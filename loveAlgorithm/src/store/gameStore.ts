import { create } from 'zustand';
import type { GameState, Settings, ScreenType, GameEvent, SaveSlot } from '../types/game.types';
import { gameEvents as localGameEvents } from '../data/script';
import { replaceHeroName } from '../utils/nameUtils';

interface GameStore {
  // 기본 상태
  currentScreen: ScreenType;
  gameState: GameState;
  heroName: string;
  affections: Record<string, number>;
  kakaoTalkHistory: any[];
  systemHistory: any[];
  previousValues: any;
  isDialogueTyping: boolean;
  skipMode: boolean;
  settings: Settings;
  isAuthenticated: boolean;
  user: { nickname?: string } | null;

  // 기본 액션
  setCurrentScreen: (screen: ScreenType) => void;
  setGameState: (state: GameState) => void;
  nextDialogue: () => void;
  previousDialogue: () => void;
  goToScene: (sceneId: string) => void;
  setHeroName: (name: string) => void;
  updateAffection: (id: string, val: number) => Promise<void>;
  addKakaoTalkMessage: (text: string, sender: any, type: any, id: any) => void;
  clearKakaoTalkHistory: () => void;
  addSystemMessage: (text: string) => void;
  setPreviousValues: (values: any) => void;
  setIsDialogueTyping: (typing: boolean) => void;
  setSkipMode: (skip: boolean) => void;
  
  // 인증 및 유저 관련
  setIsAuthenticated: (auth: boolean) => void;
  setUser: (user: { nickname?: string } | null) => void;
  syncWithBackend: () => Promise<void>;
  resetGame: () => void;

  // UI 및 시스템
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  showConfirmModal: (message: string, onConfirm: () => void) => void;
  confirmModal: { message: string; onConfirm: () => void } | null;
  hideConfirmModal: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
  previousScreen: ScreenType | null;
  saveGame: (slotIndex: number, preview?: string) => Promise<void>;
  loadGame: (slotIndex: number) => Promise<void>;
  deleteSave: (slotIndex: number) => Promise<void>;
  saveSlots: SaveSlot[];
  fetchSaveSlots: () => Promise<void>;
  autoSave: () => Promise<void>;
  
  // 스크립트 로딩 관련
  gameEvents: Record<string, GameEvent> | null;
  isScriptLoading: boolean;
  scriptError: Error | null;
  loadScript: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentScreen: 'login',
  gameState: { currentSceneId: 'chapter1_scene1', currentDialogueIndex: 0, history: [], previousValues: {}, affections: {}, miniGameScores: {} },
  heroName: '이도훈',
  affections: {},
  kakaoTalkHistory: [],
  systemHistory: [],
  previousValues: {},
  isDialogueTyping: false,
  skipMode: false,
  settings: { skipMode: false, bgmVolume: 30, sfxVolume: 80, voiceVolume: 70, textSpeed: 50 },
  isAuthenticated: false,
  user: null,
  previousScreen: null,
  confirmModal: null,

  setCurrentScreen: (screen) => set((state) => ({ 
    currentScreen: screen,
    previousScreen: state.currentScreen !== screen ? state.currentScreen : state.previousScreen
  })),
  setGameState: (state) => set({ gameState: state }),
  nextDialogue: () => set((state) => ({ gameState: { ...state.gameState, currentDialogueIndex: state.gameState.currentDialogueIndex + 1 } })),
  previousDialogue: () => {
    set((state) => {
      const currentIndex = state.gameState.currentDialogueIndex;
      const currentSceneId = state.gameState.currentSceneId;
      const history = state.gameState.history || [];
      const gameEvents = state.gameEvents || localGameEvents;
      const heroName = state.heroName;
      
      console.log('◀ 이전 버튼 클릭:', { currentIndex, currentSceneId, history });
      
      // 카톡/시스템 히스토리 재구성을 위한 헬퍼 함수
      const rebuildHistory = (sceneId: string, endIndex: number) => {
        const event = gameEvents[sceneId];
        if (!event?.scenario) return { kakaoTalk: [], system: [] };
        
        const restoredKakaoTalk: any[] = [];
        const restoredSystem: any[] = [];
        let previousChatTitle = '몰입캠프 2분반';
        
        for (let i = 0; i <= endIndex; i++) {
          const item = event.scenario[i];
          if (!item) continue;
          
          const script = item.script ? replaceHeroName(item.script, heroName) : '';
          
          if (item.type?.startsWith('카톡')) {
            // 카톡방 이름 추출
            const getChatTitleFromScript = (scriptText: string): string => {
              const match = scriptText.match(/\[([^\]]+)\]\s*$/);
              return match ? match[1] : '몰입캠프 2분반';
            };
            
            const currentChatTitle = getChatTitleFromScript(script);
            
            // 카톡방 이름이 바뀌면 히스토리 초기화
            if (currentChatTitle !== previousChatTitle) {
              restoredKakaoTalk.length = 0; // 배열 초기화
              previousChatTitle = currentChatTitle;
            }
            
            // 메시지 추가
            restoredKakaoTalk.push({
              message: script,
              text: script,
              sender: item.character_id || '',
              characterId: item.character_id || '',
              type: item.type,
              id: item.character_id || ''
            });
          } else if (item.type === '시스템') {
            restoredSystem.push(script);
          } else {
            // 카톡/시스템이 아닐 때는 카톡 히스토리 초기화
            if (restoredKakaoTalk.length > 0) {
              restoredKakaoTalk.length = 0;
              previousChatTitle = '몰입캠프 2분반';
            }
          }
        }
        
        return { kakaoTalk: restoredKakaoTalk, system: restoredSystem };
      };
      
      if (currentIndex > 0) {
        // 현재 씬에서 이전 대사로 이동
        const previousIndex = currentIndex - 1;
        const currentEvent = gameEvents[currentSceneId];
        
        // 이전 대사부터 시작해서 이미지 상태 재계산
        let restoredPreviousValues: any = {};
        
        // 첫 번째 대사부터 이전 대사까지 순회하며 이미지 상태 계산
        for (let i = 0; i <= previousIndex; i++) {
          const item = currentEvent?.scenario[i];
          if (item) {
            // 배경 이미지: 현재 값이 있으면 업데이트, 없으면 이전 값 유지
            if (item.background_image_id) {
              restoredPreviousValues.background_image_id = item.background_image_id;
            }
            
            // 배경 사운드: 현재 값이 있으면 업데이트, 없으면 이전 값 유지
            if (item.background_sound_id) {
              restoredPreviousValues.background_sound_id = item.background_sound_id;
            }
            
            // 캐릭터 이미지: 현재 값이 있으면 업데이트, 없으면 이전 값 유지
            if (item.character_image_id) {
              if (item.character_image_id.all) {
                restoredPreviousValues.character_image_id = {
                  1: item.character_image_id.all,
                  2: item.character_image_id.all,
                  3: item.character_image_id.all
                };
              } else {
                restoredPreviousValues.character_image_id = {
                  ...restoredPreviousValues.character_image_id,
                  1: item.character_image_id[1] !== undefined ? item.character_image_id[1] : restoredPreviousValues.character_image_id?.[1],
                  2: item.character_image_id[2] !== undefined ? item.character_image_id[2] : restoredPreviousValues.character_image_id?.[2],
                  3: item.character_image_id[3] !== undefined ? item.character_image_id[3] : restoredPreviousValues.character_image_id?.[3],
                };
              }
            }
          }
        }
        
        // 카톡/시스템 히스토리 재구성
        const restoredHistory = rebuildHistory(currentSceneId, previousIndex);
        
        console.log('✅ 현재 씬에서 이전 대사로 이동:', previousIndex);
        console.log('🖼️ 복원된 이미지 상태:', restoredPreviousValues);
        console.log('💬 복원된 카톡 히스토리:', restoredHistory.kakaoTalk.length, '개');
        console.log('📢 복원된 시스템 히스토리:', restoredHistory.system.length, '개');
        
        return { 
          gameState: { 
            ...state.gameState, 
            currentDialogueIndex: previousIndex,
            previousValues: restoredPreviousValues
          },
          previousValues: restoredPreviousValues,
          kakaoTalkHistory: restoredHistory.kakaoTalk,
          systemHistory: restoredHistory.system
        };
      } else {
        // 현재 씬의 첫 번째 대사면 이전 씬으로 이동
        if (history.length > 1) {
          // 마지막 씬을 제거하고 그 이전 씬으로 이동
          const previousSceneId = history[history.length - 2];
          const newHistory = history.slice(0, -1);
          
          // 이전 씬의 마지막 대사 인덱스 찾기
          const previousEvent = gameEvents[previousSceneId];
          const lastDialogueIndex = previousEvent?.scenario ? previousEvent.scenario.length - 1 : 0;
          
          // 이전 씬의 첫 번째 대사부터 마지막 대사까지 순회하며 이미지 상태 계산
          let restoredPreviousValues: any = {};
          if (previousEvent?.scenario) {
            for (let i = 0; i <= lastDialogueIndex; i++) {
              const item = previousEvent.scenario[i];
              if (item) {
                if (item.background_image_id) {
                  restoredPreviousValues.background_image_id = item.background_image_id;
                }
                if (item.background_sound_id) {
                  restoredPreviousValues.background_sound_id = item.background_sound_id;
                }
                if (item.character_image_id) {
                  if (item.character_image_id.all) {
                    restoredPreviousValues.character_image_id = {
                      1: item.character_image_id.all,
                      2: item.character_image_id.all,
                      3: item.character_image_id.all
                    };
                  } else {
                    restoredPreviousValues.character_image_id = {
                      ...restoredPreviousValues.character_image_id,
                      1: item.character_image_id[1] !== undefined ? item.character_image_id[1] : restoredPreviousValues.character_image_id?.[1],
                      2: item.character_image_id[2] !== undefined ? item.character_image_id[2] : restoredPreviousValues.character_image_id?.[2],
                      3: item.character_image_id[3] !== undefined ? item.character_image_id[3] : restoredPreviousValues.character_image_id?.[3],
                    };
                  }
                }
              }
            }
          }
          
          // 카톡/시스템 히스토리 재구성
          const restoredHistory = rebuildHistory(previousSceneId, lastDialogueIndex);
          
          console.log('✅ 이전 씬으로 이동:', { previousSceneId, lastDialogueIndex });
          console.log('🖼️ 복원된 이미지 상태:', restoredPreviousValues);
          console.log('💬 복원된 카톡 히스토리:', restoredHistory.kakaoTalk.length, '개');
          console.log('📢 복원된 시스템 히스토리:', restoredHistory.system.length, '개');
          
          return {
            gameState: {
              ...state.gameState,
              currentSceneId: previousSceneId,
              currentDialogueIndex: lastDialogueIndex,
              history: newHistory,
              previousValues: restoredPreviousValues
            },
            previousValues: restoredPreviousValues,
            kakaoTalkHistory: restoredHistory.kakaoTalk,
            systemHistory: restoredHistory.system
          };
        }
        // 이전 씬이 없으면 현재 상태 유지
        console.log('⚠️ 이전 씬이 없습니다.');
        return state;
      }
    });
  },
  goToScene: (id) => {
    // 씬 전환 시 BGM 정지
    import('../services/soundService').then(({ stopBGM }) => {
      stopBGM();
    });
    
    set((state) => {
      const newHistory = [...(state.gameState.history || [])];
      if (!newHistory.includes(id)) {
        newHistory.push(id);
      }
      return { 
        gameState: { 
          ...state.gameState, 
          currentSceneId: id, 
          currentDialogueIndex: 0,
          history: newHistory
        } 
      };
    });
    
    // 씬 이동 시 자동 저장
    get().autoSave().catch(console.error);
  },
  setHeroName: (name) => set({ heroName: name }),
  updateAffection: async (id, val) => {
    // 로컬 상태 업데이트
    set((state) => ({ 
      affections: { ...state.affections, [id]: val },
      gameState: {
        ...state.gameState,
        affections: { ...state.gameState.affections || {}, [id]: val }
      }
    }));
    
    // 백엔드에 호감도 저장
    try {
      const { updateAffection: updateAffectionAPI } = await import('../services/api');
      await updateAffectionAPI(id, val);
      console.log(`✅ 호감도 저장 완료: ${id} = ${val}`);
    } catch (error) {
      console.error('❌ 호감도 저장 실패:', error);
    }
  },
  addKakaoTalkMessage: (text, sender, type, id) => set((state) => ({ 
    kakaoTalkHistory: [...state.kakaoTalkHistory, { 
      message: text,  // message 필드로 저장 (KakaoTalkModal에서 사용)
      text: text,    // 호환성을 위해 text도 저장
      sender: sender, 
      characterId: id,  // characterId 필드로 저장
      type: type, 
      id: id 
    }] 
  })),
  clearKakaoTalkHistory: () => set({ kakaoTalkHistory: [] }),
  addSystemMessage: (text) => set((state) => ({ systemHistory: [...state.systemHistory, text] })),
  setPreviousValues: (values) => set({ previousValues: values }),
  setIsDialogueTyping: (typing) => set({ isDialogueTyping: typing }),
  setSkipMode: (skip) => set({ skipMode: skip }),
  setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setUser: (user) => set({ user }),
  syncWithBackend: async () => {
    try {
      const { fetchCurrentUser, fetchAllAffections, fetchMiniGameScores } = await import('../services/api');
      
      // 사용자 정보 가져오기
      const userData = await fetchCurrentUser();
      if (userData) {
        set({ 
          user: { nickname: userData.in_game_nickname || userData.nickname },
          heroName: userData.in_game_nickname || userData.nickname || get().heroName,
        });
        
        // 게임 상태 복원
        if (userData.current_scene_id) {
          set((state) => ({
            gameState: {
              ...state.gameState,
              currentSceneId: userData.current_scene_id,
              currentDialogueIndex: userData.current_dialogue_index || 0,
              history: userData.scene_history || [],
              affections: userData.affections || {},
              miniGameScores: userData.mini_game_scores || {},
              previousValues: userData.previous_values || {},
            },
          }));
        }
        
        // 호감도 동기화
        if (userData.affections) {
          set({ affections: userData.affections });
        }
      }
      
      // 호감도 가져오기
      try {
        const affections = await fetchAllAffections();
        if (affections && Object.keys(affections).length > 0) {
          set({ affections });
        }
      } catch (e) {
        console.log('호감도 가져오기 실패:', e);
      }
      
      // 미니게임 점수 가져오기
      try {
        const scores = await fetchMiniGameScores();
        if (scores && Object.keys(scores).length > 0) {
          set((state) => ({
            gameState: {
              ...state.gameState,
              miniGameScores: scores,
            },
          }));
        }
      } catch (e) {
        console.log('미니게임 점수 가져오기 실패:', e);
      }
    } catch (error) {
      console.error('백엔드 동기화 실패:', error);
    }
  },
  resetGame: () => {
    // 게임 리셋 시 모든 BGM 정지 및 캐시 초기화
    import('../services/soundService').then(({ clearSoundCache }) => {
      clearSoundCache(); // 모든 BGM 캐시 초기화
    });
    set({
      gameState: { currentSceneId: 'chapter1_scene1', currentDialogueIndex: 0, history: [], previousValues: {}, affections: {}, miniGameScores: {} },
      kakaoTalkHistory: [],
      systemHistory: [],
    });
  },
  toast: null,
  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
    // Toast 컴포넌트의 useEffect에서 자동으로 숨김 처리
  },
  hideToast: () => set({ toast: null }),
  showConfirmModal: (message, onConfirm) => set({ confirmModal: { message, onConfirm } }),
  hideConfirmModal: () => set({ confirmModal: null }),
  updateSettings: (updates) => set((state) => ({ settings: { ...state.settings, ...updates } })),
  saveSlots: [],
  fetchSaveSlots: async () => {
    try {
      const { fetchSaveSlots: fetchSlots } = await import('../services/api');
      const slots = await fetchSlots();
      set({ saveSlots: slots });
    } catch (error) {
      console.error('❌ 저장 슬롯 불러오기 실패:', error);
      set({ saveSlots: [] });
    }
  },
  saveGame: async (slotIndex: number, preview?: string) => {
    try {
      const state = get();
      const savePreview = preview || `Chapter ${state.gameState.currentSceneId} - ${state.gameState.currentDialogueIndex}번째 대사`;
      
      // 현재 화면의 배경 이미지와 캐릭터 이미지 정보를 가져오기 위해
      // 현재 씬과 대사 인덱스로 현재 시나리오 아이템 찾기
      const gameEvents = state.gameEvents || localGameEvents;
      const currentEvent = gameEvents[state.gameState.currentSceneId];
      const currentItem = currentEvent?.scenario[state.gameState.currentDialogueIndex];
      
      // 현재 이미지 정보 (previousValues에서 가져오거나 현재 아이템에서 가져오기)
      const currentBackgroundImageId = currentItem?.background_image_id || state.previousValues?.background_image_id;
      const currentCharacterImageId = currentItem?.character_image_id || state.previousValues?.character_image_id;
      let currentBackgroundSoundId = currentItem?.background_sound_id || state.previousValues?.background_sound_id;
      
      // janjan은 저장하지 않음
      if (currentBackgroundSoundId === 'janjan') {
        currentBackgroundSoundId = undefined;
      }
      
      // previousValues 업데이트 (현재 이미지 정보 포함)
      const updatedPreviousValues: any = {
        ...state.previousValues,
        background_image_id: currentBackgroundImageId || state.previousValues?.background_image_id,
        character_image_id: currentCharacterImageId || state.previousValues?.character_image_id,
      };
      
      // janjan이 아니면 background_sound_id 저장
      if (currentBackgroundSoundId && currentBackgroundSoundId !== 'janjan') {
        updatedPreviousValues.background_sound_id = currentBackgroundSoundId;
      }
      
      const { saveToSlot } = await import('../services/api');
      await saveToSlot(slotIndex, {
        ...state.gameState,
        previousValues: updatedPreviousValues, // 현재 배경/캐릭터 이미지 정보 포함
        affections: state.affections, // 호감도도 함께 저장
      }, savePreview);
      
      // 저장 슬롯 목록 새로고침
      await get().fetchSaveSlots();
      
      console.log(`✅ 게임 저장 완료: 슬롯 ${slotIndex}`);
      console.log(`   - 배경 이미지: ${currentBackgroundImageId || '없음'}`);
      console.log(`   - 캐릭터 이미지: ${JSON.stringify(currentCharacterImageId) || '없음'}`);
    } catch (error) {
      console.error('❌ 게임 저장 실패:', error);
      throw error;
    }
  },
  loadGame: async (slotIndex: number) => {
    try {
      const { loadFromSlot } = await import('../services/api');
      const loadedData = await loadFromSlot(slotIndex);
      
      console.log('📦 불러온 데이터:', loadedData);
      
      if (loadedData) {
        // loadedData는 GameState이거나 { gameState: GameState, heroName: string } 형식일 수 있음
        const gameState = (loadedData as any).gameState || loadedData;
        const heroName = (loadedData as any).heroName || (loadedData as any).in_game_nickname || get().heroName;
        
        console.log('🔍 파싱된 gameState:', gameState);
        console.log('🔍 gameState 타입:', typeof gameState);
        console.log('🔍 gameState 키들:', gameState ? Object.keys(gameState) : 'null');
        
        // 백엔드가 다른 형식으로 반환하는 경우 처리 (예: loveDohee, loveJisoo 등)
        let affections = {};
        if (gameState.affections) {
          affections = gameState.affections;
        } else if (gameState.loveDohee !== undefined || gameState.loveJisoo !== undefined || gameState.loveSera !== undefined) {
          // 백엔드가 loveDohee, loveJisoo 형식으로 반환하는 경우
          affections = {
            dohee: gameState.loveDohee || 0,
            jisoo: gameState.loveJisoo || 0,
            sera: gameState.loveSera || 0,
          };
        }
        
        // 필수 필드 확인 및 기본값 설정
        const restoredGameState: GameState = {
          currentSceneId: gameState.currentSceneId || gameState.current_scene_id || gameState.scene_id || 'chapter1_scene1',
          currentDialogueIndex: gameState.currentDialogueIndex ?? gameState.current_dialogue_index ?? gameState.dialogue_index ?? 0,
          history: gameState.history || gameState.scene_history || [],
          affections: affections,
          miniGameScores: gameState.miniGameScores || gameState.mini_game_scores || {},
          previousValues: gameState.previousValues || gameState.previous_values || {}, // 배경/캐릭터 이미지 정보 포함
        };
        
        console.log('🖼️ 복원된 이미지 정보:', restoredGameState.previousValues);
        
        console.log('✅ 복원할 게임 상태:', restoredGameState);
        console.log(`   - 씬: ${restoredGameState.currentSceneId}`);
        console.log(`   - 대사 인덱스: ${restoredGameState.currentDialogueIndex}`);
        console.log(`   - 호감도:`, restoredGameState.affections);
        
        // janjan이 저장되어 있으면 제거
        const cleanedPreviousValues = { ...restoredGameState.previousValues };
        if (cleanedPreviousValues.background_sound_id === 'janjan') {
          console.warn('⚠️ 저장된 데이터에서 janjan BGM 제거');
          delete cleanedPreviousValues.background_sound_id;
        }
        
        set({
          gameState: restoredGameState,
          affections: restoredGameState.affections,
          heroName: heroName,
          previousValues: cleanedPreviousValues,
          // 카톡 히스토리와 시스템 히스토리는 저장하지 않으므로 초기화
          kakaoTalkHistory: [],
          systemHistory: [],
        });
        
        // 불러오기 시 모든 BGM 정지
        import('../services/soundService').then(({ clearSoundCache }) => {
          clearSoundCache(); // 모든 BGM 캐시 초기화
        });
        
        // 게임 화면으로 이동
        set({ currentScreen: 'game' });
        
        console.log(`✅ 게임 불러오기 완료: 슬롯 ${slotIndex}`);
        console.log(`   → ${restoredGameState.currentSceneId}의 ${restoredGameState.currentDialogueIndex}번째 대사부터 시작`);
      } else {
        throw new Error('불러온 데이터가 없습니다.');
      }
    } catch (error) {
      console.error('❌ 게임 불러오기 실패:', error);
      throw error;
    }
  },
  deleteSave: async (slotIndex: number) => {
    try {
      const { deleteSaveSlot } = await import('../services/api');
      await deleteSaveSlot(slotIndex);
      
      // 저장 슬롯 목록 새로고침
      await get().fetchSaveSlots();
      
      console.log(`✅ 저장 슬롯 삭제 완료: 슬롯 ${slotIndex}`);
    } catch (error) {
      console.error('❌ 저장 슬롯 삭제 실패:', error);
      throw error;
    }
  },
  autoSave: async () => {
    try {
      const state = get();
      const { updateUserProgress } = await import('../services/api');
      
      await updateUserProgress({
        ...state.gameState,
        affections: state.affections, // 호감도도 함께 저장
      }, state.heroName);
      
      console.log('✅ 자동 저장 완료');
    } catch (error) {
      console.error('❌ 자동 저장 실패:', error);
    }
  },
  
  // 스크립트 로딩 관련
  gameEvents: null,
  isScriptLoading: false,
  scriptError: null,
  loadScript: async () => {
    if (get().isScriptLoading) return;
    
    // 이미 gameEvents가 있으면 스킵
    const currentEvents = get().gameEvents;
    if (currentEvents && Object.keys(currentEvents).length > 0) {
      console.log('✅ gameEvents가 이미 로드되어 있습니다.');
      return;
    }
    
    set({ isScriptLoading: true, scriptError: null });
    
    // 로컬 데이터를 먼저 로드 (즉시 게임 시작 가능)
    console.log('📦 로컬 스크립트 데이터 로드 중...');
    console.log('📦 로드할 이벤트 개수:', Object.keys(localGameEvents).length);
    set({ gameEvents: localGameEvents, isScriptLoading: false });
    console.log('✅ 로컬 스크립트 데이터 로드 완료');
    
    // 백엔드 동기화는 백그라운드에서 시도 (선택적, 실패해도 무시)
    // 백엔드가 dialogues를 포함하지 않으면 로컬 데이터 사용
    setTimeout(async () => {
      try {
        const { fetchGameScript } = await import('../services/api');
        const backendEvents = await fetchGameScript();
        
        if (backendEvents && Object.keys(backendEvents).length > 0) {
          console.log('✅ 백엔드 스크립트 동기화 성공:', Object.keys(backendEvents).length, '개의 이벤트');
          // 백엔드 데이터로 업데이트 (선택적)
          // set({ gameEvents: backendEvents as Record<string, GameEvent> });
        }
      } catch (error) {
        // 백엔드 실패해도 로컬 데이터로 게임은 진행 가능
        console.log('ℹ️ 백엔드 동기화 실패 (로컬 데이터로 계속 진행):', error);
      }
    }, 100);
  },
}));