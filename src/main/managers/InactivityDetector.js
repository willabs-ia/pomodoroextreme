const { powerMonitor, screen } = require('electron');

class InactivityDetector {
  constructor() {
    this.isEnabled = false;
    this.timeout = 300; // 5 minutes default (in seconds)
    this.interval = null;
    this.lastActivityTime = Date.now();
    this.onInactivityCallback = null;
  }

  start(timeout = 300, callback) {
    this.timeout = timeout;
    this.onInactivityCallback = callback;
    this.isEnabled = true;
    this.lastActivityTime = Date.now();

    // Start checking every 10 seconds
    this.interval = setInterval(() => {
      this.checkInactivity();
    }, 10000);

    // Listen to system events
    this.setupSystemListeners();

    console.log(`Inactivity detector started with ${timeout}s timeout`);
  }

  setupSystemListeners() {
    // Reset activity time on system resume
    powerMonitor.on('resume', () => {
      this.recordActivity();
    });

    powerMonitor.on('unlock-screen', () => {
      this.recordActivity();
    });

    // Note: Mouse and keyboard events are not directly available in Electron main process
    // For true mouse/keyboard tracking, we would need:
    // 1. A native module (like 'node-global-key-listener')
    // 2. Or track activity from renderer process
    // For now, we'll rely on system idle state
  }

  checkInactivity() {
    if (!this.isEnabled) return;

    // Get system idle time in seconds
    const idleTime = powerMonitor.getSystemIdleTime();

    if (idleTime >= this.timeout) {
      this.onInactivityDetected(idleTime);
    }
  }

  onInactivityDetected(idleTime) {
    if (this.onInactivityCallback) {
      this.onInactivityCallback({
        idleTime,
        threshold: this.timeout
      });
    }

    console.log(`Inactivity detected: ${idleTime}s (threshold: ${this.timeout}s)`);
  }

  recordActivity() {
    this.lastActivityTime = Date.now();
  }

  stop() {
    this.isEnabled = false;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    console.log('Inactivity detector stopped');
  }

  setTimeout(timeout) {
    this.timeout = timeout;
  }

  getState() {
    const systemIdleTime = powerMonitor.getSystemIdleTime();

    return {
      isEnabled: this.isEnabled,
      timeout: this.timeout,
      systemIdleTime,
      lastActivityTime: this.lastActivityTime
    };
  }
}

module.exports = { InactivityDetector };
