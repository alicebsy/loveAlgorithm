# 💻 Love Algorithm - Frontend 발표자료

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [주요 기능](#주요-기능)
5. [핵심 컴포넌트](#핵심-컴포넌트)
6. [상태 관리](#상태-관리)
7. [API 통신](#api-통신)
8. [게임 엔진](#게임-엔진)
9. [UI/UX 특징](#uiux-특징)
10. [성능 최적화](#성능-최적화)

---

## 🎯 프로젝트 개요

**Love Algorithm**은 React + TypeScript로 구현된 몰입형 비주얼 노벨 게임입니다.

### 주요 특징
- **선택 기반 스토리텔링**: 사용자의 선택에 따라 스토리가 분기
- **호감도 시스템**: 선택에 따라 캐릭터별 호감도 변화
- **다양한 미디어**: 배경 이미지, 캐릭터 이미지, BGM, 효과음
- **서버 연동**: 게임 진행 상태를 백엔드에 저장/불러오기
- **반응형 UI**: 다양한 대화 형식 지원 (일반 대화, 카카오톡, 시스템 메시지 등)

---

## 🛠 기술 스택

### Core Technologies
- **React 19.2** - 최신 React 기능 활용
- **TypeScript 5.9** - 타입 안정성 보장
- **Vite 7.2** - 빠른 개발 서버 및 빌드

### State Management
- **Zustand 5.0** - 경량 상태 관리 라이브러리
  - Redux보다 간단한 API
  - 타입스크립트 완벽 지원
  - 미들웨어 없이도 충분한 기능

### Styling
- **Styled Components 6.1** - CSS-in-JS 스타일링
  - 동적 스타일링 지원
  - 테마 시스템 활용

### Authentication
- **@react-oauth/google** - Google OAuth 로그인

### Build Tools
- **Vite** - 빠른 개발 서버 (HMR)
- **TypeScript** - 타입 체크 및 컴파일
- **ESLint** - 코드 품질 관리

---

## 📂 프로젝트 구조

```
loveAlgorithm/
├── public/                    # 정적 파일
│   ├── backgrounds/         # 배경 이미지 (77개)
│   ├── characters/          # 캐릭터 이미지 (77개)
│   ├── icon/               # 아이콘 이미지
│   └── sounds/              # BGM 및 효과음
│       ├── bgm/            # 배경음악
│       └── sfx/            # 효과음
│
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── screens/        # 화면 컴포넌트
│   │   │   ├── StartScreen.tsx      # 시작 화면
│   │   │   ├── LoginScreen.tsx     # 로그인 화면
│   │   │   ├── RegisterScreen.tsx   # 회원가입 화면
│   │   │   ├── GameScreen.tsx       # 메인 게임 화면
│   │   │   ├── SaveLoadScreen.tsx   # 저장/불러오기 화면
│   │   │   ├── SettingsScreen.tsx   # 설정 화면
│   │   │   └── DebugScreen.tsx      # 디버그 화면
│   │   └── ui/             # UI 컴포넌트
│   │       ├── CharacterDisplay.tsx  # 캐릭터 이미지 표시
│   │       ├── DialogueBox.tsx       # 대화 박스
│   │       ├── ControlPanel.tsx      # 컨트롤 패널
│   │       ├── MiniGameModal.tsx     # 미니게임 모달
│   │       ├── KakaoTalkModal.tsx    # 카카오톡 UI
│   │       ├── ChoiceModal.tsx       # 선택지 모달
│   │       ├── Toast.tsx             # 토스트 알림
│   │       └── ...
│   │
│   ├── services/           # 서비스 레이어
│   │   ├── api.ts          # API 클라이언트 (백엔드 통신)
│   │   ├── gameDataService.ts  # 게임 데이터 서비스
│   │   ├── scenarioService.ts  # 시나리오 처리 서비스
│   │   ├── scriptService.ts    # 스크립트 서비스
│   │   ├── soundService.ts     # 사운드 서비스
│   │   └── imageService.ts     # 이미지 서비스
│   │
│   ├── store/              # 상태 관리
│   │   └── gameStore.ts    # Zustand 스토어
│   │
│   ├── hooks/              # Custom Hooks
│   │   ├── useGameEngine.ts    # 게임 엔진 로직
│   │   ├── useScriptLoader.ts  # 스크립트 로더
│   │   └── useHotkeys.ts       # 키보드 단축키
│   │
│   ├── types/              # TypeScript 타입 정의
│   │   └── game.types.ts   # 게임 관련 타입
│   │
│   ├── data/              # 게임 데이터
│   │   ├── script.ts       # 게임 스크립트 (6969줄)
│   │   └── constants.ts    # 상수 정의
│   │
│   ├── utils/              # 유틸리티 함수
│   │   ├── nameUtils.ts    # 이름 처리 유틸
│   │   └── storage.ts      # 로컬 스토리지 유틸
│   │
│   ├── App.tsx             # 메인 앱 컴포넌트
│   └── main.tsx            # 앱 진입점
│
└── package.json            # 의존성 관리
```

---

## 🎮 주요 기능

### 1. 사용자 인증 시스템
- **이메일 회원가입/로그인**: 기본 계정 시스템
- **Google OAuth**: 구글 계정으로 간편 로그인
- **세션 관리**: 자동 로그인 지원 (localStorage 기반)
- **토큰 기반 인증**: JWT 토큰으로 API 요청

### 2. 게임 진행 시스템
- **씬 기반 스토리**: Chapter와 Scene으로 구성된 스토리 구조
- **대화 진행**: 타이핑 애니메이션과 함께 대화 표시
- **선택지 시스템**: 사용자 선택에 따른 스토리 분기
- **호감도 시스템**: 선택에 따라 캐릭터별 호감도 변화
- **이전 대화로 이동**: 이전 대화로 돌아가기 기능

### 3. 다양한 대화 형식
- **일반 대화 (text)**: 기본 대화 형식
- **나레이션 (narration)**: 스토리 설명
- **생각 (think)**: 주인공의 내적 독백
- **카카오톡 (카톡)**: 실제 카카오톡 UI로 대화
- **시스템 메시지 (시스템)**: 게임 상태 알림
- **입력 모드 (input)**: 주인공 이름 입력 등
- **전환 (전환)**: 씬 전환 시 사용

### 4. 미니게임 시스템
- **스토리 중간 삽입**: 스토리 진행 중 미니게임 등장
- **게임 결과에 따른 분기**: 승리/패배에 따라 다른 씬으로 이동
- **점수 저장**: 미니게임 점수를 서버에 저장
- **게임 종류**:
  - 스파게티 코드 게임
  - 성심당 게임
  - 카드 게임
  - 메뉴 찾기 게임

### 5. 저장/불러오기 시스템
- **다중 슬롯**: 최대 10개의 저장 슬롯 지원
- **서버 연동**: 게임 진행 상태를 백엔드에 저장
- **자동 저장**: 중요한 선택지에서 자동 저장
- **미리보기**: 저장 슬롯의 미리보기 텍스트 표시
- **상태 복원**: 배경 이미지, 캐릭터 이미지, 호감도 등 완전 복원

### 6. 미디어 시스템
- **배경 이미지**: 각 장면별 고유 배경 (77개)
- **캐릭터 이미지**: 다양한 표정과 포즈 (77개)
- **BGM**: 장면에 맞는 배경음악 (5개)
- **효과음**: 타자기, 카카오톡 알림 등 (4개)
- **동적 로딩**: 필요한 리소스만 동적으로 로드

### 7. 설정 시스템
- **BGM 볼륨**: 배경음악 볼륨 조절
- **효과음 볼륨**: 효과음 볼륨 조절
- **음성 볼륨**: 음성 볼륨 조절
- **텍스트 속도**: 대화 텍스트 표시 속도 조절
- **스킵 모드**: 대화 스킵 기능

---

## 🧩 핵심 컴포넌트

### 1. App.tsx
- **역할**: 메인 앱 컴포넌트, 화면 라우팅
- **기능**:
  - 화면 전환 관리 (login, register, start, game, saveLoad, settings, debug)
  - 스크립트 자동 로드
  - 자동 로그인 처리
  - 에러 처리

### 2. GameScreen.tsx
- **역할**: 메인 게임 화면
- **기능**:
  - 게임 엔진과 연동
  - 배경/캐릭터 표시
  - 대화 박스 표시
  - 선택지 모달 표시
  - 컨트롤 패널 표시
  - 키보드 단축키 처리

### 3. gameStore.ts (Zustand)
- **역할**: 전역 상태 관리
- **주요 상태**:
  - `currentScreen`: 현재 화면
  - `gameState`: 게임 상태 (씬 ID, 대화 인덱스, 히스토리 등)
  - `affections`: 캐릭터별 호감도
  - `kakaoTalkHistory`: 카카오톡 대화 히스토리
  - `systemHistory`: 시스템 메시지 히스토리
  - `settings`: 게임 설정
- **주요 액션**:
  - `nextDialogue()`: 다음 대화로 이동
  - `previousDialogue()`: 이전 대화로 이동
  - `goToScene()`: 특정 씬으로 이동
  - `updateAffection()`: 호감도 업데이트
  - `saveGame()`: 게임 저장
  - `loadGame()`: 게임 불러오기

### 4. useGameEngine.ts
- **역할**: 게임 엔진 로직
- **기능**:
  - 현재 대화 계산
  - 시나리오 아이템 처리
  - 이미지 상태 관리
  - 선택지 처리
  - 호감도 계산
  - 게임 결과 처리

### 5. api.ts
- **역할**: 백엔드 API 통신
- **주요 함수**:
  - `login()`: 로그인
  - `register()`: 회원가입
  - `loginWithGoogle()`: 구글 로그인
  - `fetchGameScript()`: 게임 스크립트 가져오기
  - `saveToSlot()`: 게임 저장
  - `loadFromSlot()`: 게임 불러오기
  - `updateAffection()`: 호감도 업데이트
  - `fetchCurrentUser()`: 현재 사용자 정보 가져오기

---

## 🔄 상태 관리

### Zustand Store 구조

```typescript
interface GameStore {
  // 기본 상태
  currentScreen: ScreenType;
  gameState: GameState;
  heroName: string;
  affections: Record<string, number>;
  kakaoTalkHistory: any[];
  systemHistory: any[];
  previousValues: any;
  settings: Settings;
  isAuthenticated: boolean;
  user: { nickname?: string } | null;

  // 액션
  setCurrentScreen: (screen: ScreenType) => void;
  nextDialogue: () => void;
  previousDialogue: () => void;
  goToScene: (sceneId: string) => void;
  updateAffection: (id: string, val: number) => Promise<void>;
  saveGame: (slotIndex: number, preview?: string) => Promise<void>;
  loadGame: (slotIndex: number) => Promise<void>;
  // ...
}
```

### 상태 흐름

1. **게임 시작**: `loadScript()` → `gameEvents` 로드
2. **대화 진행**: `nextDialogue()` → `currentDialogueIndex` 증가
3. **선택지 선택**: `selectChoice()` → `goToScene()` → 새로운 씬으로 이동
4. **호감도 업데이트**: `updateAffection()` → 로컬 상태 + 백엔드 동기화
5. **게임 저장**: `saveGame()` → 백엔드에 게임 상태 저장
6. **게임 불러오기**: `loadGame()` → 백엔드에서 게임 상태 불러오기

---

## 🌐 API 통신

### API 클라이언트 구조

```typescript
// 기본 API 클라이언트
const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true
): Promise<ApiResponse<T>>
```

### 주요 API 엔드포인트

#### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/google` - 구글 로그인
- `POST /api/auth/logout` - 로그아웃

#### 게임 데이터
- `GET /api/script/events` - 게임 스크립트 가져오기
- `GET /api/users/me` - 현재 사용자 정보

#### 호감도
- `GET /api/affection/all` - 모든 호감도 가져오기
- `GET /api/affection/{id}` - 특정 캐릭터 호감도
- `POST /api/affection/{id}` - 호감도 업데이트
- `POST /api/affection/bulk` - 호감도 일괄 업데이트

#### 저장/불러오기
- `GET /api/save/slots` - 저장 슬롯 목록
- `POST /api/save/slots` - 게임 저장
- `GET /api/save/slots/{slotNumber}` - 게임 불러오기
- `DELETE /api/save/slots/{slotNumber}` - 저장 슬롯 삭제

#### 미니게임
- `GET /api/minigame/scores` - 미니게임 점수 가져오기
- `POST /api/minigame/score` - 미니게임 점수 저장

### 에러 처리
- **401 Unauthorized**: 토큰 만료 시 자동 로그아웃
- **네트워크 에러**: 사용자에게 친화적인 에러 메시지 표시
- **리다이렉트 감지**: OAuth 리다이렉트 자동 처리

---

## 🎯 게임 엔진

### useGameEngine Hook

게임의 핵심 로직을 담당하는 커스텀 훅입니다.

#### 주요 기능

1. **현재 대화 계산**
   ```typescript
   const currentDialogue = useMemo(() => {
     // 현재 씬과 대화 인덱스로 대화 계산
   }, [gameState, gameEvents]);
   ```

2. **시나리오 아이템 처리**
   - 배경 이미지 변경
   - 캐릭터 이미지 변경
   - BGM 재생/정지
   - 효과음 재생
   - 카카오톡 메시지 추가
   - 시스템 메시지 추가

3. **선택지 처리**
   - 선택지에 따른 호감도 변화 계산
   - 다음 씬으로 이동
   - 점수 적용

4. **게임 결과 처리**
   - 미니게임 승리/패배에 따른 분기
   - 호감도 변화 적용

### 게임 데이터 구조

```typescript
interface GameEvent {
  chapter_id: string;        // 챕터 ID
  next_scene_id: string;     // 다음 씬 ID
  event: number;             // 이벤트 번호
  scenario: ScenarioItem[];  // 시나리오 아이템 배열
}

interface ScenarioItem {
  id: string;
  script: string;            // 대화 텍스트
  character_id?: string;     // 캐릭터 ID
  type: ScenarioType;        // 대화 타입
  background_image_id?: string;
  character_image_id?: { 1?: string; 2?: string; 3?: string; };
  options?: Choice[];        // 선택지
  game?: GameConfig;         // 미니게임 설정
}
```

---

## 🎨 UI/UX 특징

### 1. 반응형 디자인
- 전체 화면 레이아웃
- 다양한 해상도 지원
- 모바일 대응 가능

### 2. 애니메이션
- 타이핑 애니메이션: 대화 텍스트가 타이핑되는 효과
- 페이드 인/아웃: 씬 전환 시 페이드 효과
- 모달 애니메이션: 모달 등장/사라짐 애니메이션

### 3. 키보드 단축키
- `Space`: 다음 대화
- `Ctrl+S`: 저장
- `Ctrl+L`: 불러오기
- `ESC`: 설정 화면
- `←`: 이전 대화

### 4. 시각적 피드백
- 호감도 변화 시 토스트 알림
- 저장/불러오기 성공 시 알림
- 에러 발생 시 친화적인 메시지

### 5. 카카오톡 UI
- 실제 카카오톡과 유사한 UI
- 채팅방별 히스토리 관리
- 메시지 타입별 스타일링

---

## ⚡ 성능 최적화

### 1. 코드 스플리팅
- 동적 import를 통한 코드 분할
- 필요한 컴포넌트만 로드

### 2. 이미지 최적화
- 필요한 이미지만 동적 로드
- 이미지 경로 캐싱

### 3. 상태 관리 최적화
- Zustand의 선택적 구독
- useMemo를 통한 불필요한 재계산 방지

### 4. 스크립트 로딩
- 로컬 데이터 우선 로드 (즉시 게임 시작 가능)
- 백엔드 동기화는 백그라운드에서 처리

### 5. 사운드 관리
- 사운드 캐싱
- 불필요한 사운드 정리
- BGM 자동 정지

---

## 📊 주요 통계

- **총 코드 라인 수**: 약 10,000+ 줄
- **컴포넌트 수**: 20+ 개
- **화면 수**: 7개
- **게임 스크립트**: 6,969줄
- **배경 이미지**: 77개
- **캐릭터 이미지**: 77개
- **BGM**: 5개
- **효과음**: 4개

---

## 🔧 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 환경 변수
```env
VITE_API_BASE_URL=http://lovealgorithmgame.site:8081/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🚀 배포

### Vercel 배포
- Vercel에 자동 배포 설정
- 환경 변수 설정 필요
- 빌드 명령: `npm run build`
- 출력 디렉토리: `dist`

### Docker 배포
- `Dockerfile.frontend` 제공
- Nginx를 통한 정적 파일 서빙

---

## 📝 향후 개선 사항

1. **성능 최적화**
   - 이미지 lazy loading
   - 코드 스플리팅 개선
   - 메모리 사용량 최적화

2. **기능 추가**
   - 다국어 지원
   - 더 많은 미니게임
   - 업적 시스템

3. **UX 개선**
   - 더 부드러운 애니메이션
   - 접근성 개선
   - 모바일 최적화

---

## 🎓 학습한 내용

1. **React 19 최신 기능 활용**
   - Hooks 패턴
   - Custom Hooks 설계

2. **TypeScript 타입 시스템**
   - 복잡한 타입 정의
   - 타입 안정성 확보

3. **상태 관리**
   - Zustand를 통한 경량 상태 관리
   - 전역 상태와 로컬 상태의 균형

4. **API 통신**
   - RESTful API 설계
   - 에러 처리 및 재시도 로직

5. **게임 엔진 설계**
   - 복잡한 게임 로직의 구조화
   - 상태 머신 패턴

---

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**발표 준비 완료!** 🎉

