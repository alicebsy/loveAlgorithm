// 사운드 관리 서비스

interface SoundCache {
  [key: string]: HTMLAudioElement;
}

const bgmCache: SoundCache = {};
const sfxCache: SoundCache = {};
let currentBGM: HTMLAudioElement | null = null;

/**
 * BGM 재생
 */
export const playBGM = async (soundId: string | undefined, volume: number = 70): Promise<void> => {
  if (!soundId) return;

  // 현재 BGM 정지
  if (currentBGM) {
    currentBGM.pause();
    currentBGM.currentTime = 0;
  }

  // 캐시에 있으면 재사용
  if (bgmCache[soundId]) {
    currentBGM = bgmCache[soundId];
    currentBGM.volume = volume / 100;
    currentBGM.loop = true;
    await currentBGM.play();
    return;
  }

  // 새로 로드
  try {
    const audio = new Audio(`/sounds/bgm/${soundId}.mp3`);
    audio.volume = volume / 100;
    audio.loop = true;
    bgmCache[soundId] = audio;
    currentBGM = audio;
    await audio.play();
  } catch (error) {
    console.error(`Error playing BGM ${soundId}:`, error);
  }
};

/**
 * 효과음 재생
 */
export const playSFX = async (soundId: string | undefined, volume: number = 70): Promise<void> => {
  if (!soundId) return;

  // 캐시에 있으면 재사용
  if (sfxCache[soundId]) {
    const audio = sfxCache[soundId].cloneNode() as HTMLAudioElement;
    audio.volume = volume / 100;
    await audio.play();
    return;
  }

  // 새로 로드
  try {
    const audio = new Audio(`/sounds/sfx/${soundId}.mp3`);
    audio.volume = volume / 100;
    sfxCache[soundId] = audio;
    await audio.play();
  } catch (error) {
    console.error(`Error playing SFX ${soundId}:`, error);
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
  Object.values(bgmCache).forEach((audio) => {
    audio.pause();
    audio.src = '';
  });
  Object.values(sfxCache).forEach((audio) => {
    audio.pause();
    audio.src = '';
  });
  Object.keys(bgmCache).forEach((key) => delete bgmCache[key]);
  Object.keys(sfxCache).forEach((key) => delete sfxCache[key]);
};

