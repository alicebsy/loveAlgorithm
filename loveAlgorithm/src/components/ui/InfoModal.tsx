import styled from 'styled-components';

interface InfoModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4000;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background: rgba(30, 30, 30, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 32px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  color: #fff;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;

const Message = styled.div`
  color: #fff;
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 32px;
  white-space: pre-line;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;

const Button = styled.button`
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid rgba(76, 175, 80, 0.9);
  background: rgba(76, 175, 80, 0.8);
  color: #fff;
  width: 100%;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
  
  &:hover {
    background: rgba(76, 175, 80, 1);
    border-color: rgba(76, 175, 80, 1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export const InfoModal = ({ title, message, onClose }: InfoModalProps) => {
  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <Button onClick={onClose}>확인</Button>
      </ModalContainer>
    </Overlay>
  );
};

