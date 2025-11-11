const { Notification } = require('electron');
const path = require('path');

class NotificationManager {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.enabled = true;
    this.soundEnabled = true;
  }

  show(options) {
    if (!this.enabled) {
      console.log('Notifications disabled, skipping:', options.title);
      return null;
    }

    const notification = new Notification({
      title: options.title || 'Pomodoro Extreme',
      body: options.body || '',
      icon: options.icon || path.join(__dirname, '../../assets/images/icon.png'),
      silent: !this.soundEnabled,
      urgency: options.urgency || 'normal', // low, normal, critical
      timeoutType: options.timeoutType || 'default' // default, never
    });

    // Play custom sound if provided and sound is enabled
    if (this.soundEnabled && options.sound && this.audioManager) {
      this.audioManager.playSound(options.sound, options.volume);
    }

    notification.on('click', () => {
      if (options.onClick) {
        options.onClick();
      }
    });

    notification.show();

    console.log('Notification shown:', options.title);
    return notification;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    console.log(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    console.log(`Notification sounds ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Helper methods for common notifications
  pomodoroComplete(type) {
    const messages = {
      focus: {
        title: '🎯 Foco Completo!',
        body: 'Parabéns! Hora de descansar um pouco.'
      },
      shortBreak: {
        title: '☕ Pausa Curta Completa!',
        body: 'Pronto para mais um período de foco?'
      },
      longBreak: {
        title: '🌟 Pausa Longa Completa!',
        body: 'Você merece! Hora de voltar ao foco.'
      }
    };

    const message = messages[type] || messages.focus;

    return this.show({
      ...message,
      sound: 'alert',
      urgency: 'normal'
    });
  }

  breakStarting(seconds = 60) {
    return this.show({
      title: '⏰ Pausa se aproxima!',
      body: `Sua pausa começará em ${seconds} segundos. Prepare-se!`,
      sound: 'notification',
      urgency: 'normal'
    });
  }

  achievementUnlocked(achievement) {
    return this.show({
      title: `🏆 Conquista Desbloqueada!`,
      body: `${achievement.icon} ${achievement.name}\n${achievement.description}`,
      sound: 'achievement',
      urgency: 'normal',
      timeoutType: 'never' // Don't auto-hide
    });
  }

  inactivityDetected(minutes) {
    return this.show({
      title: '😴 Inatividade Detectada',
      body: `Você está inativo há ${minutes} minutos. O timer foi pausado.`,
      sound: 'notification',
      urgency: 'low'
    });
  }

  sessionRecovery() {
    return this.show({
      title: '💪 Sessão Interrompida',
      body: 'Detectamos uma sessão não finalizada. Deseja recuperá-la?',
      sound: 'notification',
      urgency: 'critical'
    });
  }
}

module.exports = { NotificationManager };
