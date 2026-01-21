# Vercel 배포 가이드

이 가이드에 따라 프론트엔드를 Vercel에 배포하세요.

## 1단계: Vercel 계정 생성 및 프로젝트 준비

1. [Vercel](https://vercel.com)에 접속하여 계정 생성 (GitHub 계정으로 로그인 권장)
2. 프로젝트를 Git 저장소에 푸시 (GitHub, GitLab, Bitbucket 등)

## 2단계: Vercel에 프로젝트 연결

### 방법 1: Vercel 웹사이트에서 (추천)

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. "Add New..." > "Project" 클릭
3. Git 저장소 선택 (GitHub/GitLab/Bitbucket)
4. 프로젝트 선택 후 "Import" 클릭

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 디렉토리에서 실행
vercel

# 첫 배포 시
vercel --prod
```

## 3단계: 환경 변수 설정

Vercel 대시보드에서 환경 변수를 설정해야 합니다:

1. 프로젝트 설정 페이지로 이동
2. "Settings" > "Environment Variables" 클릭
3. 다음 환경 변수 추가:

| 이름 | 값 | 설명 |
|------|-----|------|
| `VITE_API_BASE_URL` | `http://lovealgorithmgame.site:8081/api` | 백엔드 API URL |
| `VITE_GOOGLE_CLIENT_ID` | `your_google_client_id` | Google OAuth 클라이언트 ID |

**중요**: 
- 환경 변수 추가 후 **반드시 재배포**해야 적용됩니다
- "Redeploy" 버튼을 클릭하거나 새 커밋을 푸시하면 자동 재배포됩니다

## 4단계: 빌드 설정 확인

Vercel은 `vercel.json` 파일을 자동으로 인식합니다. 다음 설정이 자동으로 적용됩니다:

- **Framework**: Vite (자동 감지)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA 라우팅**: 모든 요청을 `index.html`로 리다이렉트

## 5단계: 배포 확인

배포가 완료되면:

1. Vercel 대시보드에서 배포 URL 확인 (예: `https://your-project.vercel.app`)
2. 브라우저에서 접속하여 게임이 정상 작동하는지 확인
3. 개발자 도구(F12) > Network 탭에서 API 호출이 정상인지 확인

## 6단계: 커스텀 도메인 설정 (선택사항)

1. Vercel 대시보드 > 프로젝트 설정 > "Domains"
2. 원하는 도메인 입력 (예: `lovealgorithmgame.site`)
3. DNS 설정 안내에 따라 도메인 DNS 레코드 추가
4. SSL 인증서 자동 발급 (몇 분 소요)

## 7단계: 백엔드 CORS 설정 업데이트

프론트엔드가 배포되면 새로운 URL이 생깁니다. 백엔드의 CORS 설정을 업데이트해야 합니다:

### 백엔드 코드 수정

```java
@CrossOrigin(origins = {
    "http://localhost:5175",  // 개발 환경
    "http://lovealgorithmgame.site",  // 기존 도메인
    "https://your-project.vercel.app"  // Vercel 배포 URL
})
```

또는 `SecurityConfig`에서:

```java
corsConfiguration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5175",
    "http://lovealgorithmgame.site",
    "https://your-project.vercel.app"  // Vercel 배포 URL
));
```

## 8단계: Google OAuth 설정 업데이트

Google Cloud Console에서 OAuth 리디렉션 URI 추가:

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. "API 및 서비스" > "사용자 인증 정보" 이동
3. OAuth 클라이언트 ID 편집
4. **승인된 JavaScript 원본**에 추가:
   - `https://your-project.vercel.app`
5. **승인된 리디렉션 URI**에 추가:
   - `https://your-project.vercel.app`

## 자동 배포 설정

Git 저장소에 연결하면, 코드를 푸시할 때마다 자동으로 재배포됩니다:

```bash
git add .
git commit -m "Update code"
git push origin main
```

Vercel이 자동으로 감지하여 새 배포를 시작합니다.

## 문제 해결

### 빌드 실패
- Vercel 대시보드 > Deployments에서 빌드 로그 확인
- `package.json`의 빌드 스크립트 확인
- 환경 변수가 올바르게 설정되었는지 확인

### API 연결 실패
- 브라우저 콘솔에서 CORS 에러 확인
- 백엔드 CORS 설정에 Vercel URL이 추가되었는지 확인
- `VITE_API_BASE_URL` 환경 변수가 올바른지 확인

### 페이지 새로고침 시 404 에러
- `vercel.json`의 `rewrites` 설정이 올바른지 확인
- SPA 라우팅이 제대로 작동하는지 확인

## 배포 체크리스트

- [ ] Git 저장소에 코드 푸시 완료
- [ ] Vercel에 프로젝트 연결 완료
- [ ] 환경 변수 설정 완료 (`VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`)
- [ ] 첫 배포 성공 확인
- [ ] 브라우저에서 게임 정상 작동 확인
- [ ] 백엔드 CORS 설정에 Vercel URL 추가
- [ ] Google OAuth에 Vercel URL 추가
- [ ] 커스텀 도메인 설정 (선택사항)

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Vite 배포 가이드](https://vite.dev/guide/static-deploy.html#vercel)
