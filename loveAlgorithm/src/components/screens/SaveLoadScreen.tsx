import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { ToastManager } from '../ui/ToastManager';
import { ModalManager } from '../ui/ModalManager';

const ScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  color: #fff;
  padding: 40px;
`;

const Title = styled.h2`
  font-size: 38px;
  margin-bottom: 40px;
  font-family: '강원교육모두Bold', sans-serif;
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 40px;
`;

const SlotCard = styled.div<{ $isEmpty: boolean }>`
  background: ${(props) => (props.$isEmpty ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)')};
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  cursor: ${(props) => (props.$isEmpty ? 'default' : 'pointer')};
  transition: all 0.3s;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  &:hover {
    ${(props) =>
      !props.$isEmpty &&
      `
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-5px);
    `}
  }
`;

const SlotPreview = styled.div`
  font-size: 17px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const SlotInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #fff;
  font-size: 19px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const EmptySlotText = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 17px;
  margin-top: 40px;
`;

export const SaveLoadScreen = () => {
  const { saveSlots, loadGame, deleteSave, setCurrentScreen, saveGame, showToast, showConfirmModal } = useGameStore();

  const handleLoad = (slotId: string) => {
    loadGame(slotId);
  };

  const handleDelete = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    showConfirmModal('이 저장 슬롯을 삭제하시겠습니까?', () => {
      deleteSave(slotId);
      showToast('저장 슬롯이 삭제되었습니다.', 'success');
    });
  };

  const handleSave = (slotIndex: number) => {
    const slotId = `save_${slotIndex}`;
    const preview = '새 저장 슬롯';
    saveGame(slotId, preview);
    showToast('게임이 저장되었습니다.', 'success');
  };

  const slots = Array.from({ length: 10 }, (_, i) => {
    const slotId = `save_${i}`;
    return saveSlots.find((s) => s.id === slotId) || null;
  });

  return (
    <ScreenContainer>
      <Title>저장 / 불러오기</Title>
      <SlotGrid>
        {slots.map((slot, index) => (
          <SlotCard
            key={index}
            $isEmpty={!slot}
            onClick={() => slot && handleLoad(slot.id)}
          >
            {slot ? (
              <>
                <div>
                  <SlotPreview>{slot.preview}</SlotPreview>
                  <SlotInfo>
                    <span>슬롯 {index + 1}</span>
                    <span>{new Date(slot.timestamp).toLocaleString('ko-KR')}</span>
                  </SlotInfo>
                </div>
                <ButtonGroup>
                  <Button onClick={(e) => handleDelete(slot.id, e)}>삭제</Button>
                </ButtonGroup>
              </>
            ) : (
              <EmptySlotText>
                <div>빈 슬롯</div>
                <Button
                  onClick={() => handleSave(index)}
                  style={{ marginTop: '20px', width: '100%' }}
                >
                  저장
                </Button>
              </EmptySlotText>
            )}
          </SlotCard>
        ))}
      </SlotGrid>
      <Button onClick={() => setCurrentScreen('game')}>돌아가기</Button>
      <ToastManager />
      <ModalManager />
    </ScreenContainer>
  );
};


