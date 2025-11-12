#!/usr/bin/env node

/**
 * Gerador de Sons Placeholder
 * Cria arquivos de áudio MP3 silenciosos/básicos para o Pomodoro Extreme
 *
 * Execute: node scripts/generate-placeholder-sounds.js
 */

const fs = require('fs');
const path = require('path');

// Diretório de destino
const soundsDir = path.join(__dirname, '..', 'assets', 'sounds');

// Criar diretório se não existir
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// MP3 silencioso mínimo (44 bytes) - 0.026 segundos
// Este é um arquivo MP3 válido mas praticamente silencioso
const SILENT_MP3_BASE64 = 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v//////////////////////////////////////////////////////////////////8AAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZAAP8AAAf4AAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASUluZm8AAAAPAAAAAgAAA4QAu7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v//////////////////////////////////////////////////////////////////wAAAABMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

// Arquivos a criar
const soundFiles = [
  { name: 'tick.mp3', description: 'Som do relógio (tick)' },
  { name: 'tack.mp3', description: 'Som do relógio (tack)' },
  { name: 'pomodoro-start.mp3', description: 'Início de pomodoro' },
  { name: 'pomodoro-complete.mp3', description: 'Pomodoro concluído' },
  { name: 'break-start.mp3', description: 'Início da pausa' },
  { name: 'break-complete.mp3', description: 'Fim da pausa' },
  { name: 'session-complete.mp3', description: 'Sessão completa' },
  { name: 'achievement-unlock.mp3', description: 'Conquista desbloqueada' },
  { name: 'music-focus.mp3', description: 'Música de foco (opcional)' }
];

console.log('🎵 Gerando sons placeholder...\n');

// Criar arquivos
soundFiles.forEach(({ name, description }) => {
  const filePath = path.join(soundsDir, name);
  const buffer = Buffer.from(SILENT_MP3_BASE64, 'base64');

  fs.writeFileSync(filePath, buffer);
  console.log(`✅ ${name} - ${description}`);
});

console.log(`\n✨ ${soundFiles.length} arquivos criados em: ${soundsDir}`);
console.log('\n📝 IMPORTANTE:');
console.log('   Estes são arquivos PLACEHOLDER silenciosos.');
console.log('   Para melhor experiência, substitua por sons personalizados!');
console.log('\n📚 Consulte: assets/sounds/README.md para instruções de personalização.\n');
