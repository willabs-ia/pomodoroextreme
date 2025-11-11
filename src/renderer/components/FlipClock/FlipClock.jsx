import React from 'react';
import FlipDigit from './FlipDigit';
import './FlipClock.css';

function FlipClock({ timeRemaining, type = 'focus' }) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const minutesTens = Math.floor(minutes / 10);
  const minutesOnes = minutes % 10;
  const secondsTens = Math.floor(seconds / 10);
  const secondsOnes = seconds % 10;

  return (
    <div className={`flip-clock flip-clock-${type}`}>
      <div className="flip-section">
        <FlipDigit value={minutesTens} />
        <FlipDigit value={minutesOnes} />
      </div>

      <div className="flip-separator">:</div>

      <div className="flip-section">
        <FlipDigit value={secondsTens} />
        <FlipDigit value={secondsOnes} />
      </div>
    </div>
  );
}

export default FlipClock;
