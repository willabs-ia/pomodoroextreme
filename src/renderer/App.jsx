import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TimerPage from './pages/TimerPage';
import BlockPage from './pages/BlockPage';
import SettingsPage from './pages/SettingsPage';
import OnboardingPage from './pages/OnboardingPage';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import './styles/App.css';

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if onboarding is complete
    const checkOnboarding = async () => {
      try {
        const complete = await window.electronAPI.isOnboardingComplete();
        setIsOnboardingComplete(complete);
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setIsOnboardingComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Pomodoro Extreme...</p>
      </div>
    );
  }

  return (
    <>
      {/* AudioPlayer - Global audio manager */}
      <AudioPlayer />

      <Router>
        <Routes>
          {!isOnboardingComplete ? (
            <>
              <Route
                path="/onboarding"
                element={<OnboardingPage onComplete={handleOnboardingComplete} />}
              />
              <Route path="*" element={<Navigate to="/onboarding" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/timer" element={<TimerPage />} />
              <Route path="/block" element={<BlockPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;
