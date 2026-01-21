import { Toast } from './Toast';
import { useGameStore } from '../../store/gameStore';

export const ToastManager = () => {
  const { toast, hideToast } = useGameStore();

  if (!toast) return null;

  return <Toast message={toast.message} type={toast.type} duration={6000} onClose={hideToast} />;
};

