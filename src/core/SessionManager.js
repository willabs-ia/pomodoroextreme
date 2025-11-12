const { EventEmitter } = require('events');
const { TimerEngine } = require('./TimerEngine');
const { BlockLevelManager } = require('./BlockLevelManager');

class SessionManager extends EventEmitter {
  constructor(dataService) {
    super();
    this.dataService = dataService;
    this.timerEngine = new TimerEngine(dataService);
    this.blockLevelManager = new BlockLevelManager(dataService);

    // Forward timer events
    this.timerEngine.on('timer:tick', (data) => this.emit('timer:tick', data));
    this.timerEngine.on('timer:warning', (data) => this.emit('timer:warning', data));
    this.timerEngine.on('timer:final-minute', (data) =>
      this.emit('timer:final-minute', data)
    );
    this.timerEngine.on('pomodoro:started', (data) =>
      this.emit('pomodoro:started', data)
    );
    this.timerEngine.on('pomodoro:completed', (data) =>
      this.handlePomodoroCompleted(data)
    );
    this.timerEngine.on('session:started', (data) => this.emit('session:started', data));
    this.timerEngine.on('session:ended', (data) => this.emit('session:ended', data));
    this.timerEngine.on('timer:paused', (data) => this.emit('timer:paused', data));
    this.timerEngine.on('timer:resumed', (data) => this.emit('timer:resumed', data));
    this.timerEngine.on('timer:stopped', (data) => this.emit('timer:stopped', data));
    this.timerEngine.on('break:skipped', (data) => this.emit('break:skipped', data));
    this.timerEngine.on('inactivity:detected', (data) =>
      this.emit('inactivity:detected', data)
    );

    // Forward block level events
    this.blockLevelManager.on('level:changed', (data) =>
      this.emit('level:changed', data)
    );
    this.blockLevelManager.on('skip:granted', (data) =>
      this.emit('skip:granted', data)
    );
    this.blockLevelManager.on('skip:cancelled', (data) =>
      this.emit('skip:cancelled', data)
    );
    this.blockLevelManager.on('penalty:paid', (data) =>
      this.emit('penalty:paid', data)
    );
  }

  startSession(projectId) {
    // Load project config to get block level
    const project = this.dataService.projects.getById(projectId);
    if (project && project.config) {
      this.blockLevelManager.setLevel(project.config.block_level || 'medium');
    }

    return this.timerEngine.startSession(projectId);
  }

  pause() {
    return this.timerEngine.pause();
  }

  resume() {
    return this.timerEngine.resume();
  }

  stop() {
    return this.timerEngine.stop();
  }

  endSession() {
    this.blockLevelManager.reset();
    return this.timerEngine.endSession();
  }

  async requestSkipBreak(callbacks) {
    const state = this.timerEngine.getState();

    if (state.type === 'focus') {
      throw new Error('Cannot skip focus period');
    }

    // Check if skip is allowed
    const canSkip = this.blockLevelManager.canSkipBreak();
    if (!canSkip.allowed) {
      return {
        success: false,
        reason: canSkip.reason
      };
    }

    let result;

    // Handle based on level
    if (this.blockLevelManager.currentLevel === 'soft') {
      result = await this.blockLevelManager.requestSkipSoft(
        callbacks.onMessage
      );

      if (result.granted) {
        this.timerEngine.skipBreak(result.justification);
        return { success: true, justification: result.justification };
      }

      return { success: false, cancelled: true };
    } else if (this.blockLevelManager.currentLevel === 'medium') {
      result = this.blockLevelManager.requestSkipMedium(state.plannedDuration);

      // Show warning to user
      if (callbacks.onWarning) {
        await callbacks.onWarning(result);
      }

      // Ask for justification
      const justificationPrompt = this.dataService.phrases.getRandom(
        'skip_justification',
        1
      );
      const justification = await callbacks.onJustification(justificationPrompt);

      this.timerEngine.skipBreak(justification);

      return {
        success: true,
        penalty: result.penalty,
        nextPenalty: result.nextPenalty,
        remainingSkips: result.remainingSkips,
        warning: result.warning,
        justification
      };
    }

    // Extreme level - should never reach here
    return { success: false, reason: 'Extreme mode - no skipping allowed' };
  }

  handlePomodoroCompleted(data) {
    // If it was a break, check if penalty was paid
    if (data.type !== 'focus') {
      this.blockLevelManager.payPenalty(data.actualDuration);
    }

    this.emit('pomodoro:completed', data);
  }

  getState() {
    const timerState = this.timerEngine.getState();
    const blockStatus = this.blockLevelManager.getStatus();

    return {
      ...timerState,
      blockLevel: blockStatus
    };
  }

  setBlockLevel(level) {
    return this.blockLevelManager.setLevel(level);
  }

  recordActivity() {
    return this.timerEngine.recordActivity();
  }

  checkInactivity(threshold) {
    return this.timerEngine.checkInactivity(threshold);
  }
}

module.exports = { SessionManager };
