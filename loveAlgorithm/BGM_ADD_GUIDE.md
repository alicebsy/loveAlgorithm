# BGM 추가 가이드

## BGM 파일 추가 방법

### 1. 폴더 구조 확인 및 생성

BGM 파일은 다음 경로에 저장해야 합니다:
```
public/sounds/bgm/
```

현재 `public` 폴더에 `sounds` 폴더가 없다면 생성하세요:
```bash
mkdir -p public/sounds/bgm
mkdir -p public/sounds/sfx  # 효과음도 함께 생성
```

### 2. BGM 파일 추가

1. **BGM 파일 준비**
   - 파일 형식: `.mp3` (권장) 또는 `.wav`, `.ogg`
   - 파일 이름: 영문과 숫자, 언더스코어(`_`)만 사용 (예: `romantic_bgm.mp3`)
   - 파일 크기: 가능하면 최적화된 파일 사용

2. **파일 위치**
   ```
   public/sounds/bgm/your_bgm_name.mp3
   ```

   예시:
   ```
   public/sounds/bgm/morning_ambience.mp3
   public/sounds/bgm/romantic.mp3
   public/sounds/bgm/serious1.mp3
   ```

### 3. constants.ts에 BGM ID 추가

`src/data/constants.ts` 파일의 `backgroundSoundId` 객체에 새로운 BGM ID를 추가하세요:

```typescript
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
  keyboard_typing: 'keyboard',
  // 여기에 새로운 BGM 추가
  your_new_bgm: 'your_new_bgm',  // 파일명에서 .mp3 확장자 제거
} as const;
```

**중요**: 
- 키 이름(왼쪽): 코드에서 사용할 ID (예: `your_new_bgm`)
- 값(오른쪽): 파일명에서 확장자를 제거한 이름 (예: `your_new_bgm.mp3` → `'your_new_bgm'`)

### 4. 게임 스크립트에서 BGM 사용

#### 방법 1: script.ts에서 사용

`src/data/script.ts` 파일의 시나리오 아이템에 `background_sound_id` 필드를 추가:

```typescript
{
  id: 'chapter1_scene1_0',
  index: 0,
  script: '대사 내용',
  background_image_id: 'dohoon_room.png',
  background_sound_id: 'your_new_bgm',  // 여기에 추가
  // ... 기타 필드
}
```

#### 방법 2: InitialLoader.java에서 사용

백엔드의 `InitialLoader.java`에서도 동일하게 사용:

```java
scripts.add(createScript(
    sceneId, 
    index, 
    ScriptType.TEXT, 
    characterId, 
    script, 
    backgroundImageId,
    characterImageId,
    "your_new_bgm",  // background_sound_id
    effectSoundId,
    overlayImageId
));
```

## 예시: 새로운 BGM 추가하기

### 예시 1: "peaceful_morning.mp3" 추가

1. **파일 추가**
   ```
   public/sounds/bgm/peaceful_morning.mp3
   ```

2. **constants.ts 수정**
   ```typescript
   export const backgroundSoundId = {
     // ... 기존 항목들
     peaceful_morning: 'peaceful_morning',
   } as const;
   ```

3. **script.ts에서 사용**
   ```typescript
   {
     id: 'chapter1_scene1_0',
     index: 0,
     script: '아침에 일어났다.',
     background_sound_id: 'peaceful_morning',
     // ...
   }
   ```

### 예시 2: "battle_theme.mp3" 추가

1. **파일 추가**
   ```
   public/sounds/bgm/battle_theme.mp3
   ```

2. **constants.ts 수정**
   ```typescript
   export const backgroundSoundId = {
     // ... 기존 항목들
     battle_theme: 'battle_theme',
   } as const;
   ```

3. **script.ts에서 사용**
   ```typescript
   {
     id: 'chapter2_scene1_0',
     index: 0,
     script: '전투가 시작된다!',
     background_sound_id: 'battle_theme',
     // ...
   }
   ```

## 파일명 규칙

- ✅ **좋은 예**:
  - `morning_ambience.mp3`
  - `romantic_bgm.mp3`
  - `battle_theme.mp3`
  - `peaceful_morning.mp3`

- ❌ **나쁜 예**:
  - `아침 배경음.mp3` (한글 사용)
  - `morning bgm.mp3` (공백 사용)
  - `morning-bgm.mp3` (하이픈 사용 - 가능하지만 언더스코어 권장)
  - `Morning BGM.mp3` (대문자 사용)

## BGM 파일 형식 권장사항

1. **MP3**: 가장 권장 (호환성 좋음, 파일 크기 작음)
2. **OGG**: 브라우저 호환성 좋음
3. **WAV**: 고품질이지만 파일 크기가 큼

## 확인 방법

1. 브라우저 개발자 도구 콘솔 확인
   - BGM이 재생되면 로그가 없음
   - 파일을 찾을 수 없으면 경고 메시지 표시:
     ```
     ⚠️ BGM 파일을 찾을 수 없습니다: /sounds/bgm/your_bgm_name.mp3
     ```

2. 네트워크 탭 확인
   - 개발자 도구 → Network 탭
   - BGM 파일이 로드되는지 확인

3. 게임에서 확인
   - 해당 대사로 진행했을 때 BGM이 재생되는지 확인
   - BGM이 반복 재생되는지 확인 (BGM은 자동으로 loop됩니다)

## 문제 해결

### BGM이 재생되지 않는 경우

1. **파일 경로 확인**
   - 파일이 `public/sounds/bgm/` 폴더에 있는지 확인
   - 파일명이 정확한지 확인 (대소문자 구분)

2. **파일 형식 확인**
   - MP3 파일이 손상되지 않았는지 확인
   - 다른 플레이어에서 재생되는지 확인

3. **코드 확인**
   - `constants.ts`에 BGM ID가 추가되었는지 확인
   - `script.ts`에서 `background_sound_id`가 올바르게 설정되었는지 확인

4. **브라우저 콘솔 확인**
   - 에러 메시지가 있는지 확인
   - 파일 로드 실패 메시지 확인

### BGM이 계속 재생되는 경우

- 정상 동작입니다. BGM은 자동으로 반복 재생됩니다.
- 다른 BGM이 재생되면 이전 BGM은 자동으로 정지됩니다.

## 추가 팁

1. **볼륨 조절**: 사용자가 설정에서 BGM 볼륨을 조절할 수 있습니다.
2. **BGM 정지**: 특정 대사에서 BGM을 정지하려면 `background_sound_id`를 `null` 또는 빈 문자열로 설정하세요.
3. **효과음 추가**: 효과음도 동일한 방식으로 `public/sounds/sfx/` 폴더에 추가하고 `effectSoundId`에 등록하세요.
