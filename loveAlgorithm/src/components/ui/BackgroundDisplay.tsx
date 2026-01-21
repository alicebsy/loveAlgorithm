import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface BackgroundDisplayProps {
  background?: string;
  isBlurred?: boolean;
  isTransition?: boolean;
}

const BackgroundContainer = styled.div<{ $background?: string; $nextBackground?: string; $isBlurred?: boolean; $isLoaded?: boolean; $isTransition?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: ${(props) => (props.$isTransition ? '#000' : 'transparent')};
  z-index: 0;
  filter: ${(props) => (props.$isBlurred ? 'blur(8px)' : 'none')};
  transition: filter 0.3s ease-in-out;
  
  /* 현재 배경 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: ${(props) => (props.$isTransition ? 'none' : (props.$background ? `url(${props.$background})` : 'none'))};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${(props) => {
      if (props.$isTransition) return 0; // 전환 중에는 배경 숨김
      if (props.$nextBackground && !props.$isLoaded) return 0;
      return 1;
    }};
    transition: opacity 0.3s ease-in-out;
    z-index: 1;
  }
  
  /* 다음 배경 (로드 중) */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: ${(props) => (props.$isTransition ? 'none' : (props.$nextBackground ? `url(${props.$nextBackground})` : 'none'))};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${(props) => {
      if (props.$isTransition) return 0; // 전환 중에는 다음 배경도 숨김
      if (props.$nextBackground && props.$isLoaded) return 1;
      return 0;
    }};
    transition: opacity 0.3s ease-in-out;
    z-index: 2;
  }
`;

export const BackgroundDisplay = ({ background, isBlurred, isTransition }: BackgroundDisplayProps) => {
  const [currentBackground, setCurrentBackground] = useState<string | undefined>(background);
  const [nextBackground, setNextBackground] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    // 전환 중이면 배경 변경을 하지 않음
    if (isTransition) {
      return;
    }

    if (!background) {
      setCurrentBackground(undefined);
      setNextBackground(undefined);
      setIsLoaded(true);
      return;
    }

    // 배경이 변경되지 않으면 아무것도 하지 않음
    if (background === currentBackground) {
      return;
    }

    // 새 배경 이미지 미리 로드
    setIsLoaded(false);
    setNextBackground(background);
    
    const img = new Image();
    img.src = background;
    
    const handleLoad = () => {
      setIsLoaded(true);
      // 짧은 지연 후 현재 배경을 새 배경으로 교체
      setTimeout(() => {
        setCurrentBackground(background);
        setNextBackground(undefined);
      }, 50);
    };
    
    const handleError = () => {
      // 이미지 로드 실패 시에도 배경을 설정
      setIsLoaded(true);
      setCurrentBackground(background);
      setNextBackground(undefined);
    };

    img.onload = handleLoad;
    img.onerror = handleError;

    // 이미지가 이미 캐시되어 있으면 즉시 로드
    if (img.complete) {
      handleLoad();
    }

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [background, currentBackground, isTransition]);

  return <BackgroundContainer $background={currentBackground} $nextBackground={nextBackground} $isBlurred={isBlurred} $isLoaded={isLoaded} $isTransition={isTransition} />;
};

