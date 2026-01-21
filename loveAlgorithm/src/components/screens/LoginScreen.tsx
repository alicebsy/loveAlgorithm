import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { login, loginWithGoogle } from '../../services/api';
import { useGoogleLogin } from '@react-oauth/google';
import { ToastManager } from '../ui/ToastManager';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const ScreenContainer = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center;
  color: #fff;
  overflow: hidden;

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: ${float} 20s ease-in-out infinite;
    pointer-events: none;
  }
`;

const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.15); 
  padding: 48px 40px; 
  border-radius: 24px;
  min-width: 420px; 
  max-width: 90%;
  backdrop-filter: blur(20px); 
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    min-width: 90%;
    padding: 32px 24px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%; 
  padding: 14px 16px; 
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3); 
  background: rgba(255, 255, 255, 0.1); 
  color: white;
  font-size: 15px;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 13px;
  margin-bottom: 12px;
  min-height: 20px;
  padding: 8px 12px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  border-left: 3px solid #ff6b6b;
`;

const Button = styled.button`
  width: 100%; 
  padding: 14px; 
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  border: none;
  border-radius: 12px; 
  color: white; 
  cursor: pointer; 
  margin-top: 10px;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(118, 75, 162, 0.4);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(118, 75, 162, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const GoogleButton = styled.button`
  width: 100%; 
  padding: 14px; 
  background: #fff; 
  border: none;
  border-radius: 12px; 
  color: #333; 
  cursor: pointer; 
  margin-top: 10px;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    background: #f5f5f5;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  display: flex; 
  align-items: center; 
  margin: 24px 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  
  &::before, &::after {
    content: ''; 
    flex: 1; 
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
  }
  
  &::before { margin-right: 12px; }
  &::after { margin-left: 12px; }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: none;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const GuestButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  box-shadow: none;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const LoginScreen = () => {
  const { setCurrentScreen, setIsAuthenticated, syncWithBackend, showToast, setUser } = useGameStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 구글 클라이언트 ID 확인
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const isGoogleLoginEnabled = googleClientId && googleClientId !== '' && googleClientId !== 'dummy-client-id-for-provider';
  
  // 디버깅: 환경 변수 확인
  console.log('🔍 구글 클라이언트 ID 확인:', {
    raw: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    processed: googleClientId,
    isEnabled: isGoogleLoginEnabled,
    allEnv: Object.keys(import.meta.env).filter(key => key.includes('GOOGLE'))
  });

  // 디버깅 로그 제거 (너무 많이 출력됨)
  // console.log('🔍 LoginScreen 렌더링:', { 
  //   googleClientId: googleClientId ? '설정됨' : '설정 안 됨',
  //   isGoogleLoginEnabled 
  // });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      setLoading(false);
      return;
    }
    
    try {
      const result = await login({ email, password });
      
      if (result.success) {
        setIsAuthenticated(true);
        // 사용자 닉네임 설정
        const nickname = result.data?.nickname || email.split('@')[0];
        setUser({ nickname });
        // 환영 메시지 표시
        showToast(`환영합니다 ${nickname}님!`, 'success');
        await syncWithBackend();
        setCurrentScreen('start');
      } else {
        setError('로그인 정보가 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.error('로그인 에러:', err);
      setError(err.message || '서버 연결 실패');
    } finally {
      setLoading(false);
    }
  };

  // 구글 로그인 핸들러 (항상 호출해야 함 - React Hooks 규칙)
  const googleLoginHook = useGoogleLogin({
    onSuccess: async (tokenResponse: { access_token: string }) => {
      if (!isGoogleLoginEnabled) {
        setError('구글 로그인이 설정되지 않았습니다.');
        return;
      }
      
      setError('');
      setLoading(true);
      try {
        // 구글에서 받은 access_token을 백엔드로 전송
        const result = await loginWithGoogle(tokenResponse.access_token);
        
        if (result.success) {
          setIsAuthenticated(true);
          // 사용자 닉네임 설정 (구글에서 받은 이름 또는 이메일)
          console.log('🔍 구글 로그인 전체 응답:', result);
          console.log('🔍 구글 로그인 응답 데이터:', result.data);
          console.log('🔍 닉네임 확인:', {
            'result.data?.nickname': result.data?.nickname,
            'result.data?.name': result.data?.name,
            'result.data 전체': result.data
          });
          
          // 여러 경로에서 닉네임 찾기 (userName도 확인)
          const nickname = result.data?.nickname 
            || result.data?.userName
            || result.data?.name 
            || (result.data && typeof result.data === 'object' && 'nickname' in result.data ? (result.data as any).nickname : null)
            || '게스트';
          
          console.log('✅ 최종 설정할 닉네임:', nickname);
          setUser({ nickname });
          // 환영 메시지 표시
          showToast(`환영합니다 ${nickname}님!`, 'success');
          await syncWithBackend();
          setCurrentScreen('start');
        } else {
          setError('구글 로그인에 실패했습니다.');
        }
      } catch (err: any) {
        console.error('구글 로그인 에러:', err);
        let errorMessage = '구글 로그인 실패';
        
        if (err.message) {
          if (err.message.includes('Failed to fetch') || err.message.includes('네트워크')) {
            errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.';
          } else if (err.message.includes('CORS')) {
            errorMessage = 'CORS 에러가 발생했습니다. 백엔드 CORS 설정을 확인하세요.';
          } else if (err.message.includes('500') || err.message.includes('백엔드 서버 오류')) {
            errorMessage = '백엔드 서버 오류 (500). 백엔드 로그를 확인하거나, /api/auth/google 엔드포인트가 구현되었는지 확인하세요.';
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse: any) => {
      console.error('❌ Google OAuth 에러:', errorResponse);
      setLoading(false);
      
      // 400 오류 처리
      if (errorResponse?.error === 'invalid_client' || errorResponse?.error === 'invalid_request') {
        setError('Google 로그인 설정 오류 (400). Vercel 환경 변수와 Google Cloud Console 설정을 확인하세요.');
      } else if (errorResponse?.error === 'access_denied') {
        setError('Google 로그인이 취소되었습니다.');
      } else {
        setError(`Google 로그인 오류: ${errorResponse?.error || errorResponse?.error_description || '알 수 없는 오류'}`);
      }
    },
  });

  const handleGoogleLogin = isGoogleLoginEnabled ? googleLoginHook : () => {
    setError('구글 로그인이 설정되지 않았습니다.');
  };

  return (
    <ScreenContainer>
      <LoginBox>
        <Title>로그인</Title>
        <Subtitle>Love Algorithm에 오신 것을 환영합니다</Subtitle>
        
        <form onSubmit={handleLogin}>
          <InputGroup>
            <Input 
              type="email" 
              placeholder="이메일을 입력하세요" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              disabled={loading} 
            />
          </InputGroup>
          
          <InputGroup>
            <Input 
              type="password" 
              placeholder="비밀번호를 입력하세요" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              disabled={loading} 
            />
          </InputGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="43.98" strokeDashoffset="10" strokeLinecap="round">
                    <animate attributeName="stroke-dasharray" values="0 43.98;21.99 21.99;0 43.98" dur="1.5s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" values="0;-10.99;-21.99" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                </svg>
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </Button>
        </form>
        
        <Divider>또는</Divider>
        
        <GoogleButton 
          onClick={(e) => {
            e.preventDefault();
            if (!isGoogleLoginEnabled) {
              setError('구글 로그인이 설정되지 않았습니다. Vercel 환경 변수에 VITE_GOOGLE_CLIENT_ID를 설정해주세요.');
              return;
            }
            handleGoogleLogin();
          }}
          disabled={loading || !isGoogleLoginEnabled}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.96-2.184l-2.908-2.258c-.806.54-1.837.86-3.052.86-2.347 0-4.33-1.585-5.04-3.715H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.96 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.348 6.173 0 7.55 0 9s.348 2.827.957 4.042l3.003-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.96 7.29C4.67 5.16 6.653 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          구글로 로그인
          {!isGoogleLoginEnabled && <span style={{fontSize: '11px', marginLeft: '5px', color: '#999', fontWeight: 'normal'}}>(설정 필요)</span>}
        </GoogleButton>
        
        <SecondaryButton onClick={() => setCurrentScreen('register')} disabled={loading}>
          회원가입
        </SecondaryButton>
        
        <GuestButton onClick={() => { setIsAuthenticated(false); setCurrentScreen('start'); }} disabled={loading}>
          게스트로 시작하기
        </GuestButton>
      </LoginBox>
      <ToastManager />
    </ScreenContainer>
  );
};