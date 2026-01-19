/**
 * 이미지 파일 이름을 경로로 변환합니다.
 * DB에서 파일 이름만 저장하고, 프론트엔드에서 직접 경로로 변환하여 사용합니다.
 */

/**
 * 배경 이미지 파일 이름을 경로로 변환
 */
export const getBackgroundImagePath = (fileName?: string): string | undefined => {
  if (!fileName) return undefined;
  // 파일 확장자가 없으면 .jpg 추가
  const ext = fileName.includes('.') ? '' : '.jpg';
  return `/backgrounds/${fileName}${ext}`;
};

/**
 * 캐릭터 이미지 파일 이름을 경로로 변환
 */
export const getCharacterImagePath = (fileName?: string): string | undefined => {
  if (!fileName || fileName === 'nobody') return undefined;
  // 파일 확장자가 없으면 .png 추가
  const ext = fileName.includes('.') ? '' : '.png';
  return `/characters/${fileName}${ext}`;
};

/**
 * 이미지 파일 이름을 경로로 변환 (타입에 따라)
 */
export const getImagePath = (type: 'background' | 'character', fileName?: string): string | undefined => {
  if (!fileName) return undefined;
  
  if (type === 'background') {
    return getBackgroundImagePath(fileName);
  } else {
    return getCharacterImagePath(fileName);
  }
};
