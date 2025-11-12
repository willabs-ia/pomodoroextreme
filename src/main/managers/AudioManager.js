const path = require('path');
const fs = require('fs');

class AudioManager {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.sounds = new Map();
    this.volumes = new Map();
    this.currentMusic = null;
    this.tickInterval = null;
  }

  initialize() {
    // Define default sounds (paths relative to assets folder)
    this.sounds.set('tick', { path: 'assets/sounds/tick.mp3' });
    this.sounds.set('tack', { path: 'assets/sounds/tack.mp3' });
    this.sounds.set('pomodoro-start', { path: 'assets/sounds/pomodoro-start.mp3' });
    this.sounds.set('pomodoro-complete', { path: 'assets/sounds/pomodoro-complete.mp3' });
    this.sounds.set('break-start', { path: 'assets/sounds/break-start.mp3' });
    this.sounds.set('break-complete', { path: 'assets/sounds/break-complete.mp3' });
    this.sounds.set('notification', { path: 'assets/sounds/notification.mp3' });
    this.sounds.set('achievement', { path: 'assets/sounds/achievement.mp3' });
    this.sounds.set('warning', { path: 'assets/sounds/warning.mp3' });

    // Default volumes
    this.volumes.set('tick', 0.2);
    this.volumes.set('tack', 0.2);
    this.volumes.set('alert', 0.5);
    this.volumes.set('notification', 0.5);
    this.volumes.set('music', 0.3);

    console.log('AudioManager initialized with', this.sounds.size, 'sounds');
  }

  /**
   * Play a sound by sending IPC to renderer
   */
  playSound(soundId, volume = null) {
    const soundData = this.sounds.get(soundId);
    if (!soundData) {
      console.warn(`Sound not found: ${soundId}`);
      return;
    }

    const effectiveVolume = volume !== null ? volume : this.volumes.get(soundId) || 0.5;

    // Send to all windows that might need audio
    this.sendToWindows('audio:play-sound', {
      soundId,
      path: soundData.path,
      volume: effectiveVolume
    });

    console.log(`Playing sound: ${soundId} at volume: ${effectiveVolume}`);
  }

  stopSound(soundId) {
    this.sendToWindows('audio:stop-sound', { soundId });
    console.log(`Stopping sound: ${soundId}`);
  }

  setVolume(soundId, volume) {
    this.volumes.set(soundId, Math.max(0, Math.min(1, volume)));
    console.log(`Set volume for ${soundId}: ${volume}`);
  }

  /**
   * Start tick-tack sound (alternating every second)
   */
  startTickTack() {
    if (this.tickInterval) return; // Already running

    let isTick = true;
    this.tickInterval = setInterval(() => {
      this.playSound(isTick ? 'tick' : 'tack');
      isTick = !isTick;
    }, 1000);

    console.log('Tick-tack started');
  }

  /**
   * Stop tick-tack sound
   */
  stopTickTack() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
      console.log('Tick-tack stopped');
    }
  }

  /**
   * Play background music during breaks
   */
  playMusic(source, options = {}) {
    console.log(`Playing music from: ${source}`, options);

    this.currentMusic = {
      source,
      options,
      isPlaying: true
    };

    this.sendToWindows('audio:play-music', {
      source,
      volume: options.volume || this.volumes.get('music') || 0.3,
      loop: options.loop !== false // Default to loop
    });
  }

  stopMusic() {
    console.log('Stopping music');

    if (this.currentMusic) {
      this.currentMusic.isPlaying = false;
      this.currentMusic = null;
    }

    this.sendToWindows('audio:stop-music');
  }

  pauseMusic() {
    if (this.currentMusic) {
      this.currentMusic.isPlaying = false;
      this.sendToWindows('audio:pause-music');
      console.log('Music paused');
    }
  }

  resumeMusic() {
    if (this.currentMusic) {
      this.currentMusic.isPlaying = true;
      this.sendToWindows('audio:resume-music');
      console.log('Music resumed');
    }
  }

  getMusicState() {
    return this.currentMusic;
  }

  setMusicVolume(volume) {
    this.setVolume('music', volume);
    this.sendToWindows('audio:set-volume', {
      type: 'music',
      volume
    });
  }

  /**
   * Helper to send IPC events to all windows
   */
  sendToWindows(channel, data) {
    if (!this.windowManager) {
      console.warn('WindowManager not available, cannot send audio events');
      return;
    }

    // Send to gadget window
    if (this.windowManager.gadgetWindow && !this.windowManager.gadgetWindow.isDestroyed()) {
      this.windowManager.gadgetWindow.webContents.send(channel, data);
    }

    // Send to block windows
    if (this.windowManager.blockWindows && this.windowManager.blockWindows.length > 0) {
      this.windowManager.blockWindows.forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send(channel, data);
        }
      });
    }

    // Send to main window if exists
    if (this.windowManager.mainWindow && !this.windowManager.mainWindow.isDestroyed()) {
      this.windowManager.mainWindow.webContents.send(channel, data);
    }
  }
}

module.exports = { AudioManager };
