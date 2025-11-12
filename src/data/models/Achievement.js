class AchievementModel {
  constructor(db) {
    this.db = db;
    this.initializeAchievements();
  }

  initializeAchievements() {
    // Check if achievements already exist
    const count = this.db.get('SELECT COUNT(*) as count FROM achievements');
    if (count.count > 0) return;

    // Define all achievements
    const achievements = [
      {
        id: 'first_pomodoro',
        name: 'Primeira Batalha',
        description: 'Complete seu primeiro pomodoro',
        category: 'getting_started',
        icon: '🍅',
        points: 10,
        unlocks: null,
        isHidden: false,
        requirementType: 'total_pomodoros',
        requirementValue: 1
      },
      {
        id: 'first_week',
        name: 'Sobrevivente da Semana',
        description: 'Complete 7 dias consecutivos com pelo menos 1 pomodoro',
        category: 'streak',
        icon: '📅',
        points: 100,
        unlocks: 'theme_gold',
        isHidden: false,
        requirementType: 'streak_days',
        requirementValue: 7
      },
      {
        id: 'discipline_master',
        name: 'Mestre da Disciplina',
        description: '30 dias sem pular nenhuma pausa',
        category: 'discipline',
        icon: '🏆',
        points: 500,
        unlocks: 'panic_button',
        isHidden: false,
        requirementType: 'no_skips_days',
        requirementValue: 30
      },
      {
        id: 'century',
        name: 'Século de Foco',
        description: 'Complete 100 pomodoros',
        category: 'milestone',
        icon: '💯',
        points: 200,
        unlocks: 'theme_platinum',
        isHidden: false,
        requirementType: 'total_pomodoros',
        requirementValue: 100
      },
      {
        id: 'marathon',
        name: 'Maratonista Mental',
        description: 'Complete 1000 pomodoros',
        category: 'milestone',
        icon: '🏃',
        points: 1000,
        unlocks: 'theme_diamond',
        isHidden: false,
        requirementType: 'total_pomodoros',
        requirementValue: 1000
      },
      {
        id: 'early_bird',
        name: 'Madrugador Produtivo',
        description: 'Complete 10 pomodoros antes das 8h',
        category: 'special',
        icon: '🌅',
        points: 50,
        unlocks: null,
        isHidden: true,
        requirementType: 'early_pomodoros',
        requirementValue: 10
      },
      {
        id: 'night_owl',
        name: 'Coruja Noturna',
        description: 'Complete 10 pomodoros após as 22h',
        category: 'special',
        icon: '🦉',
        points: 50,
        unlocks: 'dark_mode_pro',
        isHidden: true,
        requirementType: 'late_pomodoros',
        requirementValue: 10
      },
      {
        id: 'perfect_week',
        name: 'Semana Perfeita',
        description: 'Atinja sua meta diária por 7 dias consecutivos',
        category: 'consistency',
        icon: '⭐',
        points: 150,
        unlocks: null,
        isHidden: false,
        requirementType: 'perfect_days',
        requirementValue: 7
      },
      {
        id: 'break_lover',
        name: 'Amante do Descanso',
        description: 'Complete 50 pausas sem pular nenhuma',
        category: 'discipline',
        icon: '☕',
        points: 100,
        unlocks: null,
        isHidden: false,
        requirementType: 'completed_breaks',
        requirementValue: 50
      },
      {
        id: 'project_master',
        name: 'Multi-projeto',
        description: 'Complete pomodoros em 5 projetos diferentes',
        category: 'variety',
        icon: '🎯',
        points: 75,
        unlocks: null,
        isHidden: false,
        requirementType: 'different_projects',
        requirementValue: 5
      },
      {
        id: 'focus_machine',
        name: 'Máquina de Foco',
        description: 'Acumule 100 horas de foco total',
        category: 'milestone',
        icon: '🔥',
        points: 300,
        unlocks: 'focus_mode_pro',
        isHidden: false,
        requirementType: 'total_focus_hours',
        requirementValue: 100
      },
      {
        id: 'resilient',
        name: 'Resiliente',
        description: 'Recupere uma sessão interrompida',
        category: 'special',
        icon: '💪',
        points: 25,
        unlocks: null,
        isHidden: false,
        requirementType: 'recovered_sessions',
        requirementValue: 1
      }
    ];

    // Insert achievements
    const stmt = this.db.db.prepare(`
      INSERT INTO achievements (id, name, description, category, icon, points, unlocks, is_hidden, requirement_type, requirement_value)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    achievements.forEach((a) => {
      stmt.run(
        a.id,
        a.name,
        a.description,
        a.category,
        a.icon,
        a.points,
        a.unlocks,
        a.isHidden ? 1 : 0,
        a.requirementType,
        a.requirementValue
      );
    });
  }

  getAll(includeHidden = false) {
    const sql = includeHidden
      ? 'SELECT * FROM achievements'
      : 'SELECT * FROM achievements WHERE is_hidden = 0';

    const achievements = this.db.all(sql);

    // Check which ones are unlocked
    return achievements.map((achievement) => {
      const unlocked = this.db.get(
        'SELECT * FROM user_achievements WHERE achievement_id = ?',
        [achievement.id]
      );

      return {
        ...achievement,
        isUnlocked: !!unlocked,
        unlockedAt: unlocked ? unlocked.unlocked_at : null
      };
    });
  }

  unlock(achievementId) {
    // Check if already unlocked
    const existing = this.db.get(
      'SELECT * FROM user_achievements WHERE achievement_id = ?',
      [achievementId]
    );

    if (existing) return { alreadyUnlocked: true };

    // Unlock achievement
    this.db.run(
      'INSERT INTO user_achievements (achievement_id, unlocked_at) VALUES (?, ?)',
      [achievementId, new Date().toISOString()]
    );

    // Get achievement data
    const achievement = this.db.get(
      'SELECT * FROM achievements WHERE id = ?',
      [achievementId]
    );

    // Update reputation points
    if (achievement) {
      this.updateReputationPoints(achievement.points);
    }

    return { success: true, achievement };
  }

  checkAndUnlock(type, value) {
    // Find achievements that match this type and value
    const achievements = this.db.all(
      'SELECT * FROM achievements WHERE requirement_type = ? AND requirement_value <= ?',
      [type, value]
    );

    const unlocked = [];

    achievements.forEach((achievement) => {
      const result = this.unlock(achievement.id);
      if (result.success) {
        unlocked.push(achievement);
      }
    });

    return unlocked;
  }

  getUnlocked() {
    return this.db.all(`
      SELECT a.*, ua.unlocked_at
      FROM achievements a
      INNER JOIN user_achievements ua ON a.id = ua.achievement_id
      ORDER BY ua.unlocked_at DESC
    `);
  }

  updateReputationPoints(points) {
    this.db.run(
      'UPDATE reputation SET total_points = total_points + ?, updated_at = ?',
      [points, new Date().toISOString()]
    );

    // Update level based on points
    const reputation = this.db.get('SELECT * FROM reputation LIMIT 1');
    const newLevel = this.calculateLevel(reputation.total_points);

    this.db.run('UPDATE reputation SET level = ? WHERE id = ?', [
      newLevel,
      reputation.id
    ]);
  }

  calculateLevel(points) {
    if (points < 50) return 'Iniciante';
    if (points < 150) return 'Aprendiz';
    if (points < 300) return 'Focado';
    if (points < 600) return 'Dedicado';
    if (points < 1000) return 'Expert';
    if (points < 2000) return 'Mestre';
    if (points < 5000) return 'Lendário';
    return 'Divindade do Foco';
  }

  getReputation() {
    const rep = this.db.get('SELECT * FROM reputation LIMIT 1');
    if (!rep) {
      // Create if doesn't exist
      this.db.run(
        "INSERT INTO reputation (discipline_score, consistency_score, total_points, level) VALUES (0, 0, 0, 'Iniciante')"
      );
      return this.db.get('SELECT * FROM reputation LIMIT 1');
    }
    return rep;
  }

  updateReputation(updates) {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach((key) => {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${dbKey} = ?`);
      values.push(updates[key]);
    });

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());

    this.db.run(`UPDATE reputation SET ${fields.join(', ')} WHERE id = 1`, values);

    return this.getReputation();
  }
}

module.exports = { AchievementModel };
