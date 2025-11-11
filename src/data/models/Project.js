const { v4: uuidv4 } = require('uuid');

class ProjectModel {
  constructor(db) {
    this.db = db;
  }

  create(projectData) {
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = this.db.db.prepare(`
      INSERT INTO projects (id, name, description, color, icon, goal_pomodoros, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      projectData.name,
      projectData.description || null,
      projectData.color,
      projectData.icon,
      projectData.goalPomodoros || 8,
      now,
      now
    );

    // Create default configuration for this project
    this.createDefaultConfig(id);

    return this.getById(id);
  }

  createDefaultConfig(projectId) {
    const stmt = this.db.db.prepare(`
      INSERT INTO configurations (project_id)
      VALUES (?)
    `);
    stmt.run(projectId);
  }

  getById(id) {
    const project = this.db.get('SELECT * FROM projects WHERE id = ?', [id]);
    if (project) {
      const config = this.db.get(
        'SELECT * FROM configurations WHERE project_id = ?',
        [id]
      );
      return { ...project, config };
    }
    return null;
  }

  getAll(includeArchived = false) {
    const sql = includeArchived
      ? 'SELECT * FROM projects ORDER BY created_at DESC'
      : 'SELECT * FROM projects WHERE is_archived = 0 ORDER BY created_at DESC';

    const projects = this.db.all(sql);

    return projects.map((project) => {
      const config = this.db.get(
        'SELECT * FROM configurations WHERE project_id = ?',
        [project.id]
      );
      return { ...project, config };
    });
  }

  update(id, updates) {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach((key) => {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${dbKey} = ?`);
      values.push(updates[key]);
    });

    if (fields.length === 0) return this.getById(id);

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const sql = `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`;
    this.db.run(sql, values);

    return this.getById(id);
  }

  delete(id) {
    this.db.run('DELETE FROM projects WHERE id = ?', [id]);
    return { success: true };
  }

  archive(id) {
    return this.update(id, { isArchived: 1 });
  }

  unarchive(id) {
    return this.update(id, { isArchived: 0 });
  }

  getStats(id, period = 'week') {
    let dateFilter = '';
    const now = new Date();

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
      [id]
    );

    return stats || {
      totalPomodoros: 0,
      completedPomodoros: 0,
      skippedBreaks: 0,
      totalFocusTime: 0,
      totalBreakTime: 0
    };
  }
}

module.exports = { ProjectModel };
