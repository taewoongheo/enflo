import { AppStateEvent } from '@/types/InterruptEvent';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

function useBackgroundEvent(isRunning: boolean) {
  const screenBackgroundCount = useRef<AppStateEvent[]>([]);
  const isRunningRef = useRef<boolean>(isRunning);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    // screen unlock count
    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (!isRunningRef.current) {
          return;
        }

        if (nextAppState === 'background') {
          console.log('background event');
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
  }, []);

  const resetBackgroundEvent = useCallback(() => {
    screenBackgroundCount.current = [];
  }, []);

  return {
    screenBackgroundCount,
    resetBackgroundEvent,
  };
}

export default useBackgroundEvent;
