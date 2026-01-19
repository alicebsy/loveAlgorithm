import { useState } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { register, login } from '../../services/api';

const ScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  color: #fff;
`;

const RegisterBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 40px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 30px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  border-color: rgba(255, 255, 255, 0.3);
  margin-top: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
  min-height: 20px;
`;

const SuccessMessage = styled.div`
  color: #51cf66;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
  min-height: 20px;
`;

const PasswordHint = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
`;

export const RegisterScreen = () => {
  const { setCurrentScreen, showToast, setIsAuthenticated, syncWithBackend } = useGameStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !nickname) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    if (!email.includes('@')) {
      setError('올바른 이메일 형식이 아닙니다.');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(email, password, nickname);
      if (success) {
        setSuccess('회원가입이 완료되었습니다. 로그인 중...');
        
        // 자동으로 로그인 시도
        const loginResult = await login(email, password);
        if (loginResult) {
          setIsAuthenticated(true);
          showToast('회원가입 및 로그인 성공!', 'success');
          
          // 백엔드에서 사용자 정보 동기화 (syncWithBackend에서 user 정보도 설정됨)
          try {
            await syncWithBackend();
          } catch (syncError) {
            console.error('Failed to sync with backend:', syncError);
          }
          
          // 메인 화면으로 이동
          setCurrentScreen('start');
        } else {
          setError('회원가입은 완료되었지만 로그인에 실패했습니다. 로그인 화면으로 이동합니다.');
          setTimeout(() => {
            setCurrentScreen('login');
          }, 2000);
        }
      } else {
        setError('회원가입에 실패했습니다. 이미 존재하는 이메일일 수 있습니다.');
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  return (
    <ScreenContainer>
      <RegisterBox>
        <Title>회원가입</Title>
        <form onSubmit={handleRegister}>
          <FormGroup>
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              required
              disabled={isLoading}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
              disabled={isLoading}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isLoading}
            />
            <PasswordHint>최소 6자 이상 입력해주세요</PasswordHint>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
              disabled={isLoading}
            />
          </FormGroup>
          <ErrorMessage>{error}</ErrorMessage>
          <SuccessMessage>{success}</SuccessMessage>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '가입 중...' : '회원가입'}
          </Button>
        </form>
        <SecondaryButton onClick={handleBackToLogin} disabled={isLoading}>
          로그인으로 돌아가기
        </SecondaryButton>
      </RegisterBox>
    </ScreenContainer>
  );
};

