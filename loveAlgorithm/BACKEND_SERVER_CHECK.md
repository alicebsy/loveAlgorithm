# 백엔드 서버 상태 확인 및 문제 해결

## 현재 문제

1. **도메인 DNS 문제**: `lovealgorithmgame.site`가 `3.39.193.131`을 가리키고 있지만, 실제 서버는 `15.165.158.127`에 있음
2. **서버 실행 확인 필요**: 서버가 정상적으로 시작되었는지 확인 필요

## 서버 상태 확인 명령어

SSH로 서버 접속 후 다음 명령어들을 실행하세요:

```bash
# 1. 서버 프로세스 확인
ps aux | grep java

# 2. 포트 8081 확인
sudo ss -tlnp | grep 8081
# 또는
sudo netstat -tlnp | grep 8081

# 3. 서버 로그 확인 (최근 50줄)
tail -n 50 backend.log

# 4. 서버 로그 실시간 확인
tail -f backend.log

# 5. 로컬에서 API 테스트
curl http://localhost:8081/api/script

# 6. 서버 시작 확인 (Spring Boot 시작 메시지 찾기)
grep "Started LoveAlgorithmApplication" backend.log
```

## 문제 해결 방법

### 방법 1: IP 주소로 직접 사용 (빠른 해결)

Vercel 환경 변수를 IP 주소로 변경:
- `VITE_API_BASE_URL`: `http://15.165.158.127:8081/api`

### 방법 2: 도메인 DNS 수정 (권장)

도메인 DNS 설정을 새 IP로 변경:
- `lovealgorithmgame.site` → `15.165.158.127` (A 레코드)

### 방법 3: 서버 재시작

서버가 제대로 시작되지 않았다면:

```bash
# 기존 프로세스 종료
pkill -f "love-algorithm.*jar"

# 잠시 대기
sleep 2

# 서버 재시작
cd ~
nohup java -jar love-algorithm-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &

# 5초 대기 후 확인
sleep 5
ps aux | grep java
tail -n 30 backend.log
```

## 서버가 정상 시작되었는지 확인

서버가 정상적으로 시작되면 로그에 다음 메시지가 보입니다:

```
Started LoveAlgorithmApplication in X.XXX seconds
```

또는

```
Tomcat started on port(s): 8081 (http)
```

## API 테스트

서버가 실행 중이면:

```bash
# 로컬에서 테스트
curl http://localhost:8081/api/script

# 외부에서 테스트 (다른 터미널)
curl http://15.165.158.127:8081/api/script
```

응답이 오면 서버는 정상 작동 중입니다.
