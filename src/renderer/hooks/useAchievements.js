import { useState, useEffect, useCallback } from 'react';

/**
 * useAchievements - Hook para gerenciar conquistas e reputação
 */
function useAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar conquistas
  const loadAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.getAchievements();
      setAchievements(data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading achievements:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar reputação
  const loadReputation = useCallback(async () => {
    try {
      const data = await window.electronAPI.getReputation();
      setReputation(data || getDefaultReputation());
    } catch (err) {
      console.error('Error loading reputation:', err);
      setReputation(getDefaultReputation());
    }
  }, []);

  useEffect(() => {
    loadAchievements();
    loadReputation();
  }, [loadAchievements, loadReputation]);

  // Desbloquear conquista manualmente (debug)
  const unlockAchievement = useCallback(async (achievementId) => {
    try {
      const result = await window.electronAPI.unlockAchievement(achievementId);
      await loadAchievements();
      await loadReputation();
      return result;
    } catch (err) {
      console.error('Error unlocking achievement:', err);
      throw err;
    }
  }, [loadAchievements, loadReputation]);

  // Filtrar conquistas
  const getUnlockedAchievements = useCallback(() => {
    return achievements.filter(a => a.isUnlocked);
  }, [achievements]);

  const getLockedAchievements = useCallback(() => {
    return achievements.filter(a => !a.isUnlocked);
  }, [achievements]);

  const getAchievementById = useCallback(
    (id) => {
      return achievements.find(a => a.id === id);
    },
    [achievements]
  );

  // Calcular progresso até próxima conquista
  const getProgressToNextAchievement = useCallback(() => {
    const locked = getLockedAchievements();
    if (locked.length === 0) return null;

    // Encontrar conquista mais próxima de ser desbloqueada
    let closest = null;
    let closestProgress = 0;

    locked.forEach(achievement => {
      if (achievement.progress && achievement.target) {
        const progress = (achievement.progress / achievement.target) * 100;
        if (progress > closestProgress) {
          closestProgress = progress;
          closest = { ...achievement, progressPercent: progress };
        }
      }
    });

    return closest;
  }, [getLockedAchievements]);

  // Calcular progresso geral
  const getOverallProgress = useCallback(() => {
    if (achievements.length === 0) return 0;
    const unlocked = getUnlockedAchievements();
    return Math.round((unlocked.length / achievements.length) * 100);
  }, [achievements, getUnlockedAchievements]);

  return {
    achievements,
    reputation,
    loading,
    error,
    loadAchievements,
    loadReputation,
    unlockAchievement,
    getUnlockedAchievements,
    getLockedAchievements,
    getAchievementById,
    getProgressToNextAchievement,
    getOverallProgress
  };
}

// Reputação padrão
function getDefaultReputation() {
  return {
    level: 'Iniciante',
    points: 0,
    rank: 1,
    nextLevel: 'Aprendiz',
    pointsToNext: 50,
    totalLevels: 8,
    history: []
  };
}

export default useAchievements;
