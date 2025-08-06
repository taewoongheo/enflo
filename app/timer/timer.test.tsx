import { ThemeProvider } from '@/contexts/ThemeContext';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AppState } from 'react-native';
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

  describe('background event', () => {
    it('should handle app background status when timer is running', async () => {
      // given
      const { getByTestId } = renderWithProviders(<Timer />);
      const playPauseButton = getByTestId('timer-play-pause-button');

      // when
      fireEvent.press(playPauseButton);
      mockAppState.emitChange('background');
      mockAppState.emitChange('active');

      // then
      // The background event should be handled by the useBackgroundEvent hook
      expect(mockResetBackgroundEvent).toHaveBeenCalled();
    });

    it('should handle app background status when timer is paused', async () => {
      // given
      renderWithProviders(<Timer />);

      // when
      mockAppState.emitChange('background');
      mockAppState.emitChange('active');

      // then
      // The background event should be handled by the useBackgroundEvent hook
      expect(mockResetBackgroundEvent).toHaveBeenCalled();
    });
  });

  describe('scroll event', () => {
    it('should handle scroll interactions when timer is running', async () => {
      // given
      const { getByTestId } = renderWithProviders(<Timer />);
      const playPauseButton = getByTestId('timer-play-pause-button');

      // when
      fireEvent.press(playPauseButton);
      // Simulate scroll events
      const scrollView = getByTestId('timer-scroll-view');
      fireEvent.scroll(scrollView, {
        nativeEvent: { contentOffset: { y: 100 } },
      });
      fireEvent.scroll(scrollView, {
        nativeEvent: { contentOffset: { y: 200 } },
      });

      // then
      expect(mockHandleScroll).toHaveBeenCalled();
    });

    it('should handle scroll interactions when timer is paused', async () => {
      // given
      const { getByTestId } = renderWithProviders(<Timer />);

      // when
      const scrollView = getByTestId('timer-scroll-view');
      fireEvent.scroll(scrollView, {
        nativeEvent: { contentOffset: { y: 100 } },
      });

      // then
      expect(mockHandleScroll).toHaveBeenCalled();
    });
  });
});
