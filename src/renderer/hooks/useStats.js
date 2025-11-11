import { useState, useEffect, useCallback } from 'react';

/**
 * useStats - Hook para gerenciar estatísticas e métricas
 */
function useStats(projectId = null, period = 'today') {
  const [stats, setStats] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.getStats(projectId, period);
      setStats(data || getEmptyStats());
      setError(null);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError(err.message);
      setStats(getEmptyStats());
    } finally {
      setLoading(false);
    }
  }, [projectId, period]);

  // Carregar dashboard completo
  const loadDashboard = useCallback(async () => {
    try {
      const data = await window.electronAPI.getDashboard();
      setDashboard(data || getEmptyDashboard());
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setDashboard(getEmptyDashboard());
    }
  }, []);

  useEffect(() => {
    loadStats();
    if (!projectId) {
      loadDashboard();
    }
  }, [loadStats, loadDashboard, projectId]);

  // Exportar estatísticas
  const exportStats = useCallback(
    async (format = 'json', exportPeriod = period) => {
      try {
        const result = await window.electronAPI.exportStats(format, exportPeriod);
        return result;
      } catch (err) {
        console.error('Error exporting stats:', err);
        throw err;
      }
    },
    [period]
  );

  // Calcular produtividade (%)
  const calculateProductivity = useCallback(() => {
    if (!stats) return 0;

    const { totalPomodoros, completedPomodoros } = stats;
    if (totalPomodoros === 0) return 0;

    return Math.round((completedPomodoros / totalPomodoros) * 100);
  }, [stats]);

  // Calcular streak atual
  const getCurrentStreak = useCallback(() => {
    return stats?.streak || 0;
  }, [stats]);

  // Obter melhor dia
  const getBestDay = useCallback(() => {
    if (!stats?.dailyBreakdown) return null;

    let best = null;
    let maxPomodoros = 0;

    Object.entries(stats.dailyBreakdown).forEach(([date, data]) => {
      if (data.pomodoros > maxPomodoros) {
        maxPomodoros = data.pomodoros;
        best = { date, pomodoros: data.pomodoros };
      }
    });

    return best;
  }, [stats]);

  return {
    stats,
    dashboard,
    loading,
    error,
    loadStats,
    loadDashboard,
    exportStats,
    calculateProductivity,
    getCurrentStreak,
    getBestDay
  };
}

// Estatísticas vazias
function getEmptyStats() {
  return {
    totalPomodoros: 0,
    completedPomodoros: 0,
    skippedBreaks: 0,
    totalFocusTime: 0, // minutos
    totalBreakTime: 0,
    streak: 0,
    longestStreak: 0,
    averagePomodoros: 0,
    dailyBreakdown: {},
    weeklyTrend: [],
    topProjects: []
  };
}

// Dashboard vazio
function getEmptyDashboard() {
  return {
    today: getEmptyStats(),
    thisWeek: getEmptyStats(),
    thisMonth: getEmptyStats(),
    allTime: getEmptyStats(),
    recentSessions: [],
    achievements: {
      unlocked: 0,
      total: 12
    },
    reputation: {
      level: 'Iniciante',
      points: 0,
      nextLevel: 'Aprendiz',
      pointsToNext: 50
    }
  };
}

export default useStats;
