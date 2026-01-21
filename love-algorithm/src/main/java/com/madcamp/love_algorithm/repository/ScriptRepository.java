package com.madcamp.love_algorithm.repository;

import com.madcamp.love_algorithm.entity.Script;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScriptRepository extends JpaRepository<Script, String> {
    // 특정 장면(Scene)의 대사들을 순서대로 가져오는 메소드
    List<Script> findBySceneIdOrderByScriptIndex(String sceneId);
}