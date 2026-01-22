import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { InfoModal } from '../ui/InfoModal';

const ScreenContainer = styled.div<{ $bgImage: string }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(${(props) => props.$bgImage}) center center / cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center
  z-index: 100;
  color: #fff;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 58px;
  margin-bottom: 60px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: '강원교육모두Bold', sans-serif;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const MenuButton = styled.button`
  padding: 16px 32px;
  width: auto;
  min-width: 400px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateX(10px);
  }
`;

const UserInfo = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
`;

const DebugSection = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const DebugLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
`;

const DebugButton = styled.button`
  padding: 10px 20px;
  width: auto;
  min-width: 150px;
  background: rgba(255, 200, 100, 0.2);
  border: 2px solid rgba(255, 200, 100, 0.4);
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  &:hover {
    background: rgba(255, 200, 100, 0.3);
    border-color: rgba(255, 200, 100, 0.6);
    transform: translateX(5px);
  }
`;

const AffectionSection = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(0, 0, 0, 0.4);
  padding: 16px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  min-width: 250px;
`;

const AffectionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AffectionLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AffectionSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(255, 200, 100, 0.8);
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(255, 200, 100, 0.8);
    cursor: pointer;
    border: none;
  }
`;

const ConfessionButton = styled.button`
  padding: 8px 16px;
  width: 100%;
  background: rgba(255, 150, 200, 0.3);
  border: 2px solid rgba(255, 150, 200, 0.5);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  margin-top: 4px;
  &:hover {
    background: rgba(255, 150, 200, 0.4);
    border-color: rgba(255, 150, 200, 0.7);
  }
`;


export const StartScreen = () => {
  const { setCurrentScreen, resetGame, isAuthenticated, setIsAuthenticated, setUser, user, gameEvents, loadScript, goToScene, setGameState, affections, updateAffection } = useGameStore();
  const [showControls, setShowControls] = useState(false);
  const [localAffections, setLocalAffections] = useState({
    '도희': affections['도희'] || 0,
    '지수': affections['지수'] || 0,
    '세라': affections['세라'] || 0,
  });

  // affections가 변경되면 localAffections 업데이트
  useEffect(() => {
    setLocalAffections({
      '도희': affections['도희'] || 0,
      '지수': affections['지수'] || 0,
      '세라': affections['세라'] || 0,
    });
  }, [affections]);
  
  // 배경 이미지 경로 (한글 파일명 인코딩)
  const backgroundImagePath = `/backgrounds/${encodeURIComponent('홈화면.png')}`;

  const handleLogout = async () => {
    try {
      const { logout } = await import('../../services/api');
      await logout();
    } catch (e) {
      console.error('로그아웃 에러:', e);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setCurrentScreen('login');
    }
  };

  const handleStart = async () => {
    console.log('🎮 게임 시작 버튼 클릭');
    // 게임 시작 전 모든 BGM 정지 및 캐시 초기화
    const { clearSoundCache } = await import('../../services/soundService');
    clearSoundCache(); // 모든 BGM 캐시 초기화
    resetGame();
    
    // gameEvents가 없으면 로드
    if (!gameEvents || Object.keys(gameEvents).length === 0) {
      console.log('📦 gameEvents가 없어 로드 시작...');
      await loadScript();
    } else {
      console.log('✅ gameEvents가 이미 로드되어 있습니다.');
    }
    
    console.log('✅ 게임 화면으로 전환');
    setCurrentScreen('game');
  };

  const handleDebugWeek = async (week: number) => {
    console.log(`🔧 Week ${week}로 디버깅 이동`);
    const sceneId = `chapter${week}_scene1`;
    
    // 게임 시작 전 모든 BGM 정지 및 캐시 초기화
    const { clearSoundCache } = await import('../../services/soundService');
    clearSoundCache();
    
    // 게임 상태 초기화
    resetGame();
    
    // gameEvents가 없으면 로드
    if (!gameEvents || Object.keys(gameEvents).length === 0) {
      console.log('📦 gameEvents가 없어 로드 시작...');
      await loadScript();
    }
    
    // 해당 week의 첫 씬으로 이동
    goToScene(sceneId);
    
    console.log(`✅ Week ${week} (${sceneId})로 이동`);
    setCurrentScreen('game');
  };

  const handleDebugMiniGame = async (sceneId: string) => {
    console.log(`🎮 미니게임 scene ${sceneId}로 디버깅 이동`);
    
    // 게임 시작 전 모든 BGM 정지 및 캐시 초기화
    const { clearSoundCache } = await import('../../services/soundService');
    clearSoundCache();
    
    // 게임 상태 초기화
    resetGame();
    
    // gameEvents가 없으면 로드
    if (!gameEvents || Object.keys(gameEvents).length === 0) {
      console.log('📦 gameEvents가 없어 로드 시작...');
      await loadScript();
    }
    
    // 해당 미니게임 scene의 시작 부분으로 이동 (dialogue index 0)
    goToScene(sceneId);
    
    console.log(`✅ 미니게임 scene ${sceneId}로 이동`);
    setCurrentScreen('game');
  };

  const handleConfession = async (character: '도희' | '지수' | '세라') => {
    console.log(`💕 ${character} 고백 장면으로 이동`);
    
    const sceneMap = {
      '도희': { sceneId: 'chapter4_scene4_dohee', index: 1 },
      '지수': { sceneId: 'chapter4_scene4_jisoo', index: 0 },
      '세라': { sceneId: 'chapter4_scene4_sera', index: 0 },
    };
    
    const { sceneId, index } = sceneMap[character];
    
    // 게임 시작 전 모든 BGM 정지 및 캐시 초기화
    const { clearSoundCache } = await import('../../services/soundService');
    clearSoundCache();
    
    // 게임 상태 초기화
    resetGame();
    
    // gameEvents가 없으면 로드
    if (!gameEvents || Object.keys(gameEvents).length === 0) {
      console.log('📦 gameEvents가 없어 로드 시작...');
      await loadScript();
    }
    
    // 호감도 설정
    const currentAffections = {
      ...localAffections,
    };
    
    // 해당 고백 scene으로 이동
    setGameState({
      currentSceneId: sceneId,
      currentDialogueIndex: index,
      history: [sceneId],
      affections: currentAffections,
      miniGameScores: {},
      previousValues: {}
    });
    
    // 호감도 업데이트
    for (const [charId, value] of Object.entries(currentAffections)) {
      await updateAffection(charId, value);
    }
    
    console.log(`✅ ${character} 고백 장면 (${sceneId})로 이동`);
    setCurrentScreen('game');
  };

  const handleAffectionChange = async (character: '도희' | '지수' | '세라', value: number) => {
    setLocalAffections(prev => ({
      ...prev,
      [character]: value
    }));
    await updateAffection(character, value);
  };


  return (
    <ScreenContainer $bgImage={backgroundImagePath}>
      {isAuthenticated && (
        <UserInfo>
          <span>{user?.nickname || '게스트'}님</span>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </UserInfo>
      )}
      <Title>Project: Love Algorithm</Title>
      <MenuContainer>
        <MenuButton onClick={handleStart}>시작하기</MenuButton>
        <MenuButton onClick={() => setCurrentScreen('saveLoad')}>불러오기</MenuButton>
        <MenuButton onClick={() => setCurrentScreen('settings')}>환경설정</MenuButton>
        <MenuButton onClick={() => setShowControls(true)}>조작방법</MenuButton>
        <MenuButton onClick={() => setCurrentScreen('debug')} style={{background: 'rgba(255, 100, 100, 0.3)'}}>🔍 DB 확인</MenuButton>
      </MenuContainer>
      <DebugSection>
        <DebugLabel>🔧 디버깅: 바로가기</DebugLabel>
        <DebugButton onClick={() => handleDebugWeek(2)}>Week 2</DebugButton>
        <DebugButton onClick={() => handleDebugWeek(3)}>Week 3</DebugButton>
        <DebugButton onClick={() => handleDebugWeek(4)}>Week 4</DebugButton>
        <DebugLabel style={{marginTop: '12px'}}>🎮 미니게임</DebugLabel>
        <DebugButton onClick={() => handleDebugMiniGame('chapter1_scene5_party')}>카드 게임</DebugButton>
        <DebugButton onClick={() => handleDebugMiniGame('chapter2_scene1')}>리팩토링 게임</DebugButton>
        <DebugButton onClick={() => handleDebugMiniGame('chapter3_scene2_jisoo_menu')}>메뉴 찾기 (지수)</DebugButton>
        <DebugButton onClick={() => handleDebugMiniGame('chapter3_scene2_dohee')}>메뉴 찾기 (도희)</DebugButton>
        <DebugButton onClick={() => handleDebugMiniGame('chapter3_scene6')}>성심당 게임</DebugButton>
      </DebugSection>
      <AffectionSection>
        <DebugLabel style={{marginBottom: '8px'}}>💕 고백 장면 & 호감도</DebugLabel>
        {(['도희', '지수', '세라'] as const).map((character) => (
          <AffectionItem key={character}>
            <AffectionLabel>
              <span>{character}</span>
              <span>{localAffections[character]}</span>
            </AffectionLabel>
            <AffectionSlider
              type="range"
              min="0"
              max="20"
              value={localAffections[character]}
              onChange={(e) => handleAffectionChange(character, parseInt(e.target.value))}
            />
            <ConfessionButton onClick={() => handleConfession(character)}>
              {character} 고백
            </ConfessionButton>
          </AffectionItem>
        ))}
      </AffectionSection>
      {showControls && (
        <InfoModal
          title="조작방법"
          message="Space: 다음 대화\nCtrl+S: 저장\nCtrl+L: 불러오기\nESC: 설정"
          onClose={() => setShowControls(false)}
        />
      )}
    </ScreenContainer>
  );
};