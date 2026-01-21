package com.madcamp.love_algorithm.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "game_option") // 'Option'은 SQL 예약어라 테이블명을 바꿔야 안전합니다.
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // String 대신 Auto Increment 사용

    // 선택지는 '대사'가 아니라 '장면'에 붙는 것이 관리하기 편합니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scene_id")
    private Scene scene;

    private String text; // 버튼 텍스트 (예: "솔의 눈을 건넨다")

    @Column(name = "next_scene_id")
    private String nextSceneId; // 선택 시 이동할 다음 장면 ID

    // Service에서 option.getOptionScores()로 불렀으므로 이름 통일
    @OneToMany(mappedBy = "option", cascade = CascadeType.ALL)
    @Builder.Default
    private List<OptionScore> optionScores = new ArrayList<>();
}