package com.madcamp.love_algorithm.controller;

import com.madcamp.love_algorithm.dto.*;
import com.madcamp.love_algorithm.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 프론트의 register()에 대응: POST /api/auth/register
    @PostMapping("/register")
    public ApiResponse<Boolean> signup(@RequestBody AuthRequestDto request) {
        authService.register(request);
        return ApiResponse.success(true);
    }

    // 프론트의 login()에 대응: POST /api/auth/login
    @PostMapping("/login")
    public ApiResponse<Map<String, String>> login(@RequestBody AuthRequestDto request) {
        AuthResponseDto originalResponse = authService.login(request);

        // 프론트엔드가 token과 refreshToken 두 개를 기다리므로 맞춰줌
        Map<String, String> data = new HashMap<>();
        data.put("token", originalResponse.getToken());
        data.put("refreshToken", "dummy-refresh-token");

        return ApiResponse.success(data);
    }
}