import { useState } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { InfoModal } from '../ui/InfoModal';

const ScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

export const StartScreen = () => {
  const { setCurrentScreen, resetGame, isAuthenticated, setIsAuthenticated, setUser, user, gameEvents, loadScript } = useGameStore();
  const [showControls, setShowControls] = useState(false);

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

  return (
    <ScreenContainer>
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
    </ScreenContainer>
  );
};