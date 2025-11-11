import React, { useState, useEffect } from 'react';

function FlipDigit({ value }) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== currentValue) {
      setIsFlipping(true);

      setTimeout(() => {
        setCurrentValue(value);
        setIsFlipping(false);
      }, 300); // Match animation duration
    }
  }, [value, currentValue]);

  return (
    <div className={`flip-digit ${isFlipping ? 'flipping' : ''}`}>
      <div className="flip-card">
        <div className="flip-card-top">
          <span>{currentValue}</span>
        </div>
        <div className="flip-card-bottom">
          <span>{currentValue}</span>
        </div>
        {isFlipping && (
          <>
            <div className="flip-card-top-flip">
              <span>{currentValue}</span>
            </div>
            <div className="flip-card-bottom-flip">
              <span>{value}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FlipDigit;
