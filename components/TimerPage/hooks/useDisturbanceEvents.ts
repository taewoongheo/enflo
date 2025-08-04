import { DisturbanceCountEvent } from '@/types/interruptEvent';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

function useDisturbanceEvents(isRunning: boolean) {
  const screenUnlockCount = useRef<DisturbanceCountEvent[]>([]);
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

        if (nextAppState === 'background') {
          screenUnlockCount.current.push({
            timestamp: Date.now(),
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
