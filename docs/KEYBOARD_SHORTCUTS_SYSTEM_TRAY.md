# ⌨️ Keyboard Shortcuts & System Tray - Guia de Implementação

## Índice
1. [Keyboard Shortcuts Globais](#-keyboard-shortcuts-globais)
2. [System Tray Integration](#-system-tray-integration)
3. [Implementação Combinada](#-implementação-combinada)

---

# ⌨️ Keyboard Shortcuts Globais

## O que são?

Atalhos de teclado que funcionam **mesmo quando o app não está em foco**. Permitem controlar o timer de qualquer lugar no sistema operacional.

### Exemplos:
- `Ctrl+Alt+P` → Pausar/Retomar timer
- `Ctrl+Alt+S` → Parar timer
- `Ctrl+Alt+T` → Abrir/Focar janela do timer

---

## 🛠️ Implementação

### 1. Criar ShortcutManager

Crie: `src/main/managers/ShortcutManager.js`

```javascript
const { globalShortcut, BrowserWindow } = require('electron');

class ShortcutManager {
  constructor(timerEngine, windowManager) {
    this.timerEngine = timerEngine;
    this.windowManager = windowManager;
    this.registeredShortcuts = new Map();
  }

  /**
   * Registra todos os atalhos globais
   */
  registerAllShortcuts() {
    const shortcuts = {
      // Timer controls
      'CommandOrControl+Alt+P': this.togglePauseResume.bind(this),
      'CommandOrControl+Alt+S': this.stopTimer.bind(this),
      'CommandOrControl+Alt+N': this.startNewPomodoro.bind(this),

      // Window controls
      'CommandOrControl+Alt+T': this.focusTimerWindow.bind(this),
      'CommandOrControl+Alt+H': this.toggleMainWindow.bind(this),

      // Quick actions
      'CommandOrControl+Alt+B': this.skipBreak.bind(this),
      'CommandOrControl+Alt+1': () => this.setTimerDuration(15), // Quick 15min
      'CommandOrControl+Alt+2': () => this.setTimerDuration(25), // Quick 25min
      'CommandOrControl+Alt+3': () => this.setTimerDuration(45), // Quick 45min
    };

    Object.entries(shortcuts).forEach(([accelerator, callback]) => {
      this.registerShortcut(accelerator, callback);
    });

    console.log(`✅ ${this.registeredShortcuts.size} global shortcuts registered`);
  }

  /**
   * Registra um atalho individual
   */
  registerShortcut(accelerator, callback) {
    try {
      const success = globalShortcut.register(accelerator, callback);

      if (success) {
        this.registeredShortcuts.set(accelerator, callback);
        console.log(`✅ Registered: ${accelerator}`);
      } else {
        console.warn(`⚠️ Failed to register: ${accelerator} (may be in use)`);
      }
    } catch (error) {
      console.error(`❌ Error registering ${accelerator}:`, error.message);
    }
  }

  /**
   * Remove um atalho específico
   */
  unregisterShortcut(accelerator) {
    globalShortcut.unregister(accelerator);
    this.registeredShortcuts.delete(accelerator);
  }

  /**
   * Remove todos os atalhos
   */
  unregisterAll() {
    globalShortcut.unregisterAll();
    this.registeredShortcuts.clear();
    console.log('🔓 All global shortcuts unregistered');
  }

  // ============ Ações dos Shortcuts ============

  togglePauseResume() {
    const state = this.timerEngine.getState();

    if (!state.isRunning) {
      this.showNotification('Timer não está rodando');
      return;
    }

    if (state.isPaused) {
      this.timerEngine.resume();
      this.showNotification('⏯️ Timer retomado');
    } else {
      this.timerEngine.pause();
      this.showNotification('⏸️ Timer pausado');
    }
  }

  stopTimer() {
    const state = this.timerEngine.getState();

    if (!state.isRunning) {
      this.showNotification('Nenhum timer ativo');
      return;
    }

    this.timerEngine.stop();
    this.showNotification('⏹️ Timer parado');
  }

  startNewPomodoro() {
    // Pega último projeto usado
    const lastProject = this.timerEngine.getLastProject();

    if (!lastProject) {
      this.showNotification('Selecione um projeto primeiro');
      this.focusMainWindow();
      return;
    }

    this.timerEngine.start({
      projectId: lastProject.id,
      type: 'focus'
    });

    this.showNotification(`🍅 Pomodoro iniciado: ${lastProject.name}`);
    this.focusTimerWindow();
  }

  skipBreak() {
    const state = this.timerEngine.getState();

    if (state.type === 'focus') {
      this.showNotification('Você está em um pomodoro, não em pausa');
      return;
    }

    // Vai mostrar dialog de skip na tela
    this.timerEngine.requestSkipBreak('Keyboard shortcut');
    this.focusTimerWindow();
  }

  setTimerDuration(minutes) {
    // Define uma sessão rápida customizada
    this.timerEngine.start({
      type: 'focus',
      customDuration: minutes * 60
    });

    this.showNotification(`⏱️ Timer de ${minutes} minutos iniciado`);
    this.focusTimerWindow();
  }

  focusTimerWindow() {
    const timerWindow = this.windowManager.getWindow('timer');

    if (timerWindow) {
      timerWindow.show();
      timerWindow.focus();
    } else {
      this.windowManager.createTimerWindow();
    }
  }

  toggleMainWindow() {
    const mainWindow = this.windowManager.getMainWindow();

    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  }

  focusMainWindow() {
    const mainWindow = this.windowManager.getMainWindow();
    mainWindow.show();
    mainWindow.focus();
  }

  showNotification(message) {
    const { Notification } = require('electron');

    if (Notification.isSupported()) {
      new Notification({
        title: 'Pomodoro Extreme',
        body: message,
        icon: path.join(__dirname, '../../assets/icons/icon.png')
      }).show();
    }
  }

  /**
   * Verifica se um atalho está disponível
   */
  isAcceleratorAvailable(accelerator) {
    return !globalShortcut.isRegistered(accelerator);
  }

  /**
   * Lista todos os atalhos registrados
   */
  getRegisteredShortcuts() {
    return Array.from(this.registeredShortcuts.keys());
  }
}

module.exports = ShortcutManager;
```

### 2. Integrar no AppController

Em `src/main/AppController.js`:

```javascript
const ShortcutManager = require('./managers/ShortcutManager');

class AppController {
  constructor() {
    // ... outros managers
    this.shortcutManager = new ShortcutManager(this.timerEngine, this.windowManager);
  }

  initialize() {
    // ... outras inicializações

    // Registrar shortcuts após app estar pronto
    app.on('ready', () => {
      this.shortcutManager.registerAllShortcuts();
    });

    // Limpar shortcuts ao sair
    app.on('will-quit', () => {
      this.shortcutManager.unregisterAll();
    });
  }
}
```

### 3. Configurações de Shortcuts (UI)

Adicione na aba de Settings uma seção para personalizar shortcuts:

```jsx
// src/renderer/pages/SettingsPage.jsx - Aba "Atalhos"

<TabPanel>
  <VStack spacing={6} align="stretch">
    <Heading size="md">⌨️ Atalhos de Teclado</Heading>

    <FormControl>
      <FormLabel>Pausar/Retomar Timer</FormLabel>
      <Input value="Ctrl+Alt+P" readOnly />
      <FormHelperText>Pausa ou retoma o timer de qualquer lugar</FormHelperText>
    </FormControl>

    <FormControl>
      <FormLabel>Parar Timer</FormLabel>
      <Input value="Ctrl+Alt+S" readOnly />
      <FormHelperText>Encerra o timer atual</FormHelperText>
    </FormControl>

    <FormControl>
      <FormLabel>Abrir Timer</FormLabel>
      <Input value="Ctrl+Alt+T" readOnly />
      <FormHelperText>Abre/foca a janela do timer</FormHelperText>
    </FormControl>

    <Divider />

    <Switch defaultChecked>
      <FormLabel>Ativar Atalhos Globais</FormLabel>
    </Switch>
  </VStack>
</TabPanel>
```

---

# 🔔 System Tray Integration

## O que é?

Ícone na bandeja do sistema (próximo ao relógio) que permite controlar o app sem abrir a janela principal.

### Funcionalidades:
- Ver tempo restante
- Controlar timer (play/pause/stop)
- Menu de ações rápidas
- Indicador visual (ativo/inativo)

---

## 🛠️ Implementação

### 1. Criar TrayManager

Crie: `src/main/managers/TrayManager.js`

```javascript
const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

class TrayManager {
  constructor(timerEngine, windowManager) {
    this.timerEngine = timerEngine;
    this.windowManager = windowManager;
    this.tray = null;
    this.updateInterval = null;
  }

  /**
   * Cria o system tray
   */
  create() {
    // Ícone da bandeja (16x16 ou 32x32 para retina)
    const iconPath = path.join(__dirname, '../../assets/icons/tray-icon.png');
    const icon = nativeImage.createFromPath(iconPath);

    // Criar tray
    this.tray = new Tray(icon.resize({ width: 16, height: 16 }));
    this.tray.setToolTip('Pomodoro Extreme');

    // Menu inicial
    this.buildMenu();

    // Evento de click (mostrar/ocultar janela)
    this.tray.on('click', () => {
      this.toggleMainWindow();
    });

    // Atualizar tooltip com tempo a cada segundo
    this.startUpdatingTooltip();

    // Escutar eventos do timer
    this.setupTimerListeners();

    console.log('✅ System tray created');
  }

  /**
   * Constrói o menu contextual
   */
  buildMenu() {
    const state = this.timerEngine.getState();
    const isRunning = state?.isRunning;
    const isPaused = state?.isPaused;

    const contextMenu = Menu.buildFromTemplate([
      // Status
      {
        label: this.getStatusLabel(),
        enabled: false
      },
      { type: 'separator' },

      // Controles do Timer
      {
        label: isRunning && !isPaused ? '⏸️ Pausar' : '▶️ Iniciar/Retomar',
        click: () => this.handlePlayPause(),
        enabled: true
      },
      {
        label: '⏹️ Parar',
        click: () => this.handleStop(),
        enabled: isRunning
      },
      { type: 'separator' },

      // Quick Actions
      {
        label: '🚀 Início Rápido',
        submenu: [
          {
            label: '15 minutos',
            click: () => this.quickStart(15)
          },
          {
            label: '25 minutos (padrão)',
            click: () => this.quickStart(25)
          },
          {
            label: '45 minutos',
            click: () => this.quickStart(45)
          }
        ]
      },
      { type: 'separator' },

      // Janelas
      {
        label: '📊 Estatísticas',
        click: () => this.openStats()
      },
      {
        label: '⚙️ Configurações',
        click: () => this.openSettings()
      },
      { type: 'separator' },

      // App
      {
        label: '👁️ Mostrar App',
        click: () => this.showMainWindow()
      },
      {
        label: '❌ Sair',
        click: () => this.quit()
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  /**
   * Retorna label do status atual
   */
  getStatusLabel() {
    const state = this.timerEngine.getState();

    if (!state || !state.isRunning) {
      return '⏸️ Parado';
    }

    const type = state.type === 'focus' ? '🎯 Foco' : '☕ Pausa';
    const time = this.formatTime(state.timeRemaining);

    return `${type} - ${time}`;
  }

  /**
   * Atualiza tooltip dinamicamente
   */
  startUpdatingTooltip() {
    this.updateInterval = setInterval(() => {
      const state = this.timerEngine.getState();

      if (!state || !state.isRunning) {
        this.tray.setToolTip('Pomodoro Extreme - Parado');
        return;
      }

      const type = state.type === 'focus' ? 'Foco' : 'Pausa';
      const time = this.formatTime(state.timeRemaining);

      this.tray.setToolTip(`Pomodoro Extreme - ${type}: ${time}`);

      // Atualizar menu também
      this.buildMenu();
    }, 1000);
  }

  /**
   * Escuta eventos do timer para atualizar ícone
   */
  setupTimerListeners() {
    this.timerEngine.on('started', () => {
      this.setActiveIcon();
      this.buildMenu();
    });

    this.timerEngine.on('stopped', () => {
      this.setInactiveIcon();
      this.buildMenu();
    });

    this.timerEngine.on('paused', () => {
      this.setInactiveIcon();
      this.buildMenu();
    });

    this.timerEngine.on('resumed', () => {
      this.setActiveIcon();
      this.buildMenu();
    });
  }

  /**
   * Define ícone ativo (timer rodando)
   */
  setActiveIcon() {
    const iconPath = path.join(__dirname, '../../assets/icons/tray-icon-active.png');
    const icon = nativeImage.createFromPath(iconPath);
    this.tray.setImage(icon.resize({ width: 16, height: 16 }));
  }

  /**
   * Define ícone inativo
   */
  setInactiveIcon() {
    const iconPath = path.join(__dirname, '../../assets/icons/tray-icon.png');
    const icon = nativeImage.createFromPath(iconPath);
    this.tray.setImage(icon.resize({ width: 16, height: 16 }));
  }

  // ============ Ações do Menu ============

  handlePlayPause() {
    const state = this.timerEngine.getState();

    if (!state.isRunning) {
      // Iniciar novo pomodoro
      const lastProject = this.timerEngine.getLastProject();
      if (lastProject) {
        this.timerEngine.start({ projectId: lastProject.id });
      } else {
        this.showMainWindow();
      }
    } else if (state.isPaused) {
      this.timerEngine.resume();
    } else {
      this.timerEngine.pause();
    }
  }

  handleStop() {
    this.timerEngine.stop();
  }

  quickStart(minutes) {
    this.timerEngine.start({
      type: 'focus',
      customDuration: minutes * 60
    });
  }

  openStats() {
    this.windowManager.openRoute('/stats');
  }

  openSettings() {
    this.windowManager.openRoute('/settings');
  }

  showMainWindow() {
    const mainWindow = this.windowManager.getMainWindow();
    mainWindow.show();
    mainWindow.focus();
  }

  toggleMainWindow() {
    const mainWindow = this.windowManager.getMainWindow();

    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  }

  quit() {
    const { app } = require('electron');
    app.quit();
  }

  // ============ Utilidades ============

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Limpa resources
   */
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    if (this.tray) {
      this.tray.destroy();
    }
  }
}

module.exports = TrayManager;
```

### 2. Integrar no AppController

```javascript
const TrayManager = require('./managers/TrayManager');

class AppController {
  constructor() {
    // ... outros managers
    this.trayManager = new TrayManager(this.timerEngine, this.windowManager);
  }

  initialize() {
    // ... outras inicializações

    // Criar tray quando app estiver pronto
    app.on('ready', () => {
      this.trayManager.create();
    });

    // Limpar ao sair
    app.on('before-quit', () => {
      this.trayManager.destroy();
    });
  }
}
```

### 3. Configurar "Minimize to Tray"

Permite minimizar para bandeja em vez de fechar:

```javascript
// Em AppController ou WindowManager
const mainWindow = this.windowManager.getMainWindow();

mainWindow.on('close', (event) => {
  // Se usuário quer minimizar para tray (configurável)
  const minimizeToTray = this.configManager.get('minimizeToTray', true);

  if (minimizeToTray && !app.isQuitting) {
    event.preventDefault();
    mainWindow.hide();
  }
});
```

---

# 🎯 Implementação Combinada

## Integração Completa no AppController

```javascript
const ShortcutManager = require('./managers/ShortcutManager');
const TrayManager = require('./managers/TrayManager');

class AppController {
  constructor() {
    this.timerEngine = new TimerEngine();
    this.windowManager = new WindowManager();

    // Novos managers
    this.shortcutManager = new ShortcutManager(this.timerEngine, this.windowManager);
    this.trayManager = new TrayManager(this.timerEngine, this.windowManager);
  }

  initialize() {
    const { app } = require('electron');

    app.on('ready', () => {
      // Criar janelas
      this.windowManager.createMainWindow();

      // Criar tray
      this.trayManager.create();

      // Registrar shortcuts
      this.shortcutManager.registerAllShortcuts();

      console.log('✅ App initialized with Tray and Shortcuts');
    });

    app.on('will-quit', () => {
      this.shortcutManager.unregisterAll();
    });

    app.on('before-quit', () => {
      this.trayManager.destroy();
    });
  }
}
```

---

## 🧪 Testando

### Keyboard Shortcuts:
1. Inicie um pomodoro
2. Minimize o app
3. Pressione `Ctrl+Alt+P` → Timer deve pausar
4. Pressione novamente → Timer deve retomar
5. Pressione `Ctrl+Alt+T` → Janela do timer deve aparecer

### System Tray:
1. Minimize o app
2. Procure o ícone 🍅 na bandeja do sistema
3. Clique no ícone → App deve aparecer/desaparecer
4. Clique com botão direito → Menu deve aparecer
5. Inicie um timer → Tooltip deve mostrar tempo

---

## ✅ Checklist de Implementação

**Keyboard Shortcuts:**
- [ ] Criar `ShortcutManager.js`
- [ ] Registrar shortcuts no app.ready
- [ ] Implementar ações (pause, resume, stop, etc.)
- [ ] Testar todos os atalhos
- [ ] Adicionar UI de configuração
- [ ] Handle conflitos de shortcuts

**System Tray:**
- [ ] Criar `TrayManager.js`
- [ ] Criar ícones para tray (normal e ativo)
- [ ] Implementar menu contextual
- [ ] Atualizar tooltip dinamicamente
- [ ] Escutar eventos do timer
- [ ] Implementar minimize to tray
- [ ] Testar em Windows/Mac/Linux

---

## 📚 Referências

- **Global Shortcuts**: https://www.electronjs.org/docs/latest/api/global-shortcut
- **System Tray**: https://www.electronjs.org/docs/latest/api/tray
- **Native Image**: https://www.electronjs.org/docs/latest/api/native-image
- **Best Practices**: https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts

---

**Status:** Documentação ✅ Completa | Implementação ⚠️ Pendente
**Prioridade:** Alta (shortcuts) / Média (tray)
**Estimativa:** 3-4 horas cada funcionalidade
