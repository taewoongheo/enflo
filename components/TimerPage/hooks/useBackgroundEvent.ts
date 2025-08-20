import { AppStateEvent } from '@/types/InterruptEvent';
import { useCallback, useEffect, useRef } from 'react';
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

        // TODO: only count active cases; 'background' is triggered when the app auto-locks
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

  const resetBackgroundEvent = useCallback(() => {
    screenBackgroundCount.current = [];
  }, []);

  return {
    screenBackgroundCount,
    resetBackgroundEvent,
  };
}

export default useBackgroundEvent;
