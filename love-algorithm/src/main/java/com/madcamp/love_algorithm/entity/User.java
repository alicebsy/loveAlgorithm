package com.madcamp.love_algorithm.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    // 닉네임 (Service에서 getName()으로 호출하므로 이름을 name으로 통일)
    @Column(name = "name")
    private String name;

    // Account와 연결 (로그인 기능 붙일 때 사용, 지금은 null 허용)
    @OneToOne
    @JoinColumn(name = "account_id")
    private Account account;

    // --- 진행 상황 (선택 사항) ---
    // 현재 씬 위치 저장용
    @Column(name = "current_scene_id")
    private String currentSceneId;

    // *중요: 호감도(loveDohee 등) 필드는 삭제했습니다.*
    // 이유: 방금 만든 UserAffinity 테이블에서 관리하기 때문입니다.

    // --- 시간 정보 ---
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}