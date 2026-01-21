import { useState } from 'react';
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
  align-items: center;
  z-index: 100;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 58px;
  margin-bottom: 60px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: '강원교육모두Bold', sans-serif;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 300px;
`;

const MenuButton = styled.button`
  padding: 16px 32px;
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

const DebugButton = styled.button`
  padding: 8px 12px;
  background: rgba(255, 200, 0, 0.3);
  border: 1px solid rgba(255, 200, 0, 0.5);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  margin: 4px;
  &:hover {
    background: rgba(255, 200, 0, 0.5);
  }
`;

const DebugContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

const DebugLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
`;

const AffectionSliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
  margin-top: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
`;

const AffectionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AffectionName = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  min-width: 40px;
`;

const AffectionSlider = styled.input`
  flex: 1;
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
    background: #fff;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: none;
  }
`;

const AffectionValue = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  min-width: 35px;
  text-align: right;
  font-weight: 600;
`;

export const StartScreen = () => {
  const { setCurrentScreen, resetGame, isAuthenticated, setIsAuthenticated, setUser, user, gameEvents, loadScript, goToScene, affections, updateAffection } = useGameStore();
  const [showControls, setShowControls] = useState(false);
  
  // 배경 이미지 경로 (한글 파일명 인코딩)
  const backgroundImagePath = `/backgrounds/${encodeURIComponent('홈화면.png')}`;
  
  // 캐릭터 ID
  const characters = [
    { id: '도희', name: '도희' },
    { id: '지수', name: '지수' },
    { id: '세라', name: '세라' },
  ];
  
  const handleAffectionChange = async (characterId: string, value: number) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    await updateAffection(characterId, clampedValue);
  };

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
    console.log(`🔧 디버깅: Week ${week}로 이동`);
    // 게임 시작 전 모든 BGM 정지 및 캐시 초기화
    const { clearSoundCache } = await import('../../services/soundService');
    clearSoundCache();
    
    // gameEvents가 없으면 로드
    if (!gameEvents || Object.keys(gameEvents).length === 0) {
      await loadScript();
    }
    
    // 각 Week의 시작 씬으로 이동
    const sceneMap: Record<number, string> = {
      2: 'chapter2_scene1',
      3: 'chapter3_scene1',
      4: 'chapter4_scene1',
    };
    
    const targetScene = sceneMap[week];
    if (targetScene) {
      goToScene(targetScene);
      setCurrentScreen('game');
    }
  };

  const handleDebugConfession = async (sceneId: string) => {
    console.log(`🔧 디버깅: ${sceneId}로 이동`);
    // 게임 시작 전 모든 BGM 정지 및 캐시 초기화
    const { clearSoundCache } = await import('../../services/soundService');
    clearSoundCache();
    
    // gameEvents가 없으면 로드
    if (!gameEvents || Object.keys(gameEvents).length === 0) {
      await loadScript();
    }
    
    goToScene(sceneId);
    setCurrentScreen('game');
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
      {showControls && (
        <InfoModal
          title="조작방법"
          message="Space: 다음 대화\nCtrl+S: 저장\nCtrl+L: 불러오기\nESC: 설정"
          onClose={() => setShowControls(false)}
        />
      )}
      <DebugContainer>
        <DebugLabel>🔧 디버깅 (임시)</DebugLabel>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <DebugButton onClick={() => handleDebugWeek(2)}>Week 2</DebugButton>
          <DebugButton onClick={() => handleDebugWeek(3)}>Week 3</DebugButton>
          <DebugButton onClick={() => handleDebugWeek(4)}>Week 4</DebugButton>
        </div>
        <DebugLabel style={{ marginTop: '12px' }}>💕 고백 엔딩</DebugLabel>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <DebugButton onClick={() => handleDebugConfession('chapter4_scene4_dohee')} style={{background: 'rgba(100, 200, 100, 0.3)'}}>도희 성공</DebugButton>
          <DebugButton onClick={() => handleDebugConfession('chapter4_scene4_dohee_fail')} style={{background: 'rgba(200, 100, 100, 0.3)'}}>도희 실패</DebugButton>
          <DebugButton onClick={() => handleDebugConfession('chapter4_scene4_jisoo')} style={{background: 'rgba(100, 200, 100, 0.3)'}}>지수 성공</DebugButton>
          <DebugButton onClick={() => handleDebugConfession('chapter4_scene4_jisoo_fail')} style={{background: 'rgba(200, 100, 100, 0.3)'}}>지수 실패</DebugButton>
          <DebugButton onClick={() => handleDebugConfession('chapter4_scene4_sera')} style={{background: 'rgba(100, 200, 100, 0.3)'}}>세라 성공</DebugButton>
          <DebugButton onClick={() => handleDebugConfession('chapter4_scene4_sera_fail')} style={{background: 'rgba(200, 100, 100, 0.3)'}}>세라 실패</DebugButton>
        </div>
        <DebugLabel style={{ marginTop: '12px' }}>🎮 미니게임</DebugLabel>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <DebugButton onClick={() => handleDebugConfession('chapter1_scene5_party')} style={{background: 'rgba(150, 150, 255, 0.3)'}}>카드 게임</DebugButton>
          <DebugButton onClick={() => handleDebugConfession('chapter2_scene1')} style={{background: 'rgba(150, 150, 255, 0.3)'}}>리팩토링</DebugButton>
          <DebugButton onClick={() => handleDebugConfession('chapter3_scene2_jisoo_menu')} style={{background: 'rgba(150, 150, 255, 0.3)'}}>메뉴 찾기</DebugButton>
          <DebugButton onClick={() => handleDebugConfession('chapter3_scene6')} style={{background: 'rgba(150, 150, 255, 0.3)'}}>성심당</DebugButton>
        </div>
        <DebugLabel style={{ marginTop: '12px' }}>💖 호감도 조절</DebugLabel>
        <AffectionSliderContainer>
          {characters.map((char) => (
            <AffectionRow key={char.id}>
              <AffectionName>{char.name}</AffectionName>
              <AffectionSlider
                type="range"
                min="0"
                max="100"
                value={affections[char.id] || 0}
                onChange={(e) => handleAffectionChange(char.id, parseInt(e.target.value))}
              />
              <AffectionValue>{affections[char.id] || 0}</AffectionValue>
            </AffectionRow>
          ))}
        </AffectionSliderContainer>
      </DebugContainer>
    </ScreenContainer>
  );
};