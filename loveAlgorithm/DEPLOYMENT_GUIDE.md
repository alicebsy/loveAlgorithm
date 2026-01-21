# 배포 가이드 (Deployment Guide)

이 문서는 Love Algorithm 프로젝트의 프론트엔드와 백엔드를 배포하는 방법을 설명합니다.

## 목차
1. [프론트엔드 배포](#프론트엔드-배포)
2. [백엔드 배포](#백엔드-배포)
3. [환경 변수 설정](#환경-변수-설정)
4. [배포 플랫폼별 가이드](#배포-플랫폼별-가이드)

---

## 프론트엔드 배포

### 1. 빌드 전 확인 사항

#### 1.1 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 프로덕션 백엔드 API URL
VITE_API_BASE_URL=http://lovealgorithmgame.site:8081/api

# Google OAuth 클라이언트 ID (사용하는 경우)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**중요**: 
- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- 배포 플랫폼에서 환경 변수를 직접 설정해야 합니다.

#### 1.2 API URL 확인
`src/services/api.ts`에서 환경 변수를 올바르게 사용하는지 확인:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://lovealgorithmgame.site:8081/api';
```

### 2. 프로덕션 빌드

```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build
```

빌드가 완료되면 `dist/` 폴더에 정적 파일들이 생성됩니다.

### 3. 빌드 결과 확인

```bash
# 빌드 결과 미리보기
npm run preview
```

브라우저에서 `http://localhost:4173`으로 접속하여 빌드된 결과를 확인할 수 있습니다.

### 4. 정적 파일 서빙

`dist/` 폴더의 내용을 정적 파일 서버에 업로드하면 됩니다.

#### 4.1 Nginx 설정 예시
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # SPA 라우팅 지원
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 정적 파일 캐싱
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 4.2 Apache 설정 예시
`.htaccess` 파일을 `dist/` 폴더에 생성:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 백엔드 배포

### 1. 빌드 전 확인 사항

#### 1.1 데이터베이스 설정
`application.properties` 또는 `application.yml`에서 데이터베이스 연결 정보를 확인하세요:

```properties
# application.properties 예시
spring.datasource.url=jdbc:mysql://your-db-host:3306/love_algorithm
spring.datasource.username=your_username
spring.datasource.password=your_password
```

#### 1.2 CORS 설정 확인
프로덕션 도메인을 CORS 허용 목록에 추가해야 합니다:

```java
@CrossOrigin(origins = {
    "http://localhost:5175",  // 개발 환경
    "http://lovealgorithmgame.site"  // 프로덕션 환경 (프론트엔드 도메인)
})
```

또는 `SecurityConfig`에서:
```java
corsConfiguration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5175",
    "http://lovealgorithmgame.site"
));
```

#### 1.3 JWT 시크릿 키 확인
프로덕션 환경에서는 강력한 JWT 시크릿 키를 사용해야 합니다:

```properties
jwt.secret=your-production-secret-key-here
```

### 2. Spring Boot 빌드

#### Maven 사용 시:
```bash
mvn clean package -DskipTests
```

#### Gradle 사용 시:
```bash
./gradlew clean build -x test
```

빌드 결과물은 `target/` (Maven) 또는 `build/libs/` (Gradle) 폴더에 생성됩니다.

### 3. JAR 파일 실행

```bash
java -jar target/love-algorithm-0.0.1-SNAPSHOT.jar
```

또는 환경 변수와 함께:
```bash
java -jar -Dspring.profiles.active=prod \
  -Dspring.datasource.url=jdbc:mysql://your-db-host:3306/love_algorithm \
  -Dspring.datasource.username=your_username \
  -Dspring.datasource.password=your_password \
  target/love-algorithm-0.0.1-SNAPSHOT.jar
```

### 4. 프로덕션 프로파일 설정

`application-prod.properties` 파일 생성:
```properties
spring.datasource.url=jdbc:mysql://your-db-host:3306/love_algorithm
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}

logging.level.root=INFO
logging.level.com.madcamp.love_algorithm=DEBUG
```

---

## 환경 변수 설정

### 프론트엔드 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `VITE_API_BASE_URL` | 백엔드 API 기본 URL | `https://api.yourdomain.com/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | `123456789-abc.apps.googleusercontent.com` |

### 백엔드 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DB_HOST` | 데이터베이스 호스트 | `your-db-host.com` |
| `DB_PORT` | 데이터베이스 포트 | `3306` |
| `DB_NAME` | 데이터베이스 이름 | `love_algorithm` |
| `DB_USERNAME` | 데이터베이스 사용자명 | `db_user` |
| `DB_PASSWORD` | 데이터베이스 비밀번호 | `secure_password` |
| `JWT_SECRET` | JWT 시크릿 키 | `your-secret-key` |

---

## 배포 플랫폼별 가이드

### 1. Vercel (프론트엔드) - **가장 쉬운 방법!**

**자세한 가이드는 `VERCEL_DEPLOY.md` 파일을 참고하세요.**

1. [Vercel](https://vercel.com)에 로그인 (GitHub 계정 권장)
2. "Add New..." > "Project" 클릭
3. Git 저장소 연결 (GitHub/GitLab/Bitbucket)
4. 프로젝트 선택 후 "Import" 클릭
5. 환경 변수 설정:
   - `VITE_API_BASE_URL`: `http://lovealgorithmgame.site:8081/api`
   - `VITE_GOOGLE_CLIENT_ID`: Google 클라이언트 ID
6. "Deploy" 클릭

**빌드 설정** (자동 감지됨):
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- `vercel.json` 파일이 있으면 자동으로 적용됨

**배포 후**:
- Vercel에서 배포 URL 확인 (예: `https://your-project.vercel.app`)
- 백엔드 CORS 설정에 Vercel URL 추가 필요
- Google OAuth에 Vercel URL 추가 필요

### 2. Netlify (프론트엔드)

1. [Netlify](https://netlify.com)에 로그인
2. "New site from Git" 클릭
3. Git 저장소 연결
4. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 환경 변수 설정 (Site settings > Environment variables)
6. "Deploy site" 클릭

### 3. AWS EC2 (백엔드)

1. EC2 인스턴스 생성
2. Java 설치:
   ```bash
   sudo yum install java-17-amazon-corretto-headless
   ```
3. JAR 파일 업로드:
   ```bash
   scp target/love-algorithm.jar user@your-server:/app/
   ```
4. 실행:
   ```bash
   java -jar /app/love-algorithm.jar
   ```
5. Systemd 서비스로 등록 (선택사항):
   ```ini
   [Unit]
   Description=Love Algorithm Backend
   After=network.target

   [Service]
   Type=simple
   User=your-user
   ExecStart=/usr/bin/java -jar /app/love-algorithm.jar
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

### 4. Heroku (프론트엔드 + 백엔드)

#### 프론트엔드:
1. `package.json`에 다음 스크립트 추가:
   ```json
   "scripts": {
     "start": "vite preview --port $PORT --host"
   }
   ```
2. Heroku CLI로 배포:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

#### 백엔드:
1. `Procfile` 생성:
   ```
   web: java -jar target/love-algorithm.jar
   ```
2. 환경 변수 설정:
   ```bash
   heroku config:set DB_URL=your-db-url
   heroku config:set JWT_SECRET=your-secret
   ```
3. 배포:
   ```bash
   git push heroku main
   ```

### 5. Docker (선택사항)

#### 프론트엔드 Dockerfile:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 백엔드 Dockerfile:
```dockerfile
FROM openjdk:17-jdk-slim AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jre-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 배포 체크리스트

### 프론트엔드
- [ ] `.env` 파일에 프로덕션 API URL 설정
- [ ] Google OAuth 클라이언트 ID 설정 (사용하는 경우)
- [ ] `npm run build` 성공 확인
- [ ] `npm run preview`로 빌드 결과 확인
- [ ] 정적 파일 서버 설정 (SPA 라우팅 지원)
- [ ] CORS 설정 확인 (백엔드에서 프론트엔드 도메인 허용)

### 백엔드
- [ ] 데이터베이스 연결 정보 설정
- [ ] JWT 시크릿 키 설정
- [ ] CORS 설정에 프론트엔드 도메인 추가
- [ ] 프로덕션 프로파일 설정
- [ ] 빌드 성공 확인
- [ ] JAR 파일 실행 테스트
- [ ] 로그 설정 확인

### 공통
- [ ] 환경 변수 보안 확인 (민감 정보 노출 방지)
- [ ] HTTPS 설정 (프로덕션)
- [ ] 도메인 연결 확인
- [ ] 모니터링 및 로깅 설정

---

## 문제 해결

### CORS 에러
- 백엔드의 CORS 설정에서 프론트엔드 도메인을 허용했는지 확인
- 브라우저 콘솔에서 정확한 에러 메시지 확인

### API 연결 실패
- `VITE_API_BASE_URL` 환경 변수가 올바르게 설정되었는지 확인
- 네트워크 탭에서 실제 요청 URL 확인
- 백엔드 서버가 실행 중인지 확인

### 빌드 실패
- Node.js 버전 확인 (권장: 18 이상)
- `node_modules` 삭제 후 `npm install` 재실행
- 빌드 로그에서 구체적인 에러 메시지 확인

---

## 추가 리소스

- [Vite 배포 가이드](https://vite.dev/guide/static-deploy.html)
- [Spring Boot 배포 가이드](https://spring.io/guides/gs/spring-boot-for-azure/)
- [Nginx 설정 가이드](https://nginx.org/en/docs/)
