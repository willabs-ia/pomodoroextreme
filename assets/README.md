# Assets do Pomodoro Extreme

Este diretório contém todos os assets do aplicativo: sons, ícones e imagens.

## 🔊 Sons (`/sounds`)

### Sons Necessários

| Arquivo | Descrição | Duração | Fontes Sugeridas |
|---------|-----------|---------|------------------|
| `tick.mp3` | Som de relógio (tick) | ~0.1s | [Freesound: Clock Tick](https://freesound.org/search/?q=clock+tick) |
| `tack.mp3` | Som de relógio (tack) | ~0.1s | [Freesound: Clock Tock](https://freesound.org/search/?q=clock+tock) |
| `pomodoro-start.mp3` | Alerta início de pomodoro | 1-2s | [Freesound: Bell Start](https://freesound.org/search/?q=bell+start) |
| `pomodoro-complete.mp3` | Alerta fim de pomodoro | 2-3s | [Freesound: Achievement](https://freesound.org/search/?q=achievement) |
| `break-start.mp3` | Alerta início de pausa | 1-2s | [Freesound: Soft Bell](https://freesound.org/search/?q=soft+bell) |
| `break-complete.mp3` | Alerta fim de pausa | 2-3s | [Freesound: Ding](https://freesound.org/search/?q=ding) |
| `notification.mp3` | Notificação geral | 0.5-1s | [Freesound: Notification](https://freesound.org/search/?q=notification) |
| `achievement.mp3` | Conquista desbloqueada | 2-3s | [Freesound: Success](https://freesound.org/search/?q=success) |
| `warning.mp3` | Aviso/alerta | 1s | [Freesound: Warning](https://freesound.org/search/?q=warning) |
| `break-music.mp3` | Música relaxante para pausas | 5-10min | [YouTube Audio Library](https://studio.youtube.com/channel/UCpIDMBl6KE4jv1rTBwsWPnA/music) |

### Características Recomendadas

- **Formato**: MP3 ou OGG
- **Taxa de bits**: 128-192 kbps
- **Volume**: Normalizado (evitar clipping)
- **Licença**: CC0 (Public Domain) ou Creative Commons BY

### Fontes de Áudio Gratuitas (CC0/Libre)

1. **Freesound.org** - https://freesound.org
   - Maior biblioteca de sons CC
   - Filtrar por licença CC0
   - Download direto

2. **YouTube Audio Library** - https://studio.youtube.com/channel/music
   - Músicas sem copyright
   - Filtrar por "No attribution required"
   - Ideal para música de fundo das pausas

3. **Zapsplat** - https://www.zapsplat.com
   - Sons de interface
   - Requer cadastro gratuito

4. **Mixkit** - https://mixkit.co/free-sound-effects/
   - Sons modernos
   - 100% gratuito

5. **BBC Sound Effects** - https://sound-effects.bbcrewind.co.uk
   - Arquivos históricos da BBC
   - Livre para uso pessoal/educacional

### Como Adicionar Sons

1. Baixe os arquivos das fontes acima
2. Renomeie conforme a tabela
3. Coloque na pasta `assets/sounds/`
4. Teste no aplicativo

---

## 🎨 Ícones (`/icons`)

### Ícones Necessários

| Arquivo | Tamanho | Descrição |
|---------|---------|-----------|
| `icon.png` | 512x512 | Ícone principal do app (tomate) |
| `icon.icns` | - | Ícone macOS |
| `icon.ico` | - | Ícone Windows |
| `tray-icon.png` | 16x16, 32x32 | Ícone da bandeja do sistema |
| `tray-icon-active.png` | 16x16, 32x32 | Ícone da bandeja (timer ativo) |

### Ícones de Projetos (30 opções)

Emojis ou ícones flat para usuários escolherem:
- Trabalho: 💼 💻 📊 📈 🎯
- Estudos: 📚 ✏️ 🎓 📖 🧮
- Criativo: 🎨 🎭 🎬 📷 🎵
- Fitness: 💪 🏃 ⚽ 🧘 🏋️
- Pessoal: 🏠 💡 🔥 ⚡ 🌟

### Ícones de Conquistas (12 designs)

Medalhas/badges para as conquistas:
1. 🏆 Troféu dourado - Primeira conquista
2. 🔥 Chama - Streak
3. 💯 100 - Meta atingida
4. ⭐ Estrela - Produtividade
5. 🎖️ Medalha - Dedicação
6. 👑 Coroa - Mestre
7. 💎 Diamante - Elite
8. 🚀 Foguete - Progresso
9. 🌟 Estrela cadente - Especial
10. ⚡ Raio - Velocidade
11. 🎯 Alvo - Precisão
12. 🏅 Medalha de ouro - Campeão

### Fontes de Ícones Gratuitas

1. **Flaticon** - https://www.flaticon.com
   - Milhões de ícones flat
   - Filtrar por "free"
   - PNG, SVG

2. **Icons8** - https://icons8.com
   - Ícones consistentes
   - Vários estilos
   - Grátis com atribuição

3. **Font Awesome** - https://fontawesome.com
   - Ícones vetoriais
   - Kit gratuito amplo

4. **Ionicons** - https://ionic.io/ionicons
   - Open source
   - Moderno e limpo

5. **Material Icons** - https://fonts.google.com/icons
   - Design Google
   - Totalmente gratuito

### Gerando Ícones do App

Para gerar os formatos específicos de cada plataforma a partir de um PNG 512x512:

```bash
# Instalar ferramenta
npm install -g electron-icon-builder

# Gerar ícones
electron-icon-builder --input=./icon.png --output=./assets/icons
```

Ou usar: https://www.electron.build/icons

---

## 🖼️ Imagens (`/images`)

### Backgrounds Padrão

| Arquivo | Resolução | Descrição |
|---------|-----------|-----------|
| `bg-gradient-red.png` | 1920x1080 | Gradiente vermelho (foco) |
| `bg-gradient-green.png` | 1920x1080 | Gradiente verde (pausa) |
| `bg-gradient-blue.png` | 1920x1080 | Gradiente azul (pausa longa) |

### Fontes de Imagens Gratuitas

1. **Unsplash** - https://unsplash.com
   - Fotos alta qualidade
   - Totalmente gratuito
   - API disponível

2. **Pexels** - https://www.pexels.com
   - Fotos e vídeos
   - CC0 license

3. **Pixabay** - https://pixabay.com
   - Imagens livres
   - Sem atribuição

### Gerando Gradientes

Use CSS ou ferramentas online:
- https://cssgradient.io
- https://www.grabient.com
- https://coolors.co/gradient-maker

---

## 📝 Checklist de Assets

### Essencial (MVP)
- [ ] Tick.mp3 e tack.mp3 (relógio)
- [ ] Pomodoro-complete.mp3 (alerta)
- [ ] Break-start.mp3 (início pausa)
- [ ] Icon.png 512x512 (ícone app)
- [ ] Tray icons (16x16, 32x32)

### Importante
- [ ] Todos os 9 sons listados
- [ ] Ícone para Windows (.ico)
- [ ] Ícone para macOS (.icns)
- [ ] 3 backgrounds padrão

### Desejável
- [ ] 30 ícones de projetos
- [ ] 12 ícones de conquistas
- [ ] Música relaxante para pausas (10min)
- [ ] Sons variados para notificações

---

## 🔧 Scripts Úteis

### Converter Audio para MP3

```bash
# Usando ffmpeg
ffmpeg -i input.wav -codec:a libmp3lame -qscale:a 2 output.mp3
```

### Normalizar Volume

```bash
# Normalizar todos os MP3
ffmpeg -i input.mp3 -filter:a loudnorm output.mp3
```

### Redimensionar Imagens

```bash
# Usando ImageMagick
convert input.png -resize 512x512 icon.png
```

---

## ⚠️ Importante

- **Sempre verifique a licença** antes de usar qualquer asset
- **Dê créditos** quando necessário (mesmo para CC0, é uma boa prática)
- **Teste os sons** no app antes de commitar
- **Mantenha tamanhos razoáveis** (MP3 < 1MB, ícones < 100KB)

---

## 📚 Recursos Adicionais

- [Guia Electron Icons](https://www.electron.build/icons)
- [Audio para Apps](https://uxdesign.cc/designing-sound-for-your-app-70cf21edb7d5)
- [Creative Commons Search](https://search.creativecommons.org)
