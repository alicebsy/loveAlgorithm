import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  duration?: number;
  onClose: () => void;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ $type: string; $isClosing: boolean }>`
  position: fixed;
  top: 80px;
  right: 20px;
  background: ${(props) => {
    switch (props.$type) {
      case 'success':
        return 'rgba(76, 175, 80, 0.95)';
      case 'error':
        return 'rgba(244, 67, 54, 0.95)';
      default:
        return 'rgba(33, 150, 243, 0.95)';
    }
  }};
  color: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 4000;
  min-width: 250px;
  max-width: 400px;
  animation: ${(props) => (props.$isClosing ? slideOut : slideIn)} 0.3s ease-out;
  backdrop-filter: blur(10px);
  font-size: 14px;
  line-height: 1.5;
`;

export const Toast = ({ message, type = 'info', duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <ToastContainer $type={type} $isClosing={false}>
      {message}
    </ToastContainer>
  );
};

