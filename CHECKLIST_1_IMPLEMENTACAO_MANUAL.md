# ✅ CHECKLIST 1: Implementação e Setup Manual

Este checklist contém **TODAS as tarefas que você precisa fazer manualmente** que não puderam ser automatizadas. Siga cada passo com atenção.

---

## 📦 PARTE 1: Instalar Dependências Faltantes

### 1.1 Verificar Node.js e NPM

```bash
# No terminal, na pasta do projeto:
cd /caminho/para/pomodoroextreme

# Verificar versões (deve ser Node 18+)
node --version
npm --version
```

**Resultado esperado:**
- Node: v18.x.x ou superior
- NPM: v9.x.x ou superior

Se não tiver Node instalado: https://nodejs.org/

---

### 1.2 Instalar Dependências do Projeto

```bash
# Ainda no terminal, na pasta do projeto:
npm install
```

**Tempo estimado:** 2-5 minutos

**O que isso faz:** Instala todas as dependências listadas no `package.json`, incluindo:
- Electron 28
- React 18
- Chakra UI
- Framer Motion
- Better-SQLite3
- Zustand
- React Router Dom
- Recharts (para gráficos futuros)

**Possíveis erros:**
- Se der erro no `better-sqlite3`, pode ser problema de compilação. Tente:
  ```bash
  npm rebuild better-sqlite3
  ```

---

## 🎵 PARTE 2: Baixar e Adicionar Assets Sonoros

**IMPORTANTE:** O app funciona sem sons, mas a experiência fica incompleta.

### 2.1 Acessar Fontes de Áudio Gratuitas

Abra seu navegador e vá para:

**Freesound.org** - https://freesound.org
- Cadastre uma conta (gratuito)
- Filtre por licença "CC0" (domínio público)

**YouTube Audio Library** - https://studio.youtube.com/channel/music
- Para música de fundo das pausas
- Filtro: "No attribution required"

---

### 2.2 Baixar Sons Necessários (9 arquivos)

Procure e baixe os seguintes sons. Salve todos em formato **MP3**.

| Som | Busca no Freesound | Duração | Onde Salvar |
|-----|-------------------|---------|-------------|
| **tick.mp3** | "clock tick short" | ~0.1s | `assets/sounds/tick.mp3` |
| **tack.mp3** | "clock tock short" | ~0.1s | `assets/sounds/tack.mp3` |
| **pomodoro-start.mp3** | "bell start" | 1-2s | `assets/sounds/pomodoro-start.mp3` |
| **pomodoro-complete.mp3** | "achievement ding" | 2-3s | `assets/sounds/pomodoro-complete.mp3` |
| **break-start.mp3** | "soft bell" | 1-2s | `assets/sounds/break-start.mp3` |
| **break-complete.mp3** | "ding complete" | 2-3s | `assets/sounds/break-complete.mp3` |
| **notification.mp3** | "notification soft" | 0.5-1s | `assets/sounds/notification.mp3` |
| **achievement.mp3** | "success fanfare" | 2-3s | `assets/sounds/achievement.mp3` |
| **warning.mp3** | "warning beep" | 1s | `assets/sounds/warning.mp3` |

**OPCIONAL (mas recomendado):**
| Som | Busca no YouTube Audio | Duração | Onde Salvar |
|-----|----------------------|---------|-------------|
| **break-music.mp3** | "relaxing instrumental" | 5-10min | `assets/sounds/break-music.mp3` |

---

### 2.3 Passo-a-passo para Baixar do Freesound

1. **Acesse:** https://freesound.org
2. **Faça login** (crie conta se necessário)
3. **Na barra de busca**, digite: `clock tick short`
4. **Filtros:**
   - Clique em "License" → Selecione "CC0" (Creative Commons Zero)
   - Clique em "Duration" → Selecione "Very short (0-2 sec)"
5. **Escute** alguns resultados
6. **Escolha um** que você goste
7. **Clique** no som escolhido
8. **Clique em "Download"** (pode precisar logar)
9. **Renomeie** o arquivo baixado para `tick.mp3`
10. **Mova** para `assets/sounds/tick.mp3`

**Repita** para todos os 9 sons da tabela acima.

---

### 2.4 Verificar se os Sons Foram Salvos

```bash
# No terminal:
ls -la assets/sounds/
```

**Resultado esperado:**
```
tick.mp3
tack.mp3
pomodoro-start.mp3
pomodoro-complete.mp3
break-start.mp3
break-complete.mp3
notification.mp3
achievement.mp3
warning.mp3
break-music.mp3 (opcional)
```

---

## 🎨 PARTE 3: Criar/Baixar Ícones

### 3.1 Ícone Principal do App

Você precisa de um ícone de tomate 🍅 (512x512 pixels).

**Opções:**

**A) Usar AI para gerar:**
1. Acesse: https://www.bing.com/images/create (Microsoft Designer - grátis)
2. Prompt: "flat design tomato icon, simple, red, minimalist, 512x512, transparent background"
3. Baixe o melhor resultado
4. Salve como: `assets/icons/icon.png`

**B) Baixar de sites:**
1. Acesse: https://www.flaticon.com
2. Busque: "tomato icon"
3. Baixe PNG (512x512 se possível)
4. Salve como: `assets/icons/icon.png`

**C) Usar emoji:**
1. Acesse: https://emojipedia.org/tomato/
2. Copie o emoji 🍅
3. Cole em um editor de imagem
4. Exporte como PNG 512x512
5. Salve como: `assets/icons/icon.png`

---

### 3.2 Ícone para System Tray

Você precisa de um ícone pequeno (16x16 e 32x32).

```bash
# Se tiver ImageMagick instalado, pode redimensionar:
convert assets/icons/icon.png -resize 16x16 assets/icons/tray-icon-16.png
convert assets/icons/icon.png -resize 32x32 assets/icons/tray-icon-32.png
```

Se não tiver ImageMagick, use um editor online:
- https://www.iloveimg.com/resize-image

---

### 3.3 Ícones de Projetos (Opcional, mas Legal)

Baixe 30 ícones flat para os usuários escolherem ao criar projetos.

**Categorias sugeridas:**
- Trabalho: 💼 💻 📊 📈 🎯 (5 ícones)
- Estudos: 📚 ✏️ 🎓 📖 🧮 (5 ícones)
- Criativo: 🎨 🎭 🎬 📷 🎵 (5 ícones)
- Fitness: 💪 🏃 ⚽ 🧘 🏋️ (5 ícones)
- Pessoal: 🏠 💡 🔥 ⚡ 🌟 (5 ícones)
- Outros: 🍕 ☕ 📱 🎮 🚗 (5 ícones)

**Como fazer:**
1. Use emojis diretamente (mais fácil) OU
2. Baixe ícones flat de https://www.flaticon.com
3. Salve em: `assets/icons/projects/` (crie a pasta)

---

### 3.4 Ícones de Conquistas (Opcional)

12 badges/medalhas para as conquistas.

**Sugestão rápida:** Use emojis:
- 🏆 🔥 💯 ⭐ 🎖️ 👑 💎 🚀 🌟 ⚡ 🎯 🏅

Salve em: `assets/icons/achievements/` (se quiser customizar)

---

## 🖼️ PARTE 4: Criar Backgrounds Padrão (Opcional)

### 4.1 Usar Gradientes CSS (Mais Fácil)

O app já vem com gradientes CSS pré-configurados. **Você não precisa fazer nada aqui.**

Se quiser adicionar mais opções:
1. Acesse: https://cssgradient.io
2. Crie gradientes bonitos
3. Copie o CSS gerado
4. Cole nas configurações do app (aba Visual)

---

### 4.2 Usar Imagens de Fundo (Opcional)

Se quiser oferecer imagens:

1. Acesse: https://unsplash.com
2. Busque: "minimal gradient background"
3. Baixe em resolução 1920x1080
4. Salve em: `assets/images/backgrounds/`

Sugestões:
- `bg-gradient-red.jpg` - Para foco
- `bg-gradient-green.jpg` - Para pausa
- `bg-gradient-blue.jpg` - Para pausa longa

---

## ⚙️ PARTE 5: Configurar Electron Builder (Para Gerar Instaladores)

### 5.1 Verificar package.json

Abra `package.json` e verifique se tem a seção `build`:

```json
"build": {
  "appId": "com.pomodoroextreme.app",
  "productName": "Pomodoro Extreme",
  "directories": {
    "buildResources": "assets",
    "output": "dist"
  },
  "files": [
    "src/**/*",
    "assets/**/*",
    "package.json"
  ],
  "win": {
    "target": ["nsis", "portable"],
    "icon": "assets/icons/icon.png"
  },
  "mac": {
    "target": ["dmg", "zip"],
    "icon": "assets/icons/icon.icns"
  },
  "linux": {
    "target": ["AppImage", "deb"],
    "icon": "assets/icons/icon.png"
  }
}
```

Se não tiver, **adicione manualmente**.

---

### 5.2 Gerar Ícones de Plataforma

**Para Windows (.ico):**

1. Acesse: https://convertico.com
2. Upload: `assets/icons/icon.png`
3. Converta para ICO (256x256)
4. Baixe e salve como: `assets/icons/icon.ico`

**Para macOS (.icns):**

Precisa de Mac ou ferramenta específica. Se não tiver Mac, pule esta etapa.

```bash
# No Mac, com png2icns instalado:
png2icns assets/icons/icon.icns assets/icons/icon.png
```

Ou use: https://cloudconvert.com/png-to-icns

---

## 🔧 PARTE 6: Configurar Variáveis de Ambiente (Se Necessário)

### 6.1 Criar arquivo .env (Opcional)

Se quiser configurar coisas como telemetria, API keys, etc:

```bash
# Na raiz do projeto:
touch .env
```

Conteúdo exemplo:
```
TELEMETRY_ENABLED=false
SENTRY_DSN=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

**Nota:** O app funciona sem .env. Isso é apenas para features avançadas futuras.

---

## 📝 PARTE 7: Verificar Configurações Finais

### 7.1 Atualizar package.json com Informações

Abra `package.json` e verifique/atualize:

```json
{
  "name": "pomodoro-extreme",
  "version": "1.0.0",
  "description": "Aplicativo Pomodoro que força você a descansar",
  "author": "Seu Nome <seu@email.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/seu-usuario/pomodoroextreme.git"
  }
}
```

---

### 7.2 Criar README.md Público

Se quiser compartilhar o projeto, crie um README.md na raiz:

```markdown
# 🍅 Pomodoro Extreme

Aplicativo Pomodoro que **força você a descansar** durante as pausas.

## Features

- ⏱️ Timer Pomodoro com FlipClock animado
- 🔒 3 níveis de bloqueio (Suave, Médio, Extremo)
- 🏆 Sistema de conquistas e reputação
- 📊 Estatísticas detalhadas
- 🎨 Totalmente personalizável
- 🔊 Sons e música relaxante

## Como Usar

1. Clone o repositório
2. `npm install`
3. `npm run dev`

## Build

`npm run build`
```

---

## ✅ CHECKLIST FINAL DE VERIFICAÇÃO

Antes de prosseguir para os testes, confirme:

- [ ] Node.js 18+ instalado
- [ ] `npm install` executado com sucesso
- [ ] Pelo menos 5 sons baixados e salvos em `assets/sounds/`
- [ ] Ícone principal criado (`assets/icons/icon.png`)
- [ ] Ícone ICO para Windows criado (se for usar no Windows)
- [ ] package.json atualizado com suas informações
- [ ] Electron Builder configurado no package.json

---

## 🚀 Próximo Passo

Agora vá para: **CHECKLIST_2_TESTES_FUNCIONALIDADES.md**

Lá você vai testar se tudo está funcionando corretamente!

---

## 📞 Dúvidas?

Se tiver algum problema:

1. **Erro no npm install?**
   - Tente: `rm -rf node_modules package-lock.json && npm install`

2. **Erro no better-sqlite3?**
   - Tente: `npm rebuild better-sqlite3`

3. **Sons não tocam?**
   - Verifique se os arquivos MP3 estão no lugar certo
   - Teste se um arquivo MP3 toca no seu player de mídia

4. **App não inicia?**
   - Verifique logs com: `npm run dev` e veja o console

---

**Data de criação:** 2025-01-11
**Versão do checklist:** 1.0
**Autor:** Claude (Anthropic)
