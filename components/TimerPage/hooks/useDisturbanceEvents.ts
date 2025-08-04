import { AppStateEvent } from '@/types/interruptEvent';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

function useDisturbanceEvents(isRunning: boolean) {
  const screenUnlockCount = useRef<AppStateEvent[]>([]);
  // const scrollInteractionCount = useRef<DisturbanceCountEvent[]>([]);
  // const pauseEvents = useRef<PauseEvent[]>([]);

  useEffect(() => {
    // screen unlock count
    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (!isRunning) {
          return;
        }

        if (nextAppState === 'background' || nextAppState === 'active') {
          screenUnlockCount.current.push({
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
    screenUnlockCount,
  };
}

export default useDisturbanceEvents;
