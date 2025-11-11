import React, { useState } from 'react';
import '../styles/SettingsPage.css';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: '⚙️ Geral', icon: '⚙️' },
    { id: 'visual', label: '🎨 Visual', icon: '🎨' },
    { id: 'audio', label: '🔊 Áudio', icon: '🔊' },
    { id: 'projects', label: '📁 Projetos', icon: '📁' },
    { id: 'notifications', label: '🔔 Notificações', icon: '🔔' },
    { id: 'background', label: '🖼️ Fundos', icon: '🖼️' },
    { id: 'privacy', label: '🔒 Privacidade', icon: '🔒' },
    { id: 'integrations', label: '🔌 Integrações', icon: '🔌' }
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">Configurações</h1>
        <button className="btn btn-ghost">✕ Fechar</button>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2 className="section-title">Configurações Gerais</h2>

              <div className="form-group">
                <label className="form-label">Nível de Bloqueio</label>
                <select className="form-input">
                  <option value="soft">Suave - Pode pular com mensagens</option>
                  <option value="medium">Médio - Paga 3x ao pular</option>
                  <option value="extreme">Extremo - Sem escape</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Duração do Foco (minutos)</label>
                <input type="number" className="form-input" defaultValue="25" min="1" max="60" />
              </div>

              <div className="form-group">
                <label className="form-label">Duração da Pausa Curta (minutos)</label>
                <input type="number" className="form-input" defaultValue="5" min="1" max="30" />
              </div>

              <div className="form-group">
                <label className="form-label">Duração da Pausa Longa (minutos)</label>
                <input type="number" className="form-input" defaultValue="15" min="1" max="60" />
              </div>

              <div className="form-group">
                <label className="form-label">Pomodoros até Pausa Longa</label>
                <input type="number" className="form-input" defaultValue="4" min="2" max="10" />
              </div>
            </div>
          )}

          {activeTab === 'visual' && (
            <div className="settings-section">
              <h2 className="section-title">Configurações Visuais</h2>
              <p className="section-subtitle">Personalize a aparência do aplicativo</p>
              {/* TODO: Implement visual settings */}
            </div>
          )}

          {/* TODO: Implement other tabs */}
        </div>
      </div>

      <div className="settings-footer">
        <button className="btn btn-ghost">Restaurar Padrões</button>
        <div className="footer-actions">
          <button className="btn btn-ghost">Cancelar</button>
          <button className="btn btn-primary">Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
