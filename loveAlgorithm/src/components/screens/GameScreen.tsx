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
  font-size: 24px;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
  text-align: center;
  padding: 20px;
  max-width: 80%;
  line-height: 1.6;
`;

export const GameScreen = () => {
  const { currentDialogue, currentScenarioItem, processedImages, proceedToNext, selectChoice, isTyping, handleGameResult } = useGameEngine();
  const { setCurrentScreen, saveGame, skipMode, setSkipMode, showToast, showConfirmModal, settings, heroName, setHeroName, kakaoTalkHistory, systemHistory } = useGameStore();

  const handleSave = () => {
    const slotId = `save_${Date.now()}`;
    const preview = currentDialogue?.text.substring(0, 30) || '저장 슬롯';
    saveGame(slotId, preview);
    showToast('게임이 저장되었습니다.', 'success');
  };

  const handleLoad = () => {
    setCurrentScreen('saveLoad');
  };

  const handleSkip = () => {
    setSkipMode(!skipMode);
  };

  const handleSettings = () => {
    setCurrentScreen('settings');
  };

  const handleMainMenu = () => {
    showConfirmModal('메인 화면으로 돌아가시겠습니까? 진행 상황은 저장되지 않습니다.', () => {
      setCurrentScreen('start');
    });
  };

  // 이름 입력 처리
  const handleNameInput = (name: string) => {
    setHeroName(name);
  };

  // 이미지 경로 결정 (processedImages 우선, 없으면 dialogue에서)
  const backgroundPath = processedImages.backgroundPath || currentDialogue?.background;
  const characterImagePaths = processedImages.characterImagePaths;
  
  // 액션/반응 이미지가 있으면 우선 사용 (하위 호환성)
  const characterActionImagePath = processedImages.characterActionImagePath;
  const characterReImagePath = processedImages.characterReImagePath;

  const hasChoices = currentDialogue?.choices && currentDialogue.choices.length > 0;
  const isKakaoTalk = currentScenarioItem?.type?.startsWith('카톡') ?? false;
  const hasKakaoTalkHistory = kakaoTalkHistory.length > 0;
  const isTransition = currentScenarioItem?.type === '전환';
  const isSystem = currentScenarioItem?.type === '시스템';
  const isGame = currentScenarioItem?.type === 'game';
  const gameConfig = currentScenarioItem?.game;
  const overlayImagePath = currentScenarioItem?.overlay_image_id 
    ? (currentScenarioItem.overlay_image_id.startsWith('/') 
        ? currentScenarioItem.overlay_image_id 
        : `/icon/${currentScenarioItem.overlay_image_id}`)
    : undefined;

  // 게임 중일 때는 proceedToNext를 비활성화
  const safeProceedToNext = isGame ? () => {} : proceedToNext;
  
  useGameHotkeys(safeProceedToNext, handleSave, handleLoad, handleSkip, handleSettings, handleMainMenu);

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
      {/* 위치별 캐릭터 표시 */}
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
      {/* 하위 호환성: 액션/반응 이미지가 있으면 가운데에 표시 */}
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
          onChoiceSelect={selectChoice}
          textSpeed={settings.textSpeed}
          onNameInput={handleNameInput}
          defaultName={heroName}
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
      {isTransition && currentDialogue && (
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
        onSkip={handleSkip}
        onNext={safeProceedToNext}
        onSettings={handleSettings}
        onMainMenu={handleMainMenu}
        skipMode={skipMode}
      />
      <ToastManager />
      <ModalManager />
    </>
  );
};

