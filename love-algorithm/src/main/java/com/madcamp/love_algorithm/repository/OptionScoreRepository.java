package com.madcamp.love_algorithm.repository;

import com.madcamp.love_algorithm.entity.OptionScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionScoreRepository extends JpaRepository<OptionScore, Long> {
    // 기본 CRUD(save, findAll 등)는 JpaRepository가 자동으로 제공합니다.
}