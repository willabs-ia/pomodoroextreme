/**
 * Audio Generator - Gera sons básicos usando Web Audio API
 * Use este script para gerar sons placeholder ou testar o sistema de áudio
 */

class AudioGenerator {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  /**
   * Gera um beep simples
   */
  generateBeep(frequency = 440, duration = 0.1, volume = 0.3) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);

    return oscillator;
  }

  /**
   * Tick do relógio (som agudo curto)
   */
  playTick() {
    this.generateBeep(800, 0.05, 0.1);
  }

  /**
   * Tack do relógio (som mais grave)
   */
  playTack() {
    this.generateBeep(600, 0.05, 0.1);
  }

  /**
   * Som de início (ascendente)
   */
  playStart() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Som de conclusão (sequência de notas)
   */
  playComplete() {
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const duration = 0.15;

    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.generateBeep(freq, duration, 0.2);
      }, index * 150);
    });
  }

  /**
   * Som de achievement (fanfarra)
   */
  playAchievement() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const duration = 0.2;

    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.generateBeep(freq, duration, 0.25);
      }, index * 120);
    });
  }

  /**
   * Cria um arquivo WAV a partir de uma sequência de notas
   * Retorna um Blob que pode ser salvo como arquivo
   */
  async generateWAVFile(type = 'tick') {
    // Offline audio context para renderizar o som
    const offlineContext = new OfflineAudioContext(1, 44100 * 0.5, 44100);

    let oscillator, gainNode;

    switch (type) {
      case 'tick':
        oscillator = offlineContext.createOscillator();
        gainNode = offlineContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(offlineContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, 0);
        gainNode.gain.exponentialRampToValueAtTime(0.01, 0.05);
        oscillator.start(0);
        oscillator.stop(0.05);
        break;

      case 'tack':
        oscillator = offlineContext.createOscillator();
        gainNode = offlineContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(offlineContext.destination);
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, 0);
        gainNode.gain.exponentialRampToValueAtTime(0.01, 0.05);
        oscillator.start(0);
        oscillator.stop(0.05);
        break;

      case 'start':
        oscillator = offlineContext.createOscillator();
        gainNode = offlineContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(offlineContext.destination);
        oscillator.frequency.setValueAtTime(400, 0);
        oscillator.frequency.exponentialRampToValueAtTime(800, 0.2);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, 0);
        gainNode.gain.exponentialRampToValueAtTime(0.01, 0.3);
        oscillator.start(0);
        oscillator.stop(0.3);
        break;

      default:
        throw new Error('Unknown type');
    }

    // Renderizar
    const buffer = await offlineContext.startRendering();

    // Converter para WAV
    const wav = this.bufferToWave(buffer);
    return new Blob([wav], { type: 'audio/wav' });
  }

  /**
   * Converte AudioBuffer para formato WAV
   */
  bufferToWave(abuffer) {
    const numOfChan = abuffer.numberOfChannels;
    const length = abuffer.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let offset = 0;
    let pos = 0;

    // Write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // Write interleaved data
    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true); // write 16-bit sample
        pos += 2;
      }
      offset++; // next source sample
    }

    return buffer;

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }

  /**
   * Helper para salvar arquivo
   */
  downloadWAV(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Export para uso em módulos
export default AudioGenerator;

// Funções globais para testes rápidos no console
if (typeof window !== 'undefined') {
  window.AudioGenerator = AudioGenerator;
  window.testAudioGenerator = async () => {
    const gen = new AudioGenerator();

    console.log('🔊 Testando sons...');

    console.log('1. Tick');
    gen.playTick();

    setTimeout(() => {
      console.log('2. Tack');
      gen.playTack();
    }, 500);

    setTimeout(() => {
      console.log('3. Start');
      gen.playStart();
    }, 1000);

    setTimeout(() => {
      console.log('4. Complete');
      gen.playComplete();
    }, 1500);

    setTimeout(() => {
      console.log('5. Achievement');
      gen.playAchievement();
    }, 2500);

    console.log('✅ Teste completo!');
  };

  window.generateAllSounds = async () => {
    const gen = new AudioGenerator();
    const sounds = ['tick', 'tack', 'start'];

    console.log('📦 Gerando arquivos WAV...');

    for (const sound of sounds) {
      const blob = await gen.generateWAVFile(sound);
      gen.downloadWAV(blob, `${sound}.wav`);
      console.log(`✅ ${sound}.wav gerado`);
    }

    console.log('🎉 Todos os arquivos gerados!');
  };
}
