import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
(window as any).gameStore = useGameStore;
import { StartScreen } from './components/screens/StartScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { GameScreen } from './components/screens/GameScreen';
import { SaveLoadScreen } from './components/screens/SaveLoadScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { DebugScreen } from './components/screens/DebugScreen';
import { ThemeProvider } from 'styled-components';
import { useScriptLoader } from './hooks/useScriptLoader';

const theme = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    text: '#ffffff',
    background: '#000000',
  },
};

function App() {
  const { currentScreen, loadScript, setIsAuthenticated, syncWithBackend, setUser } = useGameStore();
  useScriptLoader(); // 스크립트 로딩 (에러 처리용)
  
  // 앱 시작 시 스크립트 로드 (로컬 데이터 즉시 로드)
  useEffect(() => {
    try {
      loadScript().catch((error) => {
        console.error('스크립트 로드 에러:', error);
      });
    } catch (error) {
      console.error('스크립트 로드 초기화 에러:', error);
    }
  }, [loadScript]);
  
  // 앱 시작 시 토큰 확인 및 자동 로그인
  useEffect(() => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // 토큰이 있으면 사용자 정보 가져오기 시도
        syncWithBackend().then(() => {
          setIsAuthenticated(true);
        }).catch((error) => {
          // 토큰이 유효하지 않으면 삭제 (에러는 정상적인 경우가 많음)
          console.log('자동 로그인 실패 (정상일 수 있음):', error);
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
          setUser(null);
        });
      }
    } catch (error) {
      console.error('자동 로그인 초기화 에러:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의도적으로 빈 배열로 설정 (앱 시작 시 한 번만 실행)

  const renderScreen = () => {
    try {
      switch (currentScreen) {
        case 'login':
          return <LoginScreen />;
        case 'register':
          return <RegisterScreen />;
        case 'start':
          return <StartScreen />;
        case 'game':
          return <GameScreen />;
        case 'saveLoad':
          return <SaveLoadScreen />;
        case 'settings':
          return <SettingsScreen />;
        case 'debug':
          return <DebugScreen />;
        default:
          return <LoginScreen />;
      }
    } catch (error) {
      console.error('화면 렌더링 에러:', error);
      return (
        <div style={{ padding: '20px', color: '#fff' }}>
          <h1>에러가 발생했습니다</h1>
          <p>브라우저 콘솔을 확인하세요.</p>
          <p>{String(error)}</p>
        </div>
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
        {renderScreen()}
      </div>
    </ThemeProvider>
  );
}

export default App;
