package com.madcamp.love_algorithm.repository;

import com.madcamp.love_algorithm.entity.Scene;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SceneRepository extends JpaRepository<Scene, String> {
    // Scene은 ID(String)로 조회하는 기본 기능만 있으면 충분!
}