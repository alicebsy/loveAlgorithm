import { create } from 'zustand';
import type { GameState, SaveSlot, Settings, ScreenType, Scene } from '../types/game.types';
import { loadScript } from '../services/scriptService';
import { getAllAffections, getAllMiniGameScores, updateAffectionValue, updateMiniGameScore as updateMiniGameScoreService } from '../services/gameDataService';

interface GameStore {
  // Screen Management
  currentScreen: ScreenType;
  previousScreen: ScreenType | null;
  setCurrentScreen: (screen: ScreenType) => void;

  // Game State
  gameState: GameState;
  setGameState: (state: GameState) => void;
  resetGame: () => void;
  nextDialogue: () => void;
  goToScene: (sceneId: string) => void;

  // Save/Load
  saveSlots: SaveSlot[];
  saveGame: (slotId: string, preview: string) => void;
  loadGame: (slotId: string) => void;
  deleteSave: (slotId: string) => void;

  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;

  // UI State
  isDialogueTyping: boolean;
  setIsDialogueTyping: (typing: boolean) => void;
  skipMode: boolean;
  setSkipMode: (skip: boolean) => void;

  // Toast & Modal
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;
  confirmModal: { message: string; onConfirm: () => void } | null;
  showConfirmModal: (message: string, onConfirm: () => void) => void;
  hideConfirmModal: () => void;

  // Script Data
  script: Record<string, Scene> | null;
  isScriptLoading: boolean;
  scriptError: string | null;
  loadScript: () => Promise<void>;

  // Affection & MiniGame Scores
  affections: Record<string, number>;
  miniGameScores: Record<string, number>;
  updateAffection: (characterId: string, value: number) => Promise<void>;
  updateMiniGameScore: (gameId: string, score: number) => Promise<void>;
  syncWithBackend: () => Promise<void>;

  // Player Name
  heroName: string;
  setHeroName: (name: string) => void;

  // KakaoTalk History
  kakaoTalkHistory: Array<{ message: string; characterName?: string; type?: string; characterId?: string }>;
  addKakaoTalkMessage: (message: string, characterName?: string, type?: string, characterId?: string) => void;
  clearKakaoTalkHistory: () => void;

  // Previous Values (for save/load)
  previousValues: {
    character_image_id?: {
      1?: string;
      2?: string;
      3?: string;
    };
    background_image_id?: string;
    background_sound_id?: string;
  };
  setPreviousValues: (values: {
    character_image_id?: {
      1?: string;
      2?: string;
      3?: string;
    };
    background_image_id?: string;
    background_sound_id?: string;
  }) => void;
}

const defaultSettings: Settings = {
  skipMode: false,
  bgmVolume: 70,
  sfxVolume: 70,
  voiceVolume: 70,
  textSpeed: 50,
};

const defaultGameState: GameState = {
  currentSceneId: 'chapter1_scene1', // 첫 번째 씬으로 시작
  currentDialogueIndex: 0,
  history: [],
  previousValues: {},
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Screen Management
  currentScreen: 'start',
  previousScreen: null,
  setCurrentScreen: (screen) => {
    const { currentScreen } = get();
    set({ currentScreen: screen, previousScreen: currentScreen });
  },

  // Game State
  gameState: defaultGameState,
  setGameState: (state) => set({ gameState: state }),
  resetGame: () => {
    set({
      gameState: { ...defaultGameState },
      isDialogueTyping: false,
      skipMode: false,
      kakaoTalkHistory: [],
      previousValues: {},
    });
  },
  nextDialogue: () => {
    const { gameState } = get();
    // 실제 구현은 GameEngine에서 처리
    set({ gameState: { ...gameState, currentDialogueIndex: gameState.currentDialogueIndex + 1 } });
  },
  goToScene: (sceneId) => {
    const { gameState } = get();
    set({
      gameState: {
        currentSceneId: sceneId,
        currentDialogueIndex: 0,
        history: [...gameState.history, sceneId],
      },
    });
  },

  // Save/Load
  saveSlots: [],
  saveGame: (slotId, preview) => {
    const { gameState, saveSlots, previousValues } = get();
    // previousValues를 gameState에 포함하여 저장
    const gameStateWithPreviousValues = {
      ...gameState,
      previousValues: { ...previousValues },
    };
    const newSlot: SaveSlot = {
      id: slotId,
      timestamp: Date.now(),
      preview,
      gameState: gameStateWithPreviousValues,
    };
    const updatedSlots = saveSlots.filter((slot) => slot.id !== slotId);
    updatedSlots.push(newSlot);
    set({ saveSlots: updatedSlots });
    // localStorage에 저장
    localStorage.setItem('vn_save_slots', JSON.stringify(updatedSlots));
  },
  loadGame: (slotId) => {
    const { saveSlots } = get();
    const slot = saveSlots.find((s) => s.id === slotId);
    if (slot) {
      // previousValues 복원
      const previousValues = slot.gameState.previousValues || {};
      set({ 
        gameState: slot.gameState, 
        previousValues,
        currentScreen: 'game' 
      });
    }
  },
  deleteSave: (slotId) => {
    const { saveSlots } = get();
    const updatedSlots = saveSlots.filter((slot) => slot.id !== slotId);
    set({ saveSlots: updatedSlots });
    localStorage.setItem('vn_save_slots', JSON.stringify(updatedSlots));
  },

  // Settings
  settings: defaultSettings,
  updateSettings: (newSettings) => {
    const { settings } = get();
    set({ settings: { ...settings, ...newSettings } });
    localStorage.setItem('vn_settings', JSON.stringify({ ...settings, ...newSettings }));
  },

  // UI State
  isDialogueTyping: false,
  setIsDialogueTyping: (typing) => set({ isDialogueTyping: typing }),
  skipMode: false,
  setSkipMode: (skip) => set({ skipMode: skip }),

  // Toast & Modal
  toast: null,
  showToast: (message, type = 'info') => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
  confirmModal: null,
  showConfirmModal: (message, onConfirm) => set({ confirmModal: { message, onConfirm } }),
  hideConfirmModal: () => set({ confirmModal: null }),

  // Script Data
  script: null,
  isScriptLoading: false,
  scriptError: null,
  loadScript: async () => {
    set({ isScriptLoading: true, scriptError: null });
    try {
      const scriptData = await loadScript();
      set({ script: scriptData, isScriptLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load script';
      set({ scriptError: errorMessage, isScriptLoading: false });
      console.error('Script loading error:', error);
    }
  },

  // Affection & MiniGame Scores
  affections: {},
  miniGameScores: {},
  updateAffection: async (characterId, value) => {
    // 로컬 상태 업데이트
    const { affections } = get();
    const updated = { ...affections, [characterId]: value };
    set({ affections: updated });
    localStorage.setItem('vn_affections', JSON.stringify(updated));

    // 백엔드 동기화 시도
    try {
      await updateAffectionValue(characterId, value);
    } catch (error) {
      console.error('Failed to sync affection with backend:', error);
      // 백엔드 실패해도 로컬 상태는 유지
    }
  },
  updateMiniGameScore: async (gameId, score) => {
    // 로컬 상태 업데이트
    const { miniGameScores } = get();
    const currentScore = miniGameScores[gameId] || 0;
    if (score > currentScore) {
      const updated = { ...miniGameScores, [gameId]: score };
      set({ miniGameScores: updated });
      localStorage.setItem('vn_minigame_scores', JSON.stringify(updated));

      // 백엔드 동기화 시도
      try {
        await updateMiniGameScoreService(gameId, score);
      } catch (error) {
        console.error('Failed to sync mini game score with backend:', error);
        // 백엔드 실패해도 로컬 상태는 유지
      }
    }
  },
  syncWithBackend: async () => {
    try {
      // 모든 호감도 동기화
      const characterIds = Object.keys(get().affections);
      if (characterIds.length > 0) {
        const backendAffections = await getAllAffections(characterIds);
        set({ affections: backendAffections });
        localStorage.setItem('vn_affections', JSON.stringify(backendAffections));
      }

      // 모든 미니게임 점수 동기화
      const backendScores = await getAllMiniGameScores();
      set({ miniGameScores: backendScores });
      localStorage.setItem('vn_minigame_scores', JSON.stringify(backendScores));
    } catch (error) {
      console.error('Failed to sync with backend:', error);
    }
  },

  // Player Name
  heroName: '이도훈', // 기본값
  setHeroName: (name: string) => {
    set({ heroName: name });
    localStorage.setItem('vn_hero_name', name);
  },

  // KakaoTalk History
  kakaoTalkHistory: [],
  addKakaoTalkMessage: (message: string, characterName?: string, type?: string, characterId?: string) => {
    const { kakaoTalkHistory } = get();
    set({ kakaoTalkHistory: [...kakaoTalkHistory, { message, characterName, type, characterId }] });
  },
  clearKakaoTalkHistory: () => {
    set({ kakaoTalkHistory: [] });
  },

  // Previous Values (for save/load)
  previousValues: {},
  setPreviousValues: (values) => {
    set({ previousValues: { ...values } });
    // gameState에도 동기화
    const { gameState } = get();
    set({ gameState: { ...gameState, previousValues: { ...values } } });
  },
}));

// localStorage에서 초기 데이터 로드
if (typeof window !== 'undefined') {
  const savedSlots = localStorage.getItem('vn_save_slots');
  if (savedSlots) {
    try {
      const slots = JSON.parse(savedSlots);
      useGameStore.setState({ saveSlots: slots });
    } catch (e) {
      console.error('Failed to load save slots:', e);
    }
  }

  const savedSettings = localStorage.getItem('vn_settings');
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      useGameStore.setState({ settings });
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }

  const savedAffections = localStorage.getItem('vn_affections');
  if (savedAffections) {
    try {
      const affections = JSON.parse(savedAffections);
      useGameStore.setState({ affections });
    } catch (e) {
      console.error('Failed to load affections:', e);
    }
  }

  const savedMiniGameScores = localStorage.getItem('vn_minigame_scores');
  if (savedMiniGameScores) {
    try {
      const miniGameScores = JSON.parse(savedMiniGameScores);
      useGameStore.setState({ miniGameScores });
    } catch (e) {
      console.error('Failed to load mini game scores:', e);
    }
  }

  const savedHeroName = localStorage.getItem('vn_hero_name');
  if (savedHeroName) {
    useGameStore.setState({ heroName: savedHeroName });
  }
}

