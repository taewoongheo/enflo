import TimerSession from '@/models/TimerSession';
import { PauseEvent } from '@/types/InterruptEvent';
import { RefObject, useCallback, useEffect, useRef } from 'react';

export default function usePauseEvent(
  isRunning: boolean,
  timerSession: RefObject<TimerSession | null>,
) {
  const pauseEvent = useRef<PauseEvent[]>([]);
  const pauseStartTime = useRef<number | null>(null);

  // puase event
  useEffect(() => {
    if (!timerSession.current) {
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
  }, [isRunning, timerSession.current]);

  const resetPauseEvent = useCallback(() => {
    pauseEvent.current = [];
    pauseStartTime.current = null;
  }, []);

  return { pauseEvent, resetPauseEvent };
}
