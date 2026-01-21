import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styled from 'styled-components';

interface SungsimdangGameProps {
  onWin: () => void;
  onLose: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 200; // ms
const SPEED_INCREMENT = 15; // ms 감소량
const MIN_SPEED = 80; // 최소 간격
const TARGET_BREAD = 9; // 목표 빵 개수
const SNAKE_LENGTH = 20; // 고정 스네이크 길이

// 성심당 테마 컨테이너
const GameContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5e6d3 0%, #e8d5b7 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  padding: 20px;
  font-family: '강원교육모두Bold', sans-serif;
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
  color: #5d4037;
`;

const GameInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 20px;
  font-weight: bold;
`;

const BreadCounter = styled.div`
  color: #d84315;
`;

const GameArea = styled.div`
  position: relative;
  width: 600px;
  height: 600px;
  background: #fff8e1;
  border: 4px solid #8d6e63;
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(${GRID_SIZE}, 1fr);
  grid-template-rows: repeat(${GRID_SIZE}, 1fr);
  gap: 1px;
  padding: 2px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const GridCell = styled.div<{ $isSnake: boolean; $isHead: boolean; $isFood: boolean }>`
  background: ${(props) => {
    if (props.$isFood) return 'transparent';
    if (props.$isHead) return '#4caf50';
    if (props.$isSnake) return '#81c784';
    return '#fff8e1';
  }};
  border-radius: 2px;
  transition: background 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const GameOverOverlay = styled.div`
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
`;

const Instructions = styled.div`
  margin-top: 20px;
  font-size: 16px;
  color: #5d4037;
  text-align: center;
`;

export const SungsimdangGame = ({ onWin, onLose }: SungsimdangGameProps) => {
  const [snake, setSnake] = useState<Position[]>([]);
  const [food, setFood] = useState<Position | null>(null);
  const [breadCount, setBreadCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState<string | null>(null);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const gameLoopRef = useRef<number | null>(null);
  const directionRef = useRef<Direction>('UP');
  const foodRef = useRef<Position | null>(null);
  const isGameOverRef = useRef<boolean>(false);
  const speedRef = useRef<number>(INITIAL_SPEED);

  // 초기 스네이크 생성 (가운데에서 랜덤 방향으로)
  const initializeSnake = useCallback(() => {
    const centerX = Math.floor(GRID_SIZE / 2);
    const centerY = Math.floor(GRID_SIZE / 2);
    
    // 랜덤 방향 선택
    const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    
    // 20개 길이의 스네이크 생성
    let initialSnake: Position[] = [];
    if (randomDir === 'UP') {
      for (let i = 0; i < SNAKE_LENGTH; i++) {
        initialSnake.push({ x: centerX, y: centerY + i });
      }
    } else if (randomDir === 'DOWN') {
      for (let i = 0; i < SNAKE_LENGTH; i++) {
        initialSnake.push({ x: centerX, y: centerY - i });
      }
    } else if (randomDir === 'LEFT') {
      for (let i = 0; i < SNAKE_LENGTH; i++) {
        initialSnake.push({ x: centerX + i, y: centerY });
      }
    } else { // RIGHT
      for (let i = 0; i < SNAKE_LENGTH; i++) {
        initialSnake.push({ x: centerX - i, y: centerY });
      }
    }
    
    setSnake(initialSnake);
    directionRef.current = randomDir;
  }, []);

  // 빵 생성 (스네이크 몸체와 겹치지 않도록)
  const generateFood = useCallback((currentSnake: Position[]) => {
    const snakePositions = new Set(currentSnake.map((pos) => `${pos.x},${pos.y}`));
    const availablePositions: Position[] = [];
    
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const key = `${x},${y}`;
        if (!snakePositions.has(key)) {
          availablePositions.push({ x, y });
        }
      }
    }
    
    if (availablePositions.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  }, []);

  // 충돌 감지
  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    // 벽 충돌
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    
    // 자기 몸 충돌
    for (let i = 1; i < body.length; i++) {
      if (body[i].x === head.x && body[i].y === head.y) {
        return true;
      }
    }
    
    return false;
  }, []);

  // 게임 루프
  const gameLoop = useCallback(() => {
    setSnake((currentSnake) => {
      // isGameOver 상태를 직접 체크하지 않고 ref로 확인
      if (currentSnake.length === 0) return currentSnake;
      
      const currentDir = directionRef.current;
      const head = currentSnake[0];
      let newHead: Position;
      
      // 새 머리 위치 계산
      switch (currentDir) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }
      
      // 충돌 확인
      if (checkCollision(newHead, currentSnake)) {
        isGameOverRef.current = true;
        setIsGameOver(true);
        setGameMessage('패배!');
        setTimeout(() => onLose(), 1500);
        return currentSnake;
      }
      
      // 빵 먹기 확인
      const currentFood = foodRef.current;
      const ateFood = currentFood && newHead.x === currentFood.x && newHead.y === currentFood.y;
      
      // 새 스네이크 생성 (항상 고정 길이 SNAKE_LENGTH 유지)
      // 머리를 앞에 추가하고 꼬리를 제거하여 길이를 유지
      const newSnake = [newHead, ...currentSnake].slice(0, SNAKE_LENGTH);
      
      if (ateFood) {
        // 빵 카운트 증가
        setBreadCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= TARGET_BREAD) {
            isGameOverRef.current = true;
            setIsGameOver(true);
            setGameMessage('승리!');
            setTimeout(() => onWin(), 1500);
          }
          return newCount;
        });
        
        // 속도 증가 (다음 프레임부터 적용)
        setSpeed((prevSpeed) => Math.max(MIN_SPEED, prevSpeed - SPEED_INCREMENT));
        
        // 새 빵 생성
        const newFood = generateFood(newSnake);
        if (newFood) {
          setFood(newFood);
          foodRef.current = newFood;
        }
      }
      
      return newSnake;
    });
  }, [checkCollision, generateFood, onWin, onLose]);

  // 키보드 입력 처리
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      let newDir: Direction | null = null;
      
      switch (e.key) {
        case 'ArrowUp':
          newDir = 'UP';
          break;
        case 'ArrowDown':
          newDir = 'DOWN';
          break;
        case 'ArrowLeft':
          newDir = 'LEFT';
          break;
        case 'ArrowRight':
          newDir = 'RIGHT';
          break;
      }
      
      if (newDir && newDir !== directionRef.current) {
        // 반대 방향으로는 갈 수 없음
        const opposite: Record<Direction, Direction> = {
          UP: 'DOWN',
          DOWN: 'UP',
          LEFT: 'RIGHT',
          RIGHT: 'LEFT',
        };
        
        if (newDir !== opposite[directionRef.current]) {
          directionRef.current = newDir;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameOver]);

  // 게임 초기화
  useEffect(() => {
    initializeSnake();
  }, [initializeSnake]);

  // 스네이크 초기화 후 빵 생성
  useEffect(() => {
    if (snake.length > 0 && !food) {
      const initialFood = generateFood(snake);
      if (initialFood) {
        setFood(initialFood);
        foodRef.current = initialFood;
      }
    }
  }, [snake, food, generateFood]);

  // food 상태 변경 시 ref 동기화
  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  // isGameOver ref 동기화
  useEffect(() => {
    isGameOverRef.current = isGameOver;
  }, [isGameOver]);

  // speed ref 동기화
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // 게임 루프 시작
  useEffect(() => {
    // 게임 준비 조건: 스네이크가 있고, 빵이 있고, 게임이 끝나지 않았을 때
    if (snake.length === 0 || !food || isGameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }
    
    // 기존 interval 정리
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    // 새 interval 시작 (speed가 변경될 때마다 재시작)
    gameLoopRef.current = window.setInterval(() => {
      if (!isGameOverRef.current) {
        gameLoop();
      }
    }, speed);
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [speed, gameLoop, isGameOver, snake.length, food]);

  // 스네이크 위치 Set 메모이제이션 (snake가 변경될 때만 재계산)
  const snakeSet = useMemo(() => {
    return new Set(snake.map((pos) => `${pos.x},${pos.y}`));
  }, [snake]);

  // 머리 위치 메모이제이션
  const head = useMemo(() => {
    return snake[0] || null;
  }, [snake]);

  // 그리드 렌더링 최적화 (snake나 food가 변경될 때만 재계산)
  const gridCells = useMemo(() => {
    const grid = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snakeSet.has(`${x},${y}`);
        const isHead = head !== null && head.x === x && head.y === y;
        const isFood = !!(food && food.x === x && food.y === y);
        
        grid.push(
          <GridCell
            key={`${x}-${y}`}
            $isSnake={isSnake}
            $isHead={isHead}
            $isFood={isFood}
          >
            {isFood && '🍞'}
          </GridCell>
        );
      }
    }
    
    return grid;
  }, [snakeSet, head, food]); // snakeSet, head, food가 변경될 때만 재계산

  // 게임 오버 오버레이 메모이제이션
  const gameOverOverlay = useMemo(() => {
    if (!isGameOver || !gameMessage) return null;
    return (
      <GameOverOverlay>
        {gameMessage}
      </GameOverOverlay>
    );
  }, [isGameOver, gameMessage]);

  return (
    <GameContainer>
      <GameHeader>
        <GameInfo>
          <BreadCounter>빵: {breadCount} / {TARGET_BREAD}</BreadCounter>
        </GameInfo>
      </GameHeader>
      <GameArea>
        {gridCells}
        {gameOverOverlay}
      </GameArea>
      <Instructions>
        화살표 키로 조작하세요
      </Instructions>
    </GameContainer>
  );
};

