import type { GameEvent, ScenarioItem } from '../types/game.types';
import { gameEvents } from '../data/script';
import { getBackgroundImagePath, getCharacterImagePath } from './imageService';
import { playBGM, playSFX } from './soundService';

// 이벤트 데이터 캐시
let eventCache: Record<string, GameEvent> | null = null;

/**
 * 이벤트 데이터 로드
 */
export const loadEvents = async (): Promise<Record<string, GameEvent>> => {
  if (eventCache) {
    return eventCache;
  }
  
  // TODO: 백엔드에서 로드하는 로직 추가
  eventCache = gameEvents;
  return eventCache;
};

/**
 * 현재 시나리오 아이템 가져오기
 */
export const getCurrentScenarioItem = async (
  eventId: string,
  index: number
): Promise<ScenarioItem | null> => {
  const events = await loadEvents();
  const event = events[eventId];
  if (!event) return null;
  return event.scenario[index] || null;
};

/**
 * 시나리오 아이템 처리 (이미지, 사운드 등)
 */
export const processScenarioItem = (
  item: ScenarioItem,
  settings: { bgmVolume: number; sfxVolume: number }
): {
  backgroundPath?: string;
  characterImagePath?: string;
  characterActionImagePath?: string;
  characterReImagePath?: string;
} => {
  const result: {
    backgroundPath?: string;
    characterImagePath?: string;
    characterActionImagePath?: string;
    characterReImagePath?: string;
  } = {};

  // 배경 이미지 (파일 이름을 경로로 변환)
  if (item.background_image_id) {
    result.backgroundPath = getBackgroundImagePath(item.background_image_id);
  }

  // 캐릭터 이미지 (파일 이름을 경로로 변환)
  if (item.character_image_id) {
    result.characterImagePath = getCharacterImagePath(item.character_image_id);
  }

  // 캐릭터 액션 이미지 (파일 이름을 경로로 변환)
  if (item.character_action_image_id) {
    result.characterActionImagePath = getCharacterImagePath(item.character_action_image_id);
  }

  // 캐릭터 반응 이미지 (파일 이름을 경로로 변환)
  if (item.character_re_image_id) {
    result.characterReImagePath = getCharacterImagePath(item.character_re_image_id);
  }

  // BGM 재생
  if (item.background_sound_id) {
    playBGM(item.background_sound_id, settings.bgmVolume);
  }

  // 효과음 재생
  if (item.effect_sound_id) {
    playSFX(item.effect_sound_id, settings.sfxVolume);
  }

  return result;
};

/**
 * 선택지 선택 시 호감도 점수 적용
 */
export const applyChoiceScores = async (
  scoreList: Array<{ character_id: string; score: number }>,
  updateAffectionFn: (characterId: string, value: number) => Promise<void>,
  getAffectionsFn: () => Record<string, number>
): Promise<void> => {
  const affections = getAffectionsFn();
  
  for (const scoreItem of scoreList) {
    const currentAffection = affections[scoreItem.character_id] || 0;
    const newAffection = Math.max(0, Math.min(100, currentAffection + scoreItem.score));
    await updateAffectionFn(scoreItem.character_id, newAffection);
  }
};

