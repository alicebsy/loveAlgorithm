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
  sera: '세라',
} as const;

export const characterImageId = {
  nobody: 'nobody',
  manager: '성준.png',
  donghwi: '아무개.png',
  myeongseong: '아무개.png',
  hanjin: '한진.png',
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
  jisoo_삐짐: "jisoo_삐짐.png",
  dohee_basic: 'dohee_basic',
  dohee_happy: 'dohee_happy.png',
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
  // 3주차 도희 이미지들
  dohee_no_basic: 'dohee_no_basic.png',
  dohee_no_angry: 'dohee_no_angry.png',
  dohee_no_annoyed: 'dohee_no_annoyed.png',
  dohee_no_cafe: 'dohee_no_cafe.png',
  dohee_no_cafe_shame: 'dohee_no_cafe_shame.png',
  dohee_no_lookingup: 'dohee_no_lookingup.png',
  dohee_no_shy: 'dohee_no_shy.png',
  dohee_no_smile: 'dohee_no_smile.png',
  dohee_no_surprised: 'dohee_no_surprised.png',
  dohee_no_부탁: 'dohee_no_부탁.png',
  dohee_no_빼꼼: 'dohee_no_빼꼼.png',
  dohee_no_안아줘요: 'dohee_no_안아줘요.png',
  dohee_pretty_basic: 'dohee_pretty_basic.png',
  dohee_pretty_bread: 'dohee_pretty_bread.png',
  dohee_pretty_bread_shame: 'dohee_pretty_bread_shame.png',
  dohee_pretty_sad: 'dohee_pretty_sad.png',
  dohee_pretty_sitting_cry: 'dohee_pretty_sitting_cry.png',
  // 3주차 지수 이미지들
  jisoo_disappointed: 'jisoo_disappointed.png',
  jisoo_laugh_png: 'jisoo_laugh.png',
  jisoo_running: 'jisoo_running.png',
  jisoo_running_stand: 'jisoo_running_stand.png',
  jisoo_신난다: 'jisoo_신난다.png',
  sera_basic: 'sera_basic.png',
  sera_거만_crossedarm: 'sera_거만_crossedarm.png',
  sera_칭찬부끄: 'sera_칭찬부끄.png',
  sera_annoy_sitting: 'sera_annoy_sitting.png',
  sera_shy_basic: 'sera_basic.png',
  sera_shy_front: 'sera_shy_front.png',
  sera_lean_chin: 'sera_lean_chin.png',
  sera_lookingme_monitor: 'sera_lookingme_monitor.png',
  sera_staring_monitor: 'sera_staring_monitor.png',
  sera_pond: 'sera_pond.png',
  sera_surprised: 'sera_surprised.png',
  sera_shy_facecover: 'sera_shy_facecover.png',
  sera_annoy_shy: 'sera_annoy_shy.png',

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
  jisoo_room: 'jisoo_room.png',
  lab: 'classroom.png',
  duck_pond: 'krafton_passageway_night.png',
  kaist_pond: 'kaist_pond.png',
  // 3주차 배경 이미지들
  auditorium_jpeg: 'auditorium.jpeg',
  boardgame_cafe: 'boardgame_cafe.png',
  cafe: 'cafe.jpeg',
  dohee_alone: 'dohee_alone.jpeg',
  dohee_alone_background: 'dohee_alone_background.jpeg',
  kiosk: 'kiosk.jpeg',
  성심당_앞: '성심당_앞.jpeg',
} as const;

export const backgroundSoundId = {
  // 기존 BGM ID들
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
  keyboard_typing: 'keyboard',
  // public/sounds/bgm 폴더의 파일들
  daldal_bgm: 'daldal_bgm',
  game: 'game',
  relax: 'relax',
  select: 'select',
} as const;

// 기본 BGM 없음 - 각 구간별로 script.ts에서 명시적으로 background_sound_id 지정 필요

export const effectSoundId = {
  kakaotalk: 'kakaotalk',
  shock: 'shock',
  keyboard: 'keyboard',
  disappointed: 'disappointed',
  can_open: 'can_open',
  // public/sounds/sfx 폴더의 파일들
  computer_keyboard: 'computer-keyboard', // 파일명에 하이픈이 있어서 언더스코어로 변환
  heartbeat: 'heartbeat',
  skirr: 'skirr',
} as const;

// ID 생성 헬퍼 함수
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

