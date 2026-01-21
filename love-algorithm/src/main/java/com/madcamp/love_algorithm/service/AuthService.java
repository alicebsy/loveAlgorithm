package com.madcamp.love_algorithm.service;

import com.madcamp.love_algorithm.dto.*;
import com.madcamp.love_algorithm.entity.Account;
import com.madcamp.love_algorithm.entity.User;
import com.madcamp.love_algorithm.repository.AccountRepository;
import com.madcamp.love_algorithm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

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

        return AuthResponseDto.builder()
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
}