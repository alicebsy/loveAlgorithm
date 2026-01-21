package com.madcamp.love_algorithm.repository;

import com.madcamp.love_algorithm.entity.Option;
import com.madcamp.love_algorithm.entity.Scene;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
    // 특정 장면에 속한 선택지들을 가져오는 메소드
    List<Option> findByScene(Scene scene);
}