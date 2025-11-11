const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { WindowManager } = require('./managers/WindowManager');
const { TrayManager } = require('./managers/TrayManager');
const { setupIPCHandlers } = require('./ipc/handlers');

// Keep a global reference of the window object
let windowManager = null;
let trayManager = null;

const isDevelopment = process.env.NODE_ENV === 'development';

function createApp() {
  // Initialize Window Manager
  windowManager = new WindowManager();

  // Create main gadget window
  windowManager.createGadgetWindow();

  // Initialize Tray Icon
  trayManager = new TrayManager(windowManager);

  // Setup IPC handlers
  setupIPCHandlers(windowManager);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createApp();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.createGadgetWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window
    if (windowManager && windowManager.gadgetWindow) {
      if (windowManager.gadgetWindow.isMinimized()) {
        windowManager.gadgetWindow.restore();
      }
      windowManager.gadgetWindow.focus();
    }
  });
}

// Handle app termination
app.on('before-quit', () => {
  // Cleanup and save state
  if (windowManager) {
    windowManager.cleanup();
  }
  if (trayManager) {
    trayManager.cleanup();
  }
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Log to file in production
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  // Log to file in production
});
