/**
 * 이름 교체 유틸리티 함수
 * "이도훈"을 사용자 이름으로 교체할 때 성/이름을 적절히 처리
 */

/**
 * 이름에서 성을 제거하고 이름만 반환
 * 예: "배서연" -> "서연", "이도훈" -> "도훈"
 */
export const removeSurname = (fullName: string): string => {
  if (!fullName || fullName.length <= 1) return fullName;
  
  // 한 글자 이름은 그대로 반환
  if (fullName.length === 1) return fullName;
  
  // 두 글자 이상인 경우 첫 글자를 성으로 간주하고 제거
  return fullName.substring(1);
};

/**
 * 텍스트에서 "이도훈"을 사용자 이름으로 교체
 * - "이도훈" 전체가 있으면 사용자 입력 전체로 교체
 * - "도훈"만 있으면 성을 제거한 이름으로 교체
 * 
 * @param text 원본 텍스트
 * @param userName 사용자가 입력한 이름
 * @returns 교체된 텍스트
 */
export const replaceHeroName = (text: string, userName: string): string => {
  if (!text || !userName) return text || '';
  
  // 사용자 이름에서 성 제거한 이름 추출
  const nameWithoutSurname = removeSurname(userName);
  
  let result = text;
  
  // 1. "이도훈" 전체를 사용자 입력 전체로 교체
  result = result.replace(/이도훈/g, userName);
  
  // 2. "도훈"만 있는 경우 성을 제거한 이름으로 교체
  // "이도훈"이 이미 교체된 후 남은 "도훈"만 찾아서 교체
  // 단어 경계를 고려하여 정확히 "도훈"만 매칭
  result = result.replace(/\b도훈\b/g, nameWithoutSurname);
  
  // 한글의 경우 단어 경계가 제대로 작동하지 않을 수 있으므로
  // 추가로 "도훈"이 단독으로 나타나는 경우 처리
  result = result.replace(/([^이])도훈([^훈]|$)/g, (_match, before, after) => {
    // "이도훈"의 일부가 아닌 "도훈"만 교체
    return before + nameWithoutSurname + (after || '');
  });
  
  // 문장 시작에 "도훈"이 있는 경우
  result = result.replace(/^도훈([^훈]|$)/g, (_match, after) => {
    return nameWithoutSurname + (after || '');
  });
  
  return result;
};
