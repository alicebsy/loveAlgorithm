import { fetchAffection, updateAffection as updateAffectionApi, fetchMiniGameScores, saveMiniGameScore as saveMiniGameScoreApi } from './api';

/**
 * 모든 캐릭터의 호감도를 가져옵니다.
 */
export const getAllAffections = async (characterIds: string[]): Promise<Record<string, number>> => {
  const affections: Record<string, number> = {};

  try {
    await Promise.all(
      characterIds.map(async (characterId) => {
        try {
          affections[characterId] = await fetchAffection(characterId);
        } catch (error) {
          console.error(`Error fetching affection for ${characterId}:`, error);
          affections[characterId] = 0; // 기본값
        }
      })
    );
  } catch (error) {
    console.error('Error fetching affections:', error);
  }

  return affections;
};

/**
 * 호감도를 업데이트합니다.
 */
export const updateAffectionValue = async (
  characterId: string,
  affection: number
): Promise<boolean> => {
  try {
    return await updateAffectionApi(characterId, affection);
  } catch (error) {
    console.error(`Error updating affection for ${characterId}:`, error);
    return false;
  }
};

/**
 * 호감도를 증가시킵니다.
 */
export const increaseAffection = async (
  characterId: string,
  amount: number
): Promise<boolean> => {
  try {
    const currentAffection = await fetchAffection(characterId);
    const newAffection = Math.min(100, Math.max(0, currentAffection + amount));
    return await updateAffectionApi(characterId, newAffection);
  } catch (error) {
    console.error(`Error increasing affection for ${characterId}:`, error);
    return false;
  }
};

/**
 * 모든 미니게임 점수를 가져옵니다.
 */
export const getAllMiniGameScores = async (): Promise<Record<string, number>> => {
  try {
    return await fetchMiniGameScores();
  } catch (error) {
    console.error('Error fetching mini game scores:', error);
    return {};
  }
};

/**
 * 미니게임 점수를 저장합니다.
 * 기존 점수보다 높을 때만 업데이트합니다.
 */
export const saveMiniGameScoreValue = async (
  gameId: string,
  score: number
): Promise<boolean> => {
  try {
    return await saveMiniGameScoreApi(gameId, score);
  } catch (error) {
    console.error(`Error saving mini game score for ${gameId}:`, error);
    return false;
  }
};

/**
 * 미니게임 점수를 업데이트합니다 (최고 점수만 저장).
 */
export const updateMiniGameScore = async (
  gameId: string,
  newScore: number
): Promise<boolean> => {
  try {
    const currentScores = await fetchMiniGameScores();
    const currentScore = currentScores[gameId] || 0;

    // 새 점수가 더 높을 때만 업데이트
    if (newScore > currentScore) {
      return await saveMiniGameScoreApi(gameId, newScore);
    }

    return true; // 이미 더 높은 점수가 있음
  } catch (error) {
    console.error(`Error updating mini game score for ${gameId}:`, error);
    return false;
  }
};

