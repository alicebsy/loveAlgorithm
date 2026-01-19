package com.madcamp.love_algorithm.repository;

import com.madcamp.love_algorithm.entity.Account;
import com.madcamp.love_algorithm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByAccount(Account account);
}