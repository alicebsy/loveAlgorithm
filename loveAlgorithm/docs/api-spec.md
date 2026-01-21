# Project: Love Algorithm API 명세서

## 기본 정보

- Base URL: `http://lovealgorithmgame.site:8081/api`
- Content-Type: `application/json`
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

### 1. 스크립트 데이터

#### GET /api/script
전체 게임 스크립트 데이터를 가져옵니다. (하위 호환성을 위한 Scene 형식)

**응답:**
```json
{
  "success": true,
  "data": {
    "scene_001": {
      "id": "scene_001",
      "dialogues": [...]
    }
  }
}
```

#### GET /api/events
전체 게임 이벤트 데이터를 가져옵니다. (새로운 형식)

**응답:**
```json
{
  "success": true,
  "data": {
    "687691c86f755e15ad94835d": {
      "chapter_id": "chapter_1",
      "next_scene_id": "687691c86f755e15ad94835e",
      "event": 1,
      "scenario": [
        {
          "id": "...",
          "index": 1,
          "script": "칠판에 적혀 있는 조별 좌석대로...",
          "character_id": "character_nubzuki",
          "where": "몰입실",
          "when": "목요일 오후 2시",
          "character_image_id": "nubzuki_basic",
          "background_image_id": "classroom_signboard",
          "background_sound_id": "basic",
          "type": "text",
          "options": [...]
        }
      ]
    }
  }
}
```

#### GET /api/script/scene/{sceneId}
특정 씬의 데이터를 가져옵니다.

**파라미터:**
- `sceneId` (path): 씬 ID

**응답:**
```json
{
  "success": true,
  "data": {
    "id": "scene_001",
    "dialogues": [...]
  }
}
```

### 2. 호감도 관리

#### GET /api/affection/{characterId}
캐릭터의 호감도를 조회합니다.

**파라미터:**
- `characterId` (path): 캐릭터 ID

**응답:**
```json
{
  "success": true,
  "data": {
    "characterId": "character_001",
    "affection": 50
  }
}
```

#### POST /api/affection/{characterId}
캐릭터의 호감도를 업데이트합니다.

**파라미터:**
- `characterId` (path): 캐릭터 ID

**요청 본문:**
```json
{
  "affection": 60
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "characterId": "character_001",
    "affection": 60
  }
}
```

### 3. 미니게임 점수

#### GET /api/minigame/scores
모든 미니게임 점수를 조회합니다.

**응답:**
```json
{
  "success": true,
  "data": {
    "scores": {
      "minigame_001": 1000,
      "minigame_002": 500,
      "minigame_003": 750
    }
  }
}
```

#### POST /api/minigame/scores
미니게임 점수를 저장합니다.

**요청 본문:**
```json
{
  "gameId": "minigame_001",
  "score": 1200
}
```

**응답:**
```json
{
  "success": true,
  "message": "Score saved successfully"
}
```

### 4. 이미지 파일

**참고:** 이미지는 DB에 파일 이름만 저장하고, 프론트엔드에서 직접 경로로 변환하여 사용합니다.
- 배경 이미지: `/backgrounds/{파일이름}`
- 캐릭터 이미지: `/characters/{파일이름}`

백엔드 API는 이미지 URL을 제공하지 않습니다.

### 5. 게임 진행 상태 저장

#### POST /api/save
게임 진행 상태를 저장합니다.

**요청 본문:**
```json
{
  "currentSceneId": "scene_001",
  "currentDialogueIndex": 5,
  "history": ["scene_001"],
  "affections": {
    "character_001": 50
  },
  "miniGameScores": {
    "minigame_001": 1000
  }
}
```

**응답:**
```json
{
  "success": true,
  "message": "Game progress saved"
}
```

### 6. Health Check

#### GET /api/health
백엔드 서버 상태를 확인합니다.

**응답:**
```json
{
  "success": true,
  "message": "Server is running"
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
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 오류

## 데이터 모델

### Scene
```typescript
interface Scene {
  id: string;
  dialogues: Dialogue[];
}
```

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
  character_image_id?: string;
  background_image_id?: string;
  background_sound_id?: string;
  effect_sound_id?: string;
  type: 'text' | 'narration' | 'think';
  not_character?: boolean;
  options?: Choice[];
  character_action_image_id?: string;
  character_re_image_id?: string;
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

### Dialogue
```typescript
interface Dialogue {
  id: string;
  character?: string;
  text: string;
  background?: string;
  characterImage?: string;
  bgm?: string;
  sfx?: string;
  voice?: string;
  choices?: Choice[];
}
```

### Choice
```typescript
interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
}
```

### AffectionResponse
```typescript
interface AffectionResponse {
  characterId: string;
  affection: number; // 0-100
}
```

### MiniGameScoresResponse
```typescript
interface MiniGameScoresResponse {
  scores: Record<string, number>;
}
```

### 이미지 파일 처리

이미지는 DB에 파일 이름만 저장합니다. 프론트엔드에서 다음과 같이 경로로 변환합니다:
- `background_image_id: "classroom"` → `/backgrounds/classroom.jpg`
- `character_image_id: "seoyeon_basic"` → `/characters/seoyeon_basic.png`

## Spring Boot 구현 가이드

### CORS 설정

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173") // Vite 기본 포트
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

### 컨트롤러 예시

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class GameController {
    
    @GetMapping("/script")
    public ResponseEntity<ApiResponse<Map<String, Scene>>> getScript() {
        // 구현
    }
    
    @GetMapping("/affection/{characterId}")
    public ResponseEntity<ApiResponse<AffectionResponse>> getAffection(
        @PathVariable String characterId
    ) {
        // 구현
    }
    
    @PostMapping("/affection/{characterId}")
    public ResponseEntity<ApiResponse<AffectionResponse>> updateAffection(
        @PathVariable String characterId,
        @RequestBody Map<String, Integer> request
    ) {
        // 구현
    }
}
```

## 테스트

프론트엔드에서 모킹 모드로 테스트:
- `.env` 파일에 `VITE_API_MODE=mock` 설정
- 백엔드 없이도 모든 기능 테스트 가능

백엔드 연결 후:
- `.env` 파일에 `VITE_API_MODE=backend` 설정
- `VITE_API_BASE_URL=http://lovealgorithmgame.site:8081/api` 설정

