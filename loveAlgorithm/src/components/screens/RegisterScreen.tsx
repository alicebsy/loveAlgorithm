import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { register } from '../../services/api';
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

const RegisterBox = styled.div`
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

const SuccessMessage = styled.div`
  color: #51cf66;
  font-size: 13px;
  margin-bottom: 12px;
  min-height: 20px;
  padding: 8px 12px;
  background: rgba(81, 207, 102, 0.1);
  border-radius: 8px;
  border-left: 3px solid #51cf66;
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

const SecondaryButton = styled(Button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: none;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

export const RegisterScreen = () => {
  const { setCurrentScreen, showToast } = useGameStore();
  const [formData, setFormData] = useState({ email: '', password: '', nickname: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    if (!formData.email || !formData.password || !formData.nickname) {
      setError('모든 항목을 입력해주세요.');
      setLoading(false);
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      setLoading(false);
      return;
    }

    // 비밀번호 길이 검증
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setLoading(false);
      return;
    }
    
    try {
      const result = await register(formData);
      
      if (result.success) {
        setSuccess('회원가입이 완료되었습니다! 로그인해주세요.');
        showToast('회원가입 성공! 로그인해주세요.', 'success');
        setTimeout(() => {
          setCurrentScreen('login');
        }, 1500);
      } else {
        setError(result.message || '회원가입에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('회원가입 에러:', err);
      setError(err.message || '서버 연결 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <RegisterBox>
        <Title>회원가입</Title>
        <Subtitle>새로운 계정을 만들어보세요</Subtitle>
        
        <form onSubmit={handleRegister}>
          <InputGroup>
            <Input 
              type="text" 
              placeholder="닉네임을 입력하세요" 
              value={formData.nickname}
              onChange={e => setFormData({...formData, nickname: e.target.value})}
              disabled={loading}
            />
          </InputGroup>

          <InputGroup>
            <Input 
              type="email" 
              placeholder="이메일을 입력하세요" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              disabled={loading}
            />
          </InputGroup>

          <InputGroup>
            <Input 
              type="password" 
              placeholder="비밀번호를 입력하세요 (최소 6자)" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              disabled={loading}
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="43.98" strokeDashoffset="10" strokeLinecap="round">
                    <animate attributeName="stroke-dasharray" values="0 43.98;21.99 21.99;0 43.98" dur="1.5s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" values="0;-10.99;-21.99" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                </svg>
                가입 중...
              </>
            ) : (
              '가입하기'
            )}
          </Button>
        </form>

        <SecondaryButton onClick={() => setCurrentScreen('login')} disabled={loading}>
          로그인으로 돌아가기
        </SecondaryButton>
      </RegisterBox>
      <ToastManager />
    </ScreenContainer>
  );
};