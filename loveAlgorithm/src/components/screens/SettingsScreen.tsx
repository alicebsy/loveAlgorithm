import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';

const ScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  color: #fff;
  padding: 40px;
`;

const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 40px;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;

const SettingsContainer = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SettingItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SettingLabel = styled.label`
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Slider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: none;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.2);
    transition: 0.3s;
    border-radius: 30px;
    
    &:before {
      position: absolute;
      content: '';
      height: 22px;
      width: 22px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: #4caf50;
    
    &:before {
      transform: translateX(30px);
    }
  }
`;

const ValueDisplay = styled.span`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  min-width: 50px;
  text-align: right;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 20px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

export const SettingsScreen = () => {
  const { settings, updateSettings, setCurrentScreen, previousScreen } = useGameStore();

  const handleVolumeChange = (type: 'bgmVolume' | 'sfxVolume' | 'voiceVolume' | 'textSpeed', value: number) => {
    updateSettings({ [type]: value });
  };

  const handleSkipModeToggle = (enabled: boolean) => {
    updateSettings({ skipMode: enabled });
  };

  return (
    <ScreenContainer>
      <Title>환경설정</Title>
      <SettingsContainer>
        <SettingItem>
          <SettingLabel>
            <span>스킵 모드</span>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={settings.skipMode}
                onChange={(e) => handleSkipModeToggle(e.target.checked)}
              />
              <span />
            </ToggleSwitch>
          </SettingLabel>
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            <span>배경음 볼륨</span>
            <ValueDisplay>{settings.bgmVolume}%</ValueDisplay>
          </SettingLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={settings.bgmVolume}
            onChange={(e) => handleVolumeChange('bgmVolume', parseInt(e.target.value))}
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            <span>효과음 볼륨</span>
            <ValueDisplay>{settings.sfxVolume}%</ValueDisplay>
          </SettingLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={settings.sfxVolume}
            onChange={(e) => handleVolumeChange('sfxVolume', parseInt(e.target.value))}
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            <span>보이스 볼륨</span>
            <ValueDisplay>{settings.voiceVolume}%</ValueDisplay>
          </SettingLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={settings.voiceVolume}
            onChange={(e) => handleVolumeChange('voiceVolume', parseInt(e.target.value))}
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            <span>텍스트 속도</span>
            <ValueDisplay>{settings.textSpeed}%</ValueDisplay>
          </SettingLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={settings.textSpeed}
            onChange={(e) => handleVolumeChange('textSpeed', parseInt(e.target.value))}
          />
        </SettingItem>
      </SettingsContainer>
      <Button onClick={() => setCurrentScreen(previousScreen || 'start')}>돌아가기</Button>
    </ScreenContainer>
  );
};

