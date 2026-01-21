import styled from 'styled-components';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
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

const Message = styled.div`
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

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 19px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid;
  font-family: '강원교육모두Bold', sans-serif;
  
  ${(props) =>
    props.$variant === 'primary'
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
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
    color: #fff;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
    }
  `}
  
  &:active {
    transform: scale(0.95);
  }
`;

export const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
}: ConfirmModalProps) => {
  return (
    <Overlay onClick={onCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button $variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button $variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
};


