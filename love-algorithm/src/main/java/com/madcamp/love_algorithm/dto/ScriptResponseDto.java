package com.madcamp.love_algorithm.dto;

import com.madcamp.love_algorithm.entity.Script;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ScriptResponseDto {
    private String id;
    private int scriptIndex;
    private String type;
    private String speakerId; // "hero", "jisoo" 등
    private String speakerName; // 실제 화면에 출력될 이름
    private String content; // 이름이 치환된 대사

    public static ScriptResponseDto from(Script script, String userName) {
        // 1. 화자가 'hero'이면 사용자 이름으로 설정
        String actualSpeakerName = script.getSpeakerId();
        if ("hero".equals(script.getSpeakerId())) {
            actualSpeakerName = userName;
        }

        // 2. 대사 내용 중에 "도훈"이 있으면 사용자 이름으로 치환
        String processedContent = script.getContent();
        if (processedContent != null) {
            processedContent = processedContent.replace("도훈", userName);
            processedContent = processedContent.replace("이도훈", userName); // 풀네임도 대응
        }

        return ScriptResponseDto.builder()
                .id(script.getId())
                .scriptIndex(script.getScriptIndex())
                .type(script.getType().name())
                .speakerId(script.getSpeakerId())
                .speakerName(actualSpeakerName)
                .content(processedContent)
                .build();
    }
}