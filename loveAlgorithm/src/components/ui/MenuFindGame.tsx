import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

interface MenuFindGameProps {
  onWin: () => void;
  onLose: () => void;
  currentSceneId?: string;
  timeLimit?: number; // 초 단위, 기본값 120초 (2분)
}

interface GridCell {
  id: number;
  word: string;
  isCorrect: boolean;
  isSelected: boolean;
}

const ROUNDS = [3, 5, 6, 7, 9]; // 각 라운드별 그리드 크기
const LIVES_PER_ROUND = 3;
const TOTAL_TIME = 120; // 2분

// 단어 세트 정의
const WORD_SETS = {
  jisoo: {
    correct: '마라탕',
    incorrect: ['마리탕', '미라탕', '마라팅', '미라팅', '마리팅'],
  },
  dohee: {
    correct: '국밥',
    incorrect: ['극밥', '극빕', '국밤', '국빕'],
  },
};

// 키오스크 스타일 컨테이너
const KioskContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  z-index: 3000;
  padding: 20px;
  padding-right: 200px;
  font-family: '강원교육모두Bold', sans-serif;
`;

// 측면 상태바
const SideBar = styled.div`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 150px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: normal;
`;

const InfoValue = styled.div<{ $isLow?: boolean }>`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.$isLow ? '#ff4444' : '#333')};
`;

const LivesDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
`;

const HeartsContainer = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const Heart = styled.span<{ $filled: boolean }>`
  font-size: 20px;
  color: ${(props) => (props.$filled ? '#ff4444' : 'transparent')};
  opacity: ${(props) => (props.$filled ? 1 : 0.3)};
  transition: opacity 0.2s;
`;

const GameArea = styled.div`
  width: 100%;
  max-width: calc(100vw - 240px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 20px;
`;

const GridContainer = styled.div<{ $size: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$size}, 1fr);
  grid-template-rows: repeat(${(props) => props.$size}, 1fr);
  gap: 8px;
  width: 100%;
  max-width: min(calc(100vh - 100px), calc(100vw - 240px));
  max-height: min(calc(100vh - 100px), calc(100vw - 240px));
  aspect-ratio: 1;
  padding: 10px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
`;

const GridCell = styled.button<{ $isSelected: boolean; $isCorrect: boolean; $gridSize: number }>`
  background: ${(props) => {
    if (props.$isSelected) {
      return props.$isCorrect ? '#4caf50' : '#f44336';
    }
    return '#fff';
  }};
  border: 3px solid ${(props) => {
    if (props.$isSelected) {
      return props.$isCorrect ? '#2e7d32' : '#c62828';
    }
    return '#e0e0e0';
  }};
  border-radius: 12px;
  font-size: ${(props) => {
    // 그리드 크기에 따라 글씨 크기 조정
    // 셀 크기 = (100vw - 240px) / gridSize (대략)
    // 글씨는 셀 크기의 약 30-40% 정도가 적당
    if (props.$gridSize <= 3) {
      return 'clamp(12px, min(4vw, 4vh), 48px)';
    } else if (props.$gridSize <= 5) {
      return 'clamp(10px, min(3vw, 3vh), 36px)';
    } else if (props.$gridSize <= 6) {
      return 'clamp(9px, min(2.5vw, 2.5vh), 28px)';
    } else if (props.$gridSize <= 7) {
      return 'clamp(8px, min(2.2vw, 2.2vh), 24px)';
    } else {
      return 'clamp(7px, min(1.8vw, 1.8vh), 20px)';
    }
  }};
  font-weight: bold;
  color: ${(props) => {
    if (props.$isSelected) {
      return '#fff';
    }
    return '#333';
  }};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: '강원교육모두Bold', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 2px;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border-color: ${(props) => (props.$isSelected ? '' : '#2196f3')};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const MessageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  color: #fff;
  font-size: 48px;
  font-weight: bold;
  gap: 20px;
`;

const MessageText = styled.div`
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

export const MenuFindGame = ({ onWin, onLose, currentSceneId, timeLimit = TOTAL_TIME }: MenuFindGameProps) => {
  // 게임 상태
  const [currentRound, setCurrentRound] = useState(0);
  const [lives, setLives] = useState(LIVES_PER_ROUND);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState<string | null>(null);
  const [selectedCellId, setSelectedCellId] = useState<number | null>(null);

  // 씬 ID로 단어 세트 결정
  const wordSet = currentSceneId?.includes('jisoo') ? WORD_SETS.jisoo : WORD_SETS.dohee;

  // 그리드 생성
  const generateGrid = useCallback((round: number) => {
    const size = ROUNDS[round];
    const totalCells = size * size;
    const cells: GridCell[] = [];

    // 정답 위치 랜덤 선택
    const correctIndex = Math.floor(Math.random() * totalCells);

    // 모든 셀 생성
    for (let i = 0; i < totalCells; i++) {
      if (i === correctIndex) {
        // 정답 셀
        cells.push({
          id: i,
          word: wordSet.correct,
          isCorrect: true,
          isSelected: false,
        });
      } else {
        // 오답 셀 (오답 단어 중 랜덤 선택)
        const randomWrongWord = wordSet.incorrect[Math.floor(Math.random() * wordSet.incorrect.length)];
        cells.push({
          id: i,
          word: randomWrongWord,
          isCorrect: false,
          isSelected: false,
        });
      }
    }

    // 셀 섞기
    const shuffled = cells.sort(() => Math.random() - 0.5);
    // 섞은 후 ID 재할당
    const finalCells = shuffled.map((cell, index) => ({
      ...cell,
      id: index,
    }));

    setGrid(finalCells);
    setSelectedCellId(null);
  }, [wordSet]);

  // 라운드 시작
  useEffect(() => {
    if (currentRound < ROUNDS.length && !isGameOver) {
      generateGrid(currentRound);
      // 새 라운드 시작 시에만 목숨 리셋
      setLives(LIVES_PER_ROUND);
    }
  }, [currentRound, generateGrid, isGameOver]);

  // 타이머
  useEffect(() => {
    if (isGameOver || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameOver(true);
          setGameMessage('시간 초과!');
          setTimeout(() => onLose(), 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, timeLeft, onLose]);

  // 셀 클릭 처리
  const handleCellClick = useCallback((cell: GridCell) => {
    if (isGameOver || cell.isSelected || selectedCellId !== null) return;

    setSelectedCellId(cell.id);

    // 선택된 셀 업데이트
    setGrid((prev) =>
      prev.map((c) => (c.id === cell.id ? { ...c, isSelected: true } : c))
    );

    if (cell.isCorrect) {
      // 정답 선택
      if (currentRound + 1 >= ROUNDS.length) {
        // 모든 라운드 완료 - 바로 승리
        setIsGameOver(true);
        onWin();
      } else {
        // 다음 라운드로 바로 진행 (메시지 없이)
        setCurrentRound((prev) => prev + 1);
      }
    } else {
      // 오답 선택
      setLives((prevLives) => {
        const newLives = prevLives - 1;
        
        if (newLives <= 0) {
          // 목숨 소진
          setTimeout(() => {
            setIsGameOver(true);
            setGameMessage('패배!');
            setTimeout(() => onLose(), 1500);
          }, 1000);
        } else {
          // 계속 진행
          setTimeout(() => {
            setGameMessage(null);
            setSelectedCellId(null);
            // 그리드 재생성 (같은 라운드)
            generateGrid(currentRound);
          }, 1000);
        }
        
        return newLives;
      });
      setGameMessage('틀렸습니다!');
    }
  }, [isGameOver, selectedCellId, currentRound, generateGrid, onWin, onLose]);

  const gridSize = ROUNDS[currentRound];

  return (
    <KioskContainer>
      <SideBar>
        <InfoItem>
          <InfoLabel>라운드</InfoLabel>
          <InfoValue>
            {currentRound + 1} / {ROUNDS.length}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>목숨</InfoLabel>
          <LivesDisplay>
            <HeartsContainer>
              {Array.from({ length: lives }).map((_, i) => (
                <Heart key={i} $filled={true}>
                  ❤️
                </Heart>
              ))}
            </HeartsContainer>
          </LivesDisplay>
        </InfoItem>
        <InfoItem>
          <InfoLabel>남은 시간</InfoLabel>
          <InfoValue $isLow={timeLeft <= 30}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </InfoValue>
        </InfoItem>
      </SideBar>

      <GameArea>
        <GridContainer $size={gridSize}>
          {grid.map((cell) => (
            <GridCell
              key={cell.id}
              $isSelected={cell.isSelected}
              $isCorrect={cell.isCorrect}
              $gridSize={gridSize}
              onClick={() => handleCellClick(cell)}
              disabled={isGameOver || cell.isSelected || selectedCellId !== null}
            >
              {cell.word}
            </GridCell>
          ))}
          {gameMessage && (
            <MessageOverlay>
              <MessageText>{gameMessage}</MessageText>
            </MessageOverlay>
          )}
        </GridContainer>
      </GameArea>
    </KioskContainer>
  );
};

