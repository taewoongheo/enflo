import { ThemeProvider } from '@/contexts/ThemeContext';
import { DisturbanceCountEvent } from '@/types/interruptEvent';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React, { createRef } from 'react';
import { AppState } from 'react-native';
import Timer from './index';

const mockAppState = {
  // currentState: 'active' as const,
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
      id: 'test-session-id',
      title: 'Test Session',
      duration: 300000, // 5 minutes
      createdAt: new Date().toISOString(),
    },
    isLoading: false,
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

  describe('disturbance event', () => {
    describe('background event', () => {
      it('should count app background status when timer is running', async () => {
        // given
        const screenUnlockCountTestRef = createRef<DisturbanceCountEvent[]>();
        screenUnlockCountTestRef.current = [];
        const { getByTestId } = renderWithProviders(
          <Timer screenUnlockCountTestRef={screenUnlockCountTestRef} />,
        );
        const playPauseButton = getByTestId('timer-play-pause-button');

        // when
        fireEvent.press(playPauseButton);
        mockAppState.emitChange('background');
        mockAppState.emitChange('active');

        mockAppState.emitChange('background');

        // then
        expect(screenUnlockCountTestRef.current).toHaveLength(2);
      });

      it('should not count app background status when timer is paused', async () => {
        // given
        const screenUnlockCountTestRef = createRef<DisturbanceCountEvent[]>();
        screenUnlockCountTestRef.current = [];
        renderWithProviders(
          <Timer screenUnlockCountTestRef={screenUnlockCountTestRef} />,
        );

        // when
        mockAppState.emitChange('background');
        mockAppState.emitChange('active');

        // then
        expect(screenUnlockCountTestRef.current).toHaveLength(0);
      });
    });
  });
});
