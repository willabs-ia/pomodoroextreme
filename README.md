# 🍅 Pomodoro Extreme

**O aplicativo Pomodoro que te FORÇA a descansar!**

Pomodoro Extreme é um timer Pomodoro revolucionário para Windows que bloqueia sua tela durante as pausas, garantindo que você realmente descanse e cuide da sua saúde.

## ✨ Funcionalidades Principais

### 🎯 Timer Pomodoro Inteligente
- Gadget flutuante sempre visível com relógio flip analógico
- Períodos customizáveis (foco, pausa curta, pausa longa)
- Detecção automática de inatividade

### 🔒 3 Níveis de Bloqueio
- **Suave**: Permite pular com mensagens motivacionais (ou desmotivacionais 😄)
- **Médio**: Sistema de "punição" 3x - pule uma pausa e pague o triplo na próxima!
- **Extremo**: Bloqueio total sem escape

### 🎨 Personalização Completa
- Temas de cores customizáveis
- Planos de fundo personalizados no gadget
- Sons e música relaxante configuráveis
- Sistema de conquistas e reputação

### 📊 Estatísticas e Gamificação
- Dashboard com gráficos de produtividade
- Sistema de conquistas desbloqueáveis
- Boletins semanais e mensais (estilo escolar!)
- Prêmios customizáveis definidos por você

### 🎵 Controle de Mídia
- Pausa automática de Spotify, YouTube e navegadores
- Música relaxante durante pausas
- Sons ambientes personalizados

### 🖥️ Multi-Monitor
- Bloqueio em todos os monitores simultaneamente
- Interface ajustada para cada resolução

## 🛠️ Tecnologias

- **Electron** - Framework desktop multiplataforma
- **React** - Interface de usuário
- **Vite** - Build tool rápido
- **SQLite** - Banco de dados local
- **Framer Motion** - Animações suaves

## 🚀 Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/willabs-ia/pomodoroextreme.git

# Entre na pasta
cd pomodoroextreme

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

### Build

```bash
# Build para Windows
npm run build:win
```

## 📁 Estrutura do Projeto

```
pomodoroextreme/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # React UI
│   ├── core/           # Lógica de negócio
│   ├── data/           # Banco de dados e modelos
│   ├── assets/         # Recursos estáticos
│   ├── i18n/           # Internacionalização
│   └── utils/          # Utilitários
├── resources/          # Recursos de build
└── user-data/          # Dados do usuário
```

## 🎯 Roadmap

### v1.0 (Em Desenvolvimento)
- ✅ Estrutura base do projeto
- ⏳ Timer Engine completo
- ⏳ Sistema de bloqueio
- ⏳ FlipClock component
- ⏳ Sistema de projetos
- ⏳ Conquistas e gamificação
- ⏳ Onboarding interativo

### v2.0 (Futuro)
- Bloqueio de sites/apps específicos
- Análise de produtividade por horário
- Integração com calendários
- Backup na nuvem

### v3.0 (Futuro)
- Exercícios de respiração guiados
- Integração com smart lights
- Marketplace de temas

## 📄 Licença

MIT License

## 👨‍💻 Autor

Desenvolvido com 💜 pela equipe Pomodoro Extreme