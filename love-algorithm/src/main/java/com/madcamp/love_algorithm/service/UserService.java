package com.madcamp.love_algorithm.service;

import com.madcamp.love_algorithm.dto.AuthResponseDto;
import com.madcamp.love_algorithm.entity.User;
import com.madcamp.love_algorithm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public AuthResponseDto getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        // 기존에 만든 AuthResponseDto를 재활용하여 필요한 정보를 담아 보냅니다.
        return AuthResponseDto.builder()
                .accountId(user.getAccount().getId())
                .userId(user.getId())
                .email(user.getAccount().getEmail())
                .characterName(user.getName())
                .currentSceneId(user.getCurrentSceneId())
                .build();
    }
}