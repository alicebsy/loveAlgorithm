# 구글 로그인 설정 가이드

## 1. 패키지 설치

터미널에서 다음 명령어를 실행하세요:

```bash
npm install @react-oauth/google
```

## 2. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "사용자 인증 정보"로 이동
4. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID" 선택
5. 애플리케이션 유형: "웹 애플리케이션"
6. 승인된 JavaScript 원본: 
   - 개발 환경: `http://localhost:5175`
   - 프로덕션 환경: `http://lovealgorithmgame.site` (프론트엔드 도메인)
7. 승인된 리디렉션 URI:
   - 개발 환경: `http://localhost:5175`
   - 프로덕션 환경: `http://lovealgorithmgame.site` (프론트엔드 도메인)
8. 클라이언트 ID 복사

## 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음을 추가:

```
VITE_GOOGLE_CLIENT_ID=여기에_복사한_클라이언트_ID_붙여넣기
```

## 4. 백엔드 API 엔드포인트

백엔드에 다음 엔드포인트를 추가해야 합니다:

```
POST /api/auth/google
Body: { "token": "구글_액세스_토큰" }
Response: { "success": true, "data": { "token": "JWT_토큰" } }
```

백엔드에서 구글 토큰을 검증하고 사용자 정보를 가져온 후, JWT 토큰을 발급해야 합니다.
