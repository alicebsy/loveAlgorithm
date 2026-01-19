import styled from 'styled-components';

interface ControlPanelProps {
  onSave: () => void;
  onLoad: () => void;
  onSkip: () => void;
  onNext: () => void;
  onSettings: () => void;
  onMainMenu: () => void;
  skipMode: boolean;
}

const PanelContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2100;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  pointer-events: auto;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const SkipButton = styled(Button)<{ $active: boolean }>`
  ${(props) =>
    props.$active &&
    `
    background: rgba(255, 215, 0, 0.3);
    border-color: #ffd700;
  `}
`;

const HotkeyHint = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-left: 4px;
`;

const MainMenuButton = styled(Button)`
  background: rgba(139, 0, 0, 0.7);
  border-color: rgba(255, 0, 0, 0.5);
  
  &:hover {
    background: rgba(139, 0, 0, 0.9);
    border-color: rgba(255, 0, 0, 0.7);
  }
`;

export const ControlPanel = ({ onSave, onLoad, onSkip, onNext, onSettings, onMainMenu, skipMode }: ControlPanelProps) => {
  return (
    <PanelContainer>
      <Button onClick={onNext}>
        다음<HotkeyHint>(Space)</HotkeyHint>
      </Button>
      <Button onClick={onSave}>
        저장<HotkeyHint>(Ctrl+S)</HotkeyHint>
      </Button>
      <Button onClick={onLoad}>
        불러오기<HotkeyHint>(Ctrl+L)</HotkeyHint>
      </Button>
      <SkipButton onClick={onSkip} $active={skipMode}>
        스킵<HotkeyHint>(K)</HotkeyHint>
      </SkipButton>
      <Button onClick={onSettings}>
        설정<HotkeyHint>(ESC)</HotkeyHint>
      </Button>
      <MainMenuButton onClick={onMainMenu}>
        메인화면<HotkeyHint>(M)</HotkeyHint>
      </MainMenuButton>
    </PanelContainer>
  );
};

