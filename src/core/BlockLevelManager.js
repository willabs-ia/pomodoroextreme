const { EventEmitter } = require('events');

class BlockLevelManager extends EventEmitter {
  constructor(dataService) {
    super();
    this.dataService = dataService;
    this.currentLevel = 'medium'; // soft, medium, extreme
    this.skipHistory = [];
    this.accumulatedPenalty = 0;
    this.skipCount = 0;
  }

  setLevel(level) {
    if (!['soft', 'medium', 'extreme'].includes(level)) {
      throw new Error('Invalid block level');
    }
    this.currentLevel = level;
    this.emit('level:changed', { level });
  }

  canSkipBreak() {
    if (this.currentLevel === 'extreme') {
      return {
        allowed: false,
        reason: 'Modo Extremo ativado - sem escape possível!'
      };
    }

    if (this.currentLevel === 'medium' && this.skipCount >= 3) {
      return {
        allowed: false,
        reason: 'Você já pulou 3 vezes! Precisa pagar a dívida de descanso.'
      };
    }

    return {
      allowed: true,
      reason: null
    };
  }

  // SOFT LEVEL: Show 3 demotivational messages
  async requestSkipSoft(onMessageCallback) {
    const messages = this.dataService.phrases.getRandom('skip_sarcastic', 3);

    for (let i = 0; i < messages.length; i++) {
      const confirmed = await onMessageCallback(messages[i], i + 1, 3);
      if (!confirmed) {
        this.emit('skip:cancelled', { level: 'soft', atMessage: i + 1 });
        return { granted: false, cancelled: true };
      }
    }

    // Ask for justification
    const justificationPrompt = this.dataService.phrases.getRandom(
      'skip_justification',
      1
    );
    const justification = await onMessageCallback(justificationPrompt, 'justification');

    this.emit('skip:granted', {
      level: 'soft',
      justification
    });

    return { granted: true, justification };
  }

  // MEDIUM LEVEL: 3x penalty system
  requestSkipMedium(currentBreakDuration) {
    this.skipCount++;

    // Calculate penalty
    const penalty = currentBreakDuration * 3;
    this.accumulatedPenalty += penalty;

    // Calculate next penalty if they skip again
    const nextPenalty = this.accumulatedPenalty * 3;

    // Record skip in database
    // (We'll do this in the timer engine when actually skipping)

    this.emit('skip:granted', {
      level: 'medium',
      skipCount: this.skipCount,
      penalty: this.accumulatedPenalty,
      nextPenalty: this.skipCount < 3 ? nextPenalty : null,
      remainingSkips: 3 - this.skipCount
    });

    return {
      granted: true,
      penalty: this.accumulatedPenalty,
      nextPenalty: this.skipCount < 3 ? nextPenalty : null,
      remainingSkips: 3 - this.skipCount,
      warning:
        this.skipCount >= 2
          ? `ATENÇÃO: Se você pular mais uma vez, a próxima pausa será de ${Math.floor(
              nextPenalty / 60
            )} minutos!`
          : null
    };
  }

  // Called when break is actually taken (not skipped)
  payPenalty(breakDuration) {
    if (this.accumulatedPenalty > 0) {
      const paid = Math.min(breakDuration, this.accumulatedPenalty);
      this.accumulatedPenalty -= paid;

      if (this.accumulatedPenalty <= 0) {
        // Debt paid!
        this.skipCount = 0;
        this.accumulatedPenalty = 0;

        this.emit('penalty:paid', {
          message: 'Parabéns! Você pagou sua dívida de descanso! 🎉'
        });

        return { debtPaid: true };
      }

      this.emit('penalty:partial', {
        paid,
        remaining: this.accumulatedPenalty,
        message: `Você ainda deve ${Math.floor(
          this.accumulatedPenalty / 60
        )} minutos de descanso.`
      });

      return { debtPaid: false, remaining: this.accumulatedPenalty };
    }

    return { debtPaid: true };
  }

  getNextBreakDuration(baseShortBreak, baseLongBreak, isLongBreak) {
    if (this.currentLevel !== 'medium' || this.accumulatedPenalty === 0) {
      return isLongBreak ? baseLongBreak : baseShortBreak;
    }

    const baseDuration = isLongBreak ? baseLongBreak : baseShortBreak;
    return baseDuration + this.accumulatedPenalty;
  }

  getStatus() {
    return {
      level: this.currentLevel,
      skipCount: this.skipCount,
      accumulatedPenalty: this.accumulatedPenalty,
      accumulatedPenaltyMinutes: Math.floor(this.accumulatedPenalty / 60),
      canSkip: this.canSkipBreak()
    };
  }

  reset() {
    this.skipCount = 0;
    this.accumulatedPenalty = 0;
    this.skipHistory = [];
    this.emit('reset');
  }
}

module.exports = { BlockLevelManager };
