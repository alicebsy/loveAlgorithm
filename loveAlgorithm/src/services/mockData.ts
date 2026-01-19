import type { Scene, AffectionResponse, MiniGameScoresResponse } from '../types/game.types';
import { gameScript as localScript } from '../data/script';

// 모킹 스크립트 데이터 (백엔드 응답 형식과 동일)
export const mockScriptData: Record<string, Scene> = {
  ...localScript,
  // 추가 씬이 있다면 여기에 추가
};

// 모킹 호감도 데이터
export const mockAffectionData: Record<string, number> = {
  'character_hero': 0,
  'character_seoyeon': 0,
  'character_nubzuki': 0,
  'character_001': 50, // 기본 호감도 (하위 호환성)
  'character_002': 30,
  'character_003': 20,
};

// 모킹 미니게임 점수 데이터
export const mockMiniGameScores: Record<string, number> = {
  'minigame_001': 0,
  'minigame_002': 0,
  'minigame_003': 0,
};

// 모킹 API 응답 헬퍼 함수들
export const getMockScriptResponse = (): { success: true; data: Record<string, Scene> } => ({
  success: true,
  data: mockScriptData,
});

export const getMockAffectionResponse = (characterId: string): { success: true; data: AffectionResponse } => ({
  success: true,
  data: {
    characterId,
    affection: mockAffectionData[characterId] || 0,
  },
});

export const getMockMiniGameScoresResponse = (): { success: true; data: MiniGameScoresResponse } => ({
  success: true,
  data: {
    scores: { ...mockMiniGameScores },
  },
});

// 모킹 데이터 업데이트 함수들 (테스트용)
export const updateMockAffection = (characterId: string, affection: number): void => {
  mockAffectionData[characterId] = affection;
};

export const updateMockMiniGameScore = (gameId: string, score: number): void => {
  mockMiniGameScores[gameId] = Math.max(mockMiniGameScores[gameId] || 0, score);
};

