const { ipcMain, dialog, screen } = require('electron');
const path = require('path');

let windowManager = null;
let appController = null;

function setupIPCHandlers(wm, ac) {
  windowManager = wm;
  appController = ac;

  setupWindowHandlers();
  setupTimerHandlers();
  setupProjectHandlers();
  setupSessionHandlers();
  setupConfigHandlers();
  setupStatsHandlers();
  setupAchievementHandlers();
  setupAudioHandlers();
  setupMediaHandlers();
  setupInactivityHandlers();
  setupNotificationHandlers();
  setupSystemHandlers();
  setupFileSystemHandlers();
  setupPhrasesHandlers();
  setupMiscHandlers();
}

function setupWindowHandlers() {
  ipcMain.on('window:minimize', () => {
    windowManager.minimizeGadget();
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
    try {
      const session = appController.sessionManager.startSession(config.projectId);
      event.reply('timer:started', { success: true, session });
    } catch (error) {
      event.reply('timer:error', { error: error.message });
    }
  });

  ipcMain.on('timer:pause', () => {
    appController.sessionManager.pause();
  });

  ipcMain.on('timer:resume', () => {
    appController.sessionManager.resume();
  });

  ipcMain.on('timer:stop', () => {
    appController.sessionManager.stop();
  });

  ipcMain.handle('timer:get-state', () => {
    return appController.sessionManager.getState();
  });

  ipcMain.handle('timer:skip-break', async (event, reason) => {
    try {
      // This would need UI callbacks from renderer
      const result = await appController.sessionManager.requestSkipBreak({
        onMessage: async (message) => {
          // Send to renderer and wait for response
          return new Promise((resolve) => {
            windowManager.gadgetWindow.webContents.send('skip:show-message', {
              message
            });

            ipcMain.once('skip:message-response', (e, confirmed) => {
              resolve(confirmed);
            });
          });
        },
        onJustification: async (prompt) => {
          return new Promise((resolve) => {
            windowManager.gadgetWindow.webContents.send('skip:request-justification', {
              prompt
            });

            ipcMain.once('skip:justification-response', (e, justification) => {
              resolve(justification);
            });
          });
        },
        onWarning: async (warning) => {
          windowManager.gadgetWindow.webContents.send('skip:warning', warning);
        }
      });

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}

function setupProjectHandlers() {
  ipcMain.handle('projects:get-all', async () => {
    return appController.dataService.projects.getAll();
  });

  ipcMain.handle('projects:create', async (event, project) => {
    return appController.dataService.projects.create(project);
  });

  ipcMain.handle('projects:update', async (event, id, updates) => {
    return appController.dataService.projects.update(id, updates);
  });

  ipcMain.handle('projects:delete', async (event, id) => {
    return appController.dataService.projects.delete(id);
  });

  ipcMain.handle('projects:get-active', async () => {
    const state = appController.sessionManager.getState();
    return state.currentProject || null;
  });

  ipcMain.handle('projects:get-stats', async (event, id, period) => {
    return appController.dataService.projects.getStats(id, period);
  });
}

function setupSessionHandlers() {
  ipcMain.handle('session:get-current', async () => {
    return appController.dataService.sessions.getCurrent();
  });

  ipcMain.handle('session:recover', async () => {
    const session = appController.dataService.sessions.getCurrent();
    if (session) {
      appController.dataService.sessions.markAsRecovered(session.id);
      return session;
    }
    return null;
  });

  ipcMain.handle('session:discard', async () => {
    const session = appController.dataService.sessions.getCurrent();
    if (session) {
      appController.dataService.sessions.delete(session.id);
    }
    return { success: true };
  });

  ipcMain.on('session:end', () => {
    appController.sessionManager.endSession();
  });
}

function setupConfigHandlers() {
  ipcMain.handle('config:get', async (event, projectId) => {
    return appController.dataService.configs.getByProject(projectId);
  });

  ipcMain.handle('config:update', async (event, projectId, config) => {
    return appController.dataService.configs.update(projectId, config);
  });

  ipcMain.handle('config:get-app-settings', async () => {
    return appController.dataService.configs.getAllAppSettings();
  });

  ipcMain.on('config:set-app-setting', (event, key, value) => {
    appController.dataService.configs.setAppSetting(key, value);
  });
}

function setupStatsHandlers() {
  ipcMain.handle('stats:get', async (event, projectId, period) => {
    return appController.dataService.stats.getByProject(projectId, period);
  });

  ipcMain.handle('stats:get-aggregated', async (event, projectId, period) => {
    return appController.dataService.stats.getAggregated(projectId, period);
  });

  ipcMain.handle('stats:dashboard', async () => {
    return appController.dataService.stats.getAllProjectsStats('week');
  });

  ipcMain.handle('stats:get-streak', async () => {
    return appController.dataService.stats.getStreak();
  });

  ipcMain.handle('stats:export', async (event, format, period) => {
    // TODO: Implement export functionality
    return { success: false, message: 'Not implemented yet' };
  });
}

function setupAchievementHandlers() {
  ipcMain.handle('achievements:get-all', async () => {
    return appController.dataService.achievements.getAll();
  });

  ipcMain.handle('achievements:get-unlocked', async () => {
    return appController.dataService.achievements.getUnlocked();
  });

  ipcMain.handle('achievements:get-reputation', async () => {
    return appController.dataService.achievements.getReputation();
  });
}

function setupAudioHandlers() {
  ipcMain.on('audio:play', (event, soundId, volume) => {
    appController.audioManager.playSound(soundId, volume);
  });

  ipcMain.on('audio:stop', (event, soundId) => {
    appController.audioManager.stopSound(soundId);
  });

  ipcMain.on('audio:set-volume', (event, soundId, volume) => {
    appController.audioManager.setVolume(soundId, volume);
  });

  ipcMain.on('audio:play-music', (event, source, options) => {
    appController.audioManager.playMusic(source, options);
  });

  ipcMain.on('audio:stop-music', () => {
    appController.audioManager.stopMusic();
  });

  ipcMain.handle('audio:get-music-state', () => {
    return appController.audioManager.getMusicState();
  });
}

function setupMediaHandlers() {
  ipcMain.on('media:pause-all', async () => {
    await appController.mediaController.pauseAll();
  });

  ipcMain.on('media:resume-all', async () => {
    await appController.mediaController.resumeAll();
  });

  ipcMain.handle('media:get-paused', () => {
    return appController.mediaController.getPausedMedia();
  });
}

function setupInactivityHandlers() {
  ipcMain.on('inactivity:start', (event, timeout) => {
    appController.inactivityDetector.start(timeout, (data) => {
      appController.sessionManager.emit('inactivity:detected', data);
    });
  });

  ipcMain.on('inactivity:stop', () => {
    appController.inactivityDetector.stop();
  });

  ipcMain.handle('inactivity:get-state', () => {
    return appController.inactivityDetector.getState();
  });

  ipcMain.on('activity:record', () => {
    appController.sessionManager.recordActivity();
    appController.inactivityDetector.recordActivity();
  });
}

function setupNotificationHandlers() {
  ipcMain.on('notification:show', (event, options) => {
    appController.notificationManager.show(options);
  });

  ipcMain.on('notification:set-enabled', (event, enabled) => {
    appController.notificationManager.setEnabled(enabled);
  });

  ipcMain.on('notification:set-sound-enabled', (event, enabled) => {
    appController.notificationManager.setSoundEnabled(enabled);
  });
}

function setupSystemHandlers() {
  ipcMain.handle('system:get-info', async () => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.version,
      electron: process.versions.electron
    };
  });

  ipcMain.handle('system:get-locale', async () => {
    return require('electron').app.getLocale();
  });

  ipcMain.handle('system:get-displays', async () => {
    return screen.getAllDisplays();
  });

  ipcMain.handle('weather:get', async () => {
    // TODO: Implement weather API
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
}

function setupPhrasesHandlers() {
  ipcMain.handle('phrases:get', async (event, category) => {
    return appController.dataService.phrases.getRandom(category, 1);
  });

  ipcMain.handle('phrases:get-multiple', async (event, category, count) => {
    return appController.dataService.phrases.getRandom(category, count);
  });
}

function setupMiscHandlers() {
  ipcMain.on('onboarding:complete', () => {
    appController.dataService.configs.setAppSetting('onboarding_complete', '1');
  });

  ipcMain.handle('onboarding:is-complete', async () => {
    const value = appController.dataService.configs.getAppSetting('onboarding_complete');
    return value === '1';
  });

  ipcMain.on('telemetry:send', (event, eventName, data) => {
    const consent = appController.dataService.configs.getAppSetting('telemetry_consent');
    if (consent === '1') {
      console.log('Telemetry event:', eventName, data);
      // TODO: Send to analytics service
    }
  });

  ipcMain.on('telemetry:set-consent', (event, consent) => {
    appController.dataService.configs.setAppSetting('telemetry_consent', consent ? '1' : '0');
  });

  ipcMain.handle('update:check', async () => {
    return appController.updateManager.checkForUpdates();
  });

  ipcMain.handle('update:get-changelog', async () => {
    return appController.updateManager.getChangelog();
  });

  ipcMain.on('dnd:set', (event, enabled) => {
    // TODO: Implement Do Not Disturb mode for Windows
    console.log('DND mode:', enabled);
  });

  ipcMain.on('shortcut:register', (event, shortcut, action) => {
    appController.shortcutManager.register(shortcut, action, (triggeredAction) => {
      if (windowManager.gadgetWindow) {
        windowManager.gadgetWindow.webContents.send('shortcut:triggered', {
          action: triggeredAction
        });
      }
    });
  });

  ipcMain.on('shortcut:unregister', (event, shortcut) => {
    appController.shortcutManager.unregister(shortcut);
  });

  ipcMain.handle('shortcut:get-all', () => {
    return appController.shortcutManager.getAll();
  });

  ipcMain.on('i18n:change', (event, lang) => {
    appController.dataService.configs.setAppSetting('locale', lang);
  });

  ipcMain.handle('i18n:get', async (event, key) => {
    // TODO: Implement actual i18n
    return key;
  });
}

module.exports = { setupIPCHandlers };
