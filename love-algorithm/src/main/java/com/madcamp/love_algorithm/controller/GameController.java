package com.madcamp.love_algorithm.controller;

import com.madcamp.love_algorithm.dto.ApiResponse;
import com.madcamp.love_algorithm.dto.SceneResponseDto;
import com.madcamp.love_algorithm.entity.Scene;
import com.madcamp.love_algorithm.repository.SceneRepository;
import com.madcamp.love_algorithm.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

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
@RequestMapping("/api") // 프론트가 /api/script 로 호출함
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;
    private final SceneRepository sceneRepository;

    // 프론트의 fetchGameScript()에 대응: GET /api/script
    @GetMapping("/script")
    public ApiResponse<Map<String, Scene>> getAllScripts() {
        Map<String, Scene> data = sceneRepository.findAll().stream()
                .collect(Collectors.toMap(s -> s.getId(), s -> s));
        return ApiResponse.success(data);
    }

    // 프론트의 fetchScene()에 대응: GET /api/script/scene/{sceneId}
    @GetMapping("/script/scene/{sceneId}")
    public ApiResponse<SceneResponseDto> getScene(
            @PathVariable String sceneId,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        return ApiResponse.success(gameService.getScene(sceneId, userId));
    }

    // 프론트의 fetchAffection()에 대응: GET /api/affection/{characterId}
    @GetMapping("/affection/{targetCharacterId}")
    public ApiResponse<Integer> getAffinity(
            @PathVariable String targetCharacterId,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        return ApiResponse.success(gameService.getAffinityScore(userId, targetCharacterId));
    }
}