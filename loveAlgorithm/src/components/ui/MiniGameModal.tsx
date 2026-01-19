import { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { GameConfig } from '../../types/game.types';
import { CardGame } from './CardGame';

interface MiniGameModalProps {
  gameConfig: GameConfig;
  onWin: () => void;
  onLose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  backdrop-filter: blur(4px);
`;

const GameContainer = styled.div`
  background: rgba(30, 30, 30, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 32px;
  min-width: 500px;
  max-width: 700px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
`;

const GameTitle = styled.h2`
  color: #fff;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;

const GameContent = styled.div`
  color: #fff;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 32px;
  text-align: center;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const GameButton = styled.button<{ $variant?: 'win' | 'lose' }>`
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
  
  ${(props) =>
    props.$variant === 'win'
      ? `
    background: rgba(76, 175, 80, 0.8);
    border-color: rgba(76, 175, 80, 0.9);
    color: #fff;
    
    &:hover {
      background: rgba(76, 175, 80, 1);
      border-color: rgba(76, 175, 80, 1);
    }
  `
      : `
    background: rgba(244, 67, 54, 0.8);
    border-color: rgba(244, 67, 54, 0.9);
    color: #fff;
    
    &:hover {
      background: rgba(244, 67, 54, 1);
      border-color: rgba(244, 67, 54, 1);
    }
  `}
  
  &:active {
    transform: scale(0.95);
  }
`;

export const MiniGameModal = ({ gameConfig, onWin, onLose }: MiniGameModalProps) => {
  // 카드 게임인 경우 CardGame 컴포넌트 사용
  if (gameConfig.game_id === 'card_game' || gameConfig.game_id === 'drinking_game_card') {
    return <CardGame onWin={onWin} onLose={onLose} timeLimit={60} />;
  }

  // 기존 테스트용 게임 (drinking_game 등)
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);

  const handleGameResult = (result: 'win' | 'lose') => {
    setGameResult(result);
    if (result === 'win') {
      onWin();
    } else {
      onLose();
    }
  };

  return (
    <Overlay>
      <GameContainer>
        <GameTitle>{gameConfig.game_name || '미니게임'}</GameTitle>
        <GameContent>
          {gameConfig.game_id === 'drinking_game' && (
            <div>
              <p>🎮 [술자리 로직 배틀]</p>
              <p>이진 탐색 업앤다운 게임</p>
              <p style={{ marginTop: '20px', fontSize: '14px', color: '#aaa' }}>
                (게임 결과를 선택하세요)
              </p>
            </div>
          )}
        </GameContent>
        <ButtonGroup>
          <GameButton $variant="win" onClick={() => handleGameResult('win')}>
            승리
          </GameButton>
          <GameButton $variant="lose" onClick={() => handleGameResult('lose')}>
            실패
          </GameButton>
        </ButtonGroup>
      </GameContainer>
    </Overlay>
  );
};

