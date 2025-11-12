class StatsModel {
  constructor(db) {
    this.db = db;
  }

  recordPomodoro(projectId, pomodoroData) {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Get or create stats for today
    let stats = this.db.get(
      'SELECT * FROM statistics WHERE project_id = ? AND date = ?',
      [projectId, date]
    );

    if (!stats) {
      this.db.run(
        `INSERT INTO statistics (project_id, date) VALUES (?, ?)`,
        [projectId, date]
      );
      stats = this.db.get(
        'SELECT * FROM statistics WHERE project_id = ? AND date = ?',
        [projectId, date]
      );
    }

    // Update stats
    const updates = {};

    if (pomodoroData.type === 'focus') {
      updates.total_pomodoros = stats.total_pomodoros + 1;
      if (!pomodoroData.wasSkipped && !pomodoroData.wasInterrupted) {
        updates.completed_pomodoros = stats.completed_pomodoros + 1;
      }
      updates.total_focus_time =
        stats.total_focus_time + (pomodoroData.actualDuration || 0);
    } else {
      // break
      if (pomodoroData.wasSkipped) {
        updates.skipped_breaks = stats.skipped_breaks + 1;
      }
      updates.total_break_time =
        stats.total_break_time + (pomodoroData.actualDuration || 0);
    }

    // Build update query
    const fields = [];
    const values = [];
    Object.keys(updates).forEach((key) => {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    });

    values.push(projectId);
    values.push(date);

    this.db.run(
      `UPDATE statistics SET ${fields.join(', ')} WHERE project_id = ? AND date = ?`,
      values
    );
  }

  getByProject(projectId, period = 'week') {
    let dateFilter = '';

    if (period === 'today') {
      dateFilter = `date = date('now')`;
    } else if (period === 'week') {
      dateFilter = `date >= date('now', '-7 days')`;
    } else if (period === 'month') {
      dateFilter = `date >= date('now', '-30 days')`;
    } else if (period === 'year') {
      dateFilter = `date >= date('now', '-365 days')`;
    } else if (period === 'all') {
      dateFilter = '1=1';
    }

    return this.db.all(
      `SELECT * FROM statistics WHERE project_id = ? AND ${dateFilter} ORDER BY date DESC`,
      [projectId]
    );
  }

  getAggregated(projectId, period = 'week') {
    let dateFilter = '';

    if (period === 'today') {
      dateFilter = `date = date('now')`;
    } else if (period === 'week') {
      dateFilter = `date >= date('now', '-7 days')`;
    } else if (period === 'month') {
      dateFilter = `date >= date('now', '-30 days')`;
    }

    const stats = this.db.get(
      `
      SELECT
        SUM(total_pomodoros) as totalPomodoros,
        SUM(completed_pomodoros) as completedPomodoros,
        SUM(skipped_breaks) as skippedBreaks,
        SUM(total_focus_time) as totalFocusTime,
        SUM(total_break_time) as totalBreakTime
      FROM statistics
      WHERE project_id = ? AND ${dateFilter}
    `,
      [projectId]
    );

    return stats || {
      totalPomodoros: 0,
      completedPomodoros: 0,
      skippedBreaks: 0,
      totalFocusTime: 0,
      totalBreakTime: 0
    };
  }

  getAllProjectsStats(period = 'week') {
    let dateFilter = '';

    if (period === 'today') {
      dateFilter = `WHERE date = date('now')`;
    } else if (period === 'week') {
      dateFilter = `WHERE date >= date('now', '-7 days')`;
    } else if (period === 'month') {
      dateFilter = `WHERE date >= date('now', '-30 days')`;
    }

    const stats = this.db.get(
      `
      SELECT
        SUM(total_pomodoros) as totalPomodoros,
        SUM(completed_pomodoros) as completedPomodoros,
        SUM(skipped_breaks) as skippedBreaks,
        SUM(total_focus_time) as totalFocusTime,
        SUM(total_break_time) as totalBreakTime
      FROM statistics
      ${dateFilter}
    `
    );

    return stats || {
      totalPomodoros: 0,
      completedPomodoros: 0,
      skippedBreaks: 0,
      totalFocusTime: 0,
      totalBreakTime: 0
    };
  }

  getStreak() {
    const rows = this.db.all(`
      SELECT date FROM statistics
      WHERE total_pomodoros > 0
      ORDER BY date DESC
    `);

    if (rows.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const row of rows) {
      const rowDate = new Date(row.date + 'T00:00:00');
      const diffDays = Math.floor((currentDate - rowDate) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
        continue;
      }

      if (diffDays === streak + 1) {
        // Allow for today not being counted yet
        if (streak === 0) {
          streak++;
          continue;
        }
      }

      break;
    }

    return streak;
  }
}

module.exports = { StatsModel };
