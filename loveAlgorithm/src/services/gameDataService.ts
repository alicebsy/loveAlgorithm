import { fetchAffection, updateAffection, fetchMiniGameScores, saveMiniGameScore } from './api';

export const getAllAffections = async (characterIds: string[]) => {
  const affections: Record<string, number> = {};
  await Promise.all(characterIds.map(async (id) => {
    affections[id] = await fetchAffection(id);
  }));
  return affections;
};

export const updateAffectionValue = async (id: string, val: number) => updateAffection(id, val);

export const getAllMiniGameScores = async () => fetchMiniGameScores();

export const updateMiniGameScore = async (id: string, score: number) => {
  const current = await fetchMiniGameScores();
  if (score > (current[id] || 0)) return saveMiniGameScore(id, score);
  return true;
};