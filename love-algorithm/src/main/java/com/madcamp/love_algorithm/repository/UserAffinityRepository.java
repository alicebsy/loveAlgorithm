package com.madcamp.love_algorithm.repository;

import com.madcamp.love_algorithm.entity.User;
import com.madcamp.love_algorithm.entity.UserAffinity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserAffinityRepository extends JpaRepository<UserAffinity, Long> {
    // 1. User 객체로 찾기 (selectOption에서 사용)
    Optional<UserAffinity> findByUserAndTargetCharacterId(User user, String targetCharacterId);

    // 2. User ID(Long)로 직접 찾기 (getAffinityScore에서 사용)
    Optional<UserAffinity> findByUserIdAndTargetCharacterId(Long userId, String targetCharacterId);
}
