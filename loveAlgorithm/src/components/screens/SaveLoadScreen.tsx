import React from 'react';
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
  
  ${(props) =>
    props.$isEmpty &&
    `
    opacity: 0.5;
  `}
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
  const { saveSlots, loadGame, deleteSave, setCurrentScreen, showToast, showConfirmModal, fetchSaveSlots, setIsAuthenticated, setUser } = useGameStore();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    console.log('📥 SaveLoadScreen: 저장 슬롯 불러오기 시작');
    const token = localStorage.getItem('auth_token');
    console.log('🔐 현재 토큰 상태:', token ? '있음' : '없음');
    
    if (!token) {
      console.warn('⚠️ 토큰이 없습니다. 로그인이 필요합니다.');
      showToast('로그인이 필요합니다.', 'error');
      setCurrentScreen('login');
      return;
    }
    
    fetchSaveSlots()
      .then(() => {
        console.log('✅ SaveLoadScreen: 저장 슬롯 불러오기 완료, 슬롯 개수:', useGameStore.getState().saveSlots.length);
      })
      .catch((error) => {
        console.error('❌ SaveLoadScreen: 저장 슬롯 불러오기 실패:', error);
        if (error.message && error.message.includes('인증')) {
          showToast('인증이 만료되었습니다. 다시 로그인해주세요.', 'error');
          setIsAuthenticated(false);
          setUser(null);
          setCurrentScreen('login');
        } else {
          showToast('저장 슬롯을 불러올 수 없습니다.', 'error');
        }
      });
  }, [fetchSaveSlots, showToast, setCurrentScreen, setIsAuthenticated, setUser]);

  const handleLoad = async (slotIndex: number) => {
    try {
      setIsLoading(true);
      await loadGame(slotIndex);
      showToast('게임을 불러왔습니다.', 'success');
      setCurrentScreen('game');
    } catch (error) {
      showToast('게임 불러오기에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    showConfirmModal('이 저장 슬롯을 삭제하시겠습니까?', async () => {
      try {
        await deleteSave(slotIndex);
        showToast('저장 슬롯이 삭제되었습니다.', 'success');
      } catch (error) {
        showToast('저장 슬롯 삭제에 실패했습니다.', 'error');
      }
    });
  };

  // 슬롯 인덱스로 매핑 (백엔드 API는 slotIndex를 사용)
  const slots = Array.from({ length: 10 }, (_, i) => {
    // 백엔드에서 받은 슬롯 중 해당 인덱스의 슬롯 찾기
    return saveSlots.find((s) => {
      // slotIndex가 있으면 그것으로, 없으면 id에서 추출
      if (s.slotIndex !== undefined) {
        return s.slotIndex === i;
      }
      // id에서 인덱스 추출 시도
      if (s.id) {
        const match = s.id.match(/(\d+)/);
        if (match) {
          return parseInt(match[1]) === i;
        }
      }
      return false;
    }) || null;
  });

  return (
    <ScreenContainer>
      <Title>저장 / 불러오기</Title>
      <SlotGrid>
        {slots.map((slot, index) => (
          <SlotCard
            key={index}
            $isEmpty={!slot}
            onClick={() => {
              if (slot) {
                const slotIndex = slot.slotIndex !== undefined ? slot.slotIndex : parseInt(slot.id?.match(/(\d+)/)?.[1] || '0');
                handleLoad(slotIndex);
              }
            }}
          >
            {slot ? (
              <>
                <div>
                  <SlotPreview>{slot.preview}</SlotPreview>
                  <SlotInfo>
                    <span>슬롯 {index + 1}</span>
                    <span>{new Date(slot.timestamp).toLocaleString('ko-KR')}</span>
                  </SlotInfo>
                  {slot.gameState?.affections && (
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
                      호감도: {Object.entries(slot.gameState.affections).map(([char, score]) => `${char}: ${score}`).join(', ')}
                    </div>
                  )}
                </div>
                <ButtonGroup>
                  <Button onClick={(e) => {
                    e.stopPropagation();
                    handleLoad(slot.slotIndex !== undefined ? slot.slotIndex : parseInt(slot.id?.match(/(\d+)/)?.[1] || '0'));
                  }} disabled={isLoading}>불러오기</Button>
                  <Button onClick={(e) => handleDelete(slot.slotIndex !== undefined ? slot.slotIndex : parseInt(slot.id?.match(/(\d+)/)?.[1] || '0'), e)} disabled={isLoading}>삭제</Button>
                </ButtonGroup>
              </>
            ) : (
              <EmptySlotText>
                <div>빈 슬롯</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '10px' }}>
                  저장된 데이터가 없습니다
                </div>
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


