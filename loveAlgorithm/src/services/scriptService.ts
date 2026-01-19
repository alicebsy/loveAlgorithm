import type { Scene, Dialogue } from '../types/game.types';
import { fetchGameScript } from './api';
import { gameScript as localScript } from '../data/script';

// 스크립트 데이터 캐시
let scriptCache: Record<string, Scene> | null = null;
let isLoading = false;
let loadPromise: Promise<Record<string, Scene>> | null = null;

/**
 * 스크립트 데이터를 로드합니다.
 * 로컬 또는 API에서 데이터를 가져옵니다.
 */
export const loadScript = async (): Promise<Record<string, Scene>> => {
  // 이미 로드 중이면 기존 Promise 반환
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // 캐시가 있으면 캐시 반환
  if (scriptCache) {
    return scriptCache;
  }

  isLoading = true;

  try {
    // 모킹 모드 또는 백엔드 모드 모두 fetchGameScript 사용
    // fetchGameScript 내부에서 모드에 따라 분기 처리
    loadPromise = fetchGameScript();
    scriptCache = await loadPromise;

    return scriptCache;
  } catch (error) {
    console.error('Failed to load script, falling back to local data:', error);
    // API 실패 시 로컬 데이터로 폴백
    scriptCache = localScript;
    return localScript;
  } finally {
    isLoading = false;
    loadPromise = null;
  }
};

/**
 * 스크립트 데이터를 강제로 다시 로드합니다.
 */
export const reloadScript = async (): Promise<Record<string, Scene>> => {
  scriptCache = null;
  return loadScript();
};

/**
 * 현재 씬의 대화를 가져옵니다.
 */
export const getCurrentDialogue = async (
  sceneId: string,
  dialogueIndex: number
): Promise<Dialogue | null> => {
  const script = await loadScript();
  const scene = script[sceneId];
  if (!scene) return null;
  return scene.dialogues[dialogueIndex] || null;
};

/**
 * 다음 대화가 있는지 확인합니다.
 */
export const hasNextDialogue = async (
  sceneId: string,
  dialogueIndex: number
): Promise<boolean> => {
  const script = await loadScript();
  const scene = script[sceneId];
  if (!scene) return false;
  return dialogueIndex < scene.dialogues.length - 1;
};

/**
 * 다음 씬 ID를 가져옵니다.
 */
export const getNextSceneId = async (currentSceneId: string): Promise<string | null> => {
  const script = await loadScript();
  const sceneIds = Object.keys(script);
  const currentIndex = sceneIds.indexOf(currentSceneId);
  if (currentIndex < sceneIds.length - 1) {
    return sceneIds[currentIndex + 1];
  }
  return null;
};

/**
 * 동기 버전 (이미 로드된 데이터 사용)
 * 기존 코드와의 호환성을 위해 유지
 */
export const getCurrentDialogueSync = (sceneId: string, dialogueIndex: number): Dialogue | null => {
  if (!scriptCache) {
    // 캐시가 없으면 로컬 데이터 사용
    const scene = localScript[sceneId];
    if (!scene) return null;
    return scene.dialogues[dialogueIndex] || null;
  }
  const scene = scriptCache[sceneId];
  if (!scene) return null;
  return scene.dialogues[dialogueIndex] || null;
};

export const hasNextDialogueSync = (sceneId: string, dialogueIndex: number): boolean => {
  const script = scriptCache || localScript;
  const scene = script[sceneId];
  if (!scene) return false;
  return dialogueIndex < scene.dialogues.length - 1;
};

export const getNextSceneIdSync = (currentSceneId: string): string | null => {
  const script = scriptCache || localScript;
  const sceneIds = Object.keys(script);
  const currentIndex = sceneIds.indexOf(currentSceneId);
  if (currentIndex < sceneIds.length - 1) {
    return sceneIds[currentIndex + 1];
  }
  return null;
};

