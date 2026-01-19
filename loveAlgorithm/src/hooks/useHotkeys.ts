import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

interface HotkeyConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  preventDefault?: boolean;
}

export const useHotkeys = (hotkeys: HotkeyConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const hotkey of hotkeys) {
        const keyMatch = event.key.toLowerCase() === hotkey.key.toLowerCase();
        const ctrlMatch = hotkey.ctrl ? event.ctrlKey : !event.ctrlKey;
        const shiftMatch = hotkey.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = hotkey.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          if (hotkey.preventDefault !== false) {
            event.preventDefault();
          }
          hotkey.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkeys]);
};

// 게임에서 사용하는 기본 핫키 설정
export const useGameHotkeys = (
  onNext: () => void,
  onSave: () => void,
  onLoad: () => void,
  onSkip: () => void,
  onSettings: () => void,
  onMainMenu: () => void
) => {
  const { currentScreen } = useGameStore();

  useHotkeys([
    {
      key: ' ',
      action: () => {
        if (currentScreen === 'game') {
          onNext();
        }
      },
      preventDefault: true,
    },
    {
      key: 's',
      ctrl: true,
      action: () => {
        if (currentScreen === 'game') {
          onSave();
        }
      },
    },
    {
      key: 'l',
      ctrl: true,
      action: () => {
        if (currentScreen === 'game') {
          onLoad();
        }
      },
    },
    {
      key: 'k',
      action: () => {
        if (currentScreen === 'game') {
          onSkip();
        }
      },
    },
    {
      key: 'Escape',
      action: () => {
        if (currentScreen === 'game') {
          onSettings();
        }
      },
    },
    {
      key: 'm',
      action: () => {
        if (currentScreen === 'game') {
          onMainMenu();
        }
      },
    },
  ]);
};

