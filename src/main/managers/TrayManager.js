const { Tray, Menu, nativeImage, app } = require('electron');
const path = require('path');

class TrayManager {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.tray = null;
    this.currentStatus = 'idle'; // idle, focus, break
    this.timeRemaining = '00:00';

    this.createTray();
  }

  createTray() {
    // Create tray icon (you'll need to add actual icon files)
    const iconPath = path.join(__dirname, '../../assets/images/tray-icon.png');

    // For now, create a simple icon (will be replaced with actual icon)
    const icon = nativeImage.createEmpty();

    this.tray = new Tray(icon);
    this.tray.setToolTip('Pomodoro Extreme');

    this.updateContextMenu();

    // Handle click events
    this.tray.on('click', () => {
      this.windowManager.focusGadget();
    });

    this.tray.on('right-click', () => {
      this.tray.popUpContextMenu();
    });
  }

  updateContextMenu(timerState = null) {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Pomodoro Extreme',
        enabled: false,
        icon: null
      },
      {
        type: 'separator'
      },
      {
        label: timerState
          ? `${timerState.type === 'focus' ? '🎯' : '☕'} ${timerState.timeRemaining}`
          : '⏸️ Idle',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: timerState && timerState.isRunning ? 'Pause Timer' : 'Start Timer',
        click: () => {
          // Send to renderer via window
          if (this.windowManager.gadgetWindow) {
            this.windowManager.gadgetWindow.webContents.send(
              'tray:timer-toggle'
            );
          }
        },
        enabled: timerState !== null
      },
      {
        label: 'Stop Timer',
        click: () => {
          if (this.windowManager.gadgetWindow) {
            this.windowManager.gadgetWindow.webContents.send('tray:timer-stop');
          }
        },
        enabled: timerState !== null
      },
      {
        type: 'separator'
      },
      {
        label: 'Settings',
        click: () => {
          this.windowManager.createSettingsWindow();
        }
      },
      {
        label: 'Statistics',
        click: () => {
          if (this.windowManager.gadgetWindow) {
            this.windowManager.gadgetWindow.webContents.send('tray:show-stats');
          }
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'About',
        click: () => {
          // Show about dialog
        }
      },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        }
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  updateStatus(status, timeRemaining = '00:00') {
    this.currentStatus = status;
    this.timeRemaining = timeRemaining;

    // Update tooltip
    let tooltip = 'Pomodoro Extreme';
    if (status === 'focus') {
      tooltip = `🎯 Focus: ${timeRemaining}`;
    } else if (status === 'break') {
      tooltip = `☕ Break: ${timeRemaining}`;
    }

    this.tray.setToolTip(tooltip);
  }

  updateTimer(timerState) {
    this.updateContextMenu(timerState);
    this.updateStatus(timerState.type, timerState.timeRemaining);
  }

  cleanup() {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}

module.exports = { TrayManager };
