import type { Scene, Dialogue, GameEvent } from '../types/game.types';
import { fetchGameScript } from './api';
import { gameScript as localScript } from '../data/script';

// 스크립트 데이터 캐시
let scriptCache: Record<string, Scene> | null = null;
let isLoading = false;
let loadPromise: Promise<Record<string, Scene>> | null = null;

/**
 * GameEvent를 Scene으로 변환하는 헬퍼 함수
 */
const convertGameEventToScene = (events: Record<string, GameEvent>): Record<string, Scene> => {
  const scenes: Record<string, Scene> = {};
  for (const [sceneId, event] of Object.entries(events)) {
    scenes[sceneId] = {
      id: sceneId,
      dialogues: event.scenario.map((item, index) => ({
        id: item.id || `${sceneId}_${index}`,
        text: item.script,
        character: item.character_id,
        background: item.background_image_id,
        characterImage: item.character_image_id ? 
          (typeof item.character_image_id === 'object' ? 
            (item.character_image_id[2] || item.character_image_id.all || '') : 
            item.character_image_id) : 
          undefined,
        bgm: item.background_sound_id,
        sfx: item.effect_sound_id,
        choices: item.options?.map(opt => ({
          id: opt.id || '',
          text: opt.text || '',
          nextSceneId: opt.nextSceneId,
          score_list: opt.score_list || [],
        })),
      })),
    };
  }
  return scenes;
};

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
    // fetchGameScript는 GameEvent를 반환하므로 Scene으로 변환 필요
    const gameEvents = await fetchGameScript();
    scriptCache = convertGameEventToScene(gameEvents);
    loadPromise = Promise.resolve(scriptCache);

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

