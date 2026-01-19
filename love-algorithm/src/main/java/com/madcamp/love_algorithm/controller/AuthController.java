package com.madcamp.love_algorithm.controller;

import com.madcamp.love_algorithm.dto.*;
import com.madcamp.love_algorithm.dto.AuthRequestDto;
import com.madcamp.love_algorithm.dto.AuthResponseDto;
import com.madcamp.love_algorithm.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor // @Autowired 대신 생성자 주입 방식 사용 (권장)
public class AuthController {

    private final AuthService authService;

    // 회원가입 API
    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDto> signup(@RequestBody AuthRequestDto request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // 로그인 API
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody AuthRequestDto request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // 새 게임 시작 (유저 캐릭터 생성)
    @PostMapping("/create-user")
    public ResponseEntity<AuthResponseDto> createUser(@RequestBody CreateUserRequestDto request) {
        return ResponseEntity.ok(authService.createCharacter(request));
    }
}