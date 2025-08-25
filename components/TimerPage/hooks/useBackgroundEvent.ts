import TimerSession from '@/models/TimerSession';
import { AppStateEvent } from '@/types/InterruptEvent';
import { RefObject, useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

function useBackgroundEvent(timerSession: RefObject<TimerSession | null>) {
  const screenBackgroundCount = useRef<AppStateEvent[]>([]);

  useEffect(() => {
    // screen unlock count
    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (!timerSession.current) {
          return;
        }

        if (nextAppState === 'background') {
          screenBackgroundCount.current.push({
            timestamp: Date.now(),
            appState: 'background',
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
