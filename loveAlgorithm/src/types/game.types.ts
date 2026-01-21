// 게임 데이터 타입 정의

export interface Dialogue {
  id: string;
  character?: string;
  text: string;
  background?: string;
  characterImage?: string;
  bgm?: string;
  sfx?: string;
  voice?: string;
  choices?: Choice[];
}

export interface ScoreItem {
  id: string;
  character_id: string;
  score: number;
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId?: string;
  score_list?: ScoreItem[];
}

export interface Scene {
  id: string;
  dialogues: Dialogue[];
}

// 새로운 구조 타입
export type ScenarioType = 'text' | 'narration' | 'think' | '시스템' | '카톡' | '카톡_뽑기_시작' | '카톡_뽑기_좌' | '카톡_뽑기_우' | 'input' | '전환' | 'game'

export interface GameConfig {
  game_id: string;
  game_name?: string;
  win_scene_id: string;
  lose_scene_id: string;
  win_score_list?: ScoreItem[]; // 게임 승리 시 호감도 변화
  lose_score_list?: ScoreItem[]; // 게임 실패 시 호감도 변화
}

export interface ScenarioItem {
  id: string;
  index: number;
  script: string;
  character_id?: string;
  where?: string;
  when?: string;
  character_image_id?: {
    1?: string;
    2?: string;
    3?: string;
    all?: string;
  };
  background_image_id?: string;
  background_sound_id?: string;
  effect_sound_id?: string;
  type: ScenarioType;
  not_character?: boolean;
  options?: Choice[];
  character_action_image_id?: string;
  character_re_image_id?: string;
  game?: GameConfig;
  overlay_image_id?: string; // 화면 위쪽에 표시할 이미지
}

export interface GameEvent {
  chapter_id: string;
  next_scene_id: string;
  event: number;
  scenario: ScenarioItem[];
}

export interface GameState {
  currentSceneId: string;
  currentDialogueIndex: number;
  history: string[]; // 방문한 scene ID들
  affections?: Record<string, number>; // 캐릭터별 호감도
  miniGameScores?: Record<string, number>; // 게임별 최고 점수
  previousValues?: { // 이전 시나리오 아이템의 값 (저장/불러오기용)
    character_image_id?: {
      1?: string;
      2?: string;
      3?: string;
    };
    background_image_id?: string;
    background_sound_id?: string;
  };
}

export interface SaveSlot {
  id?: string;
  slotIndex?: number; // 백엔드에서 사용하는 슬롯 인덱스 (0~N)
  timestamp: number;
  preview: string;
  gameState: GameState;
}

export interface Settings {
  skipMode: boolean;
  bgmVolume: number; // 0-100
  sfxVolume: number; // 0-100
  voiceVolume: number; // 0-100
  textSpeed: number; // 0-100
}

export type ScreenType = 'login' | 'register' | 'start' | 'game' | 'saveLoad' | 'settings' | 'debug';

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 호감도 관련 타입
export interface AffectionResponse {
  characterId: string;
  affection: number;
}

// 미니게임 점수 관련 타입
export interface MiniGameScoreResponse {
  gameId: string;
  score: number;
}

export interface MiniGameScoresResponse {
  scores: Record<string, number>;
}

// 이미지 URL 관련 타입은 더 이상 사용하지 않음
// DB에서 파일 이름만 저장하고, 프론트엔드에서 직접 경로로 변환

