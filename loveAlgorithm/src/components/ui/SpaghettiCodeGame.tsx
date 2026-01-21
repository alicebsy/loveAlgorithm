import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

interface SpaghettiCodeGameProps {
  onWin: () => void;
  onLose: () => void;
  timeLimit?: number; // 초 단위
}

interface SpaghettiPiece {
  id: number; // 1-9 (또는 10)
  startNumber: number; // 시작점 번호 (1, 2, 3, ..., 9)
  endNumber: number; // 끝점 번호 (2, 3, 4, ..., 10)
  centerX: number; // 면의 중심 x 좌표
  centerY: number; // 면의 중심 y 좌표
  angle: number; // 면의 회전 각도 (라디안)
  initialAngle: number; // 초기 각도 (면의 형태 유지용)
  startX: number; // 시작점 x (면의 한쪽 끝)
  startY: number; // 시작점 y
  endX: number; // 끝점 x (면의 다른 쪽 끝)
  endY: number; // 끝점 y
  isDragging: boolean; // 드래그 중인지 여부
  groupId?: number; // 연결된 그룹 ID (같은 그룹은 함께 움직임)
}


const GameContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  padding: 20px;
  overflow: hidden;
`;

const GameHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
  color: #fff;
  font-family: '강원교육모두Bold', sans-serif;
  gap: 8px;
`;

const Timer = styled.div<{ $isLow: boolean }>`
  font-size: 29px;
  font-weight: bold;
  color: ${(props) => (props.$isLow ? '#ff4444' : '#fff')};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const ConnectedCount = styled.div`
  font-size: 22px;
  color: #fff;
`;

const GameArea = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 600px;
  background: rgba(20, 20, 30, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const SvgOverlay = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const PieceGroup = styled.g<{ $isDragging: boolean }>`
  cursor: ${(props) => (props.$isDragging ? 'grabbing' : 'grab')};
  pointer-events: all;
  transition: ${(props) => (props.$isDragging ? 'none' : 'transform 0.2s ease-out')};
`;

const PiecePath = styled.path<{ $isDragging: boolean }>`
  stroke: #ff9800;
  stroke-width: ${(props) => (props.$isDragging ? '8' : '6')};
  fill: none;
  stroke-linecap: round;
  filter: ${(props) => (props.$isDragging ? 'drop-shadow(0 0 8px rgba(255, 152, 0, 0.8))' : 'none')};
  transition: ${(props) => (props.$isDragging ? 'none' : 'all 0.2s ease-out')};
`;

const EndPoint = styled.circle<{ $color: string }>`
  fill: ${(props) => props.$color};
  stroke: #fff;
  stroke-width: 2;
  r: 8;
  pointer-events: none;
`;



const PIECE_LENGTH = 120; // 스파게티면의 길이
const CONNECTION_DISTANCE = 10; // 연결 가능한 거리
const NUM_PIECES = 9; // 스파게티 면 개수 (1-2, 2-3, ..., 9-10)

// 각 번호(1-10)에 대한 고유한 색깔
const NUMBER_COLORS: string[] = [
  '#FF6B6B', // 1 - 빨강
  '#4ECDC4', // 2 - 청록
  '#45B7D1', // 3 - 파랑
  '#96CEB4', // 4 - 연두
  '#FFEAA7', // 5 - 노랑
  '#DDA15E', // 6 - 주황
  '#C77DFF', // 7 - 보라
  '#FF6B9D', // 8 - 분홍
  '#95E1D3', // 9 - 민트
  '#F38181', // 10 - 연어색
];

export const SpaghettiCodeGame = ({ onWin, onLose, timeLimit = 60 }: SpaghettiCodeGameProps) => {
  const [pieces, setPieces] = useState<SpaghettiPiece[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isGameOver, setIsGameOver] = useState(false);
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [nextGroupId, setNextGroupId] = useState(1);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // 스파게티면의 시작점과 끝점 계산
  const calculateEndpoints = useCallback((centerX: number, centerY: number, angle: number) => {
    const halfLength = PIECE_LENGTH / 2;
    const startX = centerX - Math.cos(angle) * halfLength;
    const startY = centerY - Math.sin(angle) * halfLength;
    const endX = centerX + Math.cos(angle) * halfLength;
    const endY = centerY + Math.sin(angle) * halfLength;
    return { startX, startY, endX, endY };
  }, []);

  // 초기화: 스파게티 면 생성
  useEffect(() => {
    const gameAreaWidth = 1200;
    const gameAreaHeight = 600;
    const initialPieces: SpaghettiPiece[] = [];

    // 스파게티 면 생성 (1-9개: (1,2), (2,3), ..., (9,10))
    for (let i = 1; i <= NUM_PIECES; i++) {
      const startNumber = i;
      const endNumber = i + 1;
      
      // 면의 위치를 랜덤하게 배치
      const centerX = Math.random() * (gameAreaWidth - 200) + 100;
      const centerY = Math.random() * (gameAreaHeight - 200) + 100;
      const angle = Math.random() * Math.PI * 2;
      const { startX, startY, endX, endY } = calculateEndpoints(centerX, centerY, angle);

      initialPieces.push({
        id: i,
        startNumber,
        endNumber,
        centerX,
        centerY,
        angle,
        initialAngle: angle,
        startX,
        startY,
        endX,
        endY,
        isDragging: false,
      });
    }

    setPieces(initialPieces);
  }, [calculateEndpoints]);

  // 타이머
  useEffect(() => {
    if (isGameOver || pieces.length === 0 || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameOver(true);
          setTimeout(() => onLose(), 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, pieces.length, timeLeft, onLose]);

  // 승리 조건 체크: 모든 2-9번 원이 겹쳐있는지 확인 (같은 색깔의 끝점들이 가까이 있음)
  useEffect(() => {
    if (isGameOver || pieces.length === 0) return;

    // 각 번호(2-9)에 대해 해당 번호를 가진 끝점들이 서로 가까이 있는지 확인
    const numbersToCheck = [2, 3, 4, 5, 6, 7, 8, 9];
    let allOverlapped = true;

    for (const number of numbersToCheck) {
      // 이 번호를 끝점으로 가진 면 찾기 (면 number-1의 끝점 number)
      const pieceWithEndNumber = pieces.find((p) => p.id === number - 1 && p.endNumber === number);
      // 이 번호를 시작점으로 가진 면 찾기 (면 number의 시작점 number)
      const pieceWithStartNumber = pieces.find((p) => p.id === number && p.startNumber === number);

      if (!pieceWithEndNumber || !pieceWithStartNumber) {
        allOverlapped = false;
        break;
      }

      // 두 면의 끝점이 서로 가까이 있는지 확인
      const distance = Math.sqrt(
        Math.pow(pieceWithEndNumber.endX - pieceWithStartNumber.startX, 2) +
          Math.pow(pieceWithEndNumber.endY - pieceWithStartNumber.startY, 2)
      );

      if (distance >= CONNECTION_DISTANCE) {
        allOverlapped = false;
        break;
      }
    }

    if (allOverlapped && !isGameOver) {
      setIsGameOver(true);
      
      // 승리 시 0.5초 동안 모든 면에 드래그 효과 적용
      setPieces((prev) =>
        prev.map((p) => ({ ...p, isDragging: true }))
      );
      
      // 0.5초 후 드래그 효과 제거하고 승리 처리
      setTimeout(() => {
        setPieces((prev) =>
          prev.map((p) => ({ ...p, isDragging: false }))
        );
        setTimeout(() => onWin(), 100);
      }, 500);
    }
  }, [pieces, isGameOver, onWin]);

  // 그룹 내 모든 면 가져오기
  const getGroupPieces = useCallback((groupId: number, allPieces: SpaghettiPiece[]): SpaghettiPiece[] => {
    return allPieces.filter((p) => p.groupId === groupId);
  }, []);

  // 연결 확인 함수: 같은 색깔(번호)의 끝점이 가까이 있으면 연결하여 하나의 조각으로 만듦
  // 이 함수는 오직 마우스 업 이벤트(클릭을 놓았을 때)에서만 호출됨
  const checkConnections = useCallback(
    (updatedPieces: SpaghettiPiece[]) => {
      const newPieces = updatedPieces.map((p) => ({ ...p })); // 깊은 복사

      // 드래그 중인 면이 있으면 연결 확인하지 않음 (안전장치)
      const hasDragging = newPieces.some((p) => p.isDragging);
      if (hasDragging) {
        return newPieces;
      }

      // 각 번호(2-9)에 대해 연결 확인
      // 번호 i에 대해: 면 (i-1)의 끝점 i와 면 i의 시작점 i가 가까이 있으면 연결
      for (let number = 2; number <= 9; number++) {
        // 이 번호를 끝점으로 가진 면 찾기 (면 number-1의 끝점 number)
        const pieceWithEndNumber = newPieces.find((p) => p.id === number - 1 && p.endNumber === number);
        // 이 번호를 시작점으로 가진 면 찾기 (면 number의 시작점 number)
        const pieceWithStartNumber = newPieces.find((p) => p.id === number && p.startNumber === number);

        if (pieceWithEndNumber && pieceWithStartNumber) {
          // 두 면의 끝점이 서로 가까이 있는지 확인 (같은 색깔의 원이 겹치는 것)
          const distance = Math.sqrt(
            Math.pow(pieceWithEndNumber.endX - pieceWithStartNumber.startX, 2) +
              Math.pow(pieceWithEndNumber.endY - pieceWithStartNumber.startY, 2)
          );

          if (distance < CONNECTION_DISTANCE) {
            // 연결됨: 같은 그룹으로 병합하여 하나의 새로운 조각으로 만듦
            const targetGroupId =
              pieceWithEndNumber.groupId || pieceWithStartNumber.groupId || nextGroupId;

            if (!pieceWithEndNumber.groupId) {
              pieceWithEndNumber.groupId = targetGroupId;
              if (targetGroupId === nextGroupId) {
                setNextGroupId((prev) => prev + 1);
              }
            }
            if (!pieceWithStartNumber.groupId) {
              pieceWithStartNumber.groupId = targetGroupId;
            }

            // 이미 연결된 그룹들도 병합
            if (pieceWithEndNumber.groupId && pieceWithStartNumber.groupId) {
              const endGroupId = pieceWithEndNumber.groupId;
              const startGroupId = pieceWithStartNumber.groupId;
              if (endGroupId !== startGroupId) {
                // 두 그룹 병합: startGroupId를 가진 모든 면을 endGroupId로 변경
                newPieces.forEach((p) => {
                  if (p.groupId === startGroupId) {
                    p.groupId = endGroupId;
                  }
                });
              }
            }
          }
        }
      }

      return newPieces;
    },
    [nextGroupId]
  );

  // 마우스 다운: 드래그 시작
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGElement>, pieceId: number) => {
      if (isGameOver) return;

      const piece = pieces.find((p) => p.id === pieceId);
      if (!piece) return;

      const rect = gameAreaRef.current?.getBoundingClientRect();
      if (!rect) return;

      // 그룹 내 모든 면을 함께 드래그
      const groupId = piece.groupId;
      const groupPieces = groupId ? getGroupPieces(groupId, pieces) : [piece];

      setDraggingPiece(pieceId);

      // 드래그 오프셋 계산 (그룹의 중심 기준)
      const groupCenterX = groupPieces.reduce((sum, p) => sum + p.centerX, 0) / groupPieces.length;
      const groupCenterY = groupPieces.reduce((sum, p) => sum + p.centerY, 0) / groupPieces.length;

      setDragOffset({
        x: e.clientX - rect.left - groupCenterX,
        y: e.clientY - rect.top - groupCenterY,
      });

      setPieces((prev) =>
        prev.map((p) => {
          if (groupId && p.groupId === groupId) {
            return { ...p, isDragging: true };
          } else if (p.id === pieceId) {
            return { ...p, isDragging: true };
          }
          return p;
        })
      );
    },
    [pieces, isGameOver, getGroupPieces]
  );

  // 마우스 이동: 드래그 중
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingPiece === null || !gameAreaRef.current) return;

      const piece = pieces.find((p) => p.id === draggingPiece);
      if (!piece) return;

      const rect = gameAreaRef.current.getBoundingClientRect();
      const newCenterX = e.clientX - rect.left - dragOffset.x;
      const newCenterY = e.clientY - rect.top - dragOffset.y;

      // 경계 체크
      const gameAreaWidth = 1200;
      const gameAreaHeight = 600;
      const clampedX = Math.max(60, Math.min(gameAreaWidth - 60, newCenterX));
      const clampedY = Math.max(60, Math.min(gameAreaHeight - 60, newCenterY));

      setPieces((prev) => {
        const groupId = piece.groupId;
        const groupPieces = groupId ? getGroupPieces(groupId, prev) : [piece];

        // 그룹의 현재 중심 계산
        const currentGroupCenterX =
          groupPieces.reduce((sum, p) => sum + p.centerX, 0) / groupPieces.length;
        const currentGroupCenterY =
          groupPieces.reduce((sum, p) => sum + p.centerY, 0) / groupPieces.length;

        // 이동량 계산
        const deltaX = clampedX - currentGroupCenterX;
        const deltaY = clampedY - currentGroupCenterY;

        // 그룹 내 모든 면을 함께 이동 (각도는 initialAngle 유지)
        const updated = prev.map((p) => {
          if (groupId && p.groupId === groupId) {
            const newCenterX = p.centerX + deltaX;
            const newCenterY = p.centerY + deltaY;
            const angle = p.initialAngle;
            const { startX, startY, endX, endY } = calculateEndpoints(newCenterX, newCenterY, angle);
            return {
              ...p,
              centerX: newCenterX,
              centerY: newCenterY,
              angle,
              startX,
              startY,
              endX,
              endY,
            };
          } else if (p.id === draggingPiece) {
            const angle = p.initialAngle;
            const { startX, startY, endX, endY } = calculateEndpoints(clampedX, clampedY, angle);
            return {
              ...p,
              centerX: clampedX,
              centerY: clampedY,
              angle,
              startX,
              startY,
              endX,
              endY,
            };
          }
          return p;
        });

        return updated;
      });
    },
    [draggingPiece, dragOffset, pieces, getGroupPieces, calculateEndpoints]
  );

  // 마우스 업: 드래그 종료 및 연결 확인 (클릭을 놓았을 때만 연결됨)
  const handleMouseUp = useCallback(() => {
    if (draggingPiece === null) return;

    const piece = pieces.find((p) => p.id === draggingPiece);
    if (!piece) return;

    // 먼저 모든 드래그 상태를 해제한 후, 클릭을 놓은 상태에서만 연결 확인
    setPieces((prev) => {
      const updated = prev.map((p) => {
        if (piece.groupId && p.groupId === piece.groupId) {
          return { ...p, isDragging: false };
        } else if (p.id === draggingPiece) {
          return { ...p, isDragging: false };
        }
        return p;
      });
      
      // 드래그 상태가 모두 해제된 후에만 연결 확인 (클릭을 놓았을 때만 합침)
      return checkConnections(updated);
    });

    setDraggingPiece(null);
  }, [draggingPiece, pieces, checkConnections]);

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (draggingPiece !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingPiece, handleMouseMove, handleMouseUp]);

  // 각 번호의 원이 겹쳐있는지 확인 (같은 색깔의 끝점들이 가까이 있음)
  const isCircleOverlapped = useCallback(
    (number: number): boolean => {
      if (number < 2 || number > 9) return false; // 2-9만 확인

      // 이 번호를 끝점으로 가진 면 찾기 (면 number-1의 끝점 number)
      const pieceWithEndNumber = pieces.find((p) => p.id === number - 1 && p.endNumber === number);
      // 이 번호를 시작점으로 가진 면 찾기 (면 number의 시작점 number)
      const pieceWithStartNumber = pieces.find((p) => p.id === number && p.startNumber === number);

      if (!pieceWithEndNumber || !pieceWithStartNumber) return false;

      // 두 면의 끝점이 서로 가까이 있는지 확인
      const distance = Math.sqrt(
        Math.pow(pieceWithEndNumber.endX - pieceWithStartNumber.startX, 2) +
          Math.pow(pieceWithEndNumber.endY - pieceWithStartNumber.startY, 2)
      );

      return distance < CONNECTION_DISTANCE;
    },
    [pieces]
  );

  // 렌더링
  const renderSpaghettiGroups = () => {
    const elements: React.ReactElement[] = [];

    pieces.forEach((piece) => {
      const startX = piece.startX;
      const startY = piece.startY;
      const endX = piece.endX;
      const endY = piece.endY;

      // 곡선 경로 생성
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const perpAngle = piece.angle + Math.PI / 2;
      const curveOffset = 15;
      const controlX = midX + Math.cos(perpAngle) * curveOffset;
      const controlY = midY + Math.sin(perpAngle) * curveOffset;

      const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`;

      const startColor = NUMBER_COLORS[piece.startNumber - 1];
      const endColor = NUMBER_COLORS[piece.endNumber - 1];

      elements.push(
        <PieceGroup
          key={`piece-${piece.id}`}
          $isDragging={piece.isDragging}
          onMouseDown={(e) => handleMouseDown(e, piece.id)}
        >
          <PiecePath d={pathData} $isDragging={piece.isDragging} />
          <EndPoint cx={startX} cy={startY} $color={startColor} />
          <EndPoint cx={endX} cy={endY} $color={endColor} />
        </PieceGroup>
      );
    });

    return elements;
  };


  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 겹쳐진 원 개수 계산 (2-9번만)
  const overlappedCount = [2, 3, 4, 5, 6, 7, 8, 9].filter((number) =>
    isCircleOverlapped(number)
  ).length;

  if (pieces.length === 0) {
    return (
      <GameContainer>
        <div style={{ color: '#fff', fontSize: '24px' }}>게임 로딩 중...</div>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <GameHeader>
        <Timer $isLow={timeLeft <= 10}>{formatTime(timeLeft)}</Timer>
        <ConnectedCount>겹쳐진 원: {overlappedCount} / 8</ConnectedCount>
      </GameHeader>
      <GameArea ref={gameAreaRef}>
        <SvgOverlay>
          {renderSpaghettiGroups()}
        </SvgOverlay>
      </GameArea>
    </GameContainer>
  );
};
