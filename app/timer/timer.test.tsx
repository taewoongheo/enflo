import { ThemeProvider } from '@/contexts/ThemeContext';
import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import Timer from './index';

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

const renderWithProviders = (children: React.ReactNode) => {
  return render(<ThemeProvider>{children}</ThemeProvider>);
};

jest.useFakeTimers();

describe('Timer', () => {
  it('should render Timer component', () => {
    const { getByTestId } = renderWithProviders(<Timer />);
    expect(getByTestId).toBeDefined();
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
