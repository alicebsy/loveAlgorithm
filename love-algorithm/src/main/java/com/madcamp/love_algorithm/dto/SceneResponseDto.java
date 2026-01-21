package com.madcamp.love_algorithm.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class SceneResponseDto {
    private String sceneId;
    private List<ScriptResponseDto> scripts; // 대사 목록
    private List<OptionDto> options;         // 선택지 목록 (버튼)
}