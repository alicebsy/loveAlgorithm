package com.madcamp.love_algorithm.service;

import com.madcamp.love_algorithm.dto.OptionDto;
import com.madcamp.love_algorithm.dto.SceneResponseDto;
import com.madcamp.love_algorithm.dto.ScriptResponseDto;
import com.madcamp.love_algorithm.entity.*;
import com.madcamp.love_algorithm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameService {

    private final ScriptRepository scriptRepository;
    private final OptionRepository optionRepository;
    private final UserAffinityRepository affinityRepository; // 리포지토리 변수명 통일
    private final UserRepository userRepository;
    private final SceneRepository sceneRepository;

    // 1. 장면(대사+선택지) 불러오기
    @Transactional(readOnly = true)
    public SceneResponseDto getScene(String sceneId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // (1) 대사 가져오기
        List<Script> scripts = scriptRepository.findBySceneIdOrderByScriptIndex(sceneId);
        List<ScriptResponseDto> scriptDtos = scripts.stream()
                .map(script -> ScriptResponseDto.from(script, user.getName()))
                .collect(Collectors.toList());

        // (2) 선택지 가져오기
        Scene scene = sceneRepository.findById(sceneId)
                .orElseThrow(() -> new RuntimeException("Scene not found"));

        List<Option> options = optionRepository.findByScene(scene);
        List<OptionDto> optionDtos = options.stream()
                .map(OptionDto::from)
                .collect(Collectors.toList());

        return SceneResponseDto.builder()
                .sceneId(sceneId)
                .scripts(scriptDtos)
                .options(optionDtos)
                .build();
    }

    // 2. 특정 캐릭터의 호감도 점수 조회
    @Transactional(readOnly = true)
    public int getAffinityScore(Long userId, String targetCharacterId) {
        return affinityRepository.findByUserIdAndTargetCharacterId(userId, targetCharacterId)
                .map(UserAffinity::getScore)
                .orElse(0); // 데이터가 없으면 초기값 0 반환
    }

    // 3. 선택지 선택 (호감도 반영 후 다음 씬 ID 반환)
    @Transactional
    public String selectOption(Long userId, Long optionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Option option = optionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Option not found"));

        // 호감도 반영 로직
        for (OptionScore os : option.getOptionScores()) {
            UserAffinity affinity = affinityRepository.findByUserAndTargetCharacterId(user, os.getTargetCharacterId())
                    .orElseGet(() -> UserAffinity.builder()
                            .user(user)
                            .targetCharacterId(os.getTargetCharacterId())
                            .score(0)
                            .build());

            affinity.addScore(os.getScore()); // 엔티티 내부의 addScore 호출
            affinityRepository.save(affinity);
        }

        return option.getNextSceneId(); // 다음 이동할 장면 ID 반환
    }
}