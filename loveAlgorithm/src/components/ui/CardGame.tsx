import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getCharacterImagePath } from '../../services/imageService';

interface CardGameProps {
  onWin: () => void;
  onLose: () => void;
  timeLimit?: number; // 초 단위
}

interface Card {
  id: number;
  imageId: string;
  isFlipped: boolean;
  isMatched: boolean;
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
`;

const GameHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
  color: #fff;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
  gap: 8px;
`;

const Timer = styled.div<{ $isLow: boolean }>`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.$isLow ? '#ff4444' : '#fff')};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const Matches = styled.div`
  font-size: 18px;
  color: #fff;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 8px;
  max-width: 600px;
  max-height: 600px;
  width: 100%;
  aspect-ratio: 1;
`;

const CardWrapper = styled.div<{ $isFlipped: boolean; $isMatched: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  cursor: ${(props) => (props.$isMatched ? 'default' : 'pointer')};
  transform-style: preserve-3d;
  transition: transform 0.3s;
  
  ${(props) =>
    props.$isFlipped
      ? `
    transform: rotateY(180deg);
  `
      : ''}
`;

const CardFace = styled.div<{ $isBack: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  ${(props) =>
    props.$isBack
      ? `
    transform: rotateY(0deg);
  `
      : `
    transform: rotateY(180deg);
  `}
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const getCardImages = (): string[] => {
  return [
    '아무개',
    'dohee_access_denied',
    'dohee_side_smile',
    'dohee_joy',
    'jisoo_smile',
    'jisoo_hard',
    'jisoo_shy',
    '성준',
  ];
};

const getImagePath = (imageId: string): string => {
  // 이미지 ID를 경로로 변환
  // 확장자가 포함된 경우 그대로 사용, 없으면 .png 추가
  if (imageId.includes('.')) {
    return `/characters/${imageId}`;
  }
  return `/characters/${imageId}.png`;
};

export const CardGame = ({ onWin, onLose, timeLimit = 60 }: CardGameProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // 카드 초기화
  useEffect(() => {
    const imageIds = getCardImages();
    const cardPairs: string[] = [];
    
    // 각 이미지를 2번씩 추가
    imageIds.forEach((id) => {
      cardPairs.push(id);
      cardPairs.push(id);
    });

    // 카드 섞기
    const shuffled = [...cardPairs].sort(() => Math.random() - 0.5);

    // 카드 배열 생성
    const initialCards: Card[] = shuffled.map((imageId, index) => ({
      id: index,
      imageId,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
  }, []);

  // 타이머
  useEffect(() => {
    if (isGameOver || cards.length === 0 || timeLeft <= 0) return;

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
  }, [isGameOver, cards.length, timeLeft, onLose]);

  // 모든 카드 매칭 확인
  useEffect(() => {
    if (matchedPairs === 8 && !isGameOver) {
      setIsGameOver(true);
      onWin();
    }
  }, [matchedPairs, isGameOver, onWin]);

  // 카드 클릭 처리
  const handleCardClick = useCallback(
    (cardId: number) => {
      if (isGameOver || isChecking || flippedCards.length >= 2) return;

      const card = cards[cardId];
      if (card.isFlipped || card.isMatched) return;

      const newFlippedCards = [...flippedCards, cardId];
      setFlippedCards(newFlippedCards);

      setCards((prevCards) =>
        prevCards.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
      );

      // 2장이 뒤집혔을 때 매칭 확인
      if (newFlippedCards.length === 2) {
        setIsChecking(true);
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards[firstId];
        const secondCard = cards[secondId];

        setTimeout(() => {
          if (firstCard.imageId === secondCard.imageId) {
            // 매칭 성공
            setCards((prevCards) =>
              prevCards.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isMatched: true, isFlipped: true }
                  : c
              )
            );
            setMatchedPairs((prev) => prev + 1);
          } else {
            // 매칭 실패 - 카드 뒤집기
            setCards((prevCards) =>
              prevCards.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
          }
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    },
    [cards, flippedCards, isGameOver, isChecking]
  );

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 카드가 로드되지 않았으면 로딩 표시
  if (cards.length === 0) {
    return (
      <GameContainer>
        <div style={{ color: '#fff', fontSize: '24px' }}>게임 로딩 중...</div>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <GameHeader>
        <Timer $isLow={timeLeft <= 10}>
          {formatTime(timeLeft)}
        </Timer>
        <Matches>매칭: {matchedPairs} / 8</Matches>
      </GameHeader>
      <CardGrid>
        {cards.map((card) => (
          <CardWrapper
            key={card.id}
            $isFlipped={card.isFlipped}
            $isMatched={card.isMatched}
            onClick={() => handleCardClick(card.id)}
          >
            <CardFace $isBack={!card.isFlipped}>
              <CardImage 
                src="/icon/카드_뒤면.png" 
                alt="카드 뒷면" 
              />
            </CardFace>
            <CardFace $isBack={false}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <CardImage
                  src="/icon/카드_앞면.png"
                  alt="카드 앞면"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                  }}
                />
                <CardImage
                  src={getCharacterImagePath(card.imageId) || getImagePath(card.imageId)}
                  alt={card.imageId}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 2,
                  }}
                />
              </div>
            </CardFace>
          </CardWrapper>
        ))}
      </CardGrid>
    </GameContainer>
  );
};

