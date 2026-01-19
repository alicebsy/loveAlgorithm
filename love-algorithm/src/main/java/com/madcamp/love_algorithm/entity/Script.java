package com.madcamp.love_algorithm.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "scripts")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Script {

    @Id
    @Column(name = "script_id")
    private String id; // 예: "ch1_sc1_001"

    // 어떤 장면(Scene)에 속한 대사인지 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scene_id")
    private Scene scene;

    @Column(name = "script_index")
    private int scriptIndex; // 출력 순서 (1, 2, 3...)

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ScriptType type = ScriptType.TEXT; // 기본값은 일반 대사

    @Column(name = "speaker_id")
    private String speakerId; // 말하는 사람 (hero, dohee, jisoo...)

    @Column(columnDefinition = "TEXT") // 대사는 길 수 있으니까 TEXT 타입
    private String content;

    // --- 연출 정보 ---
    @Column(name = "background_img_id")
    private String backgroundImgId; // 배경 이미지 파일명

    @Column(name = "background_sound_id")
    private String backgroundSoundId; // BGM 파일명

    @Column(name = "character_img_id")
    private String characterImgId; // 캐릭터 스탠딩 이미지 파일명

    @Column(name = "effect_sound_id")
    private String effectSoundId; // (New) 띠링, 충격음 등

}