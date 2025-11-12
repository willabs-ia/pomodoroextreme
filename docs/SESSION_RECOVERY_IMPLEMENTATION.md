# 🔄 Session Recovery - Guia de Implementação

## Visão Geral

O **Session Recovery** permite que o usuário recupere uma sessão de timer que foi interrompida (app fechou, crash, reinício do sistema, etc.).

### Como Funciona:

1. **Durante o timer**: Estado é salvo periodicamente (a cada segundo)
2. **Ao fechar/crashar**: Última snapshot do estado fica salva em disco
3. **Ao reabrir**: App detecta sessão interrompida e oferece recuperação
4. **Usuário decide**: Continuar de onde parou, descartar, ou decidir depois

---

## 📦 Componentes Já Implementados

### Frontend:
- ✅ `SessionRecovery.jsx` - Modal de recuperação
- ✅ Integrado no `App.jsx`
- ✅ Handlers IPC no `preload.js`

### Backend:
- ⚠️ **Pendente de implementação no main process**

---

## 🛠️ Implementação no Main Process

### 1. Criar SessionRecoveryManager

Crie: `src/main/managers/SessionRecoveryManager.js`

```javascript
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class SessionRecoveryManager {
  constructor() {
    // Arquivo onde o estado será salvo
    this.recoveryFilePath = path.join(app.getPath('userData'), 'session-recovery.json');
    this.saveTimer = null;
    this.currentState = null;
  }

  /**
   * Salva o estado atual do timer
   * Chamado a cada segundo durante um timer ativo
   */
  saveState(timerState) {
    this.currentState = {
      sessionId: timerState.sessionId,
      project: timerState.project,
      type: timerState.type, // 'focus', 'shortBreak', 'longBreak'
      timeRemaining: timerState.timeRemaining,
      plannedDuration: timerState.plannedDuration,
      pomodorosCompleted: timerState.pomodorosCompleted,
      interruptedAt: new Date().toISOString(),
      recoveryVersion: 1
    };

    // Salvar em disco (throttled para performance)
    this.throttledSave();
  }

  /**
   * Salva com throttle (evita gravar a cada milissegundo)
   */
  throttledSave() {
    if (this.saveTimer) return;

    this.saveTimer = setTimeout(() => {
      this.writeToFile();
      this.saveTimer = null;
    }, 1000); // Salvar no máximo 1x por segundo
  }

  /**
   * Escreve no arquivo
   */
  writeToFile() {
    if (!this.currentState) return;

    try {
      fs.writeFileSync(
        this.recoveryFilePath,
        JSON.stringify(this.currentState, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('Error saving session recovery:', error);
    }
  }

  /**
   * Verifica se há sessão para recuperar
   */
  checkRecovery() {
    try {
      if (!fs.existsSync(this.recoveryFilePath)) {
        return { hasRecovery: false };
      }

      const data = fs.readFileSync(this.recoveryFilePath, 'utf8');
      const recoveryData = JSON.parse(data);

      // Verificar se a sessão é válida (não muito antiga)
      const interruptedAt = new Date(recoveryData.interruptedAt);
      const now = new Date();
      const hoursSince = (now - interruptedAt) / 1000 / 60 / 60;

      // Se passou mais de 24 horas, descartar automaticamente
      if (hoursSince > 24) {
        this.discardRecovery();
        return { hasRecovery: false };
      }

      return {
        hasRecovery: true,
        ...recoveryData
      };
    } catch (error) {
      console.error('Error checking session recovery:', error);
      return { hasRecovery: false };
    }
  }

  /**
   * Restaura a sessão
   */
  async restoreSession(sessionId) {
    const recoveryData = this.checkRecovery();

    if (!recoveryData.hasRecovery) {
      throw new Error('No recovery data found');
    }

    // Limpar arquivo de recovery (já foi restaurado)
    this.discardRecovery();

    // Retornar dados para o TimerEngine restaurar
    return recoveryData;
  }

  /**
   * Descarta a recovery (usuário não quer recuperar)
   */
  discardRecovery() {
    try {
      if (fs.existsSync(this.recoveryFilePath)) {
        fs.unlinkSync(this.recoveryFilePath);
      }
      this.currentState = null;
    } catch (error) {
      console.error('Error discarding recovery:', error);
    }
  }

  /**
   * Limpar recovery quando sessão termina normalmente
   */
  clearRecovery() {
    this.discardRecovery();
  }

  /**
   * Hook para quando timer para
   */
  onTimerStopped() {
    this.clearRecovery();
  }

  /**
   * Hook para quando sessão completa
   */
  onSessionEnded() {
    this.clearRecovery();
  }
}

module.exports = SessionRecoveryManager;
```

### 2. Integrar no AppController

Em `src/main/AppController.js`:

```javascript
const SessionRecoveryManager = require('./managers/SessionRecoveryManager');

class AppController {
  constructor() {
    // ... outros managers
    this.sessionRecoveryManager = new SessionRecoveryManager();
  }

  initialize() {
    // ... outras inicializações

    // Registrar handlers IPC
    this.registerRecoveryHandlers();

    // Conectar eventos do TimerEngine
    this.setupRecoveryListeners();
  }

  registerRecoveryHandlers() {
    const { ipcMain } = require('electron');

    ipcMain.handle('session:check-recovery', async () => {
      return this.sessionRecoveryManager.checkRecovery();
    });

    ipcMain.handle('session:restore', async (event, sessionId) => {
      const recoveryData = await this.sessionRecoveryManager.restoreSession(sessionId);

      // Restaurar no TimerEngine
      await this.timerEngine.restoreFromRecovery(recoveryData);

      return { success: true };
    });

    ipcMain.handle('session:discard-recovery', async () => {
      this.sessionRecoveryManager.discardRecovery();
      return { success: true };
    });
  }

  setupRecoveryListeners() {
    // Salvar estado a cada tick
    this.timerEngine.on('tick', (state) => {
      if (state.isRunning) {
        this.sessionRecoveryManager.saveState(state);
      }
    });

    // Limpar recovery quando timer para
    this.timerEngine.on('stopped', () => {
      this.sessionRecoveryManager.onTimerStopped();
    });

    // Limpar recovery quando sessão termina
    this.timerEngine.on('session:ended', () => {
      this.sessionRecoveryManager.onSessionEnded();
    });
  }
}
```

### 3. Adicionar método de restauração no TimerEngine

Em `src/main/core/TimerEngine.js`:

```javascript
class TimerEngine {
  // ... código existente

  /**
   * Restaura timer a partir de recovery data
   */
  async restoreFromRecovery(recoveryData) {
    // Configurar estado
    this.currentSession = await this.sessionManager.getSessionById(recoveryData.sessionId);
    this.currentProject = recoveryData.project;
    this.currentType = recoveryData.type;
    this.timeRemaining = recoveryData.timeRemaining;
    this.plannedDuration = recoveryData.plannedDuration;

    // Reiniciar o timer
    this.isRunning = true;
    this.isPaused = false;

    // Começar contagem
    this.startTicking();

    // Emitir evento de restauração
    this.emit('session:restored', {
      session: this.currentSession,
      project: this.currentProject,
      type: this.currentType,
      timeRemaining: this.timeRemaining
    });

    console.log('✅ Session restored from recovery');
  }
}
```

---

## 🧪 Testando

### Cenário 1: Crash Durante Pomodoro
1. Inicie um pomodoro
2. Feche o app abruptamente (força)
3. Reabra o app
4. ✅ Modal de recovery deve aparecer
5. Clique em "Continuar Sessão"
6. ✅ Timer deve continuar de onde parou

### Cenário 2: Fechar Durante Pausa
1. Complete um pomodoro
2. Entre na pausa
3. Feche o app normalmente
4. Reabra o app
5. ✅ Modal deve aparecer oferecendo continuar a pausa

### Cenário 3: Descartar Recovery
1. Inicie pomodoro e feche
2. Reabra o app
3. Modal aparece
4. Clique em "Descartar"
5. ✅ Recovery removido, app inicia limpo

### Cenário 4: Decidir Depois
1. Inicie pomodoro e feche
2. Reabra o app
3. Modal aparece
4. Clique em "Decidir Depois"
5. ✅ Modal fecha mas recovery continua salvo
6. Pode voltar e recuperar depois

---

## 📂 Estrutura de Arquivos

```
session-recovery.json (em app.getPath('userData')):
{
  "sessionId": "uuid-da-sessao",
  "project": {
    "id": 1,
    "name": "Projeto Teste",
    "icon": "🚀"
  },
  "type": "focus",
  "timeRemaining": 900,
  "plannedDuration": 1500,
  "pomodorosCompleted": 2,
  "interruptedAt": "2025-11-11T10:30:00.000Z",
  "recoveryVersion": 1
}
```

---

## 🔒 Segurança e Edge Cases

### Validações:
- ✅ Verificar se sessão não é muito antiga (> 24h)
- ✅ Validar estrutura do JSON
- ✅ Handle se arquivo estiver corrompido
- ✅ Limpar recovery após restauração bem-sucedida

### Edge Cases:
- App foi atualizado entre crash e recovery → Verificar `recoveryVersion`
- Projeto foi deletado → Mostrar erro amigável
- Múltiplos crashs → Sempre manter o mais recente
- Disco cheio → Log erro, não crashar

---

## 🎯 Melhorias Futuras

### V2:
- [ ] Salvar histórico de múltiplas recuperações
- [ ] Recovery automático (sem perguntar se < 5 min)
- [ ] Backup na nuvem (Google Drive, Dropbox)
- [ ] Recovery entre dispositivos

### V3:
- [ ] "Desfazer" recovery (caso usuário mude de ideia)
- [ ] Recovery por projeto (múltiplos timers simultâneos)
- [ ] Integração com notificações do sistema

---

## ✅ Checklist de Implementação

Backend (Main Process):
- [ ] Criar `SessionRecoveryManager.js`
- [ ] Adicionar handlers IPC no AppController
- [ ] Conectar eventos do TimerEngine
- [ ] Implementar `restoreFromRecovery()` no TimerEngine
- [ ] Testar salvamento a cada segundo
- [ ] Testar recovery após crash
- [ ] Validar edge cases

Frontend (já implementado):
- [x] Componente `SessionRecovery.jsx`
- [x] Integração no `App.jsx`
- [x] Handlers no `preload.js`
- [x] Toast notifications

---

## 📚 Referências

- **Electron User Data**: https://www.electronjs.org/docs/latest/api/app#appgetpathname
- **Best Practices**: https://www.electronjs.org/docs/latest/tutorial/application-data-store
- **Crash Recovery Pattern**: https://stackoverflow.com/questions/tagged/electron+crash-recovery

---

**Status:** Frontend ✅ Completo | Backend ⚠️ Pendente
**Prioridade:** Alta (melhora significativamente UX)
**Estimativa:** 2-3 horas de implementação no backend
