import React, { useState } from 'react';
import '../styles/OnboardingPage.css';

function OnboardingPage({ onComplete }) {
  const [step, setStep] = useState(0);
  const [telemetryConsent, setTelemetryConsent] = useState(false);

  const steps = [
    {
      title: '🍅 Bem-vindo ao Pomodoro Extreme!',
      description:
        'O app que te obriga a descansar para você ser mais produtivo. Sim, você leu certo!',
      content: (
        <div className="onboarding-image">
          <div className="welcome-icon">🚀</div>
          <p className="welcome-text">
            Prepare-se para uma jornada de foco intenso e pausas forçadas!
          </p>
        </div>
      )
    },
    {
      title: '⚡ Como Funciona?',
      description: 'É simples: trabalhe focado e descanse de verdade!',
      content: (
        <div className="feature-list">
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <div>
              <h3>Períodos de Foco</h3>
              <p>25 minutos de concentração total (customizável)</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">☕</span>
            <div>
              <h3>Pausas Obrigatórias</h3>
              <p>5-15 minutos de descanso FORÇADO (sim, forçado mesmo!)</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <div>
              <h3>Bloqueio de Tela</h3>
              <p>Durante a pausa, você não consegue usar o PC. É sério!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '🎮 Escolha Seu Nível',
      description: 'Quão sério você está sobre cuidar de si mesmo?',
      content: (
        <div className="level-selection">
          <div className="level-card">
            <h3>😊 Suave</h3>
            <p>Pode pular pausas (mas terá que ouvir umas verdades antes)</p>
          </div>
          <div className="level-card recommended">
            <div className="recommended-badge">Recomendado</div>
            <h3>😤 Médio</h3>
            <p>Pode pular 3x, mas paga TRIPLO na próxima pausa</p>
          </div>
          <div className="level-card">
            <h3>🔥 Extremo</h3>
            <p>SEM ESCAPE! Só reiniciando o PC (você sabe o risco)</p>
          </div>
        </div>
      )
    },
    {
      title: '🔒 Privacidade e Dados',
      description: 'Seus dados, suas escolhas',
      content: (
        <div className="privacy-section">
          <div className="privacy-card">
            <h3>📊 Telemetria Opcional</h3>
            <p>
              Podemos coletar dados anônimos de uso para melhorar o app?
              Nenhum dado pessoal é coletado, apenas estatísticas de uso e erros.
            </p>

            <div className="consent-option">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={telemetryConsent}
                  onChange={(e) => setTelemetryConsent(e.target.checked)}
                />
                <span>
                  Sim, quero ajudar a melhorar o Pomodoro Extreme compartilhando dados
                  anônimos
                </span>
              </label>
            </div>

            <p className="privacy-note">
              Você pode mudar isso a qualquer momento nas configurações.
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await window.electronAPI.setTelemetryConsent(telemetryConsent);
      await window.electronAPI.completeOnboarding();
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const currentStep = steps[step];

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <h1 className="onboarding-title">{currentStep.title}</h1>
          <p className="onboarding-description">{currentStep.description}</p>
        </div>

        <div className="onboarding-content">{currentStep.content}</div>

        <div className="onboarding-footer">
          <div className="step-indicators">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`step-indicator ${index === step ? 'active' : ''} ${
                  index < step ? 'completed' : ''
                }`}
              />
            ))}
          </div>

          <div className="onboarding-actions">
            {step > 0 && (
              <button className="btn btn-ghost" onClick={handlePrev}>
                ← Voltar
              </button>
            )}
            <button className="btn btn-primary btn-lg" onClick={handleNext}>
              {step < steps.length - 1 ? 'Próximo →' : '🚀 Começar!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
