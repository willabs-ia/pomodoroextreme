const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class MediaController {
  constructor() {
    this.platform = process.platform;
    this.pausedMedia = [];
  }

  async pauseAll() {
    console.log('Pausing all media...');
    this.pausedMedia = [];

    try {
      // Windows-specific media control
      if (this.platform === 'win32') {
        await this.pauseWindowsMedia();
      }
      // macOS-specific
      else if (this.platform === 'darwin') {
        await this.pauseMacMedia();
      }
      // Linux
      else if (this.platform === 'linux') {
        await this.pauseLinuxMedia();
      }

      return { success: true, pausedMedia: this.pausedMedia };
    } catch (error) {
      console.error('Error pausing media:', error);
      return { success: false, error: error.message };
    }
  }

  async pauseWindowsMedia() {
    // On Windows, we can use nircmd or powershell to control media
    // This is a simplified version - full implementation would need nircmd or similar

    try {
      // Try to pause Chrome/Edge via keyboard shortcut simulation
      // This would require a library like 'robotjs' for keyboard simulation
      console.log('Attempting to pause Windows media...');

      // TODO: Implement actual media pause using:
      // - nircmd for global media control
      // - Windows Media Control API
      // - robotjs for keyboard simulation (Space key in browsers)

      this.pausedMedia.push('chrome', 'edge', 'spotify');
    } catch (error) {
      console.error('Error pausing Windows media:', error);
    }
  }

  async pauseMacMedia() {
    try {
      // macOS: Use AppleScript to control apps
      const scripts = [
        // Spotify
        'osascript -e \'tell application "Spotify" to pause\'',
        // Chrome
        'osascript -e \'tell application "Google Chrome" to tell active tab of window 1 to execute javascript "document.querySelector(\'video\')?.pause()"\'',
        // Safari
        'osascript -e \'tell application "Safari" to do JavaScript "document.querySelector(\'video\')?.pause()" in document 1\''
      ];

      for (const script of scripts) {
        try {
          await execPromise(script);
          console.log(`Executed: ${script}`);
        } catch (e) {
          // App might not be running, ignore
        }
      }

      this.pausedMedia.push('spotify', 'chrome', 'safari');
    } catch (error) {
      console.error('Error pausing macOS media:', error);
    }
  }

  async pauseLinuxMedia() {
    try {
      // Linux: Use playerctl or dbus
      await execPromise('playerctl pause');
      this.pausedMedia.push('all-mpris-players');
    } catch (error) {
      console.error('Error pausing Linux media:', error);
    }
  }

  async resumeAll() {
    console.log('Resuming media...');

    try {
      if (this.platform === 'win32') {
        await this.resumeWindowsMedia();
      } else if (this.platform === 'darwin') {
        await this.resumeMacMedia();
      } else if (this.platform === 'linux') {
        await this.resumeLinuxMedia();
      }

      this.pausedMedia = [];
      return { success: true };
    } catch (error) {
      console.error('Error resuming media:', error);
      return { success: false, error: error.message };
    }
  }

  async resumeWindowsMedia() {
    // Resume Windows media
    console.log('Resuming Windows media...');
    // TODO: Implement actual resume
  }

  async resumeMacMedia() {
    try {
      // Only resume if we paused them
      if (this.pausedMedia.includes('spotify')) {
        await execPromise('osascript -e \'tell application "Spotify" to play\'');
      }
      // Note: Browsers are not auto-resumed to avoid unexpected behavior
    } catch (error) {
      console.error('Error resuming macOS media:', error);
    }
  }

  async resumeLinuxMedia() {
    try {
      await execPromise('playerctl play');
    } catch (error) {
      console.error('Error resuming Linux media:', error);
    }
  }

  getPausedMedia() {
    return this.pausedMedia;
  }
}

module.exports = { MediaController };
