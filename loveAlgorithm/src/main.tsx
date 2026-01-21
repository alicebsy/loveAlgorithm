import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.tsx'

// 구글 OAuth 클라이언트 ID (환경 변수에서 가져오기)
// .env 파일에 VITE_GOOGLE_CLIENT_ID=your_client_id 추가 필요
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// 구글 로그인이 활성화되어 있는지 확인
const isGoogleLoginEnabled = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== '' && !GOOGLE_CLIENT_ID.includes('dummy');

// Google OAuth Provider는 항상 사용 (버튼은 항상 보이도록)
// 클라이언트 ID가 없으면 더미 값 사용 (에러는 LoginScreen에서 처리)
const clientId = GOOGLE_CLIENT_ID || 'dummy-client-id-for-provider';

try {
  const app = <App />;
  
  // Google OAuth Provider는 항상 사용 (에러 처리는 컴포넌트에서)
  const rootElement = (
    <StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        {app}
      </GoogleOAuthProvider>
    </StrictMode>
  );
  
  createRoot(document.getElementById('root')!).render(rootElement);
  console.log('✅ 앱 렌더링 성공', { isGoogleLoginEnabled, hasClientId: !!GOOGLE_CLIENT_ID });
} catch (error) {
  console.error('❌ 앱 렌더링 실패:', error);
  // 에러 발생 시 Provider 없이 렌더링 시도
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div style={{ padding: '20px', color: '#fff', backgroundColor: '#000' }}>
        <h1>앱 로딩 에러</h1>
        <p>에러: {String(error)}</p>
        <p>브라우저 콘솔을 확인하세요.</p>
      </div>
    </StrictMode>,
  );
}
