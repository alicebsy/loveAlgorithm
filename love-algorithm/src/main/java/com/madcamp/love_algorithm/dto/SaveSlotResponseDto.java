package com.madcamp.love_algorithm.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SaveSlotResponseDto {
    private int slotNumber;
    private String sceneId;
    private String previewText;
    private String savedAt; // "2026-01-19 14:00" 형식으로 변환 권장
}
