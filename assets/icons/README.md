# 🎨 Ícones do Pomodoro Extreme

## Ícones Incluídos (Padrão)

Este diretório contém ícones SVG básicos gerados automaticamente. **Você pode substituí-los** por designs personalizados mantendo os mesmos nomes e formatos.

## 📦 Ícones Necessários

### Para o Aplicativo:

| Arquivo | Tamanho | Uso | Formato |
|---------|---------|-----|---------|
| `icon.png` | 512x512 | Ícone principal do app | PNG transparente |
| `icon.ico` | Multi-size | Windows (16,32,48,256) | ICO |
| `icon.icns` | Multi-size | macOS | ICNS |
| `tray-icon.png` | 16x16, 32x32 | System tray | PNG transparente |
| `tray-icon-active.png` | 16x16, 32x32 | Tray quando timer ativo | PNG transparente |

### Para a Interface (Opcional):

| Arquivo | Uso |
|---------|-----|
| `project-icons/` | Ícones para categorias de projetos |
| `achievement-badges/` | Badges de conquistas |

## 🎨 Ícone Padrão

O ícone padrão é um **tomate estilizado (🍅)** em formato SVG.

### Características:
- Simples e reconhecível
- Funciona em qualquer tamanho
- Cores: Vermelho (#E53E3E) e Verde (#48BB78)

## 🛠️ Ferramentas para Criar Ícones Personalizados

### Online (Gratuitas):

1. **Figma** - https://figma.com
   - Design profissional
   - Export para PNG/SVG
   - Gratuito para uso pessoal

2. **Canva** - https://canva.com
   - Templates prontos
   - Fácil de usar
   - Export em vários formatos

3. **Icon Converter** - https://convertico.com
   - Converte PNG → ICO/ICNS
   - Sem instalação
   - Gratuito

4. **Electron Icon Builder** - https://www.electron.build/icons
   - Gera todos os formatos necessários
   - A partir de um PNG 1024x1024
   - Linha de comando

### Geradores de Emoji para Ícone:

1. **Emoji to Icon** - https://favicon.io/emoji-favicons/
   - Converte emoji em ícone
   - PNG transparente
   - Download imediato

2. **Twemoji** - https://github.com/twitter/twemoji
   - SVGs de emojis de alta qualidade
   - Domínio público (CC-BY 4.0)
   - Perfeito para tomates 🍅

## 🚀 Gerando Ícones com Electron Builder

Se você tiver um PNG de 1024x1024, o Electron Builder pode gerar automaticamente:

```bash
# Instalar ferramenta
npm install -g electron-icon-maker

# Gerar todos os formatos
electron-icon-maker --input=icon-source.png --output=./assets/icons
```

Isso gera:
- `icon.ico` (Windows - múltiplos tamanhos)
- `icon.icns` (macOS - múltiplos tamanhos)
- PNGs de vários tamanhos

## 📐 Especificações Técnicas

### Windows (.ico):
- Deve conter múltiplos tamanhos: 16x16, 32x32, 48x48, 256x256
- Formato: ICO ou PNG
- Transparência: Recomendada

### macOS (.icns):
- Deve conter múltiplos tamanhos: 16x16 até 1024x1024
- Formato: ICNS
- Retina support: Sim (2x de cada tamanho)

### System Tray:
- Tamanhos: 16x16 (normal), 32x32 (retina)
- Formato: PNG com transparência
- Estilos: Normal e Active (opcional: pause, focus, break)
- Cores: Monocromático recomendado (adapta ao tema do OS)

## 🎯 Design Recomendado

Para melhor visualização em todos os tamanhos:

1. **Simples**: Evite detalhes pequenos
2. **Contrastante**: Use cores que se destaquem
3. **Reconhecível**: Identificável mesmo em 16x16
4. **Coerente**: Mantenha o tema do tomate/pomodoro

## 📋 Como Substituir Ícones:

### Método 1: Substituição Simples
1. Crie/baixe seu ícone em PNG (512x512 ou maior)
2. Renomeie para `icon.png`
3. Coloque em `assets/icons/`
4. Execute: `npm run build:icons` (se configurado)

### Método 2: Usar Electron Icon Maker
```bash
# Com seu PNG de alta resolução
electron-icon-maker --input=meu-icone.png --output=./assets/icons

# Isso gera automaticamente todos os formatos
```

### Método 3: Manual
1. Crie cada tamanho manualmente
2. Use ferramentas online para converter para .ico e .icns
3. Coloque os arquivos nos locais corretos
4. Atualize `package.json` → `build.icon`

## ⚙️ Configuração no package.json

```json
{
  "build": {
    "appId": "com.pomodoroextreme.app",
    "productName": "Pomodoro Extreme",
    "win": {
      "icon": "assets/icons/icon.ico",
      "target": ["nsis"]
    },
    "mac": {
      "icon": "assets/icons/icon.icns",
      "category": "public.app-category.productivity"
    },
    "linux": {
      "icon": "assets/icons/icon.png",
      "category": "Utility"
    }
  }
}
```

## 🔗 Recursos Úteis

- **Twemoji SVGs**: https://github.com/twitter/twemoji/tree/master/assets/svg
- **Electron Builder Icons**: https://www.electron.build/configuration/contents#icons
- **Icon Best Practices**: https://www.electronjs.org/docs/latest/tutorial/icons

## 🎨 Paleta de Cores do App

Use estas cores para consistência visual:

- **Vermelho (Focus)**: #E53E3E
- **Verde (Break)**: #48BB78
- **Azul (Long Break)**: #3182CE
- **Amarelo (Warning)**: #D69E2E
- **Roxo (Achievement)**: #805AD5

---

**Nota:** Os ícones padrão incluídos são básicos. Para uma aparência profissional, recomendamos criar ou contratar um designer para ícones personalizados!
