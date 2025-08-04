import { ScrollInteractionEvent } from '@/types/interruptEvent';
import { useCallback, useEffect, useRef } from 'react';

const SCROLL_DEBOUNCE_TIME = 5000;

function useScrollEvent(isRunning: boolean) {
  const scrollInteractionCount = useRef<ScrollInteractionEvent[]>([]);
  const scrollDebounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    if (scrollDebounceTimeoutRef.current) {
      clearTimeout(scrollDebounceTimeoutRef.current);
      scrollDebounceTimeoutRef.current = null;
    }

    return () => {
      if (scrollDebounceTimeoutRef.current) {
        clearTimeout(scrollDebounceTimeoutRef.current);
      }
    };
  }, [isRunning]);

  const handleScroll = useCallback(() => {
    if (!isRunning) {
      return;
    }

    if (scrollDebounceTimeoutRef.current) {
      clearTimeout(scrollDebounceTimeoutRef.current);
    }

    scrollDebounceTimeoutRef.current = setTimeout(() => {
      if (!isRunning) {
        return;
      }

      scrollInteractionCount.current.push({
        timestamp: Date.now(),
      });
    }, SCROLL_DEBOUNCE_TIME);
  }, [isRunning]);

  return {
    scrollInteractionCount,
    handleScroll,
  };
}

export default useScrollEvent;
