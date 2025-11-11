const { ipcMain, dialog, screen, shell } = require('electron');
const path = require('path');

// Import managers (will be implemented)
// const { AudioManager } = require('../managers/AudioManager');
// const { MediaController } = require('../managers/MediaController');
// const { InactivityDetector } = require('../managers/InactivityDetector');
// const { Database } = require('../../data/Database');

let windowManager = null;
// let audioManager = null;
// let mediaController = null;
// let inactivityDetector = null;
// let database = null;

function setupIPCHandlers(wm) {
  windowManager = wm;

  // Initialize managers
  // audioManager = new AudioManager();
  // mediaController = new MediaController();
  // inactivityDetector = new InactivityDetector();
  // database = new Database();

  // Window management handlers
  setupWindowHandlers();

  // Timer handlers
  setupTimerHandlers();

  // Project handlers
  setupProjectHandlers();

  // Session handlers
  setupSessionHandlers();

  // Configuration handlers
  setupConfigHandlers();

  // Statistics handlers
  setupStatsHandlers();

  // Achievement handlers
  setupAchievementHandlers();

  // Audio handlers
  setupAudioHandlers();

  // Media control handlers
  setupMediaHandlers();

  // Inactivity handlers
  setupInactivityHandlers();

  // Notification handlers
  setupNotificationHandlers();

  // System handlers
  setupSystemHandlers();

  // File system handlers
  setupFileSystemHandlers();

  // Phrases handlers
  setupPhrasesHandlers();

  // Other handlers
  setupMiscHandlers();
}

function setupWindowHandlers() {
  ipcMain.on('window:minimize', () => {
    windowManager.minimizeGadget();
  });

  ipcMain.on('window:maximize', () => {
    // Toggle maximize/restore for gadget (if needed)
  });

  ipcMain.on('window:close', () => {
    // Handle close request (maybe show confirmation dialog)
  });

  ipcMain.on('window:always-on-top', (event, flag) => {
    windowManager.setGadgetAlwaysOnTop(flag);
  });

  ipcMain.on('window:set-bounds', (event, bounds) => {
    windowManager.setGadgetBounds(bounds);
  });

  ipcMain.handle('window:get-bounds', () => {
    return windowManager.getGadgetBounds();
  });

  ipcMain.on('blockscreen:show', (event, data) => {
    windowManager.enableBlockMode(data.blockLevel);
    windowManager.createBlockScreenWindows(data);
  });

  ipcMain.on('blockscreen:hide', () => {
    windowManager.disableBlockMode();
    windowManager.closeBlockScreenWindows();
  });
}

function setupTimerHandlers() {
  ipcMain.on('timer:start', (event, config) => {
    // Timer logic will be handled in TimerEngine
    // This just broadcasts to windows
    console.log('Timer started:', config);
  });

  ipcMain.on('timer:pause', () => {
    console.log('Timer paused');
  });

  ipcMain.on('timer:stop', () => {
    console.log('Timer stopped');
  });
}

function setupProjectHandlers() {
  ipcMain.handle('projects:get-all', async () => {
    // TODO: Implement database query
    return [
      {
        id: '1',
        name: 'Project 1',
        color: '#FF6B6B',
        icon: '🚀',
        createdAt: new Date().toISOString()
      }
    ];
  });

  ipcMain.handle('projects:create', async (event, project) => {
    // TODO: Implement database insert
    console.log('Creating project:', project);
    return { id: Date.now().toString(), ...project };
  });

  ipcMain.handle('projects:update', async (event, id, project) => {
    // TODO: Implement database update
    console.log('Updating project:', id, project);
    return { id, ...project };
  });

  ipcMain.handle('projects:delete', async (event, id) => {
    // TODO: Implement database delete
    console.log('Deleting project:', id);
    return { success: true };
  });

  ipcMain.handle('projects:get-active', async () => {
    // TODO: Get active project from session
    return null;
  });
}

function setupSessionHandlers() {
  ipcMain.handle('session:get-current', async () => {
    // TODO: Get current session from database
    return null;
  });

  ipcMain.handle('session:recover', async () => {
    // TODO: Recover interrupted session
    return null;
  });

  ipcMain.handle('session:discard', async () => {
    // TODO: Discard interrupted session
    return { success: true };
  });
}

function setupConfigHandlers() {
  ipcMain.handle('config:get', async (event, projectId) => {
    // TODO: Get config from database
    return {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      pomodorosUntilLongBreak: 4,
      blockLevel: 'medium',
      theme: 'dark',
      sounds: {
        enabled: true,
        volume: 0.5
      }
    };
  });

  ipcMain.handle('config:update', async (event, projectId, config) => {
    // TODO: Update config in database
    console.log('Updating config:', projectId, config);
    return { success: true };
  });
}

function setupStatsHandlers() {
  ipcMain.handle('stats:get', async (event, projectId, period) => {
    // TODO: Get stats from database
    return {
      totalPomodoros: 0,
      totalFocusTime: 0,
      totalBreakTime: 0,
      streak: 0
    };
  });

  ipcMain.handle('stats:dashboard', async () => {
    // TODO: Get dashboard data
    return {
      today: { pomodoros: 0, focusTime: 0 },
      week: { pomodoros: 0, focusTime: 0 },
      month: { pomodoros: 0, focusTime: 0 }
    };
  });

  ipcMain.handle('stats:export', async (event, format, period) => {
    // TODO: Export stats to PDF/CSV
    console.log('Exporting stats:', format, period);
    return { success: true, path: '/path/to/export.pdf' };
  });
}

function setupAchievementHandlers() {
  ipcMain.handle('achievements:get-all', async () => {
    // TODO: Get achievements from database
    return [];
  });

  ipcMain.handle('achievements:get-reputation', async () => {
    // TODO: Calculate reputation
    return {
      discipline: 80,
      consistency: 60,
      level: 'Focado'
    };
  });

  ipcMain.handle('achievements:unlock', async (event, id) => {
    // TODO: Unlock achievement
    console.log('Unlocking achievement:', id);
    return { success: true };
  });
}

function setupAudioHandlers() {
  ipcMain.on('audio:play', (event, soundId, volume) => {
    // TODO: Play sound
    console.log('Playing sound:', soundId, volume);
  });

  ipcMain.on('audio:stop', (event, soundId) => {
    // TODO: Stop sound
    console.log('Stopping sound:', soundId);
  });

  ipcMain.on('audio:set-volume', (event, soundId, volume) => {
    // TODO: Set volume
    console.log('Setting volume:', soundId, volume);
  });

  ipcMain.on('audio:play-music', (event, source, options) => {
    // TODO: Play music
    console.log('Playing music:', source, options);
  });

  ipcMain.on('audio:stop-music', () => {
    // TODO: Stop music
    console.log('Stopping music');
  });
}

function setupMediaHandlers() {
  ipcMain.on('media:pause-all', () => {
    // TODO: Pause all media
    console.log('Pausing all media');
  });

  ipcMain.on('media:resume-all', () => {
    // TODO: Resume all media
    console.log('Resuming all media');
  });
}

function setupInactivityHandlers() {
  ipcMain.on('inactivity:start', (event, timeout) => {
    // TODO: Start inactivity detection
    console.log('Starting inactivity detection:', timeout);
  });

  ipcMain.on('inactivity:stop', () => {
    // TODO: Stop inactivity detection
    console.log('Stopping inactivity detection');
  });
}

function setupNotificationHandlers() {
  ipcMain.on('notification:show', (event, options) => {
    // TODO: Show notification
    console.log('Showing notification:', options);
  });
}

function setupSystemHandlers() {
  ipcMain.handle('system:get-info', async () => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.version
    };
  });

  ipcMain.handle('system:get-locale', async () => {
    return require('electron').app.getLocale();
  });

  ipcMain.handle('system:get-displays', async () => {
    return screen.getAllDisplays();
  });

  ipcMain.handle('weather:get', async () => {
    // TODO: Get weather from API
    return {
      temp: 22,
      condition: 'sunny',
      description: 'Céu limpo'
    };
  });
}

function setupFileSystemHandlers() {
  ipcMain.handle('fs:select-file', async (event, options) => {
    const result = await dialog.showOpenDialog(options);
    return result.filePaths[0] || null;
  });

  ipcMain.handle('fs:select-folder', async (event, options) => {
    const result = await dialog.showOpenDialog({
      ...options,
      properties: ['openDirectory']
    });
    return result.filePaths[0] || null;
  });

  ipcMain.handle('fs:save-file', async (event, filePath, data) => {
    // TODO: Save file
    console.log('Saving file:', filePath);
    return { success: true };
  });
}

function setupPhrasesHandlers() {
  ipcMain.handle('phrases:get', async (event, category) => {
    // TODO: Get random phrase from database
    return 'Placeholder phrase';
  });

  ipcMain.handle('phrases:get-multiple', async (event, category, count) => {
    // TODO: Get multiple phrases
    return ['Phrase 1', 'Phrase 2', 'Phrase 3'];
  });
}

function setupMiscHandlers() {
  ipcMain.on('onboarding:complete', () => {
    // TODO: Mark onboarding as complete
    console.log('Onboarding completed');
  });

  ipcMain.handle('onboarding:is-complete', async () => {
    // TODO: Check if onboarding is complete
    return false;
  });

  ipcMain.on('telemetry:send', (event, eventName, data) => {
    // TODO: Send telemetry if consent given
    console.log('Telemetry event:', eventName, data);
  });

  ipcMain.on('telemetry:set-consent', (event, consent) => {
    // TODO: Save telemetry consent
    console.log('Telemetry consent:', consent);
  });

  ipcMain.handle('update:check', async () => {
    // TODO: Check for updates
    return { available: false, version: '1.0.0' };
  });

  ipcMain.handle('update:get-changelog', async () => {
    // TODO: Get changelog
    return 'Changelog content';
  });

  ipcMain.on('dnd:set', (event, enabled) => {
    // TODO: Set Do Not Disturb mode
    console.log('DND mode:', enabled);
  });

  ipcMain.on('shortcut:register', (event, shortcut, action) => {
    // TODO: Register global shortcut
    console.log('Registering shortcut:', shortcut, action);
  });

  ipcMain.on('shortcut:unregister', (event, shortcut) => {
    // TODO: Unregister global shortcut
    console.log('Unregistering shortcut:', shortcut);
  });

  ipcMain.on('i18n:change', (event, lang) => {
    // TODO: Change language
    console.log('Changing language:', lang);
  });

  ipcMain.handle('i18n:get', async (event, key) => {
    // TODO: Get translation
    return key;
  });
}

module.exports = { setupIPCHandlers };
