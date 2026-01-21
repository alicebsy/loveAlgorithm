# 도메인 설정 가이드

프로젝트가 `http://lovealgorithmgame.site:8081` 도메인으로 배포되었습니다.

## 도메인 정보

- **백엔드 API**: `http://lovealgorithmgame.site:8081/api`
- **프론트엔드**: `http://lovealgorithmgame.site` (또는 별도 포트)

## 필수 설정 사항

### 1. 프론트엔드 환경 변수

프로젝트 루트에 `.env` 파일 생성:

```env
VITE_API_BASE_URL=http://lovealgorithmgame.site:8081/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 2. 백엔드 CORS 설정

백엔드의 `SecurityConfig` 또는 `@CrossOrigin` 어노테이션에 프론트엔드 도메인 추가:

```java
@CrossOrigin(origins = {
    "http://localhost:5175",  // 개발 환경
    "http://lovealgorithmgame.site"  // 프로덕션 환경
})
```

또는 `SecurityConfig`에서:

```java
corsConfiguration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5175",
    "http://lovealgorithmgame.site"
));
```

### 3. Google OAuth 설정

Google Cloud Console에서 OAuth 클라이언트 설정:

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. "API 및 서비스" > "사용자 인증 정보" 이동
3. OAuth 클라이언트 ID 편집
4. **승인된 JavaScript 원본**에 추가:
   - `http://localhost:5175` (개발)
   - `http://lovealgorithmgame.site` (프로덕션)
5. **승인된 리디렉션 URI**에 추가:
   - `http://localhost:5175` (개발)
   - `http://lovealgorithmgame.site` (프로덕션)

### 4. 데이터베이스 연결 확인

백엔드 `application.properties` 또는 환경 변수에서 데이터베이스 연결 정보 확인:

```properties
spring.datasource.url=jdbc:mysql://your-db-host:3306/love_algorithm
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 배포 후 확인 사항

### 프론트엔드
- [ ] `.env` 파일에 올바른 API URL 설정
- [ ] `npm run build` 성공 확인
- [ ] 브라우저에서 API 연결 확인 (Network 탭)

### 백엔드
- [ ] CORS 설정에 프론트엔드 도메인 추가 확인
- [ ] Google OAuth 리다이렉트 URI 설정 확인
- [ ] 데이터베이스 연결 확인
- [ ] 서버가 `lovealgorithmgame.site:8081`에서 실행 중인지 확인

## 문제 해결

### CORS 에러
```
Access to fetch at 'http://lovealgorithmgame.site:8081/api/...' from origin 'http://lovealgorithmgame.site' has been blocked by CORS policy
```

**해결**: 백엔드 CORS 설정에 `http://lovealgorithmgame.site` 추가

### Google OAuth 에러
```
Error 400: redirect_uri_mismatch
```

**해결**: Google Cloud Console에서 리디렉션 URI에 `http://lovealgorithmgame.site` 추가

### API 연결 실패
- 브라우저 콘솔에서 실제 요청 URL 확인
- Network 탭에서 응답 상태 코드 확인
- 백엔드 서버 로그 확인
