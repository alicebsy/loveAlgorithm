package com.madcamp.love_algorithm.entity;


import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "scenes")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scene {

    @Id // 숫자가 아니라 우리가 직접 정한 문자열 ID (예: "ch1_sc1")
    @Column(name = "scene_id")
    private String id;

    @Column(name = "chapter_id")
    private String chapterId; // 예: "chapter1"

    @Column(name = "event_seq")
    private int eventSeq; // 챕터 내 순서

    private String title; // 장면 제목 (개발자 확인용)

    @Column(name = "default_next_scene_id")
    private String defaultNextSceneId; // 선택지 없이 쭉 이어질 때 다음 장면 ID

    @OneToMany(mappedBy = "scene", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("scriptIndex ASC") // 순서대로 정렬
    private List<Script> dialogues = new ArrayList<>();
}