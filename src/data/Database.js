const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbPath = null;
  }

  initialize() {
    // Get user data path
    const userDataPath = app.getPath('userData');
    const dbDir = path.join(userDataPath, 'database');

    // Create directory if it doesn't exist
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.dbPath = path.join(dbDir, 'pomodoro.db');

    // Open database
    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');

    // Run migrations
    this.runMigrations();

    console.log('Database initialized at:', this.dbPath);
  }

  runMigrations() {
    // Check if migrations table exists
    const migrationsTableExists = this.db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='migrations'"
      )
      .get();

    if (!migrationsTableExists) {
      this.db.exec(`
        CREATE TABLE migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    // Get executed migrations
    const executedMigrations = this.db
      .prepare('SELECT name FROM migrations')
      .all()
      .map((row) => row.name);

    // Define migrations
    const migrations = [
      {
        name: '001_initial_schema',
        up: () => this.migration_001_initial_schema()
      },
      {
        name: '002_add_achievements',
        up: () => this.migration_002_add_achievements()
      },
      {
        name: '003_add_phrases',
        up: () => this.migration_003_add_phrases()
      }
    ];

    // Execute pending migrations
    migrations.forEach((migration) => {
      if (!executedMigrations.includes(migration.name)) {
        console.log(`Running migration: ${migration.name}`);
        migration.up();
        this.db
          .prepare('INSERT INTO migrations (name) VALUES (?)')
          .run(migration.name);
      }
    });
  }

  migration_001_initial_schema() {
    this.db.exec(`
      -- Projects table
      CREATE TABLE projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        color TEXT NOT NULL,
        icon TEXT NOT NULL,
        goal_pomodoros INTEGER DEFAULT 8,
        is_archived INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Configurations table (per project)
      CREATE TABLE configurations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id TEXT NOT NULL,
        focus_duration INTEGER DEFAULT 25,
        short_break_duration INTEGER DEFAULT 5,
        long_break_duration INTEGER DEFAULT 15,
        pomodoros_until_long_break INTEGER DEFAULT 4,
        block_level TEXT DEFAULT 'medium',
        auto_start_breaks INTEGER DEFAULT 1,
        auto_start_pomodoros INTEGER DEFAULT 0,
        inactivity_detection INTEGER DEFAULT 1,
        inactivity_timeout INTEGER DEFAULT 300,
        theme TEXT DEFAULT 'dark',
        primary_color TEXT DEFAULT '#6366f1',
        secondary_color TEXT DEFAULT '#8b5cf6',
        background_image TEXT,
        sound_enabled INTEGER DEFAULT 1,
        tick_sound_enabled INTEGER DEFAULT 0,
        alert_sound_volume REAL DEFAULT 0.5,
        tick_sound_volume REAL DEFAULT 0.3,
        music_volume REAL DEFAULT 0.5,
        notification_enabled INTEGER DEFAULT 1,
        notification_sound_enabled INTEGER DEFAULT 1,
        notification_volume REAL DEFAULT 0.5,
        dnd_enabled INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      -- Sessions table
      CREATE TABLE sessions (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        duration INTEGER,
        status TEXT NOT NULL,
        is_recovered INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      -- Pomodoros table
      CREATE TABLE pomodoros (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        project_id TEXT NOT NULL,
        type TEXT NOT NULL,
        planned_duration INTEGER NOT NULL,
        actual_duration INTEGER,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        was_skipped INTEGER DEFAULT 0,
        skip_reason TEXT,
        was_interrupted INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      -- Skip history (for medium level tracking)
      CREATE TABLE skip_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id TEXT NOT NULL,
        pomodoro_id TEXT NOT NULL,
        skip_count INTEGER DEFAULT 1,
        penalty_multiplier INTEGER DEFAULT 3,
        accumulated_penalty INTEGER DEFAULT 0,
        was_paid INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (pomodoro_id) REFERENCES pomodoros(id) ON DELETE CASCADE
      );

      -- Statistics table
      CREATE TABLE statistics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id TEXT NOT NULL,
        date DATE NOT NULL,
        total_pomodoros INTEGER DEFAULT 0,
        completed_pomodoros INTEGER DEFAULT 0,
        skipped_breaks INTEGER DEFAULT 0,
        total_focus_time INTEGER DEFAULT 0,
        total_break_time INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, date),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      -- App settings table
      CREATE TABLE app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Insert default app settings
      INSERT INTO app_settings (key, value) VALUES
        ('onboarding_complete', '0'),
        ('telemetry_consent', '0'),
        ('locale', 'pt-BR'),
        ('app_version', '1.0.0'),
        ('last_session_project_id', NULL),
        ('panic_button_unlocked', '0');

      -- Indexes for better performance
      CREATE INDEX idx_sessions_project_id ON sessions(project_id);
      CREATE INDEX idx_pomodoros_session_id ON pomodoros(session_id);
      CREATE INDEX idx_pomodoros_project_id ON pomodoros(project_id);
      CREATE INDEX idx_statistics_project_date ON statistics(project_id, date);
      CREATE INDEX idx_skip_history_project ON skip_history(project_id);
    `);
  }

  migration_002_add_achievements() {
    this.db.exec(`
      -- Achievements table
      CREATE TABLE achievements (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        icon TEXT NOT NULL,
        points INTEGER DEFAULT 0,
        unlocks TEXT,
        is_hidden INTEGER DEFAULT 0,
        requirement_type TEXT NOT NULL,
        requirement_value INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- User achievements (unlocked achievements)
      CREATE TABLE user_achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        achievement_id TEXT NOT NULL,
        unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (achievement_id) REFERENCES achievements(id)
      );

      -- Reputation table
      CREATE TABLE reputation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discipline_score INTEGER DEFAULT 0,
        consistency_score INTEGER DEFAULT 0,
        total_points INTEGER DEFAULT 0,
        level TEXT DEFAULT 'Iniciante',
        streak_days INTEGER DEFAULT 0,
        last_activity_date DATE,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Insert initial reputation record
      INSERT INTO reputation (discipline_score, consistency_score, total_points, level)
      VALUES (0, 0, 0, 'Iniciante');

      CREATE INDEX idx_user_achievements ON user_achievements(achievement_id);
    `);
  }

  migration_003_add_phrases() {
    this.db.exec(`
      -- Phrases table
      CREATE TABLE phrases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        text TEXT NOT NULL,
        weight INTEGER DEFAULT 1,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_phrases_category ON phrases(category);
    `);
  }

  // Helper methods
  run(sql, params = []) {
    return this.db.prepare(sql).run(params);
  }

  get(sql, params = []) {
    return this.db.prepare(sql).get(params);
  }

  all(sql, params = []) {
    return this.db.prepare(sql).all(params);
  }

  transaction(fn) {
    return this.db.transaction(fn);
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = { DatabaseManager };
