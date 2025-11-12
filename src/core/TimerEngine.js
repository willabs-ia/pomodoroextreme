const { EventEmitter } = require('events');
const { v4: uuidv4 } = require('uuid');

class TimerEngine extends EventEmitter {
  constructor(dataService) {
    super();
    this.dataService = dataService;

    // Timer state
    this.isRunning = false;
    this.isPaused = false;
    this.currentSession = null;
    this.currentPomodoro = null;
    this.currentProject = null;
    this.currentConfig = null;

    // Timer values
    this.timeRemaining = 0; // in seconds
    this.plannedDuration = 0;
    this.timerType = null; // 'focus', 'shortBreak', 'longBreak'
    this.pomodorosCompleted = 0;

    // Interval
    this.interval = null;

    // Last activity (for inactivity detection)
    this.lastActivityTime = Date.now();
  }

  startSession(projectId) {
    // Load project and config
    this.currentProject = this.dataService.projects.getById(projectId);
    if (!this.currentProject) {
      throw new Error('Project not found');
    }

    this.currentConfig = this.currentProject.config;

    // Create session
    this.currentSession = this.dataService.sessions.create(projectId);

    // Start first pomodoro
    this.pomodorosCompleted = 0;
    this.startFocus();

    this.emit('session:started', {
      session: this.currentSession,
      project: this.currentProject
    });

    return this.currentSession;
  }

  startFocus() {
    const duration = (this.currentConfig.focus_duration || 25) * 60; // convert to seconds
    this.startPomodoro('focus', duration);
  }

  startBreak() {
    // Determine if it's a long break
    const isLongBreak = this.pomodorosCompleted >= this.currentConfig.pomodoros_until_long_break;

    const duration = isLongBreak
      ? (this.currentConfig.long_break_duration || 15) * 60
      : (this.currentConfig.short_break_duration || 5) * 60;

    const type = isLongBreak ? 'longBreak' : 'shortBreak';

    // Reset pomodoro counter if long break
    if (isLongBreak) {
      this.pomodorosCompleted = 0;
    }

    this.startPomodoro(type, duration);
  }

  startPomodoro(type, duration) {
    this.timerType = type;
    this.plannedDuration = duration;
    this.timeRemaining = duration;
    this.isRunning = true;
    this.isPaused = false;

    // Create pomodoro record
    const pomodoroId = uuidv4();
    const now = new Date().toISOString();

    this.dataService.database.run(
      `
      INSERT INTO pomodoros (id, session_id, project_id, type, planned_duration, start_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        pomodoroId,
        this.currentSession.id,
        this.currentProject.id,
        type,
        duration,
        now
      ]
    );

    this.currentPomodoro = {
      id: pomodoroId,
      type,
      plannedDuration: duration,
      startTime: now
    };

    // Start interval
    this.startInterval();

    this.emit('pomodoro:started', {
      type,
      duration,
      pomodoro: this.currentPomodoro
    });
  }

  startInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      if (!this.isPaused && this.isRunning) {
        this.timeRemaining--;

        this.emit('timer:tick', {
          timeRemaining: this.timeRemaining,
          plannedDuration: this.plannedDuration,
          type: this.timerType,
          percentage: (this.timeRemaining / this.plannedDuration) * 100
        });

        if (this.timeRemaining <= 0) {
          this.completePomodoro();
        }

        // Check for specific time milestones
        if (this.timeRemaining === 300 && this.timerType === 'focus') {
          // 5 minutes remaining
          this.emit('timer:warning', { timeRemaining: 300 });
        }

        if (this.timeRemaining === 60) {
          // 1 minute remaining
          this.emit('timer:final-minute', { timeRemaining: 60 });
        }
      }
    }, 1000);
  }

  completePomodoro() {
    this.stopInterval();
    this.isRunning = false;

    const now = new Date().toISOString();
    const actualDuration = this.plannedDuration - this.timeRemaining;

    // Update pomodoro record
    this.dataService.database.run(
      `
      UPDATE pomodoros
      SET end_time = ?, actual_duration = ?
      WHERE id = ?
    `,
      [now, actualDuration, this.currentPomodoro.id]
    );

    // Update statistics
    this.dataService.stats.recordPomodoro(this.currentProject.id, {
      type: this.timerType,
      actualDuration,
      wasSkipped: false,
      wasInterrupted: false
    });

    // Increment pomodoros completed if it was a focus session
    if (this.timerType === 'focus') {
      this.pomodorosCompleted++;

      // Update reputation
      const reputation = this.dataService.achievements.getReputation();
      this.dataService.achievements.updateReputation({
        disciplineScore: reputation.discipline_score + 1,
        lastActivityDate: new Date().toISOString().split('T')[0]
      });

      // Check achievements
      const stats = this.dataService.stats.getAggregated(this.currentProject.id, 'all');
      this.dataService.achievements.checkAndUnlock(
        'total_pomodoros',
        stats.totalPomodoros
      );

      const streak = this.dataService.stats.getStreak();
      this.dataService.achievements.checkAndUnlock('streak_days', streak);
    }

    this.emit('pomodoro:completed', {
      type: this.timerType,
      actualDuration,
      pomodorosCompleted: this.pomodorosCompleted
    });

    // Auto-start next phase if configured
    if (this.timerType === 'focus' && this.currentConfig.auto_start_breaks) {
      setTimeout(() => {
        this.startBreak();
      }, 3000); // 3 second delay
    } else if (
      this.timerType !== 'focus' &&
      this.currentConfig.auto_start_pomodoros
    ) {
      setTimeout(() => {
        this.startFocus();
      }, 3000);
    }
  }

  pause() {
    if (!this.isRunning) return;

    this.isPaused = true;
    this.emit('timer:paused', {
      timeRemaining: this.timeRemaining,
      type: this.timerType
    });
  }

  resume() {
    if (!this.isRunning || !this.isPaused) return;

    this.isPaused = false;
    this.emit('timer:resumed', {
      timeRemaining: this.timeRemaining,
      type: this.timerType
    });
  }

  stop() {
    if (!this.isRunning) return;

    this.stopInterval();

    const now = new Date().toISOString();
    const actualDuration = this.plannedDuration - this.timeRemaining;

    // Mark pomodoro as interrupted
    this.dataService.database.run(
      `
      UPDATE pomodoros
      SET end_time = ?, actual_duration = ?, was_interrupted = 1
      WHERE id = ?
    `,
      [now, actualDuration, this.currentPomodoro.id]
    );

    this.isRunning = false;
    this.isPaused = false;

    this.emit('timer:stopped', {
      type: this.timerType,
      timeRemaining: this.timeRemaining
    });
  }

  skipBreak(reason = null) {
    if (this.timerType === 'focus') {
      throw new Error('Cannot skip focus period');
    }

    const now = new Date().toISOString();
    const actualDuration = this.plannedDuration - this.timeRemaining;

    // Mark pomodoro as skipped
    this.dataService.database.run(
      `
      UPDATE pomodoros
      SET end_time = ?, actual_duration = ?, was_skipped = 1, skip_reason = ?
      WHERE id = ?
    `,
      [now, actualDuration, reason, this.currentPomodoro.id]
    );

    // Update statistics
    this.dataService.stats.recordPomodoro(this.currentProject.id, {
      type: this.timerType,
      actualDuration,
      wasSkipped: true,
      wasInterrupted: false
    });

    // Update reputation (negative impact)
    const reputation = this.dataService.achievements.getReputation();
    this.dataService.achievements.updateReputation({
      disciplineScore: Math.max(0, reputation.discipline_score - 2)
    });

    this.stopInterval();
    this.isRunning = false;

    this.emit('break:skipped', {
      type: this.timerType,
      reason
    });

    // Auto-start next focus
    setTimeout(() => {
      this.startFocus();
    }, 1000);
  }

  stopInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  endSession() {
    this.stopInterval();

    if (this.currentSession) {
      this.dataService.sessions.complete(this.currentSession.id);
    }

    this.isRunning = false;
    this.isPaused = false;
    this.currentSession = null;
    this.currentPomodoro = null;
    this.currentProject = null;
    this.currentConfig = null;
    this.pomodorosCompleted = 0;

    this.emit('session:ended');
  }

  getState() {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      timeRemaining: this.timeRemaining,
      plannedDuration: this.plannedDuration,
      type: this.timerType,
      pomodorosCompleted: this.pomodorosCompleted,
      currentProject: this.currentProject,
      currentSession: this.currentSession,
      percentage: this.plannedDuration > 0
        ? (this.timeRemaining / this.plannedDuration) * 100
        : 0
    };
  }

  // For inactivity detection
  recordActivity() {
    this.lastActivityTime = Date.now();
  }

  checkInactivity(threshold = 300000) {
    // 5 minutes default
    const now = Date.now();
    const inactiveTime = now - this.lastActivityTime;

    if (inactiveTime >= threshold && this.isRunning && !this.isPaused) {
      this.pause();
      this.emit('inactivity:detected', { inactiveTime });
    }
  }
}

module.exports = { TimerEngine };
