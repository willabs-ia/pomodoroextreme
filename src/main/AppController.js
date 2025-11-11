const { getDataService } = require('../data');
const { SessionManager } = require('../core/SessionManager');
const { AudioManager } = require('./managers/AudioManager');
const { MediaController } = require('./managers/MediaController');
const { InactivityDetector } = require('./managers/InactivityDetector');
const { ShortcutManager } = require('./managers/ShortcutManager');
const { NotificationManager } = require('./managers/NotificationManager');
const { UpdateManager } = require('./managers/UpdateManager');
const { TaskbarManager } = require('./managers/TaskbarManager');

class AppController {
  constructor(windowManager, trayManager) {
    this.windowManager = windowManager;
    this.trayManager = trayManager;

    // Initialize data service
    this.dataService = getDataService();
    this.dataService.initialize();

    // Initialize managers
    this.audioManager = new AudioManager();
    this.audioManager.initialize();

    this.mediaController = new MediaController();
    this.inactivityDetector = new InactivityDetector();
    this.shortcutManager = new ShortcutManager();
    this.notificationManager = new NotificationManager(this.audioManager);
    this.updateManager = new UpdateManager();
    this.taskbarManager = new TaskbarManager(windowManager);

    // Initialize session manager
    this.sessionManager = new SessionManager(this.dataService);

    // Setup session manager events
    this.setupSessionEvents();

    // Setup shortcuts
    this.setupShortcuts();

    // Check for session recovery
    this.checkSessionRecovery();

    console.log('AppController initialized');
  }

  setupSessionEvents() {
    // Timer tick
    this.sessionManager.on('timer:tick', (data) => {
      // Update tray
      this.trayManager.updateTimer({
        type: data.type,
        timeRemaining: this.formatTime(data.timeRemaining),
        isRunning: true
      });

      // Update taskbar progress
      this.taskbarManager.setProgress(1 - data.percentage / 100);

      // Broadcast to renderer
      if (this.windowManager.gadgetWindow) {
        this.windowManager.gadgetWindow.webContents.send('timer:tick', data);
      }

      // Check inactivity if enabled
      const config = this.sessionManager.timerEngine.currentConfig;
      if (config && config.inactivity_detection) {
        this.sessionManager.checkInactivity(config.inactivity_timeout * 1000);
      }
    });

    // Pomodoro started
    this.sessionManager.on('pomodoro:started', (data) => {
      console.log('Pomodoro started:', data.type);

      // Show block screen if it's a break
      if (data.type !== 'focus') {
        const blockLevel = this.sessionManager.blockLevelManager.currentLevel;
        this.windowManager.enableBlockMode(blockLevel);
        this.windowManager.createBlockScreenWindows({
          type: data.type,
          duration: data.duration,
          blockLevel
        });

        // Pause media
        this.mediaController.pauseAll();
      }

      // Update taskbar
      this.taskbarManager.setOverlay(data.type);

      // Broadcast to renderer
      if (this.windowManager.gadgetWindow) {
        this.windowManager.gadgetWindow.webContents.send('pomodoro:started', data);
      }
    });

    // Pomodoro completed
    this.sessionManager.on('pomodoro:completed', (data) => {
      console.log('Pomodoro completed:', data.type);

      // Close block screen if it was a break
      if (data.type !== 'focus') {
        this.windowManager.closeBlockScreenWindows();
        this.windowManager.disableBlockMode();

        // Resume media
        this.mediaController.resumeAll();
      }

      // Show notification
      this.notificationManager.pomodoroComplete(data.type);

      // Flash taskbar
      this.taskbarManager.flash(2);

      // Play sound
      this.audioManager.playSound('alert');

      // Broadcast to renderer
      if (this.windowManager.gadgetWindow) {
        this.windowManager.gadgetWindow.webContents.send('pomodoro:completed', data);
      }
    });

    // Timer warning (5 minutes remaining)
    this.sessionManager.on('timer:warning', (data) => {
      // Shake gadget window
      if (this.windowManager.gadgetWindow) {
        this.windowManager.gadgetWindow.webContents.send('timer:shake');
      }

      // Play warning sound
      this.audioManager.playSound('shake-warning');

      // Show notification
      this.notificationManager.breakStarting(data.timeRemaining);
    });

    // Inactivity detected
    this.sessionManager.on('inactivity:detected', (data) => {
      console.log('Inactivity detected:', data);

      this.notificationManager.inactivityDetected(
        Math.floor(data.inactiveTime / 60000)
      );

      if (this.windowManager.gadgetWindow) {
        this.windowManager.gadgetWindow.webContents.send('inactivity:detected', data);
      }
    });

    // Session ended
    this.sessionManager.on('session:ended', () => {
      this.taskbarManager.clearProgress();
      this.taskbarManager.setOverlay(null);
    });
  }

  setupShortcuts() {
    this.shortcutManager.registerDefaults((action) => {
      if (this.windowManager.gadgetWindow) {
        this.windowManager.gadgetWindow.webContents.send('shortcut:triggered', {
          action
        });
      }
    });
  }

  checkSessionRecovery() {
    const currentSession = this.dataService.sessions.getCurrent();

    if (currentSession) {
      console.log('Found unfinished session:', currentSession);

      // Show recovery notification
      this.notificationManager.sessionRecovery();

      // Broadcast to renderer
      if (this.windowManager.gadgetWindow) {
        this.windowManager.gadgetWindow.webContents.send('session:recovery-available', {
          session: currentSession
        });
      }
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  cleanup() {
    this.sessionManager.endSession();
    this.inactivityDetector.stop();
    this.shortcutManager.unregisterAll();
    this.dataService.close();
  }
}

module.exports = { AppController };
