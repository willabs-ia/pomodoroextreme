import toast from 'react-hot-toast';

/**
 * useToast - Custom hook for toast notifications
 * Wraps react-hot-toast with Pomodoro-specific styling
 */
function useToast() {
  // Success toast
  const success = (message, options = {}) => {
    return toast.success(message, {
      duration: options.duration || 3000,
      ...options
    });
  };

  // Error toast
  const error = (message, options = {}) => {
    return toast.error(message, {
      duration: options.duration || 4000,
      ...options
    });
  };

  // Info toast
  const info = (message, options = {}) => {
    return toast(message, {
      icon: 'ℹ️',
      duration: options.duration || 3000,
      ...options
    });
  };

  // Warning toast
  const warning = (message, options = {}) => {
    return toast(message, {
      icon: '⚠️',
      duration: options.duration || 4000,
      style: {
        background: '#DD6B20',
        color: '#fff'
      },
      ...options
    });
  };

  // Pomodoro-specific toasts
  const pomodoroStarted = (projectName) => {
    return toast.success(`🍅 Pomodoro iniciado${projectName ? ` - ${projectName}` : ''}!`, {
      duration: 2000
    });
  };

  const pomodoroCompleted = () => {
    return toast.success('✅ Pomodoro completado! Hora de descansar.', {
      duration: 3000
    });
  };

  const breakStarted = (duration) => {
    return toast(`☕ Pausa de ${duration} minutos iniciada`, {
      icon: '🎉',
      duration: 2000
    });
  };

  const breakCompleted = () => {
    return toast.success('✨ Pausa concluída! Pronto para focar novamente?', {
      duration: 3000
    });
  };

  const breakSkipped = (reason) => {
    return toast.error(`⏭️ Pausa pulada${reason ? `: ${reason}` : ''}`, {
      duration: 3000
    });
  };

  const achievementUnlocked = (achievementName) => {
    return toast.success(`🏆 Conquista desbloqueada: ${achievementName}!`, {
      duration: 5000,
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        fontWeight: 'bold'
      }
    });
  };

  const levelUp = (newLevel) => {
    return toast.success(`🎊 Level Up! Agora você é: ${newLevel}`, {
      duration: 5000,
      style: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: '#fff',
        fontWeight: 'bold'
      }
    });
  };

  // Loading toast
  const loading = (message) => {
    return toast.loading(message);
  };

  // Promise toast (for async operations)
  const promise = (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Carregando...',
      success: messages.success || 'Sucesso!',
      error: messages.error || 'Erro ao processar'
    });
  };

  // Dismiss toast
  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  // Dismiss all toasts
  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    success,
    error,
    info,
    warning,
    pomodoroStarted,
    pomodoroCompleted,
    breakStarted,
    breakCompleted,
    breakSkipped,
    achievementUnlocked,
    levelUp,
    loading,
    promise,
    dismiss,
    dismissAll
  };
}

export default useToast;
