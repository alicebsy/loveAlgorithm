package com.madcamp.love_algorithm.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
public class AuthResponseDto {
    private String token;
    private Long accountId;
    private Long userId;       // 캐릭터가 없으면 null
    private String email;
    private String characterName; // 캐릭터가 없으면 null
    private String currentSceneId; // 진행 중인 씬 ID
}