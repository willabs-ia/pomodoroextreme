#!/usr/bin/env node

/**
 * Gerador de Ícones Placeholder
 * Cria ícones SVG básicos para o Pomodoro Extreme
 *
 * Execute: node scripts/generate-placeholder-icons.js
 */

const fs = require('fs');
const path = require('path');

// Diretório de destino
const iconsDir = path.join(__dirname, '..', 'assets', 'icons');

// Criar diretório se não existir
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

/**
 * Gera um SVG de ícone do tomate
 */
function generateTomatoSVG(size = 512, isActive = false) {
  const color = isActive ? '#48BB78' : '#E53E3E'; // Verde se ativo, vermelho se não
  const stemColor = '#48BB78';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="tomatoGradient">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#C53030;stop-opacity:1" />
    </radialGradient>
  </defs>

  <!-- Corpo do tomate -->
  <circle cx="256" cy="280" r="180" fill="url(#tomatoGradient)" />

  <!-- Destaques (brilho) -->
  <ellipse cx="200" cy="240" rx="40" ry="60" fill="#FC8181" opacity="0.6" />

  <!-- Caule -->
  <path d="M 256 100 Q 240 140, 240 180 Q 240 190, 250 190 Q 260 190, 260 180 Q 260 140, 244 100 Z"
        fill="${stemColor}" />

  <!-- Folhas -->
  <ellipse cx="230" cy="130" rx="25" ry="15" fill="${stemColor}" transform="rotate(-30 230 130)" />
  <ellipse cx="280" cy="130" rx="25" ry="15" fill="${stemColor}" transform="rotate(30 280 130)" />

  ${isActive ? `
  <!-- Anel de timer ativo -->
  <circle cx="256" cy="280" r="200"
          fill="none"
          stroke="${color}"
          stroke-width="8"
          opacity="0.5"
          stroke-dasharray="10,10" />
  ` : ''}
</svg>`;
}

/**
 * Gera ícone de system tray (mais simples, monocromático)
 */
function generateTrayIconSVG(size = 16, isActive = false) {
  const color = isActive ? '#48BB78' : '#1A202C';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <!-- Círculo simples do tomate -->
  <circle cx="8" cy="9" r="6" fill="${color}" />

  <!-- Caule simples -->
  <rect x="7" y="2" width="2" height="4" fill="${color}" opacity="0.8" />

  ${isActive ? `
  <!-- Indicador ativo -->
  <circle cx="8" cy="9" r="7" fill="none" stroke="${color}" stroke-width="1" opacity="0.6" />
  ` : ''}
</svg>`;
}

console.log('🎨 Gerando ícones placeholder...\n');

// Gerar ícone principal (SVG)
const mainIconSVG = generateTomatoSVG(512, false);
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), mainIconSVG);
console.log('✅ icon.svg - Ícone principal (512x512)');

// Gerar PNG simples (base64 data URL para demonstração)
// Nota: Para produção, use ferramenta adequada para converter SVG → PNG
const iconSizes = [16, 32, 48, 64, 128, 256, 512];
iconSizes.forEach((size) => {
  const svg = generateTomatoSVG(size, false);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.svg`), svg);
});
console.log(`✅ icon-{16,32,48,64,128,256,512}.svg - Múltiplos tamanhos`);

// Gerar ícones de tray
const trayNormal = generateTrayIconSVG(16, false);
const trayActive = generateTrayIconSVG(16, true);

fs.writeFileSync(path.join(iconsDir, 'tray-icon.svg'), trayNormal);
fs.writeFileSync(path.join(iconsDir, 'tray-icon-active.svg'), trayActive);

console.log('✅ tray-icon.svg - Ícone da bandeja (normal)');
console.log('✅ tray-icon-active.svg - Ícone da bandeja (ativo)');

// Criar arquivo de instruções adicionais
const instructionsPath = path.join(iconsDir, 'CONVERT_TO_ICO.txt');
const instructions = `
# Converter SVG para ICO/ICNS

## Para Windows (.ico):

1. Instale o ImageMagick: https://imagemagick.org/script/download.php

2. Execute no terminal:
   convert icon.svg -define icon:auto-resize=16,32,48,256 icon.ico

## Para macOS (.icns):

1. Use a ferramenta png2icns ou iconutil (nativo do macOS)

2. Ou instale: npm install -g png2icons

3. Execute:
   png2icons icon-512.svg icon.icns

## Método Mais Fácil:

Use electron-icon-maker (recomendado):

npm install -g electron-icon-maker
electron-icon-maker --input=icon-512.svg --output=.

Isso gera automaticamente .ico e .icns!

## Online (Sem Instalação):

1. https://convertico.com - Upload SVG, baixa ICO
2. https://cloudconvert.com/svg-to-icns - Para ICNS
`;

fs.writeFileSync(instructionsPath, instructions);
console.log('✅ CONVERT_TO_ICO.txt - Instruções de conversão');

console.log(`\n✨ Ícones SVG criados em: ${iconsDir}`);
console.log('\n📝 PRÓXIMOS PASSOS:');
console.log('   1. Para converter para .ico/.icns, consulte: CONVERT_TO_ICO.txt');
console.log('   2. Ou use: npm install -g electron-icon-maker && electron-icon-maker --input=assets/icons/icon.svg --output=assets/icons');
console.log('   3. Para personalizar, edite os SVGs ou substitua por seus próprios arquivos');
console.log('\n📚 Consulte: assets/icons/README.md para mais informações.\n');
