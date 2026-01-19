package com.madcamp.love_algorithm.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CreateUserRequestDto {
    private Long accountId; // 연결할 계정 ID
    private String name;    // 게임 내에서 사용할 캐릭터 이름
}