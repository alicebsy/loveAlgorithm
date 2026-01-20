package com.madcamp.love_algorithm.controller;

import com.madcamp.love_algorithm.dto.ApiResponse; // [중요] 아까 만든 공통 응답 DTO
import com.madcamp.love_algorithm.dto.SaveRequestDto;
import com.madcamp.love_algorithm.dto.SaveSlotResponseDto;
import com.madcamp.love_algorithm.service.SaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// 프론트엔드 fetchSaveSlots() 등의 호출 경로인 /api/save/slots 에 맞춥니다.
@RequestMapping("/api/save/slots")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5174")
public class SaveController {

    private final SaveService saveService;

    // 1. 세이브 슬롯 목록 조회 (프론트: fetchSaveSlots)
    @GetMapping
    public ApiResponse<List<SaveSlotResponseDto>> getSaveSlots(
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long userId) {

        List<SaveSlotResponseDto> slots = saveService.getSaveSlots(userId);
        return ApiResponse.success(slots); // { success: true, data: [...] } 형태로 반환
    }

    // 2. 게임 저장하기 (프론트: saveToSlot)
    @PostMapping
    public ApiResponse<Boolean> saveGame(@RequestBody SaveRequestDto request) {
        saveService.saveGame(request);
        return ApiResponse.success(true);
    }

    // 3. 불러오기 (프론트: loadFromSlot)
    // 프론트 주소: /api/save/slots/${slotIndex}
    @GetMapping("/{slotNumber}")
    public ApiResponse<Object> loadGame(
            @PathVariable("slotNumber") int slotNumber,
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long userId) {

        // 프론트엔드는 이 API에서 'game_state' 객체가 담긴 data를 기다립니다.
        // 서비스 로직에 따라 gameState 객체를 반환하도록 구성해야 합니다.
        Object gameState = saveService.loadGame(userId, slotNumber);
        return ApiResponse.success(gameState);
    }

    // 4. 삭제 (프론트: deleteSaveSlot)
    @DeleteMapping("/{slotNumber}")
    public ApiResponse<Boolean> deleteSaveSlot(
            @PathVariable("slotNumber") int slotNumber,
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long userId) {

        // saveService.deleteSaveSlot(userId, slotNumber); // 서비스에 삭제 로직이 있다면 추가
        return ApiResponse.success(true);
    }
}