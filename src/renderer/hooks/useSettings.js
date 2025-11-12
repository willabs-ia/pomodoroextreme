import { useState, useEffect, useCallback } from 'react';

/**
 * useSettings - Hook para gerenciar configurações globais e por projeto
 */
function useSettings(projectId = null) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar configurações
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const config = await window.electronAPI.getConfig(projectId);
      setSettings(config || getDefaultSettings());
      setError(null);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError(err.message);
      setSettings(getDefaultSettings());
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Atualizar configurações
  const updateSettings = useCallback(
    async (updates) => {
      try {
        const updatedConfig = await window.electronAPI.updateConfig(projectId, updates);
        setSettings(updatedConfig);
        return updatedConfig;
      } catch (err) {
        console.error('Error updating settings:', err);
        throw err;
      }
    },
    [projectId]
  );

  // Atualizar um campo específico
  const updateField = useCallback(
    async (field, value) => {
      return updateSettings({ [field]: value });
    },
    [updateSettings]
  );

  // Reset para padrões
  const resetToDefaults = useCallback(async () => {
    const defaults = getDefaultSettings();
    return updateSettings(defaults);
  }, [updateSettings]);

  return {
    settings,
    loading,
    error,
    loadSettings,
    updateSettings,
    updateField,
    resetToDefaults
  };
}

// Configurações padrão
function getDefaultSettings() {
  return {
    // Durações (em minutos)
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    pomodorosUntilLongBreak: 4,

    // Auto-start
    autoStartFocus: false,
    autoStartBreak: true,

    // Nível de bloqueio
    blockLevel: 'soft', // soft, medium, extreme

    // Visual
    theme: 'dark', // light, dark, auto
    accentColor: '#E53E3E',
    backgroundType: 'gradient', // gradient, solid, image, video
    backgroundValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    transparency: 1.0,
    fontSize: 'medium', // small, medium, large

    // Áudio
    enableTickSound: true,
    tickVolume: 0.2,
    enableAlerts: true,
    alertVolume: 0.5,
    enableBreakMusic: false,
    breakMusicSource: null,
    musicVolume: 0.3,

    // Notificações
    enableNotifications: true,
    notificationSound: true,
    notificationPosition: 'top-right', // top-right, top-left, bottom-right, bottom-left

    // DND (Do Not Disturb)
    enableDND: false,
    pauseMediaOnFocus: true,

    // Inatividade
    detectInactivity: true,
    inactivityTimeout: 5, // minutos

    // Atalhos
    shortcuts: {
      startPause: 'CommandOrControl+Shift+S',
      stop: 'CommandOrControl+Shift+X',
      skipBreak: 'CommandOrControl+Shift+K'
    },

    // Integrations
    spotifyEnabled: false,
    spotifyPlaylistId: null,

    // Gamificação
    enableAchievements: true,
    enableReputation: true,
    enableRewards: true,

    // Avançado
    showInTray: true,
    startMinimized: false,
    closeToTray: true,
    launchAtStartup: false,
    language: 'pt-BR', // pt-BR, en-US

    // Dados
    telemetryEnabled: false,
    backupEnabled: true,
    backupFrequency: 'daily' // daily, weekly, never
  };
}

export default useSettings;
