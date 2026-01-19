package com.madcamp.love_algorithm.controller;

import com.madcamp.love_algorithm.dto.SceneResponseDto;
import com.madcamp.love_algorithm.entity.Scene;
import com.madcamp.love_algorithm.repository.SceneRepository;
import com.madcamp.love_algorithm.repository.UserRepository;
import com.madcamp.love_algorithm.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;
    private final UserRepository userRepository;
    private final SceneRepository sceneRepository;

    // [추가] 저장된 모든 씬(Scene) 보기
    @GetMapping("/scenes")
    public List<Scene> getAllScenes() {
        return sceneRepository.findAll();
    }

    // 장면 불러오기 (예: /api/game/scene/chapter1_scene1?userId=1)
    @GetMapping("/scene/{sceneId}")
    public ResponseEntity<SceneResponseDto> getScene(
            @PathVariable String sceneId,
            @RequestParam Long userId) {
        return ResponseEntity.ok(gameService.getScene(sceneId, userId));
    }

    // 선택지 고르기 (예: /api/game/choice?userId=1&optionId=5)
    @PostMapping("/choice")
    public ResponseEntity<String> chooseOption(
            @RequestParam Long userId,
            @RequestParam Long optionId) {
        String nextSceneId = gameService.selectOption(userId, optionId);
        return ResponseEntity.ok(nextSceneId);
    }

    @GetMapping("/affinity/{targetCharacterId}")
    public ResponseEntity<Integer> getAffinity(
            @PathVariable String targetCharacterId,
            @RequestParam Long userId) {
        int currentScore = gameService.getAffinityScore(userId, targetCharacterId);
        return ResponseEntity.ok(currentScore);
    }
}