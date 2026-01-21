package com.madcamp.love_algorithm.repository;

import com.madcamp.love_algorithm.entity.Account;
import com.madcamp.love_algorithm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByAccount(Account account);
    
    // Account의 email로 User 조회 (JPA 관계 필드 접근)
    Optional<User> findByAccount_Email(String email);
}
