import * as entropyModule from '@/components/TimerPage/utils/calculateEntropyScore';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { afterEach, describe, expect, it, jest, test } from '@jest/globals';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AppState } from 'react-native';
import { scale } from 'react-native-size-matters';
import Timer from './index';

const mockAppState = {
  _callback: null as
    | ((state: 'active' | 'background' | 'inactive') => void)
    | null,
  emitChange: (state: 'active' | 'background' | 'inactive') => {
    mockAppState._callback?.(state);
  },
};

jest
  .spyOn(AppState, 'addEventListener')
  .mockImplementation((event, callback) => {
    mockAppState._callback = callback as (
      state: 'active' | 'background' | 'inactive',
    ) => void;
    return { remove: jest.fn() };
  });

const renderWithProviders = (children: React.ReactNode) => {
  return render(<ThemeProvider>{children}</ThemeProvider>);
};

// Mock the useSession hook
jest.mock('@/components/TimerPage/hooks/useSession', () => ({
  __esModule: true,
  default: () => ({
    session: {
      sessionId: 'test-session-id',
      title: 'Test Session',
      duration: 300000, // 5 minutes
      createdAt: new Date().toISOString(),
    },
    isLoading: false,
  }),
}));

// Mock the useBackgroundEvent hook
const mockResetBackgroundEvent = jest.fn();
jest.mock('@/components/TimerPage/hooks/useBackgroundEvent', () => ({
  __esModule: true,
  default: () => ({
    screenBackgroundCount: { current: 0 },
    resetBackgroundEvent: mockResetBackgroundEvent,
  }),
}));

// Mock the useScrollEvent hook
const mockHandleScroll = jest.fn();
const mockResetScrollEvent = jest.fn();
jest.mock('@/components/TimerPage/hooks/useScrollEvent', () => ({
  __esModule: true,
  default: () => ({
    scrollInteractionCount: { current: 0 },
    handleScroll: mockHandleScroll,
    resetScrollEvent: mockResetScrollEvent,
  }),
}));

// Mock the usePauseEvent hook
const mockResetPauseEvent = jest.fn();
jest.mock('@/components/TimerPage/hooks/usePauseEvent', () => ({
  __esModule: true,
  default: () => ({
    pauseEvent: { current: [] },
    resetPauseEvent: mockResetPauseEvent,
  }),
}));

jest.useFakeTimers();

describe('Timer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Timer component', () => {
    renderWithProviders(<Timer />);
  });

  it('should start timer when timer-play-pause-button is clicked and timer is paused', async () => {
    // given
    const { getByTestId } = renderWithProviders(<Timer />);
    const timer = getByTestId('timer');
    const playPauseButton = getByTestId('timer-play-pause-button');

    const START_TIME = '05:00';

    timer.props.children = START_TIME;

    // when
    fireEvent.press(playPauseButton);

    // then
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(getByTestId('timer')).toHaveTextContent('04:59');
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(getByTestId('timer')).toHaveTextContent('04:58');
    });
  });

  it('should pause timer when timer-play-pause-button is clicked and timer is running', async () => {
    // given
    const { getByTestId } = renderWithProviders(<Timer />);
    const playPauseButton = getByTestId('timer-play-pause-button');

    // when
    fireEvent.press(playPauseButton);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    fireEvent.press(playPauseButton);

    // then
    // assume timer setting is 5 minutes
    await waitFor(() => {
      expect(getByTestId('timer')).toHaveTextContent('04:59');
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(getByTestId('timer')).toHaveTextContent('04:59');
    });
  });
});

// 타이머 시간이 변경될 때마다 calculateEntropyScore 함수가 호출되는지
describe('Timer EntropyScore', () => {
  it('calls calculateEntropyScore whenever timer time changes', async () => {
    const spy = jest.spyOn(entropyModule, 'calculateEntropyScore');
    const { getByTestId } = renderWithProviders(<Timer />);
    const slider = getByTestId('timer-tuner-slider');

    // Simulate scroll event to change timer time
    act(() => {
      slider.props.onMomentumScrollEnd({
        nativeEvent: { contentOffset: { x: 5 * (scale(5) + scale(4)) } }, // simulate scroll to index 1 (10 minutes)
      });
    });

    // Wait for effect
    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    act(() => {
      slider.props.onMomentumScrollEnd({
        nativeEvent: { contentOffset: { x: 10 * (scale(5) + scale(4)) } }, // simulate scroll to index 1 (10 minutes)
      });
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    spy.mockRestore();
  });

  // 타이머가 00:00 이 되면, calculateEntropyScore 함수가 호출되는지
  it('calls calculateEntropyScore when timer reaches 00:00', async () => {
    const spy = jest.spyOn(entropyModule, 'calculateEntropyScore');
    const { getByTestId } = renderWithProviders(<Timer />);
    const playPauseButton = getByTestId('timer-play-pause-button');
    const timer = getByTestId('timer');

    // Start the timer
    fireEvent.press(playPauseButton);

    // Advance timers until 00:00 (5 minutes = 300,000 ms)
    act(() => {
      jest.advanceTimersByTime(300000);
    });

    // Wait for timer to reach 00:00 and for calculateEntropyScore to be called
    await waitFor(() => {
      expect(timer).toHaveTextContent('00:00');
      expect(spy).toHaveBeenCalled();
    });

    act(() => {
      jest.advanceTimersByTime(90000);
    });

    await waitFor(() => {
      expect(timer).toHaveTextContent('00:00');
      expect(spy).toHaveBeenCalled();
    });

    spy.mockRestore();
  });

  // 여러 time 에 대해 테스트(5 ~ 90)
  const times = Array.from({ length: 18 }, (_, i) => (i + 1) * 5); // [5, 10, ..., 90]
  test.each(times)(
    'calls calculateEntropyScore for timer duration %d minutes',
    async (minutes) => {
      const spy = jest.spyOn(entropyModule, 'calculateEntropyScore');
      const { getByTestId } = renderWithProviders(<Timer />);
      const slider = getByTestId('timer-tuner-slider');
      const playPauseButton = getByTestId('timer-play-pause-button');
      const timer = getByTestId('timer');

      // Set timer to desired minutes via slider
      act(() => {
        slider.props.onMomentumScrollEnd({
          nativeEvent: {
            contentOffset: { x: (minutes / 5 - 1) * (scale(5) + scale(4)) },
          },
        });
      });

      // Start the timer
      fireEvent.press(playPauseButton);

      // Advance timers until 00:00
      act(() => {
        jest.advanceTimersByTime(minutes * 60 * 1000);
      });

      // Wait for timer to reach 00:00 and for calculateEntropyScore to be called
      await waitFor(() => {
        expect(timer).toHaveTextContent('00:00');
        expect(spy).toHaveBeenCalled();
      });

      spy.mockRestore();
    },
  );
});

// 타이머가 변경될 떄마다 방해 이벤트가 초기화되는지
// 타이머가 변경될 떄마다 타이머 세션이 생성되는지
// 타이머가 변경될 때마다 이전에 있던 방해 이벤트들이 초기화되는지
//  puase, app state, scroll 각각 테스트
// entropy score 결과값 시뮬레이션
//  여러 값들에 대해 상황별로 값 시뮬레이션(타이머 설정 시간 및 여러 방해 이벤트 설정)
//  만약 순수 몰입 시간이 5분 이내면 null 반환

describe('Timer Disturbance Reset', () => {
  it('resets disturbance event refs whenever timer time changes', async () => {
    // Create mock refs with initial values
    const mockScreenBackgroundCount = { current: [1, 2, 3] };
    const mockScrollInteractionCount = { current: [4, 5, 6] };
    const mockPauseEvent = { current: [7, 8, 9] };

    // Reset functions that actually clear the refs
    const resetBackgroundEvent = jest.fn(() => {
      mockScreenBackgroundCount.current = [];
    });
    const resetScrollEvent = jest.fn(() => {
      mockScrollInteractionCount.current = [];
    });
    const resetPauseEvent = jest.fn(() => {
      mockPauseEvent.current = [];
    });

    // Override the hooks to use our mock refs and resetters
    jest.doMock('@/components/TimerPage/hooks/useBackgroundEvent', () => ({
      __esModule: true,
      default: () => ({
        screenBackgroundCount: mockScreenBackgroundCount,
        resetBackgroundEvent,
      }),
    }));
    jest.doMock('@/components/TimerPage/hooks/useScrollEvent', () => ({
      __esModule: true,
      default: () => ({
        scrollInteractionCount: mockScrollInteractionCount,
        handleScroll: jest.fn(),
        resetScrollEvent,
      }),
    }));
    jest.doMock('@/components/TimerPage/hooks/usePauseEvent', () => ({
      __esModule: true,
      default: () => ({
        pauseEvent: mockPauseEvent,
        resetPauseEvent,
      }),
    }));

    // Re-require Timer after mocks
    const TimerWithMocks = require('./index').default;
    const { getByTestId } = renderWithProviders(<TimerWithMocks />);
    const slider = getByTestId('timer-tuner-slider');

    // Before time change, refs have values
    expect(mockScreenBackgroundCount.current.length).toBe(3);
    expect(mockScrollInteractionCount.current.length).toBe(3);
    expect(mockPauseEvent.current.length).toBe(3);

    // Simulate timer time change
    act(() => {
      slider.props.onMomentumScrollEnd({
        nativeEvent: { contentOffset: { x: 5 * (scale(5) + scale(4)) } },
      });
    });

    // After time change, refs should be reset (emptied)
    expect(resetBackgroundEvent).toHaveBeenCalled();
    expect(resetScrollEvent).toHaveBeenCalled();
    expect(resetPauseEvent).toHaveBeenCalled();
    expect(mockScreenBackgroundCount.current.length).toBe(0);
    expect(mockScrollInteractionCount.current.length).toBe(0);
    expect(mockPauseEvent.current.length).toBe(0);
  });
});
