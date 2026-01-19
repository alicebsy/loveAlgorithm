package com.madcamp.love_algorithm.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash; // 소셜 로그인은 null 가능

    private String nickname; // 계정 닉네임

    @Enumerated(EnumType.STRING) // DB에 문자열("LOCAL")로 저장
    @Column(name = "social_provider")
    @Builder.Default
    private SocialProvider socialProvider = SocialProvider.LOCAL;

    @Column(name = "social_id")
    private String socialId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.USER;

    @CreationTimestamp // 자동으로 현재 시간 입력
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
}