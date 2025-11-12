const { globalShortcut } = require('electron');

class ShortcutManager {
  constructor() {
    this.shortcuts = new Map();
  }

  register(accelerator, action, callback) {
    // Unregister if already exists
    if (this.shortcuts.has(accelerator)) {
      this.unregister(accelerator);
    }

    const success = globalShortcut.register(accelerator, () => {
      console.log(`Shortcut triggered: ${accelerator} -> ${action}`);
      callback(action);
    });

    if (success) {
      this.shortcuts.set(accelerator, { action, callback });
      console.log(`Registered shortcut: ${accelerator} for action: ${action}`);
      return { success: true };
    } else {
      console.error(`Failed to register shortcut: ${accelerator}`);
      return { success: false, error: 'Failed to register shortcut' };
    }
  }

  unregister(accelerator) {
    if (this.shortcuts.has(accelerator)) {
      globalShortcut.unregister(accelerator);
      this.shortcuts.delete(accelerator);
      console.log(`Unregistered shortcut: ${accelerator}`);
      return { success: true };
    }
    return { success: false, error: 'Shortcut not found' };
  }

  unregisterAll() {
    globalShortcut.unregisterAll();
    this.shortcuts.clear();
    console.log('All shortcuts unregistered');
  }

  isRegistered(accelerator) {
    return globalShortcut.isRegistered(accelerator);
  }

  getAll() {
    return Array.from(this.shortcuts.entries()).map(([accelerator, data]) => ({
      accelerator,
      action: data.action
    }));
  }

  registerDefaults(callback) {
    // Default shortcuts
    const defaults = [
      { accelerator: 'CommandOrControl+Alt+P', action: 'toggle-timer' },
      { accelerator: 'CommandOrControl+Alt+S', action: 'open-settings' },
      { accelerator: 'CommandOrControl+Alt+D', action: 'open-dashboard' }
    ];

    defaults.forEach(({ accelerator, action }) => {
      this.register(accelerator, action, callback);
    });
  }
}

module.exports = { ShortcutManager };
