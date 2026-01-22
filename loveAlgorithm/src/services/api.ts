import type { ApiResponse, AffectionResponse, MiniGameScoresResponse, GameState } from '../types/game.types';

// 환경 변수에서 API URL 가져오기 (배포 시 설정 필요)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://lovealgorithmgame.site:8081/api';

const apiClient = async <T>(endpoint: string, options: RequestInit = {}, requireAuth: boolean = true): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  
  // requireAuth가 true이고 토큰이 없으면 에러
  if (requireAuth && !token) {
    console.error('❌ 인증 토큰이 없습니다. 로그인이 필요합니다.');
    throw new Error('인증이 필요합니다. 로그인해주세요.');
  }
  
  // requireAuth가 false이거나 토큰이 없으면 Authorization 헤더를 보내지 않음
  if (requireAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log(`🔐 API 요청: ${endpoint} (토큰 포함, 길이: ${token.length})`);
  } else {
    console.log(`🔓 API 요청: ${endpoint} (인증 없음)`);
  }
  
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  try {
    // redirect: 'follow'로 변경하여 실제 응답 상태 코드 확인
    const response = await fetch(url, { 
      ...options, 
      headers,
      redirect: 'follow' // 리다이렉트를 따라가서 실제 응답 확인
    });
    
    console.log(`📡 응답 상태: ${response.status} ${response.statusText}`);
    console.log(`📡 응답 URL: ${response.url}`);
    console.log(`📡 리다이렉트됨: ${response.redirected}`);
    
    // 리다이렉트 응답 감지 (3xx 상태 코드)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location') || response.url;
      console.error(`⚠️ 리다이렉트 감지 [${response.status}]:`, location);
      
      if (location && (location.includes('/oauth2/authorization') || location.includes('accounts.google.com'))) {
        console.error('❌ 백엔드가 OAuth2 로그인으로 리다이렉트했습니다.');
        console.error('❌ 토큰이 유효하지 않거나 만료되었을 수 있습니다.');
        console.error('❌ 현재 토큰:', token ? `${token.substring(0, 20)}...` : '없음');
        
        // 토큰 삭제 및 로그인 필요 알림
        localStorage.removeItem('auth_token');
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      
      throw new Error(`리다이렉트 응답: ${response.status} - ${location || '알 수 없음'}`);
    }
    
    // 리다이렉트 감지 (response.redirected 속성) - redirect: 'follow' 사용 시
    if (response.redirected && response.url.includes('/oauth2/authorization')) {
      console.error('⚠️ 백엔드가 OAuth2 로그인으로 리다이렉트했습니다.');
      console.error('⚠️ 토큰이 유효하지 않거나 만료되었을 수 있습니다.');
      console.error('⚠️ 최종 리다이렉트 URL:', response.url);
      
      // 토큰 삭제 및 로그인 필요 알림
      localStorage.removeItem('auth_token');
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
    
    if (!response.ok) {
      // 401 Unauthorized인 경우 토큰 삭제
      if (response.status === 401) {
        console.error('❌ 401 Unauthorized: 인증 토큰이 유효하지 않습니다.');
        localStorage.removeItem('auth_token');
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = '응답 본문을 읽을 수 없습니다.';
      }
      
      console.error(`API 에러 [${response.status}]:`, errorText);
      throw new Error(`서버 에러: ${response.status} - ${errorText || '알 수 없는 에러'}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
  return response.json();
    } else {
      // JSON이 아닌 경우 빈 객체 반환
      return { success: true, data: {} as T };
    }
  } catch (error: any) {
    // 네트워크 에러나 CORS 에러 처리
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      // 에러 메시지에서 리다이렉트 정보 확인
      const errorMessage = error.message || '';
      if (errorMessage.includes('oauth2') || errorMessage.includes('accounts.google.com')) {
        console.error('❌ 백엔드가 OAuth2 로그인으로 리다이렉트했습니다.');
        console.error('❌ 토큰이 유효하지 않거나 만료되었을 수 있습니다.');
        localStorage.removeItem('auth_token');
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      
      console.error('❌ 백엔드 서버에 연결할 수 없습니다. lovealgorithmgame.site:8081이 실행 중인지 확인하세요.');
      throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.');
    }
    
    // 상태 코드 0 에러 처리
    if (error.message && error.message.includes('상태 코드 0')) {
      throw error;
    }
    
    // 이미 처리된 에러는 그대로 throw
    if (error.message && (error.message.includes('인증') || error.message.includes('로그인'))) {
      throw error;
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
    
    // 타임아웃 설정 (30초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: googleToken }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
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
    
    // 타임아웃 에러 처리
    if (error.name === 'AbortError') {
      console.error('🔴 요청 타임아웃: 백엔드 서버가 응답하지 않습니다.');
      throw new Error('서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
    }
    
    // 네트워크 에러 처리
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      const detailedError = new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.');
      console.error('🔴 네트워크 에러 상세:', {
        message: error.message,
        endpoint: `${API_BASE_URL}/auth/google`,
        suggestion: '백엔드 서버가 lovealgorithmgame.site:8081에서 실행 중인지 확인하세요.'
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
        win_score_list: (script.gameConfig || script.game_config).winScoreList || (script.gameConfig || script.game_config).win_score_list,
        lose_score_list: (script.gameConfig || script.game_config).loseScoreList || (script.gameConfig || script.game_config).lose_score_list,
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
    // 백엔드 UserController: /api/users/me
    const r = await apiClient<any>('/users/me');
    return r.data; 
  } catch {
    return null;
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
export const saveToSlot = async (slotIndex: number, gameState: GameState, preview: string) => {
  // 백엔드: POST /api/save/slots
  // 백엔드 SaveRequestDto 형식: userId, slotNumber, sceneId, previewText
  // 현재 사용자 정보 가져오기
  const currentUser = await fetchCurrentUser();
  if (!currentUser || !currentUser.userId) {
    throw new Error('사용자 정보를 가져올 수 없습니다. 로그인이 필요합니다.');
  }
  
  const requestBody = { 
    userId: currentUser.userId,
    slotNumber: slotIndex,
    sceneId: gameState.currentSceneId,
    previewText: preview
  };
  
  console.log('💾 저장 요청 데이터:', JSON.stringify(requestBody, null, 2));
  
  try {
    const result = await apiClient('/save/slots', {
    method: 'POST',
      body: JSON.stringify(requestBody)
    });
    console.log('✅ 저장 성공 응답:', result);
    return result;
  } catch (error) {
    console.error('❌ 저장 실패:', error);
    throw error;
  }
};

export const loadFromSlot = async (slotIndex: number) => {
  // 백엔드: GET /api/save/slots/{slotNumber}
  const r = await apiClient<any>(`/save/slots/${slotIndex}`);
  console.log('📥 백엔드 응답 (loadFromSlot):', JSON.stringify(r, null, 2));
  
  // 백엔드가 { gameState: {...}, heroName: "..." } 형식으로 반환할 수도 있음
  if (r.data) {
    // gameState 필드가 있으면 그것을 사용
    if (r.data.gameState) {
      console.log('✅ gameState 필드 발견:', r.data.gameState);
      return r.data;
    } 
    // game_state 필드 (snake_case) 확인
    else if (r.data.game_state) {
      console.log('✅ game_state 필드 발견:', r.data.game_state);
      return { 
        gameState: r.data.game_state, 
        heroName: r.data.heroName || r.data.in_game_nickname || r.data.in_game_nickname 
      };
    }
    // GameState 형식인 경우 (직접 GameState 객체)
    else if (r.data.currentSceneId || r.data.current_scene_id) {
      console.log('✅ GameState 형식으로 인식');
      return { 
        gameState: r.data, 
        heroName: r.data.heroName || r.data.in_game_nickname 
      };
    } 
    // 백엔드가 다른 형식으로 반환하는 경우 (예: loveDohee, loveJisoo 등)
    else {
      console.warn('⚠️ 예상치 못한 응답 형식:', r.data);
      // 백엔드가 다른 형식으로 반환하는 경우, 빈 GameState 반환
      return {
        gameState: {
          currentSceneId: null,
          currentDialogueIndex: 0,
          history: [],
          affections: {},
          miniGameScores: {},
          previousValues: {}
        },
        heroName: null
      };
    }
  }
  
  return r.data;
};

export const fetchSaveSlots = async () => {
  try {
    // 백엔드: GET /api/save/slots
    const r = await apiClient<any>('/save/slots');
    console.log('📥 백엔드 응답 (fetchSaveSlots):', r);
    
    const slots = r.data || [];
    console.log('📦 저장 슬롯 개수:', slots.length);
    
    // 백엔드 응답을 SaveSlot 형식으로 변환
    const convertedSlots = slots.map((slot: any) => {
      const converted = {
        id: slot.id || `slot_${slot.slot_index || slot.slotIndex || slot.slotNumber || 0}`,
        slotIndex: slot.slot_index !== undefined ? slot.slot_index : (slot.slotIndex !== undefined ? slot.slotIndex : (slot.slotNumber !== undefined ? slot.slotNumber : undefined)),
        timestamp: slot.timestamp || (slot.saved_at ? new Date(slot.saved_at).getTime() : Date.now()),
        preview: slot.preview || slot.save_title || '저장 슬롯',
        gameState: slot.gameState || slot.game_state || {},
      };
      console.log('📦 변환된 슬롯:', converted);
      return converted;
    });
    
    console.log('✅ 변환된 저장 슬롯 목록:', convertedSlots);
    return convertedSlots;
  } catch (error) {
    console.error('❌ 저장 슬롯 불러오기 실패:', error);
    return [];
  }
};

export const deleteSaveSlot = async (slotIndex: number) => {
  // 백엔드: DELETE /api/save/slots/{slotNumber}
  await apiClient(`/save/slots/${slotIndex}`, { method: 'DELETE' });
  return true;
};

export const updateUserProgress = async (gameState: GameState, heroName: string) => {
  await apiClient('/users/progress', {
    method: 'POST',
    body: JSON.stringify({ gameState, heroName })
  });
  return true;
};