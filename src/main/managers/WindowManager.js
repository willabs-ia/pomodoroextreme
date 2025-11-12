const { BrowserWindow, screen } = require('electron');
const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

class WindowManager {
  constructor() {
    this.gadgetWindow = null;
    this.blockScreenWindows = []; // Array for multi-monitor support
    this.settingsWindow = null;
  }

  createGadgetWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    this.gadgetWindow = new BrowserWindow({
      width: 280,
      height: 200,
      x: width - 300,
      y: 20,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      resizable: true,
      minimizable: false,
      maximizable: false,
      skipTaskbar: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../../preload.js')
      }
    });

    // Set minimum size
    this.gadgetWindow.setMinimumSize(200, 150);

    // Load the app
    if (isDevelopment) {
      this.gadgetWindow.loadURL('http://localhost:5173');
      // Open DevTools in development
      // this.gadgetWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
      this.gadgetWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
    }

    // Handle window events
    this.gadgetWindow.on('closed', () => {
      this.gadgetWindow = null;
    });

    // Prevent the window from being hidden
    this.gadgetWindow.on('hide', (event) => {
      if (this.preventHide) {
        event.preventDefault();
      }
    });

    return this.gadgetWindow;
  }

  createBlockScreenWindows(data) {
    // Close existing block screens first
    this.closeBlockScreenWindows();

    // Get all displays
    const displays = screen.getAllDisplays();

    displays.forEach((display) => {
      const { x, y, width, height } = display.bounds;

      const blockWindow = new BrowserWindow({
        x,
        y,
        width,
        height,
        frame: false,
        fullscreen: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        closable: false,
        minimizable: false,
        maximizable: false,
        resizable: false,
        movable: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(__dirname, '../../preload.js')
        }
      });

      // Set highest priority
      blockWindow.setAlwaysOnTop(true, 'screen-saver', 1);
      blockWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      blockWindow.setFullScreenable(false);

      // Load the block screen page
      if (isDevelopment) {
        blockWindow.loadURL('http://localhost:5173/#/block');
      } else {
        blockWindow.loadFile(path.join(__dirname, '../../dist/index.html'), {
          hash: 'block'
        });
      }

      // Send configuration data when ready
      blockWindow.webContents.on('did-finish-load', () => {
        blockWindow.webContents.send('block-screen:config', {
          ...data,
          displayId: display.id,
          displayBounds: display.bounds
        });
      });

      // Prevent closing
      blockWindow.on('close', (event) => {
        if (this.preventClose) {
          event.preventDefault();
        }
      });

      this.blockScreenWindows.push(blockWindow);
    });

    return this.blockScreenWindows;
  }

  closeBlockScreenWindows() {
    this.preventClose = false;

    this.blockScreenWindows.forEach((window) => {
      if (window && !window.isDestroyed()) {
        window.close();
      }
    });

    this.blockScreenWindows = [];
  }

  createSettingsWindow() {
    if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {
      this.settingsWindow.focus();
      return this.settingsWindow;
    }

    this.settingsWindow = new BrowserWindow({
      width: 900,
      height: 700,
      frame: true,
      resizable: true,
      minimizable: true,
      maximizable: true,
      modal: true,
      parent: this.gadgetWindow,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../../preload.js')
      }
    });

    if (isDevelopment) {
      this.settingsWindow.loadURL('http://localhost:5173/#/settings');
    } else {
      this.settingsWindow.loadFile(path.join(__dirname, '../../dist/index.html'), {
        hash: 'settings'
      });
    }

    this.settingsWindow.on('closed', () => {
      this.settingsWindow = null;
    });

    return this.settingsWindow;
  }

  setGadgetAlwaysOnTop(flag) {
    if (this.gadgetWindow) {
      this.gadgetWindow.setAlwaysOnTop(flag);
    }
  }

  setGadgetBounds(bounds) {
    if (this.gadgetWindow) {
      this.gadgetWindow.setBounds(bounds);
    }
  }

  getGadgetBounds() {
    if (this.gadgetWindow) {
      return this.gadgetWindow.getBounds();
    }
    return null;
  }

  minimizeGadget() {
    if (this.gadgetWindow) {
      this.gadgetWindow.minimize();
    }
  }

  restoreGadget() {
    if (this.gadgetWindow) {
      this.gadgetWindow.restore();
    }
  }

  focusGadget() {
    if (this.gadgetWindow) {
      this.gadgetWindow.focus();
    }
  }

  enableBlockMode(level) {
    // Extreme level: prevent everything
    if (level === 'extreme') {
      this.preventClose = true;
      this.preventHide = true;
    }
    // Medium level: just prevent close
    else if (level === 'medium') {
      this.preventClose = true;
      this.preventHide = false;
    }
    // Soft level: allow escape (handled in renderer)
    else {
      this.preventClose = false;
      this.preventHide = false;
    }
  }

  disableBlockMode() {
    this.preventClose = false;
    this.preventHide = false;
  }

  cleanup() {
    // Close all windows gracefully
    this.closeBlockScreenWindows();

    if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {
      this.settingsWindow.close();
    }

    // Don't close gadget window here, let app handle it
  }
}

module.exports = { WindowManager };
