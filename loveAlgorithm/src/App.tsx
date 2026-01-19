import { useGameStore } from './store/gameStore';
import { StartScreen } from './components/screens/StartScreen';
import { GameScreen } from './components/screens/GameScreen';
import { SaveLoadScreen } from './components/screens/SaveLoadScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
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
  const { currentScreen } = useGameStore();
  const { isScriptLoading, scriptError } = useScriptLoader();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen />;
      case 'game':
        return <GameScreen />;
      case 'saveLoad':
        return <SaveLoadScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <StartScreen />;
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
