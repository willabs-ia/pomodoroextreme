const { app } = require('electron');

class TaskbarManager {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.progress = 0;
  }

  setProgress(value) {
    // value should be between 0 and 1
    this.progress = Math.max(0, Math.min(1, value));

    if (this.windowManager.gadgetWindow) {
      // Set progress bar in taskbar
      this.windowManager.gadgetWindow.setProgressBar(this.progress);
    }
  }

  clearProgress() {
    this.progress = 0;

    if (this.windowManager.gadgetWindow) {
      this.windowManager.gadgetWindow.setProgressBar(-1); // -1 removes the progress bar
    }
  }

  setOverlay(overlay) {
    // overlay can be:
    // - 'focus' (show focus icon)
    // - 'break' (show break icon)
    // - 'paused' (show pause icon)
    // - null (clear)

    if (this.windowManager.gadgetWindow) {
      if (overlay) {
        // TODO: Create actual overlay icons
        // const iconPath = path.join(__dirname, `../../assets/images/overlay-${overlay}.png`);
        // this.windowManager.gadgetWindow.setOverlayIcon(iconPath, overlay);
        console.log(`Taskbar overlay set to: ${overlay}`);
      } else {
        this.windowManager.gadgetWindow.setOverlayIcon(null, '');
      }
    }
  }

  flash(count = 1) {
    if (this.windowManager.gadgetWindow) {
      // Flash the taskbar icon to get attention
      this.windowManager.gadgetWindow.flashFrame(count > 0);

      if (count > 1) {
        let flashes = 0;
        const interval = setInterval(() => {
          flashes++;
          this.windowManager.gadgetWindow.flashFrame(true);

          if (flashes >= count) {
            clearInterval(interval);
            this.windowManager.gadgetWindow.flashFrame(false);
          }
        }, 500);
      }
    }
  }

  setTitle(title) {
    if (this.windowManager.gadgetWindow) {
      this.windowManager.gadgetWindow.setTitle(title || 'Pomodoro Extreme');
    }
  }

  setThumbarButtons(buttons) {
    // Windows 7+ taskbar buttons
    // buttons is an array of { tooltip, icon, click }

    if (this.windowManager.gadgetWindow && process.platform === 'win32') {
      // TODO: Implement thumbar buttons
      // this.windowManager.gadgetWindow.setThumbarButtons(buttons);
      console.log('Thumbar buttons:', buttons);
    }
  }
}

module.exports = { TaskbarManager };
