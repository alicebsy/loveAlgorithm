package com.madcamp.love_algorithm.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.madcamp.love_algorithm.dto.*;
import com.madcamp.love_algorithm.entity.Account;
import com.madcamp.love_algorithm.entity.SocialProvider;
import com.madcamp.love_algorithm.entity.User;
import com.madcamp.love_algorithm.repository.AccountRepository;
import com.madcamp.love_algorithm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    // 1. 회원가입
    @Transactional
    public AuthResponseDto register(AuthRequestDto request) {
        if (accountRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        Account account = Account.builder()
                .email(request.getEmail())
                .passwordHash(request.getPassword()) // 실제 서비스 시 암호화 권장
                .createdAt(LocalDateTime.now())
                .build();

        accountRepository.save(account);

        return AuthResponseDto.builder()
                .accountId(account.getId())
                .email(account.getEmail())
                .build();
    }

    // 2. 로그인
    @Transactional
    public AuthResponseDto login(AuthRequestDto request) {
        Account account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 계정입니다."));

        if (!account.getPasswordHash().equals(request.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 로그인 시간 업데이트
        account.setLastLoginAt(LocalDateTime.now());

        // 해당 계정에 연결된 게임 캐릭터(User)가 있는지 조회
        User user = userRepository.findByAccount(account).orElse(null);

        // JWT 토큰 생성 (간단한 토큰, 실제로는 JWT 라이브러리 사용 권장)
        String token = "auth_token_" + account.getId() + "_" + System.currentTimeMillis();

        return AuthResponseDto.builder()
                .token(token)
                .accountId(account.getId())
                .userId(user != null ? user.getId() : null)
                .email(account.getEmail())
                .characterName(user != null ? user.getName() : null)
                .currentSceneId(user != null ? user.getCurrentSceneId() : null)
                .build();
    }

    // 3. 새 게임 시작 (캐릭터 생성)
    @Transactional
    public AuthResponseDto createCharacter(CreateUserRequestDto request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("계정을 찾을 수 없습니다."));

        // 이미 캐릭터가 있는지 확인
        if (userRepository.findByAccount(account).isPresent()) {
            throw new RuntimeException("이미 캐릭터가 존재합니다.");
        }

        User user = User.builder()
                .name(request.getName()) // 게임 내 이름 설정
                .account(account)
                .currentSceneId("chapter1_scene1") // 초기 시작 씬 설정
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        return AuthResponseDto.builder()
                .accountId(account.getId())
                .userId(user.getId())
                .email(account.getEmail())
                .characterName(user.getName())
                .currentSceneId(user.getCurrentSceneId())
                .build();
    }

    // 4. 구글 로그인 처리
    @Transactional
    public Map<String, Object> processGoogleUser(String googleToken) {
        try {
            System.out.println("🔍 Google UserInfo API 호출 시작...");
            // Google UserInfo API 호출
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/oauth2/v2/userinfo"))
                    .header("Authorization", "Bearer " + googleToken)
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("📥 Google UserInfo API 응답: " + response.statusCode());

            if (response.statusCode() != 200) {
                System.err.println("❌ 구글 UserInfo API 호출 실패: " + response.statusCode());
                System.err.println("응답 본문: " + response.body());
                throw new RuntimeException("구글 사용자 정보를 가져올 수 없습니다. 상태 코드: " + response.statusCode());
            }

            // JSON 파싱
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> userInfo = mapper.readValue(response.body(), Map.class);

            String googleId = (String) userInfo.get("id");
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            String picture = (String) userInfo.get("picture");

            // 기존 계정 확인 (소셜 ID 또는 이메일로)
            Account account = accountRepository.findBySocialId(googleId)
                    .orElse(accountRepository.findByEmail(email).orElse(null));

            if (account == null) {
                // 새 계정 생성
                account = Account.builder()
                        .email(email)
                        .passwordHash(null) // 소셜 로그인은 비밀번호 없음
                        .nickname(name != null ? name : email.split("@")[0])
                        .socialProvider(SocialProvider.GOOGLE)
                        .socialId(googleId)
                        .createdAt(LocalDateTime.now())
                        .lastLoginAt(LocalDateTime.now())
                        .build();
                accountRepository.save(account);
            } else {
                // 기존 계정 업데이트
                account.setSocialProvider(SocialProvider.GOOGLE);
                account.setSocialId(googleId);
                if (account.getNickname() == null && name != null) {
                    account.setNickname(name);
                }
                account.setLastLoginAt(LocalDateTime.now());
                accountRepository.save(account);
            }

            // 게임 캐릭터(User) 조회 또는 생성
            User user = userRepository.findByAccount(account).orElse(null);
            if (user == null) {
                user = User.builder()
                        .name(account.getNickname() != null ? account.getNickname() : email.split("@")[0])
                        .account(account)
                        .currentSceneId("chapter1_scene1")
                        .createdAt(LocalDateTime.now())
                        .build();
                userRepository.save(user);
            }

            // JWT 토큰 생성 (간단한 토큰, 실제로는 JWT 라이브러리 사용 권장)
            String token = "google_token_" + account.getId() + "_" + System.currentTimeMillis();

            // 응답 데이터 구성
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("nickname", account.getNickname() != null ? account.getNickname() : name);
            result.put("email", email);
            result.put("userId", user.getId());
            result.put("accountId", account.getId());

            return result;
        } catch (Exception e) {
            System.err.println("구글 로그인 처리 중 에러: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("구글 로그인 처리 실패: " + e.getMessage());
        }
    }
}