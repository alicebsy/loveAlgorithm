import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { Dialogue, ScenarioType } from '../../types/game.types';

interface DialogueBoxProps {
  dialogue: Dialogue | null;
  scenarioType?: ScenarioType;
  isTyping: boolean;
  onNext: () => void;
  onChoiceSelect?: (choiceId: string) => void;
  textSpeed?: number; // 0-100, 높을수록 빠름
  onNameInput?: (name: string) => void; // 이름 입력 콜백
  defaultName?: string; // 기본 이름
}

const DialogueContainer = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 67%;
  max-width: 1200px;
  height: 210px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  border-radius: 20px 20px 0 0;
  padding: 20px 24px 24px 24px;
  padding-top: 60px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #333;
  font-family: '강원교육모두Bold', sans-serif;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 4px;
  overflow: visible;
`;

const SpeakerBubble = styled.div<{ $type?: ScenarioType }>`
  position: absolute;
  top: -25px;
  left: 20px;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  white-space: nowrap;
  min-height: 40px;
  height: 40px;
`;

const SpeakerIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffd700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SpeakerName = styled.span<{ $type?: ScenarioType }>`
  font-size: 24px;
  font-weight: 600;
  padding-top: 3px;
  color: #333;
`;

const DialogueTextContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: -35px;
`;

const TextIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 6px;
  
  &::before {
    content: '⋯';
    color: #333;
    font-size: 14px;
    line-height: 1;
    font-weight: bold;
  }
`;

const DialogueText = styled.div<{ $isTyping: boolean; $type?: ScenarioType }>`
  font-size: 30px;
  line-height: 1.6;
  min-height: 60px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-style: ${(props) => (props.$type === 'think' ? 'italic' : 'normal')};
  color: ${(props) => {
    if (props.$type === 'think') return '#6b6bff';
    if (props.$type === 'narration') return '#555';
    if (props.$type === '카톡') return '#0066cc';
    if (props.$type === '시스템') return '#00aa00';
    return '#556b2f'; // 올리브 그린
  }};
  flex: 1;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  ${(props) =>
    props.$isTyping
      ? `
    &::after {
      content: '▋';
      animation: blink 1s infinite;
      color: #999;
    }
  `
      : ''}
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const NameInputField = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #4a90e2;
  border-radius: 8px;
  font-size: 22px;
  font-family: '강원교육모두Bold', sans-serif;
  outline: none;
  background: #fff;
  color: #333;
  margin-top: 8px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #357abd;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
`;


const BottomBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #ffd700;
  border-radius: 0 0 20px 20px;
`;

const NextIndicator = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  font-size: 14px;
  color: #999;
  animation: bounce 1s infinite;
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
`;

export const DialogueBox = ({ dialogue, scenarioType, isTyping, onNext, onChoiceSelect, textSpeed = 50, onNameInput, defaultName = '이도훈' }: DialogueBoxProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputName, setInputName] = useState(defaultName);
  const prevDialogueIdRef = useRef<string | null>(null);
  const isInputMode = scenarioType === 'input';

  if (!dialogue) return null;

  // 대화가 변경되었는지 확인 (렌더링 시점에 즉시 확인)
  // prevDialogueIdRef.current를 먼저 확인하고, 변경되었으면 즉시 업데이트
  const currentDialogueId = dialogue.id;
  const dialogueChanged = prevDialogueIdRef.current !== currentDialogueId;
  
  // 렌더링 시점에 표시할 텍스트 결정 (가장 먼저 계산)
  // 대화가 변경되었거나, 타이핑이 시작되지 않았고 currentIndex가 0이면 빈 문자열
  const safeDisplayText = (dialogueChanged || (!isTyping && currentIndex === 0 && !isInputMode)) ? '' : displayedText;
  
  // 대화가 변경되면 즉시 상태 초기화 (동기적으로)
  if (dialogueChanged) {
    prevDialogueIdRef.current = currentDialogueId;
    // 상태를 즉시 초기화
    if (displayedText !== '' || currentIndex !== 0) {
      setDisplayedText('');
      setCurrentIndex(0);
    }
  }

  // 대화가 변경되면 타이핑 효과 초기화
  useEffect(() => {
    if (dialogueChanged) {
      if (isInputMode && defaultName) {
        setInputName(defaultName);
      }
    }
  }, [currentDialogueId, dialogueChanged, isInputMode, defaultName]);

  // 한 글자씩 타이핑 효과
  useEffect(() => {
    if (isInputMode) {
      // 입력 모드일 때는 타이핑 효과 없이 즉시 표시
      setDisplayedText(dialogue.text);
      setCurrentIndex(dialogue.text.length);
      return;
    }

    // 대화가 변경되었고 타이핑이 시작되지 않았으면 빈 텍스트 유지
    if (currentIndex === 0 && !isTyping) {
      setDisplayedText('');
      return;
    }

    // 타이핑이 시작되지 않았으면 항상 빈 텍스트 유지
    if (!isTyping) {
      if (currentIndex === 0) {
        setDisplayedText('');
        return;
      }
      // 타이핑 중이었는데 중단된 경우 완료
      if (currentIndex < dialogue.text.length) {
        setDisplayedText(dialogue.text);
        setCurrentIndex(dialogue.text.length);
      }
      return;
    }

    // 타이핑이 완료된 경우
    if (currentIndex >= dialogue.text.length) {
      setDisplayedText(dialogue.text);
      return;
    }

    // textSpeed: 0-100, 높을수록 빠름
    // 0 = 100ms/글자, 50 = 50ms/글자, 100 = 10ms/글자
    const delay = Math.max(10, 100 - textSpeed);

    const timer = setTimeout(() => {
      setDisplayedText(dialogue.text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, isTyping, dialogue.text, dialogue.id, textSpeed, isInputMode, displayedText]);

  const hasChoices = dialogue.choices && dialogue.choices.length > 0;
  const displayName = () => {
    if (scenarioType === 'think') return '';
    if (scenarioType === 'narration') return '';
    if (scenarioType === '시스템') return '[시스템]';
    if (scenarioType === '카톡') return '[카톡]';
    return dialogue.character || '';
  };

  const handleClick = () => {
    if (isInputMode) return; // 입력 모드일 때는 클릭 무시
    
    if (isTyping && currentIndex < dialogue.text.length) {
      // 타이핑 중이면 즉시 완료
      setDisplayedText(dialogue.text);
      setCurrentIndex(dialogue.text.length);
    } else if (!hasChoices) {
      onNext();
    }
  };

  const handleNameSubmit = () => {
    if (inputName.trim() && onNameInput) {
      onNameInput(inputName.trim());
      onNext();
    }
  };

  const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };

  const speakerName = displayName();
  
  return (
    <>
      <DialogueContainer onClick={handleClick} style={{ cursor: hasChoices ? 'default' : 'pointer' }}>
        <SpeakerBubble $type={scenarioType}>
          <SpeakerIcon />
          <SpeakerName $type={scenarioType} style={{ visibility: speakerName && speakerName.trim() !== '' ? 'visible' : 'hidden' }}>
            {speakerName || '\u00A0'}
          </SpeakerName>
        </SpeakerBubble>
        <DialogueTextContainer>
          <TextIcon />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <DialogueText $isTyping={currentIndex < dialogue.text.length && !isInputMode && isTyping} $type={scenarioType}>
              {safeDisplayText}
            </DialogueText>
            {isInputMode && (
              <NameInputField
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyPress={handleNameKeyPress}
                placeholder="이름을 입력하세요"
                maxLength={20}
                autoFocus
              />
            )}
          </div>
        </DialogueTextContainer>
        {!hasChoices && !isInputMode && currentIndex >= dialogue.text.length && <NextIndicator>▶ 다음</NextIndicator>}
        {isInputMode && (
          <NextIndicator onClick={handleNameSubmit} style={{ cursor: 'pointer' }}>▶ 확인</NextIndicator>
        )}
        <BottomBar />
      </DialogueContainer>
    </>
  );
};

