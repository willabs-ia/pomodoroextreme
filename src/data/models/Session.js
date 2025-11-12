const { v4: uuidv4 } = require('uuid');

class SessionModel {
  constructor(db) {
    this.db = db;
  }

  create(projectId) {
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = this.db.db.prepare(`
      INSERT INTO sessions (id, project_id, start_time, status, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, projectId, now, 'active', now);

    return this.getById(id);
  }

  getById(id) {
    return this.db.get('SELECT * FROM sessions WHERE id = ?', [id]);
  }

  getCurrent() {
    return this.db.get(
      "SELECT * FROM sessions WHERE status = 'active' ORDER BY start_time DESC LIMIT 1"
    );
  }

  complete(id) {
    const now = new Date().toISOString();
    const session = this.getById(id);

    if (session) {
      const startTime = new Date(session.start_time);
      const endTime = new Date(now);
      const duration = Math.floor((endTime - startTime) / 1000); // in seconds

      this.db.run(
        `UPDATE sessions SET end_time = ?, duration = ?, status = ? WHERE id = ?`,
        [now, duration, 'completed', id]
      );
    }

    return this.getById(id);
  }

  markAsRecovered(id) {
    this.db.run('UPDATE sessions SET is_recovered = 1 WHERE id = ?', [id]);
    return this.getById(id);
  }

  delete(id) {
    this.db.run('DELETE FROM sessions WHERE id = ?', [id]);
    return { success: true };
  }

  getByProject(projectId, limit = 10) {
    return this.db.all(
      'SELECT * FROM sessions WHERE project_id = ? ORDER BY start_time DESC LIMIT ?',
      [projectId, limit]
    );
  }
}

module.exports = { SessionModel };
