import { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { processScenarioItem, applyChoiceScores } from '../services/scenarioService';
import { getBackgroundImagePath } from '../services/imageService';
import { gameEvents as localGameEvents } from '../data/script';
import { characterId } from '../data/constants';
import { replaceHeroName } from '../utils/nameUtils';
import type { Dialogue, ScenarioItem } from '../types/game.types';

export const useGameEngine = () => {
  const store = useGameStore();

  // 모든 Hook은 조기 리턴 이전에 실행되어야 함
  const [currentScenarioItem, setCurrentScenarioItem] = useState<ScenarioItem | null>(null);
  const [processedImages, setProcessedImages] = useState<any>({});
  const previousValuesRef = useRef(store.previousValues);
  const previousItemTypeRef = useRef<string | undefined>(undefined);
  const previousSceneIdRef = useRef<string>(store.gameState.currentSceneId);
  const previousChatTitleRef = useRef<string>('몰입캠프 2분반');

  // 로컬 데이터를 기본으로 사용 (백엔드는 선택적)
  // gameEvents가 null이어도 로컬 데이터를 즉시 사용
  const gameEvents = useMemo(() => {
    const events = store.gameEvents || localGameEvents;
    if (!events || Object.keys(events).length === 0) {
      console.warn('⚠️ gameEvents가 비어있어 로컬 데이터 사용');
      return localGameEvents;
    }
    return events;
  }, [store.gameEvents]);

  const rawItem = useMemo(() => {
    const sceneId = store.gameState.currentSceneId;
    const dialogueIndex = store.gameState.currentDialogueIndex;
    
    console.log('🔍 rawItem 계산:', { sceneId, dialogueIndex, gameEventsCount: gameEvents ? Object.keys(gameEvents).length : 0 });
    
    if (!gameEvents || Object.keys(gameEvents).length === 0) {
      console.error('❌ gameEvents가 완전히 비어있습니다!');
      return null;
    }
    
    const event = gameEvents[sceneId];
    if (!event) {
      console.error(`❌ Scene ${sceneId}를 찾을 수 없습니다.`);
      console.error('사용 가능한 키들:', Object.keys(gameEvents).slice(0, 10));
      // 로컬 데이터로 폴백
      const localEvent = localGameEvents[sceneId];
      if (localEvent) {
        console.log('✅ 로컬 데이터에서 찾음');
        const item = localEvent.scenario[dialogueIndex];
        if (item) {
          console.log('✅ 로컬 데이터에서 아이템 찾음:', item.id);
          return item;
        }
        console.warn(`⚠️ 로컬 데이터에서도 dialogueIndex ${dialogueIndex}를 찾을 수 없습니다.`);
      } else {
        console.error(`❌ 로컬 데이터에도 ${sceneId}가 없습니다.`);
      }
      return null;
    }
    
    if (!event.scenario || event.scenario.length === 0) {
      console.error(`❌ Scene ${sceneId}의 scenario가 비어있습니다.`);
      return null;
    }
    
    if (dialogueIndex >= event.scenario.length) {
      console.warn(`⚠️ dialogueIndex ${dialogueIndex}가 scenario 길이 ${event.scenario.length}를 초과합니다.`);
      return null;
    }
    
    const item = event.scenario[dialogueIndex];
    if (!item) {
      console.warn(`⚠️ dialogueIndex ${dialogueIndex}의 아이템이 null입니다.`);
      return null;
    }
    
    console.log('✅ rawItem 찾음:', item.id);
    return item;
  }, [gameEvents, store.gameState.currentSceneId, store.gameState.currentDialogueIndex]);

  useEffect(() => {
    previousValuesRef.current = store.previousValues || {};
    console.log('🔄 previousValues 업데이트:', store.previousValues);
  }, [store.previousValues]);

  // Scene 전환 감지 - scene이 바뀌면 BGM 정지
  useEffect(() => {
    const currentSceneId = store.gameState.currentSceneId;
    if (previousSceneIdRef.current !== currentSceneId) {
      console.log('🔄 Scene 전환 감지:', previousSceneIdRef.current, '→', currentSceneId);
      // Scene이 바뀌면 BGM 정지
      import('../services/soundService').then(({ stopBGM }) => {
        stopBGM();
      });
      previousSceneIdRef.current = currentSceneId;
    }
  }, [store.gameState.currentSceneId]);

  useEffect(() => {
    if (!rawItem) {
      console.log('⚠️ rawItem이 null이어서 currentScenarioItem을 설정하지 않습니다.');
      setCurrentScenarioItem(null);
      store.setIsDialogueTyping(false);
      return; // Hook 선언 이후에 조기 리턴
    }

    console.log('🔄 rawItem 처리 시작:', rawItem.id);
    // previousValuesRef가 최신 상태인지 확인 (불러오기 직후 반영)
    const prev = previousValuesRef.current || store.previousValues || {};
    console.log('🖼️ 사용할 previousValues:', prev);
    const rawCharImageId = rawItem.character_image_id;
    
    // 캐릭터 이미지 병합: 현재 값이 있으면 사용, 없으면 이전 값 유지
    let mergedCharImageId: any = undefined;
    if (rawCharImageId) {
      // 현재 아이템에 character_image_id가 있는 경우
      if (rawCharImageId.all) {
        // all이 있으면 모든 위치에 동일한 이미지
        mergedCharImageId = { 1: rawCharImageId.all, 2: rawCharImageId.all, 3: rawCharImageId.all };
      } else {
        // 각 위치별로 현재 값이 있으면 사용, 없으면 이전 값 유지
        mergedCharImageId = {
          1: rawCharImageId[1] !== undefined ? rawCharImageId[1] : prev.character_image_id?.[1],
          2: rawCharImageId[2] !== undefined ? rawCharImageId[2] : prev.character_image_id?.[2],
          3: rawCharImageId[3] !== undefined ? rawCharImageId[3] : prev.character_image_id?.[3],
        };
        // 모든 값이 undefined이면 이전 값 사용
        if (!mergedCharImageId[1] && !mergedCharImageId[2] && !mergedCharImageId[3]) {
          mergedCharImageId = prev.character_image_id;
        }
      }
    } else {
      // 현재 아이템에 character_image_id가 없으면 이전 값 유지
      mergedCharImageId = prev.character_image_id;
    }

    const mergedItem: ScenarioItem = {
      ...rawItem,
      character_image_id: mergedCharImageId,
      background_image_id: rawItem.background_image_id ?? prev.background_image_id,
      background_sound_id: rawItem.background_sound_id ?? prev.background_sound_id,
    };
    
    console.log('✅ currentScenarioItem 설정:', mergedItem.id);
    setCurrentScenarioItem(mergedItem);
    
    // 카톡/시스템 메시지 처리 - 이름 교체 로직 적용
    const script = mergedItem.script ? replaceHeroName(mergedItem.script, store.heroName) : '';
    
    // 카톡방 이름 추출 함수
    const getChatTitleFromScript = (scriptText: string): string => {
      const match = scriptText.match(/\[([^\]]+)\]\s*$/);
      if (match) {
        return match[1]; // [xxx]에서 xxx 부분 반환
      }
      return '몰입캠프 2분반';
    };
    
    // 현재 히스토리에서 카톡방 이름 확인 (이전 버튼으로 돌아왔을 때를 대비)
    if (store.kakaoTalkHistory.length > 0) {
      const lastMessage = store.kakaoTalkHistory[store.kakaoTalkHistory.length - 1];
      const lastScript = lastMessage.message || lastMessage.text || '';
      const lastChatTitle = getChatTitleFromScript(lastScript);
      if (lastChatTitle !== previousChatTitleRef.current) {
        previousChatTitleRef.current = lastChatTitle;
      }
    }
    
    if (mergedItem.type?.startsWith('카톡')) {
      // 현재 script에서 chatTitle 추출
      const currentChatTitle = getChatTitleFromScript(script);
      
      // 카톡방 이름이 바뀌면 히스토리 초기화
      if (currentChatTitle !== previousChatTitleRef.current) {
        console.log(`🔄 카톡방 이름 변경: ${previousChatTitleRef.current} → ${currentChatTitle}`);
        store.clearKakaoTalkHistory();
        previousChatTitleRef.current = currentChatTitle;
      }
      
      // 메시지 추가 (연속 카톡이면 계속 이어붙임)
      store.addKakaoTalkMessage(script, mergedItem.character_id || '', mergedItem.type, mergedItem.character_id || '');
    } else if (mergedItem.type === '시스템') {
      store.addSystemMessage(script);
    } else {
      // 카톡/시스템이 아닐 때는 카톡 히스토리 초기화 (일반 대사로 넘어갈 때)
      if (store.kakaoTalkHistory.length > 0) {
        store.clearKakaoTalkHistory();
        previousChatTitleRef.current = '몰입캠프 2분반';
      }
    }
    
    setProcessedImages(processScenarioItem(mergedItem, { 
      bgmVolume: store.settings.bgmVolume, 
      sfxVolume: store.settings.sfxVolume 
    }, previousItemTypeRef.current));
    
    // 현재 아이템 타입을 이전 타입으로 저장
    previousItemTypeRef.current = mergedItem.type;
    
    // 타이핑 효과 시작 (카톡/시스템/전환/게임이 아닐 때만)
    if (!mergedItem.type?.startsWith('카톡') && mergedItem.type !== '시스템' && mergedItem.type !== '전환' && mergedItem.type !== 'game') {
      store.setIsDialogueTyping(true);
    } else {
      store.setIsDialogueTyping(false);
    }
    
    // previousValues 업데이트: 현재 값이 있으면 업데이트, 없으면 이전 값 유지
    const updatedValues = {
      character_image_id: mergedCharImageId || prev.character_image_id,
      background_image_id: mergedItem.background_image_id || prev.background_image_id,
      background_sound_id: mergedItem.background_sound_id || prev.background_sound_id,
    };
    previousValuesRef.current = updatedValues;
    store.setPreviousValues(updatedValues);
  }, [rawItem, store.heroName, store.settings]);

  const handleGameResult = useCallback((result: 'win' | 'lose') => {
    if (!rawItem?.game) return;
    const nextScene = result === 'win' ? rawItem.game.win_scene_id : rawItem.game.lose_scene_id;
    if (nextScene) store.goToScene(nextScene);
  }, [rawItem, store.goToScene]);

  return {
    currentDialogue: useMemo((): Dialogue | null => {
      if (!currentScenarioItem) return null;
      return {
        id: currentScenarioItem.id,
        character: currentScenarioItem.character_id === characterId.hero ? store.heroName : (currentScenarioItem.character_id || ''),
        text: currentScenarioItem.script ? replaceHeroName(currentScenarioItem.script, store.heroName) : '',
        background: currentScenarioItem.background_image_id ? getBackgroundImagePath(currentScenarioItem.background_image_id) : undefined,
        bgm: currentScenarioItem.background_sound_id,
        sfx: currentScenarioItem.effect_sound_id,
        choices: currentScenarioItem.options,
      };
    }, [currentScenarioItem, store.heroName]),
    currentScenarioItem,
    processedImages,
    proceedToNext: useCallback(() => {
      // 카톡 모달이 열려있으면 닫기 (카톡 히스토리 초기화)
      if (store.kakaoTalkHistory.length > 0) {
        store.clearKakaoTalkHistory();
      }
      
      const event = gameEvents[store.gameState.currentSceneId];
      const currentItem = event?.scenario[store.gameState.currentDialogueIndex];
      
      // 호감도 계산 시스템 메시지 처리
      if (currentItem?.type === '시스템' && 
          currentItem.script?.includes('최종 호감도') && 
          currentItem.script?.includes('Love_Point')) {
        const currentSceneId = store.gameState.currentSceneId;
        const affections = store.affections;
        const MIN_AFFECTION_THRESHOLD = 50; // 호감도 최소 기준값
        
        // 현재 씬에 따라 캐릭터 ID 결정
        let characterId: string | null = null;
        let failSceneId: string | null = null;
        
        if (currentSceneId === 'chapter4_scene4_dohee') {
          characterId = '도희';
          failSceneId = 'chapter4_scene4_dohee_fail';
        } else if (currentSceneId === 'chapter4_scene4_jisoo') {
          characterId = '지수';
          failSceneId = 'chapter4_scene4_jisoo_fail';
        } else if (currentSceneId === 'chapter4_scene4_sera') {
          characterId = '세라';
          failSceneId = 'chapter4_scene4_sera_fail';
        }
        
        // 호감도 확인 및 분기
        if (characterId && failSceneId) {
          const affectionValue = affections[characterId] || 0;
          console.log(`💕 호감도 계산: ${characterId} = ${affectionValue} (기준: ${MIN_AFFECTION_THRESHOLD})`);
          
          if (affectionValue < MIN_AFFECTION_THRESHOLD) {
            // 호감도 부족 - 실패 씬으로 이동
            console.log(`❌ 호감도 부족으로 실패 씬으로 이동: ${failSceneId}`);
            store.goToScene(failSceneId);
            return;
          } else {
            // 호감도 충분 - 성공 씬 계속 진행
            console.log(`✅ 호감도 충분, 성공 씬 계속 진행`);
          }
        }
      }
      
      // 다음 대화가 있으면 다음으로, 없으면 다음 씬으로
      if (currentItem && store.gameState.currentDialogueIndex < event.scenario.length - 1) {
        store.nextDialogue();
      } else if (event?.next_scene_id) {
        store.goToScene(event.next_scene_id);
      } else {
        store.nextDialogue();
      }
    }, [gameEvents, store]),
    selectChoice: useCallback(async (choiceId: string) => {
      const event = gameEvents[store.gameState.currentSceneId];
      const currentItem = event?.scenario[store.gameState.currentDialogueIndex];
      
      if (!currentItem?.options) return;
      
      const choice = currentItem.options.find((c) => c.id === choiceId);
      if (!choice) return;
      
      // 호감도 점수 적용
      if (choice.score_list) {
        await applyChoiceScores(
          choice.score_list,
          store.updateAffection,
          () => store.affections
        );
        
        // 호감도 변경 후 자동 저장
        await store.autoSave();
      }
      
      // 다음 씬으로 이동
      if (choice.nextSceneId) {
        store.goToScene(choice.nextSceneId);
      } else {
        store.nextDialogue();
      }
    }, [gameEvents, store]),
    isTyping: store.isDialogueTyping,
    hasNext: useMemo(() => {
      const event = gameEvents[store.gameState.currentSceneId];
      if (!event) return false;
      return store.gameState.currentDialogueIndex < event.scenario.length - 1 || !!event.next_scene_id;
    }, [gameEvents, store.gameState.currentSceneId, store.gameState.currentDialogueIndex]),
    handleGameResult,
  };
};