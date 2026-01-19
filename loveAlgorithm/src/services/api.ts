import type { Scene, GameEvent, ApiResponse, AffectionResponse, MiniGameScoresResponse } from '../types/game.types';
import {
  getMockScriptResponse,
  getMockAffectionResponse,
  getMockMiniGameScoresResponse,
  updateMockAffection,
  updateMockMiniGameScore,
} from './mockData';
import { gameEvents, convertEventToScene } from '../data/script';

// API 모드 설정
const API_MODE = (import.meta.env.VITE_API_MODE as 'mock' | 'backend') || 'mock';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// HTTP 클라이언트 래퍼
const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
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

// 게임 진행 상태를 백엔드에 저장하는 함수
export const saveGameProgress = async (gameState: unknown): Promise<boolean> => {
  if (API_MODE === 'mock') {
    // 모킹 모드에서는 항상 성공
    return true;
  }

  try {
    const result = await apiClient<boolean>('/save', {
      method: 'POST',
      body: JSON.stringify(gameState),
    });
    return result.success || false;
  } catch (error) {
    console.error('Error saving game progress:', error);
    return false;
  }
};

// 백엔드 연결 상태 확인
export const checkBackendConnection = async (): Promise<boolean> => {
  if (API_MODE === 'mock') {
    return true; // 모킹 모드는 항상 연결됨
  }

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
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
