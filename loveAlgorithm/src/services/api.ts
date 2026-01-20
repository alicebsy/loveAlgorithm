import type { ApiResponse, AffectionResponse, MiniGameScoresResponse, SaveSlot, GameState } from '../types/game.types';

const API_BASE_URL = 'http://localhost:8081/api';

const apiClient = async <T>(endpoint: string, options: RequestInit = {}, requireAuth: boolean = true): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  // requireAuth가 false이거나 토큰이 없으면 Authorization 헤더를 보내지 않음
  if (requireAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  try {
    const response = await fetch(url, { ...options, headers });
    
    // 리다이렉트 감지 (OAuth2 로그인으로 리다이렉트되는 경우)
    if (response.redirected && response.url.includes('/oauth2/authorization')) {
      console.warn('⚠️ 백엔드가 OAuth2 로그인으로 리다이렉트했습니다. 인증이 필요 없는 엔드포인트인지 확인하세요.');
      throw new Error('백엔드가 인증을 요구합니다. SecurityConfig에서 해당 엔드포인트를 permitAll()로 설정하세요.');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 에러 [${response.status}]:`, errorText);
      throw new Error(`서버 에러: ${response.status} - ${errorText}`);
    }
    return response.json();
  } catch (error) {
    // 네트워크 에러나 CORS 에러 처리
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('백엔드 서버에 연결할 수 없습니다. localhost:8081이 실행 중인지 확인하세요.');
      throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.');
    }
    throw error;
  }
};

// --- 인증 관련 함수 (인증 없이 호출) ---
export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || result.message || '로그인 실패');
    }
    
    // 응답 형식: { success: true, data: { token, refreshToken } } 또는 { token, ... }
    const token = result.data?.token || result.token;
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    
    return { success: true, token, data: result.data || result };
  } catch (error: any) {
    console.error('로그인 에러:', error);
    throw error;
  }
};

export const register = async (userData: { email: string; password: string; nickname: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || result.message || '회원가입 실패');
    }
    
    return { success: true, message: result.message || '회원가입 성공' };
  } catch (error: any) {
    console.error('회원가입 에러:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiClient('/auth/logout', { method: 'POST' });
    localStorage.removeItem('auth_token');
  } catch (e) { 
    console.error("Logout failed", e);
    // 로그아웃 실패해도 토큰은 삭제
    localStorage.removeItem('auth_token');
  }
};

// 구글 로그인
export const loginWithGoogle = async (googleToken: string) => {
  try {
    console.log('🔐 구글 로그인 시도:', { endpoint: `${API_BASE_URL}/auth/google`, tokenLength: googleToken.length });
    
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: googleToken }),
    });
    
    console.log('📥 구글 로그인 응답:', { status: response.status, ok: response.ok });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 구글 로그인 실패:', { status: response.status, error: errorText });
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || '구글 로그인 실패' };
      }
      
      // 500 에러인 경우 백엔드 구현 문제일 가능성이 높음
      if (response.status === 500) {
        console.error('🔴 백엔드 /api/auth/google 엔드포인트에서 500 에러 발생');
        console.error('🔴 백엔드 로그를 확인하거나, 엔드포인트가 제대로 구현되었는지 확인하세요.');
        throw new Error('백엔드 서버 오류 (500). 백엔드 로그를 확인하세요.');
      }
      
      throw new Error(errorData.error || errorData.message || `구글 로그인 실패 (${response.status})`);
    }
    
    const result = await response.json();
    console.log('✅ 구글 로그인 성공:', { 
      hasToken: !!(result.data?.token || result.token), 
      nickname: result.data?.nickname,
      fullData: result.data,
      fullResult: result
    });
    
    // 응답 형식: { success: true, data: { token, nickname } } 또는 { token, ... }
    const token = result.data?.token || result.token;
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    
    // data 객체가 없으면 result 전체를 data로 사용
    const responseData = result.data || result;
    
    return { success: true, token, data: responseData };
  } catch (error: any) {
    console.error('❌ 구글 로그인 에러:', error);
    
    // 네트워크 에러 처리
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      const detailedError = new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.');
      console.error('🔴 네트워크 에러 상세:', {
        message: error.message,
        endpoint: `${API_BASE_URL}/auth/google`,
        suggestion: '백엔드 서버가 localhost:8081에서 실행 중인지 확인하세요.'
      });
      throw detailedError;
    }
    
    throw error;
  }
};

// --- gameStore.ts의 빨간 줄을 없애기 위한 함수들 ---
import type { GameEvent, ScenarioItem } from '../types/game.types';

/**
 * 백엔드의 Scene 형식을 GameEvent 형식으로 변환
 * 백엔드 Scene 엔티티: id, chapterId, eventSeq, defaultNextSceneId, scripts (List<Script>)
 * 백엔드 Script 엔티티: id, scriptIndex, type, speakerId, content, backgroundImageId, characterImageId 등
 */
const convertSceneToGameEvent = (sceneId: string, scene: any): GameEvent | null => {
  if (!scene) return null;
  
  // Scene에서 chapter_id, event_seq, default_next_scene_id 추출
  // 백엔드가 camelCase 또는 snake_case로 반환할 수 있음
  const chapterId = scene.chapterId || scene.chapter_id || scene.chapterId || 'chapter1';
  const eventSeq = scene.eventSeq || scene.event_seq || scene.eventSeq || 1;
  const nextSceneId = scene.defaultNextSceneId || scene.default_next_scene_id || scene.nextSceneId || null;
  
  // 백엔드가 dialogues 배열을 반환하거나, scripts 배열을 반환할 수 있음
  // 백엔드 Scene 엔티티는 dialogues 필드를 가지고 있을 것 (LAZY 로딩이므로 null일 수 있음)
  let scripts: any[] = [];
  
  // 백엔드 Scene 엔티티는 dialogues 필드를 사용 (Script 엔티티 리스트)
  if (scene.dialogues && Array.isArray(scene.dialogues)) {
    scripts = scene.dialogues;
  } else if (scene.scripts && Array.isArray(scene.scripts)) {
    scripts = scene.scripts;
  } else if (Array.isArray(scene)) {
    // Scene이 배열인 경우 (예상치 못한 경우)
    scripts = scene;
  }
  
  if (!scripts || scripts.length === 0) {
    console.warn(`❌ Scene ${sceneId}에 scripts/dialogues가 없습니다.`);
    console.warn('Scene 구조:', {
      id: scene.id,
      chapterId: scene.chapterId,
      eventSeq: scene.eventSeq,
      hasDialogues: !!scene.dialogues,
      dialoguesType: typeof scene.dialogues,
      hasScripts: !!scene.scripts,
      allKeys: Object.keys(scene)
    });
    console.warn('⚠️ 백엔드에서 LAZY 로딩으로 인해 dialogues가 포함되지 않았을 수 있습니다.');
    console.warn('⚠️ SceneRepository에 @EntityGraph를 추가하거나 FetchType.EAGER를 사용하세요.');
    return null;
  }
  
  console.log(`✅ Scene ${sceneId}: ${scripts.length}개의 스크립트 발견`);
  
  // Script를 ScenarioItem으로 변환
  const scenario: ScenarioItem[] = scripts
    .sort((a: any, b: any) => {
      // scriptIndex로 정렬
      const indexA = a.scriptIndex || a.script_index || 0;
      const indexB = b.scriptIndex || b.script_index || 0;
      return indexA - indexB;
    })
    .map((script: any, index: number) => {
    // character_image_id 처리 (JSON 문자열일 수 있음)
    let characterImageId: any = undefined;
    if (script.characterImageId || script.character_image_id) {
      const charImgId = script.characterImageId || script.character_image_id;
      if (typeof charImgId === 'string') {
        try {
          // JSON 문자열인 경우 파싱
          characterImageId = JSON.parse(charImgId);
        } catch {
          // 문자열인 경우 center(2)에 배치
          characterImageId = { 2: charImgId };
        }
      } else if (typeof charImgId === 'object') {
        characterImageId = charImgId;
      }
    } else if (script.characterImage) {
      // Dialogue 형식의 경우
      characterImageId = { 2: script.characterImage };
    }
    
    // type 필드 처리 (Script 엔티티의 type 필드 사용)
    // 백엔드 ScriptType enum 값을 문자열로 변환
    let scriptType = script.type;
    if (scriptType && typeof scriptType === 'object') {
      // Enum 객체인 경우 name 속성 사용
      scriptType = scriptType.name || scriptType.toString();
    }
    scriptType = scriptType || 'text';
    
    // type을 ScenarioType으로 변환 (대소문자 처리)
    const normalizedType = scriptType.toLowerCase();
    let finalType: ScenarioItem['type'] = 'text';
    if (normalizedType === 'narration' || normalizedType === 'think' || normalizedType === 'text') {
      finalType = normalizedType as ScenarioItem['type'];
    } else if (normalizedType.includes('카톡') || normalizedType.includes('kakao')) {
      finalType = '카톡';
    } else if (normalizedType === '시스템' || normalizedType === 'system') {
      finalType = '시스템';
    } else if (normalizedType === 'input') {
      finalType = 'input';
    } else if (normalizedType === '전환' || normalizedType === 'transition') {
      finalType = '전환';
    } else if (normalizedType === 'game') {
      finalType = 'game';
    }
    
    // options 처리 (백엔드의 Option 엔티티 리스트)
    const options = script.options || script.choices || [];
    const mappedOptions = options.map((opt: any) => ({
      id: opt.id || opt.optionId || opt.option_id,
      text: opt.text || opt.content,
      nextSceneId: opt.nextSceneId || opt.next_scene_id,
      score_list: opt.scoreList || opt.score_list || [],
    }));
    
    return {
      id: script.id || script.scriptId || `${sceneId}_${script.scriptIndex || index}`,
      index: script.scriptIndex || script.script_index || index,
      script: script.content || script.text || '',
      character_id: script.speakerId || script.speaker_id || script.character,
      where: script.where,
      when: script.when,
      background_image_id: script.backgroundImageId || script.background_image_id || script.background,
      background_sound_id: script.backgroundSoundId || script.background_sound_id || script.bgm,
      effect_sound_id: script.effectSoundId || script.effect_sound_id || script.sfx,
      type: finalType,
      character_image_id: characterImageId,
      options: mappedOptions.length > 0 ? mappedOptions : undefined,
      overlay_image_id: script.overlayImageId || script.overlay_image_id,
      game: script.gameConfig || script.game_config ? {
        game_id: (script.gameConfig || script.game_config).gameId || (script.gameConfig || script.game_config).game_id,
        game_name: (script.gameConfig || script.game_config).gameName || (script.gameConfig || script.game_config).game_name,
        win_scene_id: (script.gameConfig || script.game_config).winSceneId || (script.gameConfig || script.game_config).win_scene_id,
        lose_scene_id: (script.gameConfig || script.game_config).loseSceneId || (script.gameConfig || script.game_config).lose_scene_id,
      } : undefined,
    };
  });
  
  return {
    chapter_id: chapterId,
    next_scene_id: nextSceneId,
    event: eventSeq,
    scenario: scenario,
  };
};

export const fetchGameScript = async (): Promise<Record<string, GameEvent>> => {
  try {
    // 백엔드가 GameEvent 형식으로 반환하도록 요청
    // 인증이 필요 없도록 requireAuth: false 설정
    const r = await apiClient<Record<string, GameEvent>>('/script/events', {}, false);
    if (r.data && Object.keys(r.data).length > 0) {
      return r.data;
    }
  } catch (error) {
    console.log('/script/events 엔드포인트 없음, /script 시도');
  }
  
  // /script/events가 없으면 기존 /script 엔드포인트 시도 (Scene 형식)
  // 인증이 필요 없도록 requireAuth: false 설정
  try {
    const r = await apiClient<Record<string, any>>('/script', {}, false);
    if (r.data && Object.keys(r.data).length > 0) {
      console.log('📥 백엔드에서 Scene 형식으로 데이터 수신');
      console.log('📥 수신된 Scene 개수:', Object.keys(r.data).length);
      console.log('📥 첫 번째 Scene 키:', Object.keys(r.data)[0]);
      const firstScene = r.data[Object.keys(r.data)[0]];
      console.log('📥 첫 번째 Scene 구조:', {
        id: firstScene?.id,
        chapterId: firstScene?.chapterId,
        eventSeq: firstScene?.eventSeq,
        hasScripts: !!firstScene?.scripts,
        scriptsLength: firstScene?.scripts?.length,
        hasDialogues: !!firstScene?.dialogues,
        dialoguesLength: firstScene?.dialogues?.length,
        allKeys: Object.keys(firstScene || {})
      });
      
      // dialogues가 없으면 백엔드에서 LAZY 로딩 문제
      if (!firstScene?.dialogues || firstScene.dialogues.length === 0) {
        console.warn('⚠️ 백엔드 Scene에 dialogues가 없습니다. LAZY 로딩 문제일 수 있습니다.');
        console.warn('⚠️ 로컬 데이터를 사용합니다.');
        throw new Error('백엔드 Scene에 dialogues가 없습니다.');
      }
      
      // Scene을 GameEvent로 변환
      const gameEvents: Record<string, GameEvent> = {};
      let successCount = 0;
      let failCount = 0;
      
      for (const [sceneId, scene] of Object.entries(r.data)) {
        const gameEvent = convertSceneToGameEvent(sceneId, scene);
        if (gameEvent) {
          gameEvents[sceneId] = gameEvent;
          successCount++;
        } else {
          console.warn(`❌ Scene ${sceneId} 변환 실패`);
          failCount++;
        }
      }
      
      if (Object.keys(gameEvents).length > 0) {
        console.log(`✅ 변환 완료: ${successCount}개 성공, ${failCount}개 실패`);
        console.log('✅ 변환된 이벤트 키들:', Object.keys(gameEvents).slice(0, 5), '...');
        return gameEvents;
      } else {
        console.error('❌ 변환된 이벤트가 없습니다. 백엔드 데이터 구조를 확인하세요.');
        throw new Error('백엔드 Scene을 GameEvent로 변환할 수 없습니다.');
      }
    }
  } catch (e) {
    console.warn('⚠️ 백엔드에서 스크립트를 가져올 수 없습니다. 로컬 데이터를 사용합니다.', e);
    throw e;
  }
  
  throw new Error('백엔드에서 데이터를 가져올 수 없습니다.');
};

export const fetchCurrentUser = async () => {
  try {
    // API 명세서에 따르면 /user/current 또는 /user/me
    const r = await apiClient<any>('/user/current');
    return r.data; 
  } catch {
    // /user/current가 없으면 /user/me 시도
    try {
      const r = await apiClient<any>('/user/me');
      return r.data;
    } catch {
      return null;
    }
  }
};

export const fetchAllAffections = async () => {
  const r = await apiClient<Record<string, number>>('/affection/all');
  return r.data || {};
};

export const fetchAffection = async (id: string) => {
  try {
    const r = await apiClient<AffectionResponse>(`/affection/${id}`);
    return r.data?.affection || 0;
  } catch { return 0; }
};

export const updateAffection = async (id: string, affection: number) => {
  try {
    await apiClient(`/affection/${id}`, {
      method: 'POST',
      body: JSON.stringify({ affection })
    });
    return true;
  } catch { return false; }
};

export const updateAffections = async (affections: Record<string, number>) => {
  try {
    await apiClient('/affection/bulk', {
      method: 'POST',
      body: JSON.stringify({ affections })
    });
    return true;
  } catch { return false; }
};

export const fetchMiniGameScores = async () => {
  const r = await apiClient<MiniGameScoresResponse>('/minigame/scores');
  return r.data?.scores || {};
};

export const saveMiniGameScore = async (gameId: string, score: number) => {
  try {
    await apiClient('/minigame/score', {
      method: 'POST',
      body: JSON.stringify({ gameId, score })
    });
    return true;
  } catch { return false; }
};

// 세이브/로드 관련
export const saveToSlot = async (slotIndex: number, gameState: GameState, preview: string, heroName: string) => {
  return await apiClient('/save', {
    method: 'POST',
    body: JSON.stringify({ slotIndex, gameState, preview, heroName })
  });
};

export const loadFromSlot = async (slotIndex: number) => {
  const r = await apiClient<GameState>(`/save/${slotIndex}`);
  return r.data;
};

export const fetchSaveSlots = async () => {
  const r = await apiClient<SaveSlot[]>('/save/slots');
  return r.data || [];
};

export const deleteSaveSlot = async (slotIndex: number) => {
  await apiClient(`/save/${slotIndex}`, { method: 'DELETE' });
  return true;
};

export const updateUserProgress = async (gameState: GameState, heroName: string) => {
  await apiClient('/user/progress', {
    method: 'POST',
    body: JSON.stringify({ gameState, heroName })
  });
  return true;
};