import { useState, useEffect, useCallback } from 'react';

function useTimer() {
  const [timerState, setTimerState] = useState({
    isRunning: false,
    isPaused: false,
    timeRemaining: 0,
    plannedDuration: 0,
    type: null,
    pomodorosCompleted: 0,
    currentProject: null,
    currentSession: null,
    percentage: 0,
    blockLevel: null
  });

  useEffect(() => {
    // Listen to timer events from main process
    const handleTick = (data) => {
      setTimerState((prev) => ({
        ...prev,
        timeRemaining: data.timeRemaining,
        percentage: data.percentage
      }));
    };

    const handlePomodoroStarted = (data) => {
      setTimerState((prev) => ({
        ...prev,
        isRunning: true,
        isPaused: false,
        type: data.type,
        plannedDuration: data.duration
      }));
    };

    const handlePomodoroCompleted = (data) => {
      setTimerState((prev) => ({
        ...prev,
        pomodorosCompleted: data.pomodorosCompleted || prev.pomodorosCompleted
      }));
    };

    const handlePaused = () => {
      setTimerState((prev) => ({ ...prev, isPaused: true }));
    };

    const handleResumed = () => {
      setTimerState((prev) => ({ ...prev, isPaused: false }));
    };

    const handleStopped = () => {
      setTimerState((prev) => ({
        ...prev,
        isRunning: false,
        isPaused: false
      }));
    };

    const handleSessionEnded = () => {
      setTimerState({
        isRunning: false,
        isPaused: false,
        timeRemaining: 0,
        plannedDuration: 0,
        type: null,
        pomodorosCompleted: 0,
        currentProject: null,
        currentSession: null,
        percentage: 0,
        blockLevel: null
      });
    };

    window.electronAPI.onTimerTick(handleTick);
    // Note: Need to implement the actual event listeners in preload

    return () => {
      // Cleanup listeners
      window.electronAPI.removeListener?.('timer:tick', handleTick);
    };
  }, []);

  const startTimer = useCallback(async (projectId) => {
    try {
      await window.electronAPI.startTimer({ projectId });

      // Get updated state
      const state = await window.electronAPI.getTimerState?.();
      if (state) {
        setTimerState(state);
      }
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  }, []);

  const pauseTimer = useCallback(() => {
    window.electronAPI.pauseTimer();
  }, []);

  const resumeTimer = useCallback(() => {
    window.electronAPI.resumeTimer();
  }, []);

  const stopTimer = useCallback(() => {
    window.electronAPI.stopTimer();
  }, []);

  const skipBreak = useCallback(async (reason) => {
    try {
      const result = await window.electronAPI.skipBreak?.(reason);
      return result;
    } catch (error) {
      console.error('Error skipping break:', error);
      return { success: false, error: error.message };
    }
  }, []);

  return {
    ...timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    skipBreak
  };
}

export default useTimer;
