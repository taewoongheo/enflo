import { PauseEvent } from '@/types/interruptEvent';
import { useCallback, useEffect, useRef } from 'react';

export default function usePauseEvent(isRunning: boolean) {
  const pauseEvent = useRef<PauseEvent[]>([]);
  const pauseStartTime = useRef<number | null>(null);

  const timerStartedOnce = useRef<boolean>(false);

  // puase event
  useEffect(() => {
    if (!timerStartedOnce.current) {
      return;
    }

    if (isRunning) {
      if (!pauseStartTime.current) {
        return;
      }

      const now = Date.now();
      pauseEvent.current.push({
        startTs: pauseStartTime.current,
        endTs: now,
        durationMs: now - pauseStartTime.current,
      });

      pauseStartTime.current = null;

      return;
    }

    pauseStartTime.current = Date.now();
  }, [isRunning]);

  const resetPauseEvent = useCallback(() => {
    timerStartedOnce.current = false;
    pauseEvent.current = [];
    pauseStartTime.current = null;
  }, []);

  return { pauseEvent, pauseStartTime, timerStartedOnce, resetPauseEvent };
}
