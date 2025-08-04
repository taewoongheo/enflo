import { AppStateEvent } from '@/types/interruptEvent';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

function useBackgroundEvent(isRunning: boolean) {
  const screenBackgroundCount = useRef<AppStateEvent[]>([]);

  useEffect(() => {
    // screen unlock count
    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (!isRunning) {
          return;
        }

        if (nextAppState === 'background' || nextAppState === 'active') {
          screenBackgroundCount.current.push({
            timestamp: Date.now(),
            appState: nextAppState,
          });
        }
      },
    );

    return () => {
      appStateSubscription.remove();
    };
  }, [isRunning]);

  return {
    screenBackgroundCount,
  };
}

export default useBackgroundEvent;
