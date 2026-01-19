package com.madcamp.love_algorithm.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class OptionScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_id")
    private Option option;

    // Service와 Loader에서 'targetCharacterId'를 사용했으므로 이름 통일
    private String targetCharacterId; // 예: "dohee", "jisoo"

    private int score; // 예: 10, -5
}