package com.madcamp.love_algorithm.service;

import com.madcamp.love_algorithm.dto.SaveRequestDto;
import com.madcamp.love_algorithm.entity.SaveSlot;
import com.madcamp.love_algorithm.dto.SaveSlotResponseDto;
import com.madcamp.love_algorithm.entity.User;
import com.madcamp.love_algorithm.repository.SaveSlotRepository;
import com.madcamp.love_algorithm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaveService {
    private final SaveSlotRepository saveSlotRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<SaveSlotResponseDto> getSaveSlots(Long userId) {
        List<SaveSlot> slots = saveSlotRepository.findByUserIdOrderBySlotNumberAsc(userId);


        return slots.stream().map(slot -> SaveSlotResponseDto.builder()
                .slotNumber(slot.getSlotNumber())
                .sceneId(slot.getSceneId())
                .previewText(slot.getPreviewText())
                .savedAt(slot.getSavedAt() != null ?
                        slot.getSavedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) :
                        "시간 정보 없음")
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    public void saveGame(SaveRequestDto request) {
        // 1. 저장할 유저가 존재하는지 확인
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 2. 해당 슬롯 번호가 이미 있는지 확인 (있으면 가져오고, 없으면 새로 생성)
        SaveSlot saveSlot = saveSlotRepository.findByUserIdAndSlotNumber(request.getUserId(), request.getSlotNumber())
                .orElse(new SaveSlot());

        // 3. 데이터 세팅 (덮어쓰기 포함)
        saveSlot.setUser(user);
        saveSlot.setSlotNumber(request.getSlotNumber());
        saveSlot.setSceneId(request.getSceneId());
        saveSlot.setPreviewText(request.getPreviewText());
        saveSlot.setSavedAt(LocalDateTime.now()); // 현재 시간 저장

        saveSlotRepository.save(saveSlot);
    }

    // 불러오기
    @Transactional
    public String loadGame(Long userId, int slotNumber) {
        // 1. 해당 유저의 특정 슬롯 세이브 데이터를 찾습니다.
        SaveSlot saveSlot = saveSlotRepository.findByUserIdAndSlotNumber(userId, slotNumber)
                .orElseThrow(() -> new RuntimeException("해당 세이브 데이터를 찾을 수 없습니다."));

        // 2. 유저 엔티티를 가져와서 현재 씬(Scene) 위치를 업데이트합니다.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        user.setCurrentSceneId(saveSlot.getSceneId());
        userRepository.save(user); // 변경된 위치 저장

        // 3. 리액트가 어떤 씬으로 바로 이동해야 하는지 알려주기 위해 sceneId를 반환합니다.
        return saveSlot.getSceneId();
    }




}
