import TimerSession from '@/models/TimerSession';
import { PauseEvent } from '@/types/InterruptEvent';
import { useCallback, useEffect, useRef } from 'react';

export default function usePauseEvent(
  isRunning: boolean,
  timerSession: TimerSession | null,
) {
  const pauseEvent = useRef<PauseEvent[]>([]);
  const pauseStartTime = useRef<number | null>(null);

  // puase event
  useEffect(() => {
    if (!timerSession) {
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
  }, [isRunning, timerSession]);

  const resetPauseEvent = useCallback(() => {
    pauseEvent.current = [];
    pauseStartTime.current = null;
  }, []);

  return { pauseEvent, resetPauseEvent };
}
