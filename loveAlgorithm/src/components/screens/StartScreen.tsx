import { useState } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { InfoModal } from '../ui/InfoModal';
import { logout } from '../../services/api';

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
  
  &:active {
    transform: translateX(10px) scale(0.98);
  }
`;

const VersionInfo = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`;

const UserInfo = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

export const StartScreen = () => {
  const { setCurrentScreen, resetGame, isAuthenticated, setIsAuthenticated, user } = useGameStore();
  const [showControls, setShowControls] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setCurrentScreen('login');
  };

  const handleStart = () => {
    resetGame(); // 게임 상태를 초기화
    setCurrentScreen('game');
  };

  const handleLoad = () => {
    setCurrentScreen('saveLoad');
  };

  const handleSettings = () => {
    setCurrentScreen('settings');
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
        <MenuButton onClick={handleLoad}>불러오기</MenuButton>
        <MenuButton onClick={handleSettings}>환경설정</MenuButton>
        <MenuButton onClick={() => setShowControls(true)}>조작방법</MenuButton>
      </MenuContainer>
      <VersionInfo>Version 1.0.0</VersionInfo>
      {showControls && (
        <InfoModal
          title="조작방법"
          message="Space: 다음 대화\nCtrl+S: 저장\nCtrl+L: 불러오기\nK: 스킵 모드\nESC: 설정\nM: 메인화면"
          onClose={() => setShowControls(false)}
        />
      )}
    </ScreenContainer>
  );
};


