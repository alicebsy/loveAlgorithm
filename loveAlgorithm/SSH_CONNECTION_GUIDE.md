# 백엔드 서버 SSH 접속 가이드

## SSH 접속 기본 명령어

### 1. 도메인으로 접속 (가장 일반적)
```bash
ssh username@lovealgorithmgame.site
```

### 2. IP 주소로 접속
```bash
ssh username@서버_IP_주소
```

### 3. 포트 지정 (기본 포트가 22가 아닌 경우)
```bash
ssh -p 포트번호 username@lovealgorithmgame.site
```

## 서버 정보 확인 방법

### 도메인의 IP 주소 확인
```bash
# 도메인의 IP 주소 확인
nslookup lovealgorithmgame.site
# 또는
dig lovealgorithmgame.site
# 또는
ping lovealgorithmgame.site
```

### 일반적인 사용자명
- `root` (루트 사용자)
- `ubuntu` (Ubuntu 서버)
- `ec2-user` (AWS EC2)
- `admin` (일부 서버)
- `user` (일반 사용자)

## 실제 접속 예시

### 예시 1: Ubuntu 서버
```bash
ssh ubuntu@lovealgorithmgame.site
```

### 예시 2: 루트 사용자
```bash
ssh root@lovealgorithmgame.site
```

### 예시 3: 특정 포트 사용
```bash
ssh -p 2222 username@lovealgorithmgame.site
```

## SSH 키 파일 사용 (권장)

### 키 파일로 접속
```bash
ssh -i /path/to/your/private-key.pem username@lovealgorithmgame.site
```

### AWS EC2 예시
```bash
ssh -i ~/.ssh/my-key.pem ubuntu@lovealgorithmgame.site
```

## 처음 접속 시

### 호스트 키 확인
처음 접속하면 다음과 같은 메시지가 나타납니다:
```
The authenticity of host 'lovealgorithmgame.site (IP)' can't be established.
Are you sure you want to continue connecting (yes/no)?
```
`yes`를 입력하고 Enter를 누르세요.

## 접속 후 확인 사항

### 1. 현재 사용자 확인
```bash
whoami
```

### 2. 서버 정보 확인
```bash
uname -a
cat /etc/os-release
```

### 3. 백엔드 프로세스 확인
```bash
# Java 프로세스 확인
ps aux | grep java

# 포트 8081 사용 확인
sudo netstat -tlnp | grep 8081
# 또는
sudo ss -tlnp | grep 8081
```

### 4. Nginx 설치 여부 확인
```bash
nginx -v
# 또는
which nginx
```

## 접속 문제 해결

### 연결 거부됨
```bash
# 방화벽 확인
sudo ufw status
# 또는
sudo firewall-cmd --list-all

# SSH 서비스 확인
sudo systemctl status ssh
# 또는
sudo systemctl status sshd
```

### 권한 거부됨
- 사용자명이 올바른지 확인
- SSH 키 파일 권한 확인: `chmod 400 /path/to/key.pem`
- 비밀번호가 올바른지 확인

### 타임아웃
- 서버 IP 주소 확인
- 방화벽에서 SSH 포트(22)가 열려있는지 확인
- 네트워크 연결 확인

## 보안 설정 (선택사항)

### SSH 키 생성 (로컬에서)
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

### 공개 키를 서버에 복사
```bash
ssh-copy-id username@lovealgorithmgame.site
```

## 다음 단계

SSH 접속 후:
1. [Nginx 설치 및 HTTPS 설정](./NGINX_HTTPS_SETUP.md) 진행
2. 백엔드 서버 상태 확인
3. SSL 인증서 발급

## 참고

서버 정보를 모르는 경우:
- 서버 관리자에게 문의
- 클라우드 서비스(AWS, GCP, Azure 등) 대시보드에서 확인
- 호스팅 제공업체에 문의
