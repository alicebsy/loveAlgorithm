# 🚀 빠른 배포 가이드 (5분 안에 배포하기)

## 준비사항
- [ ] Git 저장소에 코드가 푸시되어 있음 (GitHub/GitLab/Bitbucket)
- [ ] Vercel 계정 (GitHub 계정으로 바로 가입 가능)

## 배포 단계

### 1단계: Vercel에 프로젝트 연결 (2분)

1. [https://vercel.com](https://vercel.com) 접속
2. "Sign Up" 또는 "Login" 클릭 (GitHub 계정 권장)
3. 대시보드에서 "Add New..." > "Project" 클릭
4. Git 저장소 선택 (GitHub/GitLab/Bitbucket)
5. 프로젝트 선택 후 "Import" 클릭

### 2단계: 환경 변수 설정 (1분)

프로젝트 설정 화면에서:

1. "Environment Variables" 섹션 찾기
2. 다음 변수 추가:

```
VITE_API_BASE_URL = http://lovealgorithmgame.site:8081/api
```

Google 로그인을 사용하는 경우:
```
VITE_GOOGLE_CLIENT_ID = your_google_client_id_here
```

3. "Save" 클릭

### 3단계: 배포 시작 (1분)

1. "Deploy" 버튼 클릭
2. 빌드 완료까지 2-3분 대기
3. 배포 완료 후 URL 확인 (예: `https://your-project.vercel.app`)

### 4단계: 백엔드 설정 업데이트 (1분)

프론트엔드가 배포되면 백엔드 코드를 수정해야 합니다:

**백엔드 파일 찾기**: `SecurityConfig.java` 또는 `OAuth2SuccessHandler.java`

**수정할 내용**:
```java
// 기존
@CrossOrigin(origins = {"http://localhost:5175"})

// 수정 후 (Vercel URL 추가)
@CrossOrigin(origins = {
    "http://localhost:5175",
    "https://your-project.vercel.app"  // 여기에 Vercel URL 입력
})
```

**또는 SecurityConfig에서**:
```java
corsConfiguration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5175",
    "https://your-project.vercel.app"  // Vercel URL 추가
));
```

### 5단계: Google OAuth 설정 업데이트 (1분)

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. "API 및 서비스" > "사용자 인증 정보" 이동
3. OAuth 클라이언트 ID 클릭
4. **승인된 JavaScript 원본**에 추가:
   ```
   https://your-project.vercel.app
   ```
5. **승인된 리디렉션 URI**에 추가:
   ```
   https://your-project.vercel.app
   ```
6. "저장" 클릭

## ✅ 배포 완료!

이제 `https://your-project.vercel.app`에서 게임을 플레이할 수 있습니다!

## 자동 배포 설정

앞으로 코드를 수정하고 Git에 푸시하면 자동으로 재배포됩니다:

```bash
git add .
git commit -m "Update code"
git push origin main
```

Vercel이 자동으로 감지하여 새 배포를 시작합니다.

## 문제 해결

### 빌드 실패?
- Vercel 대시보드 > Deployments에서 빌드 로그 확인
- 빨간색 에러 메시지 확인

### API 연결 안 됨?
- 브라우저 콘솔(F12) 확인
- 백엔드 CORS 설정에 Vercel URL이 추가되었는지 확인

### Google 로그인 안 됨?
- Google Cloud Console에서 리디렉션 URI 확인
- Vercel URL이 추가되었는지 확인

## 더 자세한 가이드

- 상세 가이드: `VERCEL_DEPLOY.md` 참고
- 전체 배포 가이드: `DEPLOYMENT_GUIDE.md` 참고
