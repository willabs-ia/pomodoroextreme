import { useState, useEffect, useCallback } from 'react';
import useToast from './useToast';

function useTimer() {
  const toast = useToast();
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
        plannedDuration: data.duration,
        currentProject: data.project,
        currentSession: data.session
      }));
      // Show toast notification
      const projectName = data.project?.name;
      toast.pomodoroStarted(projectName);
    };

    const handlePomodoroCompleted = (data) => {
      setTimerState((prev) => ({
        ...prev,
        pomodorosCompleted: data.pomodorosCompleted || prev.pomodorosCompleted + 1
      }));
      // Show toast notification
      toast.pomodoroCompleted();
    };

    const handleBreakStarted = (data) => {
      setTimerState((prev) => ({
        ...prev,
        isRunning: true,
        isPaused: false,
        type: data.type,
        plannedDuration: data.duration
      }));
      // Show toast notification
      const duration = Math.floor(data.duration / 60); // Convert seconds to minutes
      toast.breakStarted(duration);
    };

    const handleBreakCompleted = () => {
      // Break completed, will transition to next pomodoro
      toast.breakCompleted();
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

    const handleSessionStarted = (data) => {
      setTimerState((prev) => ({
        ...prev,
        currentSession: data.session,
        currentProject: data.project,
        blockLevel: data.blockLevel
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

    // Register all event listeners
    window.electronAPI.onTimerTick(handleTick);
    window.electronAPI.onPomodoroStarted(handlePomodoroStarted);
    window.electronAPI.onPomodoroCompleted(handlePomodoroCompleted);
    window.electronAPI.onBreakStarted(handleBreakStarted);
    window.electronAPI.onBreakCompleted(handleBreakCompleted);
    window.electronAPI.onTimerPaused(handlePaused);
    window.electronAPI.onTimerResumed(handleResumed);
    window.electronAPI.onTimerStopped(handleStopped);
    window.electronAPI.onSessionStarted(handleSessionStarted);
    window.electronAPI.onSessionEnded(handleSessionEnded);

    return () => {
      // Cleanup listeners
      window.electronAPI.removeListener?.('timer:tick', handleTick);
      window.electronAPI.removeListener?.('pomodoro:started', handlePomodoroStarted);
      window.electronAPI.removeListener?.('pomodoro:completed', handlePomodoroCompleted);
      window.electronAPI.removeListener?.('break:started', handleBreakStarted);
      window.electronAPI.removeListener?.('break:completed', handleBreakCompleted);
      window.electronAPI.removeListener?.('timer:paused', handlePaused);
      window.electronAPI.removeListener?.('timer:resumed', handleResumed);
      window.electronAPI.removeListener?.('timer:stopped', handleStopped);
      window.electronAPI.removeListener?.('session:started', handleSessionStarted);
      window.electronAPI.removeListener?.('session:ended', handleSessionEnded);
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
