# Nginx HTTPS 설정 가이드

백엔드 서버에 Nginx를 설치하고 HTTPS를 설정하는 방법입니다.

## 1단계: Nginx 설치

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install nginx -y
```

### CentOS/RHEL
```bash
sudo yum install epel-release -y
sudo yum install nginx -y
```

### 설치 확인
```bash
nginx -v
sudo systemctl status nginx
```

## 2단계: SSL 인증서 발급 (Let's Encrypt)

### Certbot 설치
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

### SSL 인증서 발급
```bash
sudo certbot --nginx -d lovealgorithmgame.site
```

인증 과정에서:
- 이메일 주소 입력
- 약관 동의 (Y)
- 이메일 수신 동의 (선택, N 가능)
- 도메인 확인 (자동)

## 3단계: Nginx 설정 파일 생성

### 설정 파일 생성
```bash
sudo nano /etc/nginx/sites-available/lovealgorithmgame
```

### 설정 내용 (HTTPS + 백엔드 프록시)

```nginx
# HTTP를 HTTPS로 리다이렉트
server {
    listen 80;
    server_name lovealgorithmgame.site;

    # Let's Encrypt 인증을 위한 경로
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # 모든 HTTP 요청을 HTTPS로 리다이렉트
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 서버 설정
server {
    listen 443 ssl http2;
    server_name lovealgorithmgame.site;

    # SSL 인증서 경로 (Let's Encrypt가 자동으로 설정)
    ssl_certificate /etc/letsencrypt/live/lovealgorithmgame.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lovealgorithmgame.site/privkey.pem;

    # SSL 설정 (보안 강화)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 백엔드 API 프록시
    location /api {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # CORS 헤더 (필요시)
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        # OPTIONS 요청 처리
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # 정적 파일 서빙 (프론트엔드가 같은 서버에 있는 경우)
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # 로그 설정
    access_log /var/log/nginx/lovealgorithmgame_access.log;
    error_log /var/log/nginx/lovealgorithmgame_error.log;
}
```

## 4단계: 설정 파일 활성화

### 심볼릭 링크 생성
```bash
sudo ln -s /etc/nginx/sites-available/lovealgorithmgame /etc/nginx/sites-enabled/
```

### 기본 설정 비활성화 (선택사항)
```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 설정 파일 검증
```bash
sudo nginx -t
```

출력 예시:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: the configuration file /etc/nginx/nginx.conf test is successful
```

## 5단계: Nginx 재시작

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

## 6단계: 방화벽 설정

### UFW (Ubuntu)
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
sudo ufw status
```

### firewalld (CentOS/RHEL)
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 7단계: SSL 인증서 자동 갱신 설정

Let's Encrypt 인증서는 90일마다 갱신해야 합니다.

### 자동 갱신 테스트
```bash
sudo certbot renew --dry-run
```

### Cron 작업 추가 (자동 갱신)
```bash
sudo crontab -e
```

다음 줄 추가:
```
0 0,12 * * * certbot renew --quiet
```

## 8단계: 백엔드 Spring Boot 설정 확인

### application.properties 확인
백엔드가 `localhost:8081`에서 실행 중인지 확인:

```properties
server.port=8081
```

### 백엔드 실행 확인
```bash
# 백엔드가 실행 중인지 확인
sudo netstat -tlnp | grep 8081
# 또는
sudo ss -tlnp | grep 8081
```

## 9단계: Vercel 환경 변수 업데이트

Vercel 대시보드에서:
1. Settings > Environment Variables
2. `VITE_API_BASE_URL` 값을 다음으로 변경:
   ```
   https://lovealgorithmgame.site/api
   ```
3. 재배포

## 10단계: 테스트

### HTTPS 연결 테스트
```bash
curl https://lovealgorithmgame.site/api/script
```

### 브라우저에서 테스트
1. `https://lovealgorithmgame.site/api/script` 접속
2. JSON 응답이 나오는지 확인

### 프론트엔드에서 테스트
1. Vercel 배포 URL 접속
2. 브라우저 개발자 도구 > Network 탭 확인
3. API 요청이 HTTPS로 가는지 확인

## 문제 해결

### Nginx가 시작되지 않을 때
```bash
sudo nginx -t  # 설정 파일 검증
sudo journalctl -u nginx -n 50  # 로그 확인
```

### SSL 인증서 발급 실패
- 도메인이 서버 IP를 가리키는지 확인
- 방화벽에서 80, 443 포트가 열려있는지 확인
- DNS 설정 확인: `nslookup lovealgorithmgame.site`

### 백엔드 연결 실패
```bash
# 백엔드가 실행 중인지 확인
curl http://localhost:8081/api/script

# Nginx 로그 확인
sudo tail -f /var/log/nginx/lovealgorithmgame_error.log
```

### 502 Bad Gateway 오류
- 백엔드가 `localhost:8081`에서 실행 중인지 확인
- 백엔드 로그 확인

## 추가 보안 설정

### Rate Limiting 추가
```nginx
# nginx.conf의 http 블록에 추가
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

# server 블록의 location /api에 추가
limit_req zone=api_limit burst=20;
```

### 보안 헤더 추가
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## 완료 체크리스트

- [ ] Nginx 설치 완료
- [ ] SSL 인증서 발급 완료
- [ ] Nginx 설정 파일 생성 및 활성화
- [ ] Nginx 재시작 성공
- [ ] 방화벽 설정 완료
- [ ] HTTPS 연결 테스트 성공
- [ ] 백엔드 API 프록시 동작 확인
- [ ] Vercel 환경 변수 업데이트
- [ ] 프론트엔드에서 API 호출 성공

## 참고 자료

- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [Let's Encrypt 문서](https://letsencrypt.org/docs/)
- [Certbot 문서](https://certbot.eff.org/)
