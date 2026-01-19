import styled from 'styled-components';
import type { Choice } from '../../types/game.types';

interface ChoiceModalProps {
  choices: Choice[];
  onSelect: (choiceId: string) => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  pointer-events: auto;
`;

const ChoicesContainer = styled.div<{ $choiceCount: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$choiceCount <= 2 ? '20px' : '16px')};
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  padding: 0 20px;
`;

const ChoiceButton = styled.button`
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(74, 144, 226, 0.5);
  border-radius: 12px;
  padding: 18px 32px;
  color: #333;
  font-size: 22px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  font-family: '강원교육모두Bold', sans-serif;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(74, 144, 226, 0.8);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(-1px) scale(0.98);
  }
`;

export const ChoiceModal = ({ choices, onSelect }: ChoiceModalProps) => {
  const handleChoiceClick = (choiceId: string) => {
    console.log('Choice clicked:', choiceId);
    onSelect(choiceId);
  };

  return (
    <Overlay onClick={(e) => e.stopPropagation()}>
      <ChoicesContainer $choiceCount={choices.length} onClick={(e) => e.stopPropagation()}>
        {choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            onClick={(e) => {
              e.stopPropagation();
              handleChoiceClick(choice.id);
            }}
          >
            {choice.text}
          </ChoiceButton>
        ))}
      </ChoicesContainer>
    </Overlay>
  );
};


