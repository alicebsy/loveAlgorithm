import { useState } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { fetchCurrentUser } from '../../services/api';

const ScreenContainer = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex; flex-direction: column; padding: 20px;
  color: #fff; overflow-y: auto;
`;

const DebugBox = styled.div`
  background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px;
  margin-bottom: 20px; backdrop-filter: blur(10px);
`;

const Button = styled.button`
  padding: 10px 20px; margin: 5px; background: #764ba2; border: none;
  border-radius: 8px; color: white; cursor: pointer;
  &:hover { background: #5a3a7a; }
`;

const CodeBlock = styled.pre`
  background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px;
  overflow-x: auto; font-size: 12px; max-height: 400px; overflow-y: auto;
`;

export const DebugScreen = () => {
  const { setCurrentScreen } = useGameStore();
  const [scriptData, setScriptData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkScripts = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch('http://15.165.158.127:8081/api/script', { headers });
      const data = await response.json();
      setScriptData(data.data || data);
    } catch (e: any) {
      setError(e.message || '에러 발생');
      console.error('스크립트 확인 에러:', e);
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await fetchCurrentUser();
      setUserData(user);
    } catch (e: any) {
      setError(e.message || '에러 발생');
      console.error('사용자 확인 에러:', e);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('토큰이 없습니다. 로그인해주세요.');
        setLoading(false);
        return;
      }
      const headers: Record<string, string> = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch('http://15.165.158.127:8081/api/user/current', { headers });
      const data = await response.json();
      setUserData(data.data || data);
    } catch (e: any) {
      setError(e.message || '에러 발생');
      console.error('인증 확인 에러:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <h1>🔍 데이터베이스 확인</h1>
      
      <Button onClick={() => setCurrentScreen('start')}>← 메인으로</Button>

      <DebugBox>
        <h2>1. 스크립트 데이터 확인</h2>
        <Button onClick={checkScripts} disabled={loading}>
          {loading ? '로딩 중...' : '스크립트 데이터 가져오기'}
        </Button>
        {scriptData && (
          <div>
            <p>✅ Scene 개수: {Object.keys(scriptData).length}</p>
            <p>✅ 첫 번째 Scene ID: {Object.keys(scriptData)[0]}</p>
            <CodeBlock>{JSON.stringify(scriptData, null, 2)}</CodeBlock>
          </div>
        )}
      </DebugBox>

      <DebugBox>
        <h2>2. 사용자 정보 확인</h2>
        <Button onClick={checkUser} disabled={loading}>
          {loading ? '로딩 중...' : '사용자 정보 가져오기'}
        </Button>
        <Button onClick={checkAuth} disabled={loading} style={{marginLeft: '10px'}}>
          인증 확인
        </Button>
        {userData && (
          <div>
            <p>✅ 사용자 정보:</p>
            <CodeBlock>{JSON.stringify(userData, null, 2)}</CodeBlock>
          </div>
        )}
      </DebugBox>

      {error && (
        <DebugBox style={{background: 'rgba(255, 0, 0, 0.2)'}}>
          <p style={{color: '#ff6b6b'}}>❌ 에러: {error}</p>
        </DebugBox>
      )}

      <DebugBox>
        <h2>3. 빠른 확인 명령어</h2>
        <p>브라우저 콘솔(F12)에서 다음 명령어를 실행하세요:</p>
        <CodeBlock>{`// 스크립트 확인
fetch('http://15.165.158.127:8081/api/script')
  .then(r => r.json())
  .then(d => console.log('Scene 개수:', Object.keys(d.data || d).length));

// 사용자 확인 (토큰 필요)
const token = localStorage.getItem('auth_token');
fetch('http://15.165.158.127:8081/api/user/current', {
  headers: { 'Authorization': \`Bearer \${token}\` }
})
  .then(r => r.json())
  .then(d => console.log('사용자:', d));`}</CodeBlock>
      </DebugBox>
    </ScreenContainer>
  );
};
