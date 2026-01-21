import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * 앱 시작 시 스크립트를 자동으로 로드하는 훅
 */
export const useScriptLoader = () => {
  const { gameEvents, isScriptLoading, loadScript } = useGameStore();

  useEffect(() => {
    // 스크립트가 아직 로드되지 않았고, 로딩 중이 아닐 때만 로드
    if (!gameEvents && !isScriptLoading) {
      loadScript();
    }
  }, [gameEvents, isScriptLoading, loadScript]);

  return {
    gameEvents,
    isScriptLoading,
    reload: loadScript,
  };
};

