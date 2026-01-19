import { useEffect, useCallback, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { getCurrentDialogueSync, hasNextDialogueSync, getNextSceneIdSync } from '../services/scriptService';
import { getCurrentScenarioItem, processScenarioItem, applyChoiceScores } from '../services/scenarioService';
import { getBackgroundImagePath, getCharacterImagePath } from '../services/imageService';
import { gameEvents } from '../data/script';
import { characterId } from '../data/constants';
import type { Dialogue, ScenarioItem } from '../types/game.types';

export const useGameEngine = () => {
  const {
    gameState,
    setGameState,
    goToScene,
    nextDialogue,
    isDialogueTyping,
    setIsDialogueTyping,
    skipMode,
    settings,
    updateAffection,
    affections,
    heroName,
    addKakaoTalkMessage,
    clearKakaoTalkHistory,
    previousValues: storePreviousValues,
    setPreviousValues,
  } = useGameStore();

  const [currentScenarioItem, setCurrentScenarioItem] = useState<ScenarioItem | null>(null);
  const [processedImages, setProcessedImages] = useState<{
    backgroundPath?: string;
    characterImagePath?: string;
    characterActionImagePath?: string;
    characterReImagePath?: string;
  }>({});
  
  // 이전 시나리오 아이템의 특정 필드들만 저장 (이어지게 하기 위해)
  // 불러오기 시 storePreviousValues로 초기화
  const previousValuesRef = useRef<{
    character_image_id?: string;
    background_image_id?: string;
    background_sound_id?: string;
  }>(storePreviousValues);
  
  // storePreviousValues가 변경되면 (불러오기 시) previousValuesRef 업데이트
  useEffect(() => {
    previousValuesRef.current = storePreviousValues;
  }, [storePreviousValues]);

  // 현재 대화 가져오기
  const getCurrentDialogueData = useCallback((): Dialogue | null => {
    // currentScenarioItem이 있으면 그것을 사용 (이미 병합됨)
    if (currentScenarioItem) {
      // character_id가 hero이면 heroName 사용
      const characterName = currentScenarioItem.character_id === characterId.hero 
        ? heroName 
        : (currentScenarioItem.character_id || '');
      
      // script에서 {heroName} 플레이스홀더를 실제 이름으로 치환
      let scriptText = currentScenarioItem.script;
      if (scriptText.includes('이도훈')) {
        scriptText = scriptText.replace(/이도훈/g, heroName);
      }
      
      return {
        id: currentScenarioItem.id,
        character: characterName,
        text: scriptText,
        background: currentScenarioItem.background_image_id ? getBackgroundImagePath(currentScenarioItem.background_image_id) : undefined,
        characterImage: currentScenarioItem.character_image_id ? getCharacterImagePath(currentScenarioItem.character_image_id) : undefined,
        bgm: currentScenarioItem.background_sound_id,
        sfx: currentScenarioItem.effect_sound_id,
        choices: currentScenarioItem.options,
      };
    }

    // currentScenarioItem이 없으면 gameEvents에서 직접 가져오기 (초기 로딩 시)
    const eventId = gameState.currentSceneId;
    const event = gameEvents[eventId];
    if (!event) {
      // 기존 방식으로 폴백
      return getCurrentDialogueSync(gameState.currentSceneId, gameState.currentDialogueIndex);
    }
    
    const rawItem = event.scenario[gameState.currentDialogueIndex];
    if (!rawItem) return null;
    
    // character_id가 hero이면 heroName 사용
    const characterName = rawItem.character_id === characterId.hero 
      ? heroName 
      : (rawItem.character_id || '');
    
    // script에서 '이도훈'을 실제 이름으로 치환
    let scriptText = rawItem.script;
    if (scriptText.includes('이도훈')) {
      scriptText = scriptText.replace(/이도훈/g, heroName);
    }
    
    // 초기 로딩 시에는 원본 데이터를 그대로 사용
    return {
      id: rawItem.id,
      character: characterName,
      text: scriptText,
      background: rawItem.background_image_id ? getBackgroundImagePath(rawItem.background_image_id) : undefined,
      characterImage: rawItem.character_image_id ? getCharacterImagePath(rawItem.character_image_id) : undefined,
      bgm: rawItem.background_sound_id,
      sfx: rawItem.effect_sound_id,
      choices: rawItem.options,
    };
  }, [gameState.currentSceneId, gameState.currentDialogueIndex, currentScenarioItem, heroName]);

  // 다음 대화로 진행
  const proceedToNext = useCallback(() => {
    // 게임 타입일 때는 진행 불가
    if (currentScenarioItem?.type === 'game') {
      return;
    }

    if (isDialogueTyping && !skipMode) {
      // 타이핑 중이면 즉시 완료
      setIsDialogueTyping(false);
      return;
    }

    // 타이핑 상태를 먼저 false로 설정하여 다음 대화가 표시되기 전에 빈 텍스트 유지
    setIsDialogueTyping(false);

    // 이벤트 기반 처리
    const eventId = gameState.currentSceneId;
    const event = gameEvents[eventId];

    if (event) {
      const hasNext = gameState.currentDialogueIndex < event.scenario.length - 1;
      if (hasNext) {
        // 같은 이벤트 내 다음 대화
        nextDialogue();
      } else {
        // 이벤트가 끝나면 next_scene_id로 이동
        if (event.next_scene_id) {
          goToScene(event.next_scene_id);
        } else {
          // 게임 종료 또는 엔딩 처리
          console.log('게임 종료 또는 엔딩');
        }
      }
    } else {
      // 기존 Scene 형식 처리 (하위 호환성)
      const hasNext = hasNextDialogueSync(gameState.currentSceneId, gameState.currentDialogueIndex);
      if (hasNext) {
        nextDialogue();
      } else {
        const nextSceneId = getNextSceneIdSync(gameState.currentSceneId);
        if (nextSceneId) {
          goToScene(nextSceneId);
        } else {
          console.log('게임 종료 또는 엔딩');
        }
      }
    }
  }, [
    gameState.currentSceneId,
    gameState.currentDialogueIndex,
    isDialogueTyping,
    skipMode,
    nextDialogue,
    goToScene,
    setIsDialogueTyping,
  ]);

  // 특정 씬으로 이동
  const jumpToScene = useCallback(
    (sceneId: string) => {
      goToScene(sceneId);
    },
    [goToScene]
  );

  // 선택지 처리
  const selectChoice = useCallback(
    async (choiceId: string) => {
      const dialogue = getCurrentDialogueData();
      if (!dialogue || !dialogue.choices) {
        console.warn('No dialogue or choices found');
        return;
      }

      const choice = dialogue.choices.find((c) => c.id === choiceId);
      if (!choice) {
        console.warn(`Choice not found: ${choiceId}`);
        return;
      }

      // 호감도 점수 적용
      if (choice.score_list && choice.score_list.length > 0) {
        await applyChoiceScores(choice.score_list, updateAffection, () => affections);
      }

      // 다음 씬으로 이동 또는 다음 대화로 진행
      if (choice.nextSceneId) {
        console.log(`Moving to scene: ${choice.nextSceneId}`);
        goToScene(choice.nextSceneId);
      } else {
        // 선택지가 있으면 다음 대화로 진행
        console.log('No nextSceneId, moving to next dialogue');
        nextDialogue();
      }
    },
    [getCurrentDialogueData, goToScene, nextDialogue, updateAffection, affections, currentScenarioItem]
  );

  // 시나리오 아이템 로드 및 처리
  useEffect(() => {
    // 이벤트 ID 찾기 (현재 씬 ID를 이벤트 ID로 사용)
    const eventId = gameState.currentSceneId;
    const events = gameEvents;
    const event = events[eventId];

    if (event) {
      const rawItem = event.scenario[gameState.currentDialogueIndex];
      if (rawItem) {
        // character_image_id, background_image_id, background_sound_id만 이전 값으로 채우기
        const prev = previousValuesRef.current;
        const character_image_id = rawItem.character_image_id ?? prev.character_image_id;
        const background_image_id = rawItem.background_image_id ?? prev.background_image_id;
        const background_sound_id = rawItem.background_sound_id ?? prev.background_sound_id;
        
        // 병합된 아이템 생성
        const mergedItem: ScenarioItem = {
          ...rawItem,
          character_image_id,
          background_image_id,
          background_sound_id,
        };
        
        // 병합된 아이템 설정
        setCurrentScenarioItem(mergedItem);
        
        // 카톡 메시지 히스토리 관리
        if (mergedItem.type?.startsWith('카톡')) {
          // character_id가 hero이면 heroName 사용
          const characterName = mergedItem.character_id === characterId.hero
            ? heroName
            : (mergedItem.character_id || undefined);
          
          // script에서 '이도훈'을 실제 이름으로 치환
          let scriptText = mergedItem.script;
          if (scriptText.includes('이도훈')) {
            scriptText = scriptText.replace(/이도훈/g, heroName);
          }
          
          addKakaoTalkMessage(scriptText, characterName, mergedItem.type, mergedItem.character_id);
        } else if (!mergedItem.type?.startsWith('카톡')) {
          // 카톡이 아니면 히스토리 초기화
          clearKakaoTalkHistory();
        }
        
        // 이미지 경로 변환 (동기 처리)
        const processed = processScenarioItem(mergedItem, {
          bgmVolume: settings.bgmVolume,
          sfxVolume: settings.sfxVolume,
        });
        setProcessedImages(processed);
        
        // 현재 아이템의 값으로 이전 값 업데이트 (다음 아이템을 위해)
        const updatedPreviousValues = {
          character_image_id: character_image_id ?? prev.character_image_id,
          background_image_id: background_image_id ?? prev.background_image_id,
          background_sound_id: background_sound_id ?? prev.background_sound_id,
        };
        previousValuesRef.current = updatedPreviousValues;
        // gameStore에도 동기화 (저장을 위해)
        setPreviousValues(updatedPreviousValues);
      } else {
        // 시나리오가 끝나면 next_scene_id로 이동
        if (event.next_scene_id) {
          // 다음 씬으로 이동할 때 이전 값 및 카톡 히스토리 초기화
          previousValuesRef.current = {};
          setPreviousValues({});
          clearKakaoTalkHistory();
          goToScene(event.next_scene_id);
        }
      }
    }
  }, [gameState.currentSceneId, gameState.currentDialogueIndex, settings.bgmVolume, settings.sfxVolume, goToScene, addKakaoTalkMessage, clearKakaoTalkHistory, heroName, setPreviousValues]);

  // 텍스트 타이핑 효과
  useEffect(() => {
    // type이 '전환'이면 타이핑 효과를 적용하지 않음
    if (currentScenarioItem?.type === '전환') {
      setIsDialogueTyping(false);
      return;
    }

    // 대화가 변경되면 즉시 타이핑 상태를 true로 설정 (타이핑 시작)
    if (skipMode || settings.textSpeed === 100) {
      setIsDialogueTyping(false);
      return;
    }

    const dialogue = getCurrentDialogueData();
    if (!dialogue) {
      setIsDialogueTyping(false);
      return;
    }

    // 대화가 변경되면 타이핑 시작
    setIsDialogueTyping(true);
    const textLength = dialogue.text.length;
    const typingSpeed = 100 - settings.textSpeed; // textSpeed가 높을수록 빠름
    const delay = Math.max(10, typingSpeed);

    const timer = setTimeout(() => {
      setIsDialogueTyping(false);
    }, textLength * delay);

    return () => clearTimeout(timer);
  }, [gameState.currentDialogueIndex, gameState.currentSceneId, skipMode, settings.textSpeed, getCurrentDialogueData, setIsDialogueTyping, currentScenarioItem]);

  // 게임 결과 처리
  const handleGameResult = useCallback(
    (result: 'win' | 'lose') => {
      if (!currentScenarioItem?.game) {
        console.warn('No game config found');
        return;
      }

      const { win_scene_id, lose_scene_id } = currentScenarioItem.game;
      const nextSceneId = result === 'win' ? win_scene_id : lose_scene_id;
      
      if (nextSceneId) {
        goToScene(nextSceneId);
      } else {
        console.warn(`No scene ID for game result: ${result}`);
      }
    },
    [currentScenarioItem, goToScene]
  );

  const dialogue = getCurrentDialogueData();

  return {
    currentDialogue: dialogue,
    currentScenarioItem,
    processedImages,
    proceedToNext,
    jumpToScene,
    selectChoice,
    handleGameResult,
    hasNext: hasNextDialogueSync(gameState.currentSceneId, gameState.currentDialogueIndex),
    isTyping: isDialogueTyping,
  };
};

