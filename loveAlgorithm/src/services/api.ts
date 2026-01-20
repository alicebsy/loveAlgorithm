import type { 
  Scene, 
  GameEvent, 
  ApiResponse, 
  AffectionResponse, 
  MiniGameScoresResponse,
  GameState,
  SaveSlot
} from '../types/game.types';
import {
  getMockScriptResponse,
  getMockAffectionResponse,
  getMockMiniGameScoresResponse,
  updateMockAffection,
  updateMockMiniGameScore,
} from './mockData';
import { gameEvents, convertEventToScene } from '../data/script';

// API 모드 설정
const API_MODE = (import.meta.env.VITE_API_MODE as 'mock' | 'backend') || 'backend';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://10.249.19.19:8081/api';

// HTTP 클라이언트 래퍼 (인증 토큰 포함)
const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  // 로컬 스토리지에서 토큰 가져오기
  const token = localStorage.getItem('auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // API_BASE_URL 끝에 슬래시가 없고, endpoint가 /로 시작하도록 보장
  const url = API_BASE_URL.endsWith('/') 
    ? `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // 인증 실패 시 토큰 제거
      localStorage.removeItem('auth_token');
      throw new Error('Authentication failed');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// 스크립트 데이터를 백엔드에서 가져오는 함수
export const fetchGameScript = async (): Promise<Record<string, Scene>> => {
  if (API_MODE === 'mock') {
    // 모킹 모드: 이벤트를 씬으로 변환하여 반환
    const scenes: Record<string, Scene> = {};
    Object.values(gameEvents).forEach((event) => {
      const scene = convertEventToScene(event);
      scenes[event.next_scene_id] = scene;
    });
    return scenes;
  }

  // 백엔드 모드: 실제 API 호출
  try {
    const result = await apiClient<Record<string, Scene>>('/script');
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch script data');
    }
    return result.data;
  } catch (error) {
    console.error('Error fetching game script:', error);
    throw error;
  }
};

// 이벤트 데이터를 백엔드에서 가져오는 함수 (새로운 형식)
export const fetchGameEvents = async (): Promise<Record<string, GameEvent>> => {
  if (API_MODE === 'mock') {
    // 모킹 모드: 로컬 이벤트 데이터 반환
    return gameEvents;
  }

  // 백엔드 모드: 실제 API 호출
  try {
    const result = await apiClient<Record<string, GameEvent>>('/events');
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch event data');
    }
    return result.data;
  } catch (error) {
    console.error('Error fetching game events:', error);
    throw error;
  }
};

// 특정 씬만 가져오는 함수
export const fetchScene = async (sceneId: string): Promise<Scene | null> => {
  if (API_MODE === 'mock') {
    const mockResponse = getMockScriptResponse();
    return mockResponse.data[sceneId] || null;
  }

  try {
    const result = await apiClient<Scene>(`/script/scene/${sceneId}`);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch scene data');
    }
    return result.data;
  } catch (error) {
    console.error('Error fetching scene:', error);
    throw error;
  }
};

// 캐릭터 호감도 조회
export const fetchAffection = async (characterId: string): Promise<number> => {
  if (API_MODE === 'mock') {
    const mockResponse = getMockAffectionResponse(characterId);
    return mockResponse.data.affection;
  }

  try {
    const result = await apiClient<AffectionResponse>(`/affection/${characterId}`);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch affection data');
    }
    return result.data.affection;
  } catch (error) {
    console.error('Error fetching affection:', error);
    throw error;
  }
};

// 캐릭터 호감도 업데이트
export const updateAffection = async (characterId: string, affection: number): Promise<boolean> => {
  if (API_MODE === 'mock') {
    updateMockAffection(characterId, affection);
    return true;
  }

  try {
    const result = await apiClient<AffectionResponse>(`/affection/${characterId}`, {
      method: 'POST',
      body: JSON.stringify({ affection }),
    });
    return result.success || false;
  } catch (error) {
    console.error('Error updating affection:', error);
    return false;
  }
};

// 미니게임 점수 조회
export const fetchMiniGameScores = async (): Promise<Record<string, number>> => {
  if (API_MODE === 'mock') {
    const mockResponse = getMockMiniGameScoresResponse();
    return mockResponse.data.scores;
  }

  try {
    const result = await apiClient<MiniGameScoresResponse>('/minigame/scores');
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch mini game scores');
    }
    return result.data.scores;
  } catch (error) {
    console.error('Error fetching mini game scores:', error);
    throw error;
  }
};

// 미니게임 점수 저장
export const saveMiniGameScore = async (gameId: string, score: number): Promise<boolean> => {
  if (API_MODE === 'mock') {
    updateMockMiniGameScore(gameId, score);
    return true;
  }

  try {
    const result = await apiClient<{ success: boolean }>('/minigame/scores', {
      method: 'POST',
      body: JSON.stringify({ gameId, score }),
    });
    return result.success || false;
  } catch (error) {
    console.error('Error saving mini game score:', error);
    return false;
  }
};

// 이미지 URL API는 더 이상 사용하지 않음
// DB에서 파일 이름만 저장하고, 프론트엔드에서 직접 경로로 변환하여 사용

// ==========================================
// 인증 관련 API
// ==========================================

// 로그인
export const login = async (email: string, password: string): Promise<{ token: string; refreshToken: string } | null> => {
  if (API_MODE === 'mock') {
    // 모킹 모드: 항상 성공
    const mockToken = 'mock_token_' + Date.now();
    localStorage.setItem('auth_token', mockToken);
    return { token: mockToken, refreshToken: 'mock_refresh_token' };
  }

  try {
    const result = await apiClient<{ token: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (result.success && result.data) {
      localStorage.setItem('auth_token', result.data.token);
      localStorage.setItem('refresh_token', result.data.refreshToken);
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};

// 로그아웃
export const logout = async (): Promise<void> => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  
  if (API_MODE === 'backend') {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
};

// 회원가입
export const register = async (email: string, password: string, nickname: string): Promise<boolean> => {
  if (API_MODE === 'mock') {
    return true;
  }

  try {
    const result = await apiClient<{ success: boolean }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname }),
    });
    return result.success || false;
  } catch (error) {
    console.error('Error registering:', error);
    return false;
  }
};

// ==========================================
// 사용자 정보 관련 API
// ==========================================

// 현재 사용자 정보 조회
export const fetchCurrentUser = async (): Promise<{
  user_id: number;
  in_game_nickname: string;
  current_scene_id: string;
  current_script_id: string | null;
  current_dialogue_index: number;
  affections: Record<string, number>;
  mini_game_scores: Record<string, number>;
  previous_values: GameState['previousValues'];
  scene_history: string[];
} | null> => {
  if (API_MODE === 'mock') {
    return {
      user_id: 1,
      in_game_nickname: '도훈',
      current_scene_id: 'chapter1_scene1',
      current_script_id: null,
      current_dialogue_index: 0,
      affections: {},
      mini_game_scores: {},
      previous_values: {},
      scene_history: [],
    };
  }

  try {
    const result = await apiClient<{
      user_id: number;
      in_game_nickname: string;
      current_scene_id: string;
      current_script_id: string | null;
      current_dialogue_index: number;
      affections: Record<string, number>;
      mini_game_scores: Record<string, number>;
      previous_values: GameState['previousValues'];
      scene_history: string[];
    }>('/user/current');
    
    if (result.success && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

// 사용자 정보 업데이트 (게임 진행 상태 저장)
export const updateUserProgress = async (gameState: GameState, heroName: string): Promise<boolean> => {
  if (API_MODE === 'mock') {
    return true;
  }

  try {
    const result = await apiClient<{ success: boolean }>('/user/progress', {
      method: 'PUT',
      body: JSON.stringify({
        current_scene_id: gameState.currentSceneId,
        current_script_id: gameState.currentDialogueIndex > 0 ? `${gameState.currentSceneId}_${gameState.currentDialogueIndex}` : null,
        current_dialogue_index: gameState.currentDialogueIndex,
        in_game_nickname: heroName,
        affections: gameState.affections || {},
        mini_game_scores: gameState.miniGameScores || {},
        previous_values: gameState.previousValues || {},
        scene_history: gameState.history || [],
      }),
    });
    return result.success || false;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return false;
  }
};

// ==========================================
// 세이브 슬롯 관련 API
// ==========================================

// 세이브 슬롯 목록 조회
export const fetchSaveSlots = async (): Promise<SaveSlot[]> => {
  if (API_MODE === 'mock') {
    return [];
  }

  try {
    const result = await apiClient<SaveSlot[]>('/save/slots');
    if (result.success && result.data) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching save slots:', error);
    return [];
  }
};

// 세이브 슬롯 저장
export const saveToSlot = async (
  slotIndex: number,
  gameState: GameState,
  preview: string,
  heroName: string
): Promise<boolean> => {
  if (API_MODE === 'mock') {
    return true;
  }

  try {
    const result = await apiClient<{ success: boolean }>('/save/slots', {
      method: 'POST',
      body: JSON.stringify({
        slot_index: slotIndex,
        scene_id: gameState.currentSceneId,
        script_id: gameState.currentDialogueIndex > 0 ? `${gameState.currentSceneId}_${gameState.currentDialogueIndex}` : null,
        dialogue_index: gameState.currentDialogueIndex,
        game_state: gameState,
        save_title: preview,
        in_game_nickname: heroName,
      }),
    });
    return result.success || false;
  } catch (error) {
    console.error('Error saving to slot:', error);
    return false;
  }
};

// 세이브 슬롯 불러오기
export const loadFromSlot = async (slotIndex: number): Promise<GameState | null> => {
  if (API_MODE === 'mock') {
    return null;
  }

  try {
    const result = await apiClient<{ game_state: GameState }>(`/save/slots/${slotIndex}`);
    if (result.success && result.data) {
      return result.data.game_state;
    }
    return null;
  } catch (error) {
    console.error('Error loading from slot:', error);
    return null;
  }
};

// 세이브 슬롯 삭제
export const deleteSaveSlot = async (slotIndex: number): Promise<boolean> => {
  if (API_MODE === 'mock') {
    return true;
  }

  try {
    const result = await apiClient<{ success: boolean }>(`/save/slots/${slotIndex}`, {
      method: 'DELETE',
    });
    return result.success || false;
  } catch (error) {
    console.error('Error deleting save slot:', error);
    return false;
  }
};

// ==========================================
// 호감도 관련 API (전체 조회/업데이트)
// ==========================================

// 전체 호감도 조회
export const fetchAllAffections = async (): Promise<Record<string, number>> => {
  if (API_MODE === 'mock') {
    return {}; // 모킹 데이터는 빈 객체 반환
  }

  try {
    const result = await apiClient<{ affections: Record<string, number> }>('/affection/all');
    if (result.success && result.data) {
      return result.data.affections;
    }
    return {};
  } catch (error) {
    console.error('Error fetching all affections:', error);
    return {};
  }
};

// 호감도 일괄 업데이트 (선택지 선택 시 여러 캐릭터 호감도 동시 변경)
export const updateAffections = async (affections: Record<string, number>): Promise<boolean> => {
  if (API_MODE === 'mock') {
    Object.entries(affections).forEach(([characterId, value]) => {
      updateMockAffection(characterId, value);
    });
    return true;
  }

  try {
    const result = await apiClient<{ success: boolean }>('/affection/batch', {
      method: 'POST',
      body: JSON.stringify({ affections }),
    });
    return result.success || false;
  } catch (error) {
    console.error('Error updating affections:', error);
    return false;
  }
};

// ==========================================
// 게임 진행 상태 저장 (기존 함수 유지)
// ==========================================

// 게임 진행 상태를 백엔드에 저장하는 함수 (자동 저장용)
export const saveGameProgress = async (gameState: GameState, heroName: string): Promise<boolean> => {
  return updateUserProgress(gameState, heroName);
};

// 백엔드 연결 상태 확인
export const checkBackendConnection = async (): Promise<boolean> => {
  if (API_MODE === 'mock') {
    return true; // 모킹 모드는 항상 연결됨
  }

  try {
    const healthUrl = API_BASE_URL.endsWith('/') 
      ? `${API_BASE_URL}health`
      : `${API_BASE_URL}/health`;
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
