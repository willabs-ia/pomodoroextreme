# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.0.0] - 2025-01-11

### 🎉 Lançamento Inicial

#### ✨ Funcionalidades

**Timer Pomodoro**
- Timer Pomodoro completo com períodos customizáveis
- Relógio flip analógico com animações suaves
- Gadget flutuante always-on-top, redimensionável e arrastável
- Auto-start configurável para pausas e períodos de foco
- Detecção automática de inatividade do sistema

**3 Níveis de Bloqueio**
- **Suave**: 3 mensagens desmotivacionais antes de permitir skip
- **Médio**: Sistema de penalidade 3x (pula 5min, paga 15min depois)
- **Extremo**: Bloqueio total sem escape durante pausas

**Sistema de Projetos**
- CRUD completo de projetos
- Configurações individuais por projeto
- Metas personalizadas de pomodoros
- Cores e ícones customizáveis

**Gamificação**
- 12 conquistas desbloqueáveis
- Sistema de reputação com níveis dinâmicos
- Streak de dias consecutivos
- Prêmios customizáveis definidos pelo usuário
- Boletins semanais e mensais estilo escolar

**Estatísticas**
- Dashboard com métricas detalhadas
- Gráficos de produtividade
- Histórico completo de sessões
- Análise de pulos de pausa
- Taxa de adesão e consistência

**Frases e Mensagens**
- Banco com 50+ frases sarcásticas
- Mensagens motivacionais durante pausas
- Lembretes de saúde (água, alongamento, etc)
- Sistema de rotação aleatória

**Interface**
- Onboarding interativo com tutorial
- Tela de bloqueio fullscreen em todos os monitores
- Sugestões de atividades durante pausas
- Música relaxante configurável
- Modo escuro/claro

**Integrações**
- Pausa automática de Spotify, Chrome, Edge (Windows/Mac/Linux)
- Integração com taskbar do Windows
- System tray com menu completo
- Atalhos globais customizáveis
- Notificações nativas do SO

**Técnico**
- Electron 28 + React 18 + Vite 5
- SQLite com migrations automáticas
- Multi-monitor support completo
- Session recovery automática
- Telemetria opt-in

#### 📊 Banco de Dados

- 9 tabelas principais
- Migrations versionadas
- Índices otimizados para performance
- Sistema de backup automático

#### 🎨 Design

- Sistema de cores customizáveis
- Planos de fundo personalizados
- 2 temas padrão incluídos
- Animações suaves com Framer Motion
- Responsive e adaptativo

#### 🔊 Áudio

- Sons de tique-taque do relógio (opcional)
- Alertas sonoros customizáveis
- Controle de volume individual
- Suporte a músicas locais, URLs e Spotify

#### 🏆 Conquistas Iniciais

- Primeira Batalha (1 pomodoro)
- Sobrevivente da Semana (7 dias)
- Século de Foco (100 pomodoros)
- Mestre da Disciplina (30 dias sem pulos)
- Coruja Noturna (hidden achievement)
- E mais 7 conquistas secretas!

#### 🐛 Correções

Nenhuma (versão inicial)

#### 🚧 Limitações Conhecidas

- Export de relatórios em PDF/CSV ainda não implementado
- Integração com YouTube Music pendente
- Exercícios de respiração guiados para v2.0
- Smart lights integration planejado para v3.0

---

## [Não Lançado]

### v2.0 (Planejado)

- Bloqueio de sites/apps específicos
- Análise de produtividade por horário
- Integração com calendários (Google/Outlook)
- Backup e sincronização na nuvem
- Boletim mensal com gráficos avançados
- Modo Pomodoro invertido (criatividade)

### v3.0 (Planejado)

- Exercícios de respiração guiados
- Integração com smart lights (Philips Hue)
- Marketplace de temas da comunidade
- Plugins e extensões
- API pública para integrações

---

**Legenda:**
- ✨ Nova funcionalidade
- 🐛 Correção de bug
- 🎨 Melhorias visuais
- 🔧 Mudanças técnicas
- 📊 Dados e estatísticas
- 🎵 Áudio e som
- 🏆 Conquistas e gamificação
