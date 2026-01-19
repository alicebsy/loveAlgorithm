package com.madcamp.love_algorithm.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SaveRequestDto {
    private Long userId;
    private int slotNumber;
    private String sceneId;
    private String previewText;
}