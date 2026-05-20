import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import musicManager from '../../utils/BackgroundMusicManager';

/**
 * BackgroundMusic Component (Sync Bridge)
 * This component only syncs the Master Manager with the React state/route.
 */
export default function BackgroundMusic() {
  const location = useLocation();
  const musicEnabled = useGameStore((s) => s.musicEnabled);

  useEffect(() => {
    // Determine if we should be playing
    const isActivity = location.pathname.startsWith('/actividad/');
    const shouldPlay = musicEnabled && !isActivity;

    if (shouldPlay) {
      musicManager.play();
    } else {
      musicManager.pause();
    }

    // Interaction Unlocker: If blocked, try again on first click anywhere
    const unlock = () => {
      // Re-read current path/state to ensure we still want to play
      const freshIsActivity = window.location.pathname.includes('/actividad/');
      const freshMusicEnabled = useGameStore.getState().musicEnabled;

      if (freshMusicEnabled && !freshIsActivity) {
        musicManager.play();
      }

      // Cleanup listener
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };

    if (shouldPlay && musicManager.isPaused()) {
      document.addEventListener('click', unlock);
      document.addEventListener('touchstart', unlock);
    }

    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };
  }, [location.pathname, musicEnabled]);

  return null;
}
