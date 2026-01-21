import styled from 'styled-components';
import type { GameConfig } from '../../types/game.types';
import { CardGame } from './CardGame';
import { SpaghettiCodeGame } from './SpaghettiCodeGame';
import { MenuFindGame } from './MenuFindGame';
import { SungsimdangGame } from './SungsimdangGame';
import { useGameStore } from '../../store/gameStore';

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
  font-size: 29px;
  margin-bottom: 20px;
  text-align: center;
  font-family: '강원교육모두Bold', sans-serif;
`;

const GameContent = styled.div`
  color: #fff;
  font-size: 22px;
  line-height: 1.6;
  margin-bottom: 32px;
  text-align: center;
  font-family: '강원교육모두Bold', sans-serif;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const GameButton = styled.button<{ $variant?: 'win' | 'lose' }>`
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 19px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid;
  font-family: '강원교육모두Bold', sans-serif;
  
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
  const { gameState } = useGameStore();
  const currentSceneId = gameState.currentSceneId;

  // 메뉴 찾기 게임인 경우 MenuFindGame 컴포넌트 사용
  if (gameConfig.game_id === 'menu_find_game') {
    // 스크립트에서 "5초 안에 찾아 클릭하세요"라고 했지만, 전체 게임 시간은 120초로 설정
    // 각 라운드를 빠르게 완료해야 함
    return <MenuFindGame onWin={onWin} onLose={onLose} currentSceneId={currentSceneId} timeLimit={120} />;
  }

  // 성심당 게임인 경우 SungsimdangGame 컴포넌트 사용
  if (gameConfig.game_id === 'sungsimdang_game') {
    return <SungsimdangGame onWin={onWin} onLose={onLose} />;
  }

  // 카드 게임인 경우 CardGame 컴포넌트 사용
  if (gameConfig.game_id === 'card_game' || gameConfig.game_id === 'drinking_game_card') {
    return <CardGame onWin={onWin} onLose={onLose} timeLimit={60} />;
  }

  // 스파게티 코드 리팩토링 게임인 경우 SpaghettiCodeGame 컴포넌트 사용
  if (gameConfig.game_id === 'refactor_game') {
    return <SpaghettiCodeGame onWin={onWin} onLose={onLose} timeLimit={60} />;
  }

  // 기존 테스트용 게임 (drinking_game 등)
  const handleGameResult = (result: 'win' | 'lose') => {
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


