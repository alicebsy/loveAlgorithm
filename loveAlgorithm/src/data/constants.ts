// 게임 상수 정의

export const chapterId = {
  chapter1: 'chapter_1',
  chapter2: 'chapter_2',
  chapter3: 'chapter_3',
} as const;

export const characterId = {
  hero: 'character_hero',
  dohee: '도희',
  jisoo: '지수',
  manager: '성준',
  hanjin: '한진',
  myeongseong: '명성',
  donghwi: '동휘',
  wonyoung: '원영',
} as const;

export const characterImageId = {
  nobody: 'nobody',
  manager: '성준.png',
  donghwi: '아무개.png',
  myeongseong: '아무개.png',
  hanjin: '아무개.png',
  wonyoung: '아무개.png',
  seoyeon_basic: 'seoyeon_basic',
  seoyeon_side: 'seoyeon_side',
  nubzuki_basic: 'nubzuki_basic',
  jisoo_basic: 'jisoo_basic',
  jisoo_smile: 'jisoo_smile',
  jisoo_happy: 'jisoo_happy',
  jisoo_wink: 'jisoo_wink',
  jisoo_laugh: 'jisoo_laugh',
  jisoo_shout: 'jisoo_shout',
  jisoo_hello: 'jisoo_hello.png',
  jisoo_hard: 'jisoo_hard.png',
  jisoo_begging: 'jisoo_begging.png',
  jisoo_lookingup: 'jisoo_lookingup.png',
  dohee_basic: 'dohee_basic',
  dohee_smile: 'dohee_smile',
  dohee_embarrassed: 'dohee_embarrassed.png',
  dohee_satisfied: 'dohee_satisfied.png',
  dohee_hasitate: 'dohee_hasitate.png',
  dohee_surprised: 'dohee_surprised',
  dohee_annoyed: 'dohee_annoyed',
  dohee_side_smile: 'dohee_side_smile.png',
  dohee_access_denied: 'dohee_access_denied.png',
  dohee_boring: 'dohee_boring.png',
  dohee_drunken: 'dohee_drunken.png',
  dohee_joy: 'dohee_joy',
  
} as const;

export const backgroundImageId = {
  dohoon_room: 'dohoon_room.png',
  dohoon_room_monitor: 'dohoon_room_monitor.png',
  krafton_passageway_day: 'krafton_passageway_day.png',
  krafton_passageway_night: 'krafton_passageway_night.png',
  krafton_auditorium_entry: 'krafton_auditorium_entry.png',
  classroom_back: 'classroom_back.png',  
  dohee_can_closeup: 'dohee_can_closeup.png',
  classroom_dohee: 'classroom_dohee.png',
  classroon: 'classroon.png',
  restaurant_inside: 'restaurant_inside.png',
  convenience_store_inside: 'convenience_store_inside.png',
  convenience_store_outside: 'convenience_store_outside.png',
  second_restaurant_inside: 'second_restaurant_inside.png',
  night_street: 'night_street.png',
  mobile_screen: 'mobile_screen',
  kaimaru_front: 'kaimaru_front.png',
  classroom: 'classroom.png',
  classroom_signboard: 'classroom_signboard',
  blackboard_seoyeon: 'blackboard_seoyeon',
  pocha_inside: 'pocha_inside.png',
  pocha_front: 'pocha_front.png',
  convenience_store_front: 'convenience_store_front.png',
  auditorium: 'auditorium.png',
  dorm_room: 'dorm_room.png',
} as const;

export const backgroundSoundId = {
  alert: 'alert',
  morning_ambience: 'morning_ambience',
  romantic: 'romantic',
  romantic_intro: 'romantic_intro',
  noise: 'noise',
  comical_fail: 'comical_fail',
  basic: 'basic',
  serious1: 'serious1',
  serious3: 'serious3',
  typing_noise: 'typing_noise',
  party_noise: 'party_noise',
} as const;

export const effectSoundId = {
  kakao_alert: 'kakao_alert',
  shock: 'shock',
  keyboard: 'keyboard',
  disappointed: 'disappointed',
  can_open: 'can_open',
} as const;

// ID 생성 헬퍼 함수
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

