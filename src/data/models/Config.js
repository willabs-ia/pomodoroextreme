class ConfigModel {
  constructor(db) {
    this.db = db;
  }

  getByProject(projectId) {
    return this.db.get(
      'SELECT * FROM configurations WHERE project_id = ?',
      [projectId]
    );
  }

  update(projectId, updates) {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach((key) => {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${dbKey} = ?`);
      values.push(updates[key]);
    });

    if (fields.length === 0) return this.getByProject(projectId);

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(projectId);

    const sql = `UPDATE configurations SET ${fields.join(', ')} WHERE project_id = ?`;
    this.db.run(sql, values);

    return this.getByProject(projectId);
  }

  // App-level settings
  getAppSetting(key) {
    const result = this.db.get('SELECT value FROM app_settings WHERE key = ?', [
      key
    ]);
    return result ? result.value : null;
  }

  setAppSetting(key, value) {
    this.db.run(
      `
      INSERT INTO app_settings (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = ?
    `,
      [key, value, new Date().toISOString(), value, new Date().toISOString()]
    );
  }

  getAllAppSettings() {
    const rows = this.db.all('SELECT * FROM app_settings');
    const settings = {};
    rows.forEach((row) => {
      settings[row.key] = row.value;
    });
    return settings;
  }
}

module.exports = { ConfigModel };
