import React, { useState, useEffect } from 'react';
import '../styles/TimerPage.css';

function TimerPage() {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState('focus'); // focus, shortBreak, longBreak

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    // TODO: Send to TimerEngine
  };

  const handlePause = () => {
    setIsRunning(false);
    // TODO: Send to TimerEngine
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeRemaining(25 * 60);
    // TODO: Send to TimerEngine
  };

  return (
    <div className="page timer-page">
      <div className="timer-container">
        <div className="timer-type-badge">
          {timerType === 'focus' ? '🎯 FOCO' : '☕ PAUSA'}
        </div>

        <div className="timer-display">
          {formatTime(timeRemaining)}
        </div>

        <div className="timer-progress">
          <div
            className="timer-progress-bar"
            style={{ width: `${(timeRemaining / (25 * 60)) * 100}%` }}
          />
        </div>

        <div className="timer-controls">
          {!isRunning ? (
            <button className="btn btn-primary btn-lg" onClick={handleStart}>
              ▶️ Iniciar
            </button>
          ) : (
            <button className="btn btn-warning btn-lg" onClick={handlePause}>
              ⏸️ Pausar
            </button>
          )}
          <button className="btn btn-danger" onClick={handleStop}>
            ⏹️ Parar
          </button>
        </div>

        <div className="session-info">
          <div className="info-item">
            <span className="info-label">Pomodoros hoje</span>
            <span className="info-value">0 / 8</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tempo focado</span>
            <span className="info-value">0h 0m</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimerPage;
