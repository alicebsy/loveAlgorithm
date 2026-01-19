package com.madcamp.love_algorithm.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "save_slots") // DB 테이블 이름
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaveSlot { // 이름 뒤에 Dto를 떼주세요!
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // 누구의 세이브인가

    private int slotNumber; // 1번, 2번, 3번 슬롯
    private String sceneId; // 저장된 장면 ID
    private String previewText; // 목록에서 보여줄 미리보기 텍스트

    @CreationTimestamp
    private LocalDateTime savedAt;
}