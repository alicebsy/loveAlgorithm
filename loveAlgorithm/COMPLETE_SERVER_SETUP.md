# 백엔드 서버 접속 및 Nginx 설치 완전 가이드

## 1단계: 서버 정보 확인

### 서버 IP 주소 확인
```bash
# 도메인의 IP 주소 확인
nslookup lovealgorithmgame.site
# 또는
dig +short lovealgorithmgame.site
# 또는
ping -c 1 lovealgorithmgame.site
```

### 서버 정보 확인 방법
1. **클라우드 서비스 대시보드 확인** (AWS, GCP, Azure 등)
2. **호스팅 제공업체에 문의**
3. **서버 관리자에게 문의**

## 2단계: SSH 접속 시도

### 방법 1: 일반적인 접속
```bash
# Ubuntu/Debian 서버
ssh ubuntu@lovealgorithmgame.site
# 또는
ssh root@lovealgorithmgame.site

# IP 주소로 접속 (IP를 알고 있는 경우)
ssh ubuntu@서버_IP_주소
```

### 방법 2: SSH 키 파일 사용 (AWS EC2 등)
```bash
# 키 파일 경로 확인 후
ssh -i ~/.ssh/your-key.pem ubuntu@lovealgorithmgame.site
# 또는
ssh -i /path/to/key.pem ubuntu@lovealgorithmgame.site
```

### 방법 3: 포트 지정
```bash
# 기본 포트가 22가 아닌 경우
ssh -p 포트번호 username@lovealgorithmgame.site
```

### 방법 4: 상세 정보 출력 (디버깅)
```bash
# 연결 문제 진단
ssh -v username@lovealgorithmgame.site
# 더 자세한 정보
ssh -vvv username@lovealgorithmgame.site
```

## 3단계: 접속 문제 해결

### 문제 1: "Connection refused" 오류
```bash
# 서버가 실행 중인지 확인
ping lovealgorithmgame.site

# 방화벽 확인 (로컬에서)
telnet lovealgorithmgame.site 22
```

### 문제 2: "Permission denied" 오류
- 사용자명 확인
- 비밀번호 확인
- SSH 키 파일 권한 확인: `chmod 400 /path/to/key.pem`

### 문제 3: "Host key verification failed"
```bash
# 기존 키 제거 후 재접속
ssh-keygen -R lovealgorithmgame.site
```

## 4단계: 서버 접속 성공 후 - 시스템 확인

### 현재 사용자 및 권한 확인
```bash
whoami
sudo -v  # sudo 권한 확인
```

### 서버 OS 확인
```bash
cat /etc/os-release
# 또는
lsb_release -a
```

### 백엔드 프로세스 확인
```bash
# Java 프로세스 확인
ps aux | grep java

# 포트 8081 사용 확인
sudo netstat -tlnp | grep 8081
# 또는
sudo ss -tlnp | grep 8081

# 백엔드가 실행 중이면 계속 진행
```

## 5단계: Nginx 설치

### Ubuntu/Debian 서버
```bash
# 패키지 목록 업데이트
sudo apt update

# Nginx 설치
sudo apt install nginx -y

# 설치 확인
nginx -v

# Nginx 상태 확인
sudo systemctl status nginx
```

### CentOS/RHEL 서버
```bash
# EPEL 저장소 추가
sudo yum install epel-release -y

# Nginx 설치
sudo yum install nginx -y

# Nginx 시작 및 자동 시작 설정
sudo systemctl start nginx
sudo systemctl enable nginx

# 상태 확인
sudo systemctl status nginx
```

### 설치 확인
```bash
# Nginx 버전 확인
nginx -v

# Nginx 실행 상태 확인
sudo systemctl status nginx

# 브라우저에서 http://lovealgorithmgame.site 접속 시 Nginx 기본 페이지가 보여야 함
```

## 6단계: SSL 인증서 발급 (Let's Encrypt)

### Certbot 설치
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

### SSL 인증서 발급
```bash
# 자동으로 Nginx 설정까지 해줌
sudo certbot --nginx -d lovealgorithmgame.site
```

**인증 과정:**
1. 이메일 주소 입력
2. 약관 동의 (A)
3. 이메일 수신 동의 (Y 또는 N)
4. 도메인 확인 (자동)

### 인증서 발급 확인
```bash
# 인증서 파일 확인
sudo ls -la /etc/letsencrypt/live/lovealgorithmgame.site/
```

## 7단계: Nginx 설정 파일 수정

### 설정 파일 위치 확인
```bash
# Ubuntu/Debian
sudo nano /etc/nginx/sites-available/default
# 또는 Certbot이 생성한 파일
sudo nano /etc/nginx/sites-available/lovealgorithmgame.site

# CentOS/RHEL
sudo nano /etc/nginx/conf.d/default.conf
```

### 설정 파일 내용 (전체)

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

    # SSL 인증서 (Certbot이 자동 설정)
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
        
        # 타임아웃 설정
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 로그 설정
    access_log /var/log/nginx/lovealgorithmgame_access.log;
    error_log /var/log/nginx/lovealgorithmgame_error.log;
}
```

### 설정 파일 편집
```bash
sudo nano /etc/nginx/sites-available/default
# 또는
sudo nano /etc/nginx/sites-available/lovealgorithmgame.site
```

위의 설정 내용을 복사하여 붙여넣으세요.

## 8단계: Nginx 설정 검증 및 재시작

### 설정 파일 검증
```bash
sudo nginx -t
```

**성공 메시지:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: the configuration file /etc/nginx/nginx.conf test is successful
```

### Nginx 재시작
```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

## 9단계: 방화벽 설정

### UFW 사용 (Ubuntu)
```bash
# HTTP, HTTPS 포트 허용
sudo ufw allow 'Nginx Full'
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
sudo ufw status
```

### firewalld 사용 (CentOS/RHEL)
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

## 10단계: 테스트

### HTTPS 연결 테스트
```bash
# API 엔드포인트 테스트
curl https://lovealgorithmgame.site/api/script

# 응답이 나오면 성공!
```

### 브라우저에서 테스트
1. `https://lovealgorithmgame.site/api/script` 접속
2. JSON 응답이 나오는지 확인

## 11단계: SSL 인증서 자동 갱신 설정

### 자동 갱신 테스트
```bash
sudo certbot renew --dry-run
```

### Cron 작업 추가
```bash
sudo crontab -e
```

다음 줄 추가:
```
0 0,12 * * * certbot renew --quiet && systemctl reload nginx
```

## 12단계: Vercel 환경 변수 업데이트

Vercel 대시보드에서:
1. Settings > Environment Variables
2. `VITE_API_BASE_URL` 값을 다음으로 변경:
   ```
   https://lovealgorithmgame.site/api
   ```
3. 재배포

## 문제 해결

### Nginx가 시작되지 않을 때
```bash
# 설정 파일 검증
sudo nginx -t

# 로그 확인
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u nginx -n 50
```

### 502 Bad Gateway 오류
```bash
# 백엔드가 실행 중인지 확인
curl http://localhost:8081/api/script

# 백엔드가 실행되지 않으면 시작
cd /path/to/backend
java -jar your-backend.jar
```

### SSL 인증서 발급 실패
- 도메인이 서버 IP를 가리키는지 확인: `nslookup lovealgorithmgame.site`
- 방화벽에서 80, 443 포트가 열려있는지 확인
- DNS 설정 확인

### 백엔드 연결 실패
```bash
# Nginx 로그 확인
sudo tail -f /var/log/nginx/lovealgorithmgame_error.log

# 백엔드 로그 확인
# 백엔드 로그 파일 위치 확인 필요
```

## 완료 체크리스트

- [ ] SSH 접속 성공
- [ ] 서버 정보 확인 완료
- [ ] Nginx 설치 완료
- [ ] SSL 인증서 발급 완료
- [ ] Nginx 설정 파일 수정 완료
- [ ] Nginx 재시작 성공
- [ ] 방화벽 설정 완료
- [ ] HTTPS 연결 테스트 성공
- [ ] 백엔드 API 프록시 동작 확인
- [ ] Vercel 환경 변수 업데이트
- [ ] 프론트엔드에서 API 호출 성공

## 추가 도움말

접속이 안 될 때:
1. 서버 관리자에게 SSH 접속 정보 문의
2. 클라우드 서비스 대시보드에서 인스턴스 정보 확인
3. 호스팅 제공업체 고객지원 문의
