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
  settings: { bgmVolume: number; sfxVolume: number },
  _previousItemType?: string
): {
  backgroundPath?: string;
  characterImagePaths?: {
    1?: string;
    2?: string;
    3?: string;
  };
  characterActionImagePath?: string;
  characterReImagePath?: string;
} => {
  const result: {
    backgroundPath?: string;
    characterImagePaths?: {
      1?: string;
      2?: string;
      3?: string;
    };
    characterActionImagePath?: string;
    characterReImagePath?: string;
  } = {};

  // 배경 이미지 (파일 이름을 경로로 변환)
  if (item.background_image_id) {
    result.backgroundPath = getBackgroundImagePath(item.background_image_id);
  }

  // 캐릭터 이미지 (위치별로 파일 이름을 경로로 변환)
  if (item.character_image_id) {
    const characterImagePaths: {
      1?: string;
      2?: string;
      3?: string;
    } = {};
    
    // all이 있으면 1, 2, 3 모두에 적용
    if (item.character_image_id.all) {
      const imagePath = getCharacterImagePath(item.character_image_id.all);
      characterImagePaths[1] = imagePath;
      characterImagePaths[2] = imagePath;
      characterImagePaths[3] = imagePath;
    } else {
      // 각 위치별로 변환
      if (item.character_image_id[1]) {
        characterImagePaths[1] = getCharacterImagePath(item.character_image_id[1]);
      }
      if (item.character_image_id[2]) {
        characterImagePaths[2] = getCharacterImagePath(item.character_image_id[2]);
      }
      if (item.character_image_id[3]) {
        characterImagePaths[3] = getCharacterImagePath(item.character_image_id[3]);
      }
    }
    
    if (Object.keys(characterImagePaths).length > 0) {
      result.characterImagePaths = characterImagePaths;
    }
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
    // 특정 BGM이 지정된 경우 해당 BGM 재생
    playBGM(item.background_sound_id, settings.bgmVolume);
  }
  // background_sound_id가 없으면 BGM을 재생하지 않음 (키보드 소리 구간 등)

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

