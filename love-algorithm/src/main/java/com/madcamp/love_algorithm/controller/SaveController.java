package com.madcamp.love_algorithm.controller;

import com.madcamp.love_algorithm.dto.SaveRequestDto;
import com.madcamp.love_algorithm.dto.SaveSlotResponseDto;
import com.madcamp.love_algorithm.service.SaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saves")
@RequiredArgsConstructor
public class SaveController {

    private final SaveService saveService;

    // 1. 세이브 슬롯 목록 조회 (GET) - @GetMapping을 꼭 붙여야 합니다!
    @GetMapping
    public ResponseEntity<List<SaveSlotResponseDto>> getSaveSlots(@RequestParam("userId") Long userId) {
        // 실제 데이터 조회 로직은 서비스에서 가져옵니다.
        return ResponseEntity.ok(saveService.getSaveSlots(userId));
    }

    // 2. 게임 저장하기 (POST)
    @PostMapping
    public ResponseEntity<String> saveGame(@RequestBody SaveRequestDto request) {
        saveService.saveGame(request);
        return ResponseEntity.ok("성공적으로 저장되었습니다.");
    }

    // 불러오기
    @PostMapping("/{slotNumber}/load")
    public ResponseEntity<String> loadGame(
            @PathVariable("slotNumber") int slotNumber,
            @RequestParam("userId") Long userId) {

        // 로드 성공 시 이동해야 할 sceneId를 반환합니다.
        String sceneId = saveService.loadGame(userId, slotNumber);
        return ResponseEntity.ok(sceneId);
    }


}