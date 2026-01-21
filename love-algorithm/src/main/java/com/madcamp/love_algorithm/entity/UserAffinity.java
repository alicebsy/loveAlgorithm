package com.madcamp.love_algorithm.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAffinity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 유저의 호감도인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // 대상 캐릭터 (예: "dohee", "jisoo")
    private String targetCharacterId;

    // 현재 호감도 점수
    private int score;

    public void addScore(int value) {
        this.score += value;
    }
}