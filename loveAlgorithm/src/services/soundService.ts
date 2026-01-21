// 사운드 관리 서비스

interface SoundCache {
  [key: string]: HTMLAudioElement;
}

const bgmCache: SoundCache = {};
const sfxCache: SoundCache = {};
let currentBGM: HTMLAudioElement | null = null;

/**
 * janjan을 포함한 모든 오디오 강제 정지
 */
const forceStopAllJanjan = (): void => {
  // 모든 오디오 요소 찾기
  const allAudios = document.querySelectorAll('audio');
  allAudios.forEach((audio) => {
    const src = audio.src || '';
    if (src.includes('janjan') || src.includes('janjan.mp3')) {
      console.warn('🚫 janjan 오디오 강제 정지:', src);
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      audio.load();
    }
  });
  
  // 캐시에서도 제거
  if (bgmCache['janjan']) {
    const janjanAudio = bgmCache['janjan'];
    janjanAudio.pause();
    janjanAudio.currentTime = 0;
    janjanAudio.src = '';
    delete bgmCache['janjan'];
  }
  
  // 현재 재생 중인 BGM이 janjan이면 정지
  if (currentBGM) {
    const currentSrc = currentBGM.src || '';
    if (currentSrc.includes('janjan')) {
      console.warn('🚫 현재 재생 중인 janjan BGM 강제 정지');
      currentBGM.pause();
      currentBGM.currentTime = 0;
      currentBGM.src = '';
      currentBGM = null;
    }
  }
};

/**
 * BGM 재생 - 모든 BGM 비활성화 + janjan 강제 차단
 */
export const playBGM = async (soundId: string | undefined, _volume: number = 30): Promise<void> => {
  // janjan은 절대 재생하지 않음
  if (soundId === 'janjan' || soundId?.includes('janjan')) {
    console.warn('🚫 janjan BGM 재생 차단:', soundId);
    forceStopAllJanjan();
    return;
  }
  
  // 모든 BGM 비활성화 - 아무 소리도 재생하지 않음
  if (currentBGM) {
    currentBGM.pause();
    currentBGM.currentTime = 0;
    currentBGM = null;
  }
  
  // janjan이 재생되고 있는지 확인하고 정지
  forceStopAllJanjan();
  
  return;
};

/**
 * 효과음 재생
 */
export const playSFX = async (soundId: string | undefined, volume: number = 80): Promise<void> => {
  if (!soundId) return;

  // 캐시에 있으면 재사용
  if (sfxCache[soundId]) {
    const audio = sfxCache[soundId].cloneNode() as HTMLAudioElement;
    audio.volume = volume / 100;
    try {
      await audio.play();
    } catch (playError: any) {
      if (playError.name !== 'NotAllowedError') {
        console.warn(`⚠️ SFX 재생 실패: ${soundId}`, playError);
      }
    }
    return;
  }

  // 새로 로드
  try {
    const audio = new Audio(`/sounds/sfx/${soundId}.mp3`);
    
    // 에러 핸들러 추가
    audio.addEventListener('error', () => {
      console.warn(`⚠️ SFX 파일을 찾을 수 없습니다: /sounds/sfx/${soundId}.mp3`);
    });
    
    audio.volume = volume / 100;
    sfxCache[soundId] = audio;
    
    try {
      await audio.play();
    } catch (playError: any) {
      // 재생 실패 시 조용히 처리
      if (playError.name !== 'NotAllowedError') {
        console.warn(`⚠️ SFX 재생 실패: ${soundId}`, playError);
      }
    }
  } catch (error) {
    // 파일 로드 실패 시 조용히 처리
    console.warn(`⚠️ SFX 파일 로드 실패: ${soundId}`, error);
  }
};

/**
 * BGM 정지
 */
export const stopBGM = (): void => {
  if (currentBGM) {
    currentBGM.pause();
    currentBGM.currentTime = 0;
    currentBGM = null;
  }
  // janjan도 강제 정지
  forceStopAllJanjan();
};

/**
 * BGM 볼륨 변경
 */
export const setBGMVolume = (volume: number): void => {
  if (currentBGM) {
    currentBGM.volume = volume / 100;
  }
};

/**
 * 사운드 캐시 초기화
 */
export const clearSoundCache = (): void => {
  stopBGM();
  
  // janjan 강제 정지
  forceStopAllJanjan();
  
  // janjan이 캐시에 있으면 강제로 정지 및 삭제
  if (bgmCache['janjan']) {
    const janjanAudio = bgmCache['janjan'];
    janjanAudio.pause();
    janjanAudio.currentTime = 0;
    janjanAudio.src = '';
    delete bgmCache['janjan'];
  }
  
  Object.values(bgmCache).forEach((audio) => {
    const src = audio.src || '';
    if (src.includes('janjan')) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    } else {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    }
  });
  Object.values(sfxCache).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.src = '';
  });
  Object.keys(bgmCache).forEach((key) => {
    if (key.includes('janjan')) {
      delete bgmCache[key];
    }
  });
  Object.keys(sfxCache).forEach((key) => delete sfxCache[key]);
  
  // DOM의 모든 오디오 요소도 확인
  forceStopAllJanjan();
};

