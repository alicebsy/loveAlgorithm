import styled from 'styled-components';

interface ControlPanelProps {
  onSave: () => void;
  onLoad: () => void;
  onNext: () => void;
  onPrevious?: () => void; // 이전 화면으로 돌아가기
  onSettings: () => void;
  onMainMenu: () => void;
  isInputMode?: boolean; // 입력 모드 여부
  canGoBack?: boolean; // 이전으로 돌아갈 수 있는지 여부
}

const PanelContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 3000;
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
  font-size: 17px;
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

// SkipButton는 사용되지 않으므로 제거

const HotkeyHint = styled.span`
  font-size: 13px;
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

export const ControlPanel = ({ onSave, onLoad, onNext, onPrevious, onSettings, onMainMenu, isInputMode = false, canGoBack = false }: ControlPanelProps) => {
  return (
    <PanelContainer>
      {canGoBack && onPrevious && (
        <Button onClick={onPrevious}>
          ◀ 이전
        </Button>
      )}
      <Button 
        onClick={onNext}
        style={{
          opacity: isInputMode ? 0.5 : 1,
          cursor: isInputMode ? 'not-allowed' : 'pointer'
        }}
        disabled={isInputMode}
      >
        다음<HotkeyHint>(Space)</HotkeyHint>
      </Button>
      <Button onClick={onSave}>
        저장<HotkeyHint>(Ctrl+S)</HotkeyHint>
      </Button>
      <Button onClick={onLoad}>
        불러오기<HotkeyHint>(Ctrl+L)</HotkeyHint>
      </Button>
      <Button onClick={onSettings}>
        설정<HotkeyHint>(ESC)</HotkeyHint>
      </Button>
      <MainMenuButton onClick={onMainMenu}>
        메인화면<HotkeyHint>(M)</HotkeyHint>
      </MainMenuButton>
    </PanelContainer>
  );
};

