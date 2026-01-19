package com.madcamp.love_algorithm.repository;

import com.madcamp.love_algorithm.entity.SaveSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository // 스프링이 이 저장소를 인식하게 합니다.
public interface SaveSlotRepository extends JpaRepository<SaveSlot, Long> {
    // 유저 ID로 세이브 슬롯을 번호 순서대로 가져오는 규칙입니다.
    List<SaveSlot> findByUserIdOrderBySlotNumberAsc(Long userId);

    Optional<SaveSlot> findByUserIdAndSlotNumber(Long userId, int slotNumber);
}