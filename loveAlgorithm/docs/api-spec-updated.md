# Project: Love Algorithm - Updated API 명세서

## 기본 정보

- Base URL: `http://lovealgorithmgame.site:8081/api`
- Content-Type: `application/json`
- 인증: Bearer Token (JWT) - Authorization 헤더에 포함
- 응답 형식: 모든 응답은 `ApiResponse<T>` 형식을 따릅니다.

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 엔드포인트

### 1. 인증 (Authentication)

#### POST /api/auth/register
회원가입

**요청:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "사용자닉네임"
}
```

**응답:**
```json
{
  "success": true,
  "message": "회원가입 성공"
}
```

#### POST /api/auth/login
로그인

**요청:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### POST /api/auth/logout
로그아웃 (토큰 무효화)

**헤더:**
- `Authorization: Bearer {token}`

**응답:**
```json
{
  "success": true,
  "message": "로그아웃 성공"
}
```

### 2. 사용자 정보 (User)

#### GET /api/user/current
현재 사용자 정보 조회

**헤더:**
- `Authorization: Bearer {token}`

**응답:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "in_game_nickname": "도훈",
    "current_scene_id": "chapter1_scene1",
    "current_script_id": "chapter1_scene1_0",
    "current_dialogue_index": 0,
    "affections": {
      "dohee": 10,
      "jisoo": 5,
      "sera": 0
    },
    "mini_game_scores": {
      "card_game": 100,
      "puzzle_game": 50
    },
    "previous_values": {
      "character_image_id": {
        "1": "dohee_basic",
        "2": "jisoo_hello"
      },
      "background_image_id": "dohoon_room",
      "background_sound_id": "morning_ambience"
    },
    "scene_history": ["chapter1_scene1", "chapter1_scene2"]
  }
}
```

#### PUT /api/user/progress
게임 진행 상태 업데이트 (자동 저장)

**헤더:**
- `Authorization: Bearer {token}`

**요청:**
```json
{
  "current_scene_id": "chapter1_scene2",
  "current_script_id": "chapter1_scene2_5",
  "current_dialogue_index": 5,
  "in_game_nickname": "도훈",
  "affections": {
    "dohee": 10,
    "jisoo": 5
  },
  "mini_game_scores": {
    "card_game": 100
  },
  "previous_values": {
    "character_image_id": {
      "1": "dohee_basic",
      "2": "jisoo_hello"
    },
    "background_image_id": "dohoon_room",
    "background_sound_id": "morning_ambience"
  },
  "scene_history": ["chapter1_scene1", "chapter1_scene2"]
}
```

**응답:**
```json
{
  "success": true,
  "message": "진행 상태 저장 완료"
}
```

### 3. 세이브 슬롯 (Save Slots)

#### GET /api/save/slots
세이브 슬롯 목록 조회

**헤더:**
- `Authorization: Bearer {token}`

**응답:**
```json
{
  "success": true,
  "data": [
    {
      "id": "slot_1",
      "timestamp": 1704067200000,
      "preview": "챕터1 클리어 직전",
      "gameState": {
        "currentSceneId": "chapter1_scene6_commit",
        "currentDialogueIndex": 30,
        "history": ["chapter1_scene1", "chapter1_scene2", ...],
        "affections": {"dohee": 15, "jisoo": 5},
        "miniGameScores": {"card_game": 100},
        "previousValues": {...}
      }
    }
  ]
}
```

#### POST /api/save/slots
세이브 슬롯 저장

**헤더:**
- `Authorization: Bearer {token}`

**요청:**
```json
{
  "slot_index": 1,
  "scene_id": "chapter1_scene2",
  "script_id": "chapter1_scene2_5",
  "dialogue_index": 5,
  "game_state": {
    "currentSceneId": "chapter1_scene2",
    "currentDialogueIndex": 5,
    "history": ["chapter1_scene1", "chapter1_scene2"],
    "affections": {"dohee": 10},
    "miniGameScores": {},
    "previousValues": {}
  },
  "save_title": "챕터1 중간 저장",
  "in_game_nickname": "도훈"
}
```

**응답:**
```json
{
  "success": true,
  "message": "세이브 슬롯 저장 완료"
}
```

#### GET /api/save/slots/{slotIndex}
특정 세이브 슬롯 불러오기

**헤더:**
- `Authorization: Bearer {token}`

**응답:**
```json
{
  "success": true,
  "data": {
    "game_state": {
      "currentSceneId": "chapter1_scene2",
      "currentDialogueIndex": 5,
      "history": ["chapter1_scene1", "chapter1_scene2"],
      "affections": {"dohee": 10},
      "miniGameScores": {},
      "previousValues": {}
    }
  }
}
```

#### DELETE /api/save/slots/{slotIndex}
세이브 슬롯 삭제

**헤더:**
- `Authorization: Bearer {token}`

**응답:**
```json
{
  "success": true,
  "message": "세이브 슬롯 삭제 완료"
}
```

### 4. 스크립트 데이터

#### GET /api/events
전체 게임 이벤트 데이터를 가져옵니다. (새로운 형식)

**응답:**
```json
{
  "success": true,
  "data": {
    "chapter1_scene1": {
      "chapter_id": "chapter1",
      "next_scene_id": "chapter1_scene2",
      "event": 1,
      "scenario": [
        {
          "id": "chapter1_scene1_0",
          "index": 0,
          "script": "init()",
          "type": "전환",
          "character_image_id": {"all": "nobody"},
          "background_image_id": null,
          "background_sound_id": null,
          "effect_sound_id": null,
          "character_id": null,
          "where": null,
          "when": null,
          "not_character": false,
          "options": null,
          "game_config": null,
          "overlay_image_id": null
        },
        {
          "id": "chapter1_scene1_1",
          "index": 1,
          "script": "📧 [합격 메일]이 도착했습니다.",
          "type": "narration",
          "background_image_id": "dohoon_room",
          "background_sound_id": "alert",
          "character_image_id": null,
          ...
        }
      ]
    }
  }
}
```

#### GET /api/script/scene/{sceneId}
특정 씬의 데이터를 가져옵니다. (하위 호환성)

**응답:**
```json
{
  "success": true,
  "data": {
    "id": "chapter1_scene1",
    "dialogues": [...]
  }
}
```

### 5. 호감도 관리

#### GET /api/affection/all
전체 호감도 조회

**헤더:**
- `Authorization: Bearer {token}`

**응답:**
```json
{
  "success": true,
  "data": {
    "affections": {
      "dohee": 10,
      "jisoo": 5,
      "sera": 0
    }
  }
}
```

#### GET /api/affection/{characterId}
특정 캐릭터의 호감도 조회

**헤더:**
- `Authorization: Bearer {token}`

**응답:**
```json
{
  "success": true,
  "data": {
    "characterId": "dohee",
    "affection": 10
  }
}
```

#### POST /api/affection/{characterId}
특정 캐릭터의 호감도 업데이트

**헤더:**
- `Authorization: Bearer {token}`

**요청:**
```json
{
  "affection": 15
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "characterId": "dohee",
    "affection": 15
  }
}
```

#### POST /api/affection/batch
여러 캐릭터의 호감도를 일괄 업데이트 (선택지 선택 시)

**헤더:**
- `Authorization: Bearer {token}`

**요청:**
```json
{
  "affections": {
    "dohee": 12,
    "jisoo": 5
  }
}
```

**응답:**
```json
{
  "success": true,
  "message": "호감도 업데이트 완료"
}
```

### 6. 미니게임 점수

#### GET /api/minigame/scores
전체 미니게임 점수 조회

**헤더:**
- `Authorization: Bearer {token}`

**응답:**
```json
{
  "success": true,
  "data": {
    "scores": {
      "card_game": 100,
      "puzzle_game": 50
    }
  }
}
```

#### POST /api/minigame/scores
미니게임 점수 저장

**헤더:**
- `Authorization: Bearer {token}`

**요청:**
```json
{
  "gameId": "card_game",
  "score": 100
}
```

**응답:**
```json
{
  "success": true,
  "message": "점수 저장 완료"
}
```

### 7. 헬스 체크

#### GET /api/health
백엔드 연결 상태 확인

**응답:**
```json
{
  "success": true,
  "message": "OK"
}
```

## 에러 응답

모든 에러는 다음 형식을 따릅니다:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP 상태 코드

- `200 OK`: 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 오류

## 데이터 모델

### GameEvent (새로운 형식)
```typescript
interface GameEvent {
  chapter_id: string;
  next_scene_id: string;
  event: number;
  scenario: ScenarioItem[];
}
```

### ScenarioItem
```typescript
interface ScenarioItem {
  id: string;
  index: number;
  script: string;
  character_id?: string;
  where?: string;
  when?: string;
  character_image_id?: {
    1?: string; // left
    2?: string; // center
    3?: string; // right
    all?: string; // all positions
  };
  background_image_id?: string; // 파일명만 저장
  background_sound_id?: string; // 파일명만 저장
  effect_sound_id?: string; // 파일명만 저장
  type: 'text' | 'narration' | 'think' | '시스템' | '카톡' | 'input' | '전환' | 'game';
  not_character?: boolean;
  options?: Choice[];
  character_action_image_id?: string;
  character_re_image_id?: string;
  game?: GameConfig; // type이 'game'일 때
  overlay_image_id?: string; // 화면 위쪽에 표시할 이미지
}
```

### GameConfig
```typescript
interface GameConfig {
  game_id: string;
  game_name?: string;
  win_scene_id: string;
  lose_scene_id: string;
}
```

### GameState
```typescript
interface GameState {
  currentSceneId: string;
  currentDialogueIndex: number;
  history: string[];
  affections?: Record<string, number>;
  miniGameScores?: Record<string, number>;
  previousValues?: {
    character_image_id?: {
      1?: string;
      2?: string;
      3?: string;
    };
    background_image_id?: string;
    background_sound_id?: string;
  };
}
```

### Choice
```typescript
interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  score_list?: ScoreItem[];
}
```

### ScoreItem
```typescript
interface ScoreItem {
  id: string;
  character_id: string;
  score: number;
}
```

## 이미지 파일 처리

이미지는 DB에 파일 이름만 저장합니다. 프론트엔드에서 다음과 같이 경로로 변환합니다:
- `background_image_id: "dohoon_room"` → `/backgrounds/dohoon_room.jpg`
- `character_image_id: {"2": "dohee_basic"}` → `/characters/dohee_basic.png`
- `overlay_image_id: "인생네컷"` → `/icon/인생네컷.png`

## 사운드 파일 처리

사운드도 DB에 파일 이름만 저장합니다:
- `background_sound_id: "morning_ambience"` → `/sounds/bgm/morning_ambience.mp3`
- `effect_sound_id: "kakao_alert"` → `/sounds/sfx/kakao_alert.mp3`

