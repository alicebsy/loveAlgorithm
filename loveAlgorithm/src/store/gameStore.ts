import { create } from 'zustand';
import type { GameState, SaveSlot, Settings, ScreenType, Scene } from '../types/game.types';
import { loadScript } from '../services/scriptService';
import { updateAffectionValue, updateMiniGameScore as updateMiniGameScoreService } from '../services/gameDataService';
import { 
  saveToSlot, 
  loadFromSlot, 
  deleteSaveSlot as deleteSaveSlotAPI,
  fetchSaveSlots as fetchSaveSlotsAPI,
  updateUserProgress,
  fetchCurrentUser,
  fetchAllAffections,
  updateAffections as updateAffectionsAPI,
  fetchMiniGameScores
} from '../services/api';

interface GameStore {
  // Authentication
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  user: {
    account_id?: number;
    email?: string;
    nickname?: string;
  } | null;
  setUser: (user: { account_id?: number; email?: string; nickname?: string } | null) => void;

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
  saveGame: (slotId: string, preview: string) => Promise<void>;
  loadGame: (slotId: string) => Promise<void>;
  deleteSave: (slotId: string) => Promise<void>;

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

  // System History
  systemHistory: string[];
  addSystemMessage: (message: string) => void;
  clearSystemHistory: () => void;

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
  // Authentication
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => {
    set({ isAuthenticated });
    if (!isAuthenticated) {
      // 로그아웃 시 토큰 제거
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      set({ user: null });
    }
  },
  user: null,
  setUser: (user) => set({ user }),

  // Screen Management
  currentScreen: 'login', // 초기 화면을 로그인으로 설정
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
      systemHistory: [],
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
  saveGame: async (slotId, preview) => {
    const { gameState, previousValues, heroName } = get();
    // previousValues를 gameState에 포함하여 저장
    const gameStateWithPreviousValues: GameState = {
      ...gameState,
      previousValues: { ...previousValues },
    };
    
    // 로컬 저장 (즉시 반영)
    const newSlot: SaveSlot = {
      id: slotId,
      timestamp: Date.now(),
      preview,
      gameState: gameStateWithPreviousValues,
    };
    const { saveSlots } = get();
    const updatedSlots = saveSlots.filter((slot) => slot.id !== slotId);
    updatedSlots.push(newSlot);
    set({ saveSlots: updatedSlots });
    localStorage.setItem('vn_save_slots', JSON.stringify(updatedSlots));
    
    // 백엔드 저장 시도
    try {
      const slotIndex = parseInt(slotId.replace('slot_', '')) || 0;
      await saveToSlot(slotIndex, gameStateWithPreviousValues, preview, heroName);
      // 자동 저장도 업데이트
      await updateUserProgress(gameStateWithPreviousValues, heroName);
    } catch (error) {
      console.error('Failed to save to backend:', error);
      // 백엔드 실패해도 로컬 저장은 유지
    }
  },
  loadGame: async (slotId) => {
    const { saveSlots } = get();
    // 먼저 로컬에서 찾기
    let slot = saveSlots.find((s) => s.id === slotId);
    
    // 로컬에 없으면 백엔드에서 불러오기 시도
    if (!slot) {
      try {
        const slotIndex = parseInt(slotId.replace('slot_', '')) || 0;
        const loadedGameState = await loadFromSlot(slotIndex);
        if (loadedGameState) {
          slot = {
            id: slotId,
            timestamp: Date.now(),
            preview: '백엔드에서 불러옴',
            gameState: loadedGameState,
          };
        }
      } catch (error) {
        console.error('Failed to load from backend:', error);
      }
    }
    
    if (slot) {
      // previousValues 복원
      const previousValues = slot.gameState.previousValues || {};
      set({ 
        gameState: slot.gameState, 
        previousValues,
        currentScreen: 'game',
        // 호감도와 미니게임 점수도 복원
        affections: slot.gameState.affections || {},
        miniGameScores: slot.gameState.miniGameScores || {},
      });
    }
  },
  deleteSave: async (slotId) => {
    const { saveSlots } = get();
    const updatedSlots = saveSlots.filter((slot) => slot.id !== slotId);
    set({ saveSlots: updatedSlots });
    localStorage.setItem('vn_save_slots', JSON.stringify(updatedSlots));
    
    // 백엔드에서도 삭제 시도
    try {
      const slotIndex = parseInt(slotId.replace('slot_', '')) || 0;
      await deleteSaveSlotAPI(slotIndex);
    } catch (error) {
      console.error('Failed to delete from backend:', error);
    }
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

    // 게임 상태에도 반영
    const { gameState } = get();
    set({
      gameState: {
        ...gameState,
        affections: updated,
      },
    });

    // 백엔드 동기화 시도
    try {
      await updateAffectionValue(characterId, value);
      // 새로운 API도 시도
      await updateAffectionsAPI(updated);
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
      // 현재 사용자 정보 불러오기
      const userData = await fetchCurrentUser();
      if (userData) {
        // 사용자 정보 설정
        set({
          user: {
            account_id: userData.user_id,
            nickname: userData.in_game_nickname,
          },
          heroName: userData.in_game_nickname,
          affections: userData.affections || {},
          miniGameScores: userData.mini_game_scores || {},
          previousValues: userData.previous_values || {},
        });
        
        // userId를 localStorage와 sessionStorage에 저장 (API 호출용)
        sessionStorage.setItem('current_user_id', userData.user_id.toString());
        localStorage.setItem('current_user', JSON.stringify(userData));
        
        // 게임 상태도 복원
        if (userData.current_scene_id) {
          set({
            gameState: {
              currentSceneId: userData.current_scene_id,
              currentDialogueIndex: userData.current_dialogue_index || 0,
              history: userData.scene_history || [],
              affections: userData.affections || {},
              miniGameScores: userData.mini_game_scores || {},
              previousValues: userData.previous_values || {},
            },
          });
        }
      }

      // 세이브 슬롯 목록 불러오기
      const backendSlots = await fetchSaveSlotsAPI();
      if (backendSlots.length > 0) {
        set({ saveSlots: backendSlots });
        localStorage.setItem('vn_save_slots', JSON.stringify(backendSlots));
      }

      // 모든 호감도 동기화 (fallback)
      const backendAffections = await fetchAllAffections();
      if (Object.keys(backendAffections).length > 0) {
        set({ affections: backendAffections });
        localStorage.setItem('vn_affections', JSON.stringify(backendAffections));
      }

      // 모든 미니게임 점수 동기화
      const backendScores = await fetchMiniGameScores();
      if (Object.keys(backendScores).length > 0) {
        set({ miniGameScores: backendScores });
        localStorage.setItem('vn_minigame_scores', JSON.stringify(backendScores));
      }
    } catch (error) {
      console.error('Failed to sync with backend:', error);
      // 백엔드 실패 시 로컬 데이터 유지
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

  // System History
  systemHistory: [],
  addSystemMessage: (message: string) => {
    const { systemHistory } = get();
    set({ systemHistory: [...systemHistory, message] });
  },
  clearSystemHistory: () => {
    set({ systemHistory: [] });
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

// localStorage에서 초기 데이터 로드 및 자동 로그인 확인
if (typeof window !== 'undefined') {
  // 토큰이 있으면 자동 로그인 시도
  const token = localStorage.getItem('auth_token');
  if (token) {
    useGameStore.setState({ isAuthenticated: true, currentScreen: 'start' });
    // 백엔드에서 사용자 정보 불러오기 시도 (비동기)
    fetchCurrentUser()
      .then((userData) => {
        if (userData) {
          useGameStore.setState({
            user: {
              account_id: userData.user_id,
              email: undefined, // API에서 제공하지 않으면 undefined
              nickname: userData.in_game_nickname,
            },
          });
        }
      })
      .catch((error) => {
        console.error('Failed to fetch user data:', error);
        // 토큰이 유효하지 않으면 로그아웃
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        useGameStore.setState({ isAuthenticated: false, currentScreen: 'login' });
      });
  } else {
    // 토큰이 없으면 로그인 화면으로
    useGameStore.setState({ isAuthenticated: false, currentScreen: 'login' });
  }

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

