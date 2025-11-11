const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window management
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  setAlwaysOnTop: (flag) => ipcRenderer.send('window:always-on-top', flag),
  setWindowBounds: (bounds) => ipcRenderer.send('window:set-bounds', bounds),
  getWindowBounds: () => ipcRenderer.invoke('window:get-bounds'),

  // Fullscreen/Block screen
  showBlockScreen: (data) => ipcRenderer.send('blockscreen:show', data),
  hideBlockScreen: () => ipcRenderer.send('blockscreen:hide'),

  // Timer
  startTimer: (config) => ipcRenderer.invoke('timer:start', config),
  pauseTimer: () => ipcRenderer.send('timer:pause'),
  resumeTimer: () => ipcRenderer.send('timer:resume'),
  stopTimer: () => ipcRenderer.send('timer:stop'),
  skipBreak: (reason) => ipcRenderer.invoke('timer:skip-break', reason),
  getTimerState: () => ipcRenderer.invoke('timer:get-state'),

  // Timer event listeners
  onTimerTick: (callback) => ipcRenderer.on('timer:tick', (_, data) => callback(data)),
  onTimerPaused: (callback) => ipcRenderer.on('timer:paused', (_, data) => callback(data)),
  onTimerResumed: (callback) => ipcRenderer.on('timer:resumed', (_, data) => callback(data)),
  onTimerStopped: (callback) => ipcRenderer.on('timer:stopped', (_, data) => callback(data)),

  onPomodoroStarted: (callback) => ipcRenderer.on('pomodoro:started', (_, data) => callback(data)),
  onPomodoroCompleted: (callback) => ipcRenderer.on('pomodoro:completed', (_, data) => callback(data)),

  onBreakStarted: (callback) => ipcRenderer.on('break:started', (_, data) => callback(data)),
  onBreakCompleted: (callback) => ipcRenderer.on('break:completed', (_, data) => callback(data)),

  onSessionStarted: (callback) => ipcRenderer.on('session:started', (_, data) => callback(data)),
  onSessionEnded: (callback) => ipcRenderer.on('session:ended', (_, data) => callback(data)),

  // Skip dialog events
  onSkipShowMessage: (callback) => ipcRenderer.on('skip:show-message', (_, data) => callback(data)),
  sendSkipMessageResponse: (confirmed) => ipcRenderer.send('skip:message-response', confirmed),
  onSkipRequestJustification: (callback) => ipcRenderer.on('skip:request-justification', (_, data) => callback(data)),
  sendSkipJustification: (justification) => ipcRenderer.send('skip:justification-response', justification),

  // Project management
  getProjects: () => ipcRenderer.invoke('projects:get-all'),
  createProject: (project) => ipcRenderer.invoke('projects:create', project),
  updateProject: (id, project) => ipcRenderer.invoke('projects:update', id, project),
  deleteProject: (id) => ipcRenderer.invoke('projects:delete', id),
  getActiveProject: () => ipcRenderer.invoke('projects:get-active'),

  // Session management
  getCurrentSession: () => ipcRenderer.invoke('session:get-current'),
  recoverSession: () => ipcRenderer.invoke('session:recover'),
  discardSession: () => ipcRenderer.invoke('session:discard'),

  // Configuration
  getConfig: (projectId) => ipcRenderer.invoke('config:get', projectId),
  updateConfig: (projectId, config) => ipcRenderer.invoke('config:update', projectId, config),

  // Statistics
  getStats: (projectId, period) => ipcRenderer.invoke('stats:get', projectId, period),
  getDashboard: () => ipcRenderer.invoke('stats:dashboard'),
  exportStats: (format, period) => ipcRenderer.invoke('stats:export', format, period),

  // Achievements
  getAchievements: () => ipcRenderer.invoke('achievements:get-all'),
  getReputation: () => ipcRenderer.invoke('achievements:get-reputation'),
  unlockAchievement: (id) => ipcRenderer.invoke('achievements:unlock', id),

  // Audio
  playSound: (soundId, volume) => ipcRenderer.send('audio:play', soundId, volume),
  stopSound: (soundId) => ipcRenderer.send('audio:stop', soundId),
  setVolume: (soundId, volume) => ipcRenderer.send('audio:set-volume', soundId, volume),
  playMusic: (source, options) => ipcRenderer.send('audio:play-music', source, options),
  stopMusic: () => ipcRenderer.send('audio:stop-music'),

  // Media control (Spotify, YouTube, etc)
  pauseMedia: () => ipcRenderer.send('media:pause-all'),
  resumeMedia: () => ipcRenderer.send('media:resume-all'),

  // Inactivity detection
  startInactivityDetection: (timeout) => ipcRenderer.send('inactivity:start', timeout),
  stopInactivityDetection: () => ipcRenderer.send('inactivity:stop'),
  onInactivityDetected: (callback) => ipcRenderer.on('inactivity:detected', (_, data) => callback(data)),

  // Notifications
  showNotification: (options) => ipcRenderer.send('notification:show', options),

  // DND (Do Not Disturb)
  setDND: (enabled) => ipcRenderer.send('dnd:set', enabled),

  // Shortcuts
  registerShortcut: (shortcut, action) => ipcRenderer.send('shortcut:register', shortcut, action),
  unregisterShortcut: (shortcut) => ipcRenderer.send('shortcut:unregister', shortcut),

  // Updates
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  getChangelog: () => ipcRenderer.invoke('update:get-changelog'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update:available', (_, data) => callback(data)),

  // Telemetry
  sendTelemetry: (event, data) => ipcRenderer.send('telemetry:send', event, data),
  setTelemetryConsent: (consent) => ipcRenderer.send('telemetry:set-consent', consent),

  // System
  getSystemInfo: () => ipcRenderer.invoke('system:get-info'),
  getLocale: () => ipcRenderer.invoke('system:get-locale'),
  getDisplays: () => ipcRenderer.invoke('system:get-displays'),

  // Weather (for break screen widget)
  getWeather: () => ipcRenderer.invoke('weather:get'),

  // i18n
  changeLanguage: (lang) => ipcRenderer.send('i18n:change', lang),
  getTranslation: (key) => ipcRenderer.invoke('i18n:get', key),

  // File system (for custom backgrounds, sounds, etc)
  selectFile: (options) => ipcRenderer.invoke('fs:select-file', options),
  selectFolder: (options) => ipcRenderer.invoke('fs:select-folder', options),
  saveFile: (path, data) => ipcRenderer.invoke('fs:save-file', path, data),

  // Phrases database
  getPhrase: (category) => ipcRenderer.invoke('phrases:get', category),
  getPhrases: (category, count) => ipcRenderer.invoke('phrases:get-multiple', category, count),

  // Onboarding
  completeOnboarding: () => ipcRenderer.send('onboarding:complete'),
  isOnboardingComplete: () => ipcRenderer.invoke('onboarding:is-complete'),

  // Remove listeners (cleanup)
  removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Platform info
contextBridge.exposeInMainWorld('platform', {
  isWindows: process.platform === 'win32',
  isMac: process.platform === 'darwin',
  isLinux: process.platform === 'linux',
  platform: process.platform,
  arch: process.arch
});

// Version info
contextBridge.exposeInMainWorld('appVersion', {
  electron: process.versions.electron,
  chrome: process.versions.chrome,
  node: process.versions.node,
  app: require('../package.json').version
});
