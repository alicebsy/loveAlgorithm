package com.madcamp.love_algorithm.controller;

import com.madcamp.love_algorithm.dto.AuthResponseDto;
import com.madcamp.love_algorithm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 내 정보 조회 API
    @GetMapping("/me")
    public ResponseEntity<AuthResponseDto> getMyInfo(@RequestParam Long userId) {
        return ResponseEntity.ok(userService.getMyInfo(userId));
    }
}