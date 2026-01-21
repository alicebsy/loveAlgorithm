package com.madcamp.love_algorithm.dto;

import com.madcamp.love_algorithm.entity.Option;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OptionDto {
    private Long id;
    private String text;
    private String nextSceneId;

    public static OptionDto from(Option option) {
        return OptionDto.builder()
                .id(option.getId())
                .text(option.getText())
                .nextSceneId(option.getNextSceneId())
                .build();
    }
}