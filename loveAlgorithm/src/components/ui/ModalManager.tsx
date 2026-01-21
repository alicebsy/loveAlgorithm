import { ConfirmModal } from './ConfirmModal';
import { useGameStore } from '../../store/gameStore';

export const ModalManager = () => {
  const { confirmModal, hideConfirmModal } = useGameStore();

  if (!confirmModal) return null;

  const handleConfirm = () => {
    confirmModal.onConfirm();
    hideConfirmModal();
  };

  return (
    <ConfirmModal
      message={confirmModal.message}
      onConfirm={handleConfirm}
      onCancel={hideConfirmModal}
    />
  );
};

