import { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface SystemDisplayProps {
  messages: string[];
  onNext: () => void;
  onKeyPress?: (e: KeyboardEvent) => void;
}

const SystemOverlay = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 67%;
  max-width: 1200px;
  height: 210px;
  z-index: 1000;
  pointer-events: none;
  font-family: '강원교육모두Bold', monospace;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ConsoleWindow = styled.div`
  width: 100%;
  height: 100%;
  background-color: #0c0c0c;
  border: 1px solid #3c3c3c;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.7);
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.4s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ConsoleHeader = styled.div`
  background-color: #1e1e1e;
  padding: 8px 12px;
  border-bottom: 1px solid #3c3c3c;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ConsoleTitle = styled.div`
  color: #cccccc;
  font-size: 20px;
  font-weight: 500;
`;

const ConsoleBody = styled.div`
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  color: #cccccc;
  font-size: 24px;
  line-height: 1.6;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1e1e1e;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #3c3c3c;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #4c4c4c;
  }
`;

const ConsoleLine = styled.div`
  margin-bottom: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const PromptLine = styled.div`
  color: #00ff00;
  margin-bottom: 8px;
`;

const Cursor = styled.span`
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0;
    }
  }
`;

const SystemText = styled.div`
  color: #ffffff;
  margin-left: 0;
`;

export const SystemDisplay = ({ messages, onNext }: SystemDisplayProps) => {
  const consoleBodyRef = useRef<HTMLDivElement>(null);
  const consoleWindowRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    if (consoleBodyRef.current) {
      consoleBodyRef.current.scrollTop = consoleBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // 스페이스바 키 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onNext]);

  const handleClick = () => {
    onNext();
  };

  return (
    <SystemOverlay>
      <ConsoleWindow ref={consoleWindowRef} onClick={handleClick}>
        <ConsoleHeader>
          <ConsoleTitle>Microsoft Windows [Version 10.0.19044.3693]</ConsoleTitle>
        </ConsoleHeader>
        <ConsoleBody ref={consoleBodyRef}>
          <ConsoleLine>
            <PromptLine>{'(c) Microsoft Corporation. All rights reserved.'}</PromptLine>
          </ConsoleLine>
          {messages.length === 0 ? (
            <>
              <ConsoleLine>
                <PromptLine>{'C:\\Users\\LoveAlgorithm>'}</PromptLine>
              </ConsoleLine>
              <ConsoleLine>
                <PromptLine>
                  {'C:\\Users\\LoveAlgorithm>'}
                  <Cursor>_</Cursor>
                </PromptLine>
              </ConsoleLine>
            </>
          ) : (
            messages.map((message, index) => (
              <ConsoleLine key={index}>
                <PromptLine>{'C:\\Users\\LoveAlgorithm>'}</PromptLine>
                <SystemText>{message}</SystemText>
              </ConsoleLine>
            ))
          )}
          <ConsoleLine>
            <PromptLine>
              {'C:\\Users\\LoveAlgorithm>'}
              <Cursor>_</Cursor>
            </PromptLine>
          </ConsoleLine>
        </ConsoleBody>
      </ConsoleWindow>
    </SystemOverlay>
  );
};

