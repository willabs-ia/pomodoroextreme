import React, { useState, useEffect } from 'react';
import '../styles/BlockPage.css';

function BlockPage() {
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes
  const [currentPhrase, setCurrentPhrase] = useState('Hora de descansar! 😊');
  const [currentActivity, setCurrentActivity] = useState('Beba água');

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const activities = [
    '💧 Beba água',
    '🚶 Levante e caminhe',
    '🙆 Alongue o pescoço e ombros',
    '👀 Olhe para longe por 20 segundos',
    '🧘 Respire fundo 5 vezes',
    '🍎 Coma uma fruta',
    '🪟 Olhe pela janela'
  ];

  useEffect(() => {
    // Rotate activities
    const interval = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setCurrentActivity(randomActivity);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="block-page">
      <div className="block-content">
        <h1 className="block-title">☕ Pausa para Descanso</h1>
        <p className="block-phrase">{currentPhrase}</p>

        <div className="block-timer">
          {formatTime(timeRemaining)}
        </div>

        <div className="block-progress">
          <div
            className="block-progress-fill"
            style={{ width: `${(timeRemaining / (5 * 60)) * 100}%` }}
          />
        </div>

        <div className="activity-suggestions">
          <h2 className="activity-title">Enquanto isso...</h2>
          <div className="activity-current">{currentActivity}</div>
        </div>

        <div className="block-footer">
          <p className="block-footer-text">
            Relaxe! Seu corpo e mente agradecem 🌟
          </p>
        </div>
      </div>

      {/* Music player placeholder */}
      <div className="music-control">
        <button className="music-btn">🎵</button>
      </div>
    </div>
  );
}

export default BlockPage;
