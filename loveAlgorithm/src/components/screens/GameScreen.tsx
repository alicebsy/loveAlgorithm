import { useCallback, useEffect } from 'react';
import { BackgroundDisplay } from '../ui/BackgroundDisplay';
import { CharacterDisplay } from '../ui/CharacterDisplay';
import { DialogueBox } from '../ui/DialogueBox';
import { ChoiceModal } from '../ui/ChoiceModal';
import { LocationTimeDisplay } from '../ui/LocationTimeDisplay';
import { ControlPanel } from '../ui/ControlPanel';
import { ToastManager } from '../ui/ToastManager';
import { ModalManager } from '../ui/ModalManager';
import { KakaoTalkModal } from '../ui/KakaoTalkModal';
import { MiniGameModal } from '../ui/MiniGameModal';
import { ImageOverlay } from '../ui/ImageOverlay';
import { SystemDisplay } from '../ui/SystemDisplay';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useGameHotkeys } from '../../hooks/useHotkeys';
import { useGameStore } from '../../store/gameStore';
import { clearSoundCache, stopBGM } from '../../services/soundService';
import styled from 'styled-components';

const TransitionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const TransitionText = styled.div`
  color: #fff;
  font-size: 80px;
  font-family: '강원교육모두Bold', sans-serif;
  text-align: center;
  padding: 20px;
  max-width: 80%;
  line-height: 1.6;
`;

export const GameScreen = () => {
  // 모든 hooks는 조건부 return 이전에 호출되어야 함
  const { 
    currentDialogue, 
    currentScenarioItem, 
    processedImages, 
    proceedToNext, 
    selectChoice, 
    isTyping, 
    handleGameResult 
  } = useGameEngine();

  const { 
    setCurrentScreen, 
    saveGame, 
    showToast, 
    showConfirmModal, 
    settings, 
    setHeroName, 
    kakaoTalkHistory, 
    systemHistory,
    previousDialogue,
    gameState
  } = useGameStore();

  // handle 함수들을 먼저 정의 (hooks 호출 전)
  const handleSave = useCallback(async () => {
    if (!currentDialogue) return;
    
    // 저장 슬롯 목록 가져오기
    const store = useGameStore.getState();
    await store.fetchSaveSlots();
    const slots = store.saveSlots;
    
    // 빈 슬롯 찾기 (0~9 중에서)
    let emptySlotIndex = -1;
    for (let i = 0; i < 10; i++) {
      const slot = slots.find((s) => {
        const slotIdx = s.slotIndex !== undefined ? s.slotIndex : parseInt(s.id?.match(/(\d+)/)?.[1] || '-1');
        return slotIdx === i;
      });
      if (!slot) {
        emptySlotIndex = i;
        break;
      }
    }
    
    if (emptySlotIndex === -1) {
      // 모든 슬롯이 차 있으면 첫 번째 슬롯에 덮어쓰기
      emptySlotIndex = 0;
      const confirm = window.confirm('모든 저장 슬롯이 사용 중입니다. 첫 번째 슬롯에 덮어쓰시겠습니까?');
      if (!confirm) return;
    }
    
    try {
      const preview = currentDialogue.text?.substring(0, 30) || '저장 슬롯';
      await saveGame(emptySlotIndex, preview);
      showToast(`게임이 슬롯 ${emptySlotIndex + 1}에 저장되었습니다.`, 'success');
    } catch (error: any) {
      console.error('저장 실패:', error);
      const errorMessage = error?.message || '알 수 없는 오류';
      
      // 인증 관련 에러인 경우
      if (errorMessage.includes('인증') || errorMessage.includes('로그인')) {
        showToast('인증이 만료되었습니다. 다시 로그인해주세요.', 'error');
        // 로그인 화면으로 이동
        setTimeout(() => {
          useGameStore.getState().setCurrentScreen('login');
        }, 2000);
      } else {
        showToast(`게임 저장에 실패했습니다: ${errorMessage}`, 'error');
      }
    }
  }, [currentDialogue, saveGame, showToast]);

  const handleLoad = useCallback(() => {
    setCurrentScreen('saveLoad');
  }, [setCurrentScreen]);

  const handlePrevious = useCallback(() => {
    previousDialogue();
  }, [previousDialogue]);

  const handleSettings = useCallback(() => {
    setCurrentScreen('settings');
  }, [setCurrentScreen]);

  const handleMainMenu = useCallback(() => {
    showConfirmModal('메인 화면으로 돌아가시겠습니까? 진행 상황은 저장되지 않습니다.', () => {
      setCurrentScreen('start');
    });
  }, [showConfirmModal, setCurrentScreen]);

  const handleNameInput = useCallback((name: string) => {
    setHeroName(name);
  }, [setHeroName]);

  // 조건부 값들 계산
  const backgroundPath = processedImages.backgroundPath || currentDialogue?.background;
  const characterImagePaths = processedImages.characterImagePaths;
  const characterActionImagePath = processedImages.characterActionImagePath;
  const characterReImagePath = processedImages.characterReImagePath;
  const hasChoices = (currentDialogue?.choices?.length ?? 0) > 0;
  const isKakaoTalk = currentScenarioItem?.type?.startsWith('카톡') ?? false;
  const hasKakaoTalkHistory = kakaoTalkHistory.length > 0;
  const isTransition = currentScenarioItem?.type === '전환';
  const isSystem = currentScenarioItem?.type === '시스템';
  const isGame = currentScenarioItem?.type === 'game';
  const isInputMode = currentScenarioItem?.type === 'input'; // 입력 모드 확인
  const gameConfig = currentScenarioItem?.game;
  const overlayImagePath = currentScenarioItem?.overlay_image_id 
    ? (currentScenarioItem.overlay_image_id.startsWith('/') 
        ? currentScenarioItem.overlay_image_id 
        : `/icon/${currentScenarioItem.overlay_image_id}`)
    : undefined;
  
  // 입력 모드일 때는 proceedToNext 차단 (이름 입력 필수)
  const safeProceedToNext = useCallback(() => {
    if (isInputMode) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (isGame) {
      return; // 게임 모드일 때는 차단
    }
    proceedToNext();
  }, [isInputMode, isGame, proceedToNext]);
  
  // useGameHotkeys는 조건부 return 이전에 호출 (스킵 제거)
  useGameHotkeys(safeProceedToNext, handleSave, handleLoad, () => {}, handleSettings, handleMainMenu, hasChoices || isInputMode);
  
  // janjan 강제 정지 (컴포넌트 마운트 시 및 주기적으로 확인)
  useEffect(() => {
    // 즉시 정지
    clearSoundCache();
    stopBGM();
    
    // 주기적으로 janjan 확인 및 정지 (브라우저 캐시 문제 대응)
    const interval = setInterval(() => {
      const allAudios = document.querySelectorAll('audio');
      allAudios.forEach((audio) => {
        const src = audio.src || '';
        if (src.includes('janjan')) {
          console.warn('🚫 janjan 오디오 감지 및 강제 정지:', src);
          audio.pause();
          audio.currentTime = 0;
          audio.src = '';
          audio.load();
        }
      });
    }, 1000); // 1초마다 확인
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  // BGM은 script.ts에서 명시적으로 지정된 경우에만 재생됨
  
  // 데이터 로딩 중 예외 처리 (모든 hooks 호출 이후에 early return)
  if (!currentScenarioItem || !currentDialogue) {
    // 디버깅 정보 출력
    if (!currentScenarioItem) {
      console.error('❌ currentScenarioItem이 null입니다.');
      const state = useGameStore.getState();
      console.error('gameState:', state.gameState);
      const gameEvents = state.gameEvents;
      console.error('gameEvents:', gameEvents ? Object.keys(gameEvents).length + '개' : 'null');
    }
    if (!currentDialogue) {
      console.error('❌ currentDialogue가 null입니다.');
    }
    
    return (
      <TransitionOverlay>
        <TransitionText style={{ fontSize: '30px' }}>
          데이터를 불러오는 중...
          <br />
          <span style={{ fontSize: '16px', marginTop: '20px', display: 'block' }}>
            콘솔을 확인하세요 (F12)
          </span>
        </TransitionText>
      </TransitionOverlay>
    );
  }


  return (
    <>
      <BackgroundDisplay 
        background={backgroundPath} 
        isBlurred={hasChoices}
        isTransition={isTransition}
      />
      
      <LocationTimeDisplay 
        where={currentScenarioItem?.where} 
        when={currentScenarioItem?.when} 
      />

      {characterImagePaths && (
        <>
          {characterImagePaths[1] && (
            <CharacterDisplay 
              characterImage={characterImagePaths[1]} 
              characterName={currentDialogue?.character}
              notCharacter={currentScenarioItem?.not_character}
              location={1}
            />
          )}
          {characterImagePaths[2] && (
            <CharacterDisplay 
              characterImage={characterImagePaths[2]} 
              characterName={currentDialogue?.character}
              notCharacter={currentScenarioItem?.not_character}
              location={2}
            />
          )}
          {characterImagePaths[3] && (
            <CharacterDisplay 
              characterImage={characterImagePaths[3]} 
              characterName={currentDialogue?.character}
              notCharacter={currentScenarioItem?.not_character}
              location={3}
            />
          )}
        </>
      )}

      {(characterActionImagePath || characterReImagePath) && !characterImagePaths && (
        <CharacterDisplay 
          characterImage={characterActionImagePath || characterReImagePath} 
          characterName={currentDialogue?.character}
          notCharacter={currentScenarioItem?.not_character}
          location={2}
        />
      )}

      {!isKakaoTalk && !hasKakaoTalkHistory && !isTransition && !isSystem && !isGame && (
        <DialogueBox 
          dialogue={currentDialogue} 
          scenarioType={currentScenarioItem?.type}
          isTyping={isTyping} 
          onNext={proceedToNext}
          onPrevious={handlePrevious}
          onChoiceSelect={selectChoice}
          textSpeed={settings.textSpeed}
          onNameInput={handleNameInput}
          defaultName=""
          canGoBack={gameState.currentDialogueIndex > 0 || (gameState.history?.length || 0) > 1}
        />
      )}

      {(isKakaoTalk || hasKakaoTalkHistory) && (
        <KakaoTalkModal 
          messages={kakaoTalkHistory}
          onClose={proceedToNext}
          onTeamView={proceedToNext}
          currentType={currentScenarioItem?.type}
          currentCharacterId={currentScenarioItem?.character_id}
        />
      )}

      {hasChoices && (
        <ChoiceModal 
          choices={currentDialogue.choices!} 
          onSelect={selectChoice}
        />
      )}

      {isGame && gameConfig && (
        <MiniGameModal
          gameConfig={gameConfig}
          onWin={() => handleGameResult('win')}
          onLose={() => handleGameResult('lose')}
        />
      )}

      {overlayImagePath && (
        <ImageOverlay imagePath={overlayImagePath} />
      )}

      {isTransition && (
        <TransitionOverlay onClick={proceedToNext}>
          <TransitionText>{currentDialogue.text}</TransitionText>
        </TransitionOverlay>
      )}

      {isSystem && (
        <SystemDisplay 
          messages={systemHistory} 
          onNext={proceedToNext}
        />
      )}

      <ControlPanel
        onSave={handleSave}
        onLoad={handleLoad}
        onNext={safeProceedToNext}
        onPrevious={handlePrevious}
        onSettings={handleSettings}
        onMainMenu={handleMainMenu}
        isInputMode={isInputMode}
        canGoBack={gameState.currentDialogueIndex > 0 || (gameState.history?.length || 0) > 1}
      />
      <ToastManager />
      <ModalManager />
    </>
  );
};