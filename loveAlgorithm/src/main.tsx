import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.tsx'

// 구글 OAuth 클라이언트 ID (환경 변수에서 가져오기)
// .env 파일에 VITE_GOOGLE_CLIENT_ID=your_client_id 추가 필요
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// 구글 OAuth 클라이언트 ID 확인
const DUMMY_CLIENT_ID = 'dummy-client-id-for-provider';
const clientId = GOOGLE_CLIENT_ID || DUMMY_CLIENT_ID;

// 디버깅: 환경 변수 확인
console.log('🔍 main.tsx - 구글 클라이언트 ID 확인:', {
  raw: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  processed: GOOGLE_CLIENT_ID,
  clientId: clientId,
  isDummy: clientId === DUMMY_CLIENT_ID,
  allEnvKeys: Object.keys(import.meta.env).filter(key => key.includes('GOOGLE') || key.includes('VITE'))
});

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </StrictMode>,
  );
  console.log('✅ 앱 렌더링 성공');
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
