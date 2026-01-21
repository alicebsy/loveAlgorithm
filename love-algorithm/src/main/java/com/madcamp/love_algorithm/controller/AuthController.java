package com.madcamp.love_algorithm.controller;

import com.madcamp.love_algorithm.dto.*;
import com.madcamp.love_algorithm.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = {
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://15.165.158.127",
    "http://15.165.158.127:8081",
    "https://15.165.158.127",
    "https://love-algorithm-seven.vercel.app"
})
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

    // 구글 로그인: POST /api/auth/google
    @PostMapping("/google")
    public ApiResponse<Map<String, Object>> googleLogin(@RequestBody Map<String, String> request) {
        System.out.println("🔐 구글 로그인 요청 받음");
        String googleToken = request.get("token");
        if (googleToken == null || googleToken.isEmpty()) {
            System.err.println("❌ 구글 토큰이 없습니다.");
            return ApiResponse.error("구글 토큰이 필요합니다.");
        }

        System.out.println("✅ 구글 토큰 받음, 길이: " + googleToken.length());
        try {
            Map<String, Object> result = authService.processGoogleUser(googleToken);
            System.out.println("✅ 구글 로그인 성공: " + result.get("email"));
            return ApiResponse.success(result);
        } catch (Exception e) {
            System.err.println("❌ 구글 로그인 실패: " + e.getMessage());
            e.printStackTrace();
            return ApiResponse.error("구글 로그인 실패: " + e.getMessage());
        }
    }
}