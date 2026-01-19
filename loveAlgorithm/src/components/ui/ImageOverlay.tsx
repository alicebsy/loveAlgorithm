import styled from 'styled-components';

interface ImageOverlayProps {
  imagePath: string;
}

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
  z-index: 1500;
  pointer-events: none;
`;

const OverlayImage = styled.img`
  max-width: 400px;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.95);
  padding: 8px;
  pointer-events: none;
`;

export const ImageOverlay = ({ imagePath }: ImageOverlayProps) => {
  if (!imagePath) return null;

  return (
    <OverlayContainer>
      <OverlayImage src={imagePath} alt="오버레이 이미지" />
    </OverlayContainer>
  );
};

