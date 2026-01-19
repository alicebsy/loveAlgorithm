# Project: Love Algorithm - Updated ERD

## 수정된 ERD (현재 코드 구조 반영)

```sql
// ==========================================
// 1. 계정 및 인증 (Authentication)
// ==========================================

Table accounts {
  account_id bigint [pk, increment]
  email varchar(255) [unique, not null]
  password_hash varchar(255) [null]
  nickname varchar(50)
  social_provider varchar(20) [default: 'local'] // local, kakao, google, apple
  social_id varchar(255) [null]
  role varchar(20) [default: 'user'] // user, admin
  created_at timestamp [default: `now()`]
  last_login_at timestamp
}

Table tokens {
  token_id bigint [pk, increment]
  account_id bigint [ref: > accounts.account_id]
  refresh_token varchar(512)
  device_info varchar(255) [null]
  expires_at timestamp
  created_at timestamp [default: `now()`]
}

// ==========================================
// 2. 유저 정보 및 세이브 (User & Save)
// ==========================================

Table users {
  user_id bigint [pk, increment]
  account_id bigint [ref: > accounts.account_id]
  in_game_nickname varchar(50) // 게임 내 주인공 이름
  
  // 진행 상황
  current_scene_id varchar(100) [ref: > scenes.scene_id]
  current_script_id varchar(100) [ref: > scripts.script_id, null]
  current_dialogue_index int [default: 0] // 현재 대사 인덱스
  
  // 히로인 호감도 (동적 캐릭터 지원을 위해 JSON으로 변경)
  affections json [default: '{}'] // {"dohee": 10, "jisoo": 5, "sera": 0}
  
  // 미니게임 점수
  mini_game_scores json [default: '{}'] // {"card_game": 100, "puzzle_game": 50}
  
  // 이전 값 저장 (character_image_id, background_image_id, background_sound_id)
  previous_values json [default: '{}'] // {"character_image_id": {"1": "...", "2": "..."}, "background_image_id": "...", "background_sound_id": "..."}
  
  // 방문한 씬 히스토리
  scene_history json [default: '[]'] // ["chapter1_scene1", "chapter1_scene2", ...]
  
  updated_at timestamp
  created_at timestamp
}

Table save_slots {
  save_id bigint [pk, increment]
  user_id bigint [ref: > users.user_id]
  slot_index int // 0: 자동저장, 1~N: 일반 슬롯
  
  // 저장 시점의 위치 정보
  scene_id varchar(100) [ref: > scenes.scene_id]
  script_id varchar(100) [ref: > scripts.script_id]
  dialogue_index int
  
  // 저장 시점의 상태 정보 (JSON으로 저장)
  game_state json // 전체 GameState 객체를 JSON으로 저장
  
  // 슬롯 표시용 정보
  save_title varchar(100)
  play_time_seconds bigint [default: 0]
  thumbnail_url varchar(255) [null]
  saved_at timestamp [default: `now()`]
  
  indexes {
    (user_id, slot_index) [unique]
  }
}

// ==========================================
// 3. 게임 콘텐츠 (Game Contents)
// ==========================================

Table scenes {
  scene_id varchar(100) [pk] // 예: 'chapter1_scene1'
  chapter_id varchar(20) // 예: 'chapter1'
  event_seq int // 챕터 내 순서
  title varchar(100) // 씬 제목
  default_next_scene_id varchar(100) [null] // 선택지 없을 때 넘어갈 곳
}

Table scripts {
  script_id varchar(100) [pk] // 예: 'chapter1_scene1_0'
  scene_id varchar(100) [ref: > scenes.scene_id]
  script_index int // 출력 순서 (0, 1, 2...)
  
  // 기본 정보
  type varchar(20) // text, narration, think, 시스템, 카톡, input, 전환, game
  speaker_id varchar(50) [null] // hero, dohee, jisoo, manager...
  content text // 대사 내용
  
  // 위치/시간 정보
  where varchar(100) [null] // 장소 정보
  when varchar(100) [null] // 시간 정보
  
  // 이미지 정보 (파일명만 저장)
  character_image_id json [null] // {"1": "dohee_basic", "2": "jisoo_hello", "3": "...", "all": "..."}
  character_action_image_id varchar(100) [null]
  character_re_image_id varchar(100) [null]
  background_image_id varchar(100) [null] // 파일명만 저장
  overlay_image_id varchar(100) [null] // 화면 위쪽에 표시할 이미지
  
  // 사운드 정보 (파일명만 저장)
  background_sound_id varchar(100) [null] // BGM
  effect_sound_id varchar(100) [null] // 효과음
  
  // 기타
  not_character boolean [default: false] // 캐릭터 표시 여부
  
  // 미니게임 정보 (type이 'game'일 때)
  game_config json [null] // {"game_id": "card_game", "game_name": "...", "win_scene_id": "...", "lose_scene_id": "..."}
  
  indexes {
    (scene_id, script_index) [unique] // 같은 씬 내에서 인덱스는 유일해야 함
  }
}

Table options {
  option_id varchar(100) [pk] // 예: 'opt_sol'
  script_id varchar(100) [ref: > scripts.script_id] // 연결된 대사 ID
  text varchar(255) // 선택지 버튼 텍스트
  next_scene_id varchar(100) [ref: > scenes.scene_id] // 이동할 결과 씬
}

Table option_scores {
  id bigint [pk, increment]
  option_id varchar(100) [ref: > options.option_id]
  target_character_id varchar(50) // dohee, jisoo, sera...
  score_change int // 호감도 변화량 (+, -)
  
  indexes {
    (option_id, target_character_id) [unique] // 한 선택지에 같은 캐릭터는 중복 불가
  }
}
```

## 주요 변경사항

1. **`users` 테이블**:
   - `affections`를 JSON으로 변경하여 동적 캐릭터 지원
   - `mini_game_scores` JSON 필드 추가
   - `previous_values` JSON 필드 추가 (이전 시나리오 값 저장)
   - `scene_history` JSON 필드 추가
   - `current_dialogue_index` 필드 추가

2. **`save_slots` 테이블**:
   - `game_state` JSON 필드로 전체 상태 저장
   - `dialogue_index` 필드 추가

3. **`scripts` 테이블**:
   - `character_image_id`를 JSON으로 변경 (위치별 이미지 지원)
   - `type` 필드에 더 많은 값 지원 (시스템, 카톡, input, 전환, game 등)
   - `where`, `when` 필드 추가
   - `character_action_image_id`, `character_re_image_id` 필드 추가
   - `overlay_image_id` 필드 추가
   - `game_config` JSON 필드 추가 (미니게임 정보)
   - 이미지/사운드는 파일명만 저장 (프론트엔드에서 경로 변환)

4. **`option_scores` 테이블**:
   - `id`를 `bigint`로 변경
   - 인덱스 추가로 중복 방지

