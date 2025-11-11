# ETAPA 1: REVISÃO COMPLETA DE REQUISITOS ACORDADOS
## Pomodoro Extreme - Especificações do Projeto

**Data:** 2025-01-11
**Versão:** 1.0
**Status:** Auditoria Completa

---

## 📋 ÍNDICE

1. [Conceito Principal](#conceito-principal)
2. [Funcionalidades Core](#funcionalidades-core)
3. [Sistema de Bloqueio](#sistema-de-bloqueio)
4. [Interface e Visual](#interface-e-visual)
5. [Gamificação](#gamificação)
6. [Sistema de Frases](#sistema-de-frases)
7. [Projetos e Configurações](#projetos-e-configurações)
8. [Estatísticas e Relatórios](#estatísticas-e-relatórios)
9. [Integrações](#integrações)
10. [Features Extras](#features-extras)

---

## 1. CONCEITO PRINCIPAL

### 1.1 Objetivo
Timer Pomodoro para Windows que **FORÇA** o usuário a descansar bloqueando a tela durante pausas.

### 1.2 Filosofia
"Pegar pesado" até o usuário aderir ao autocuidado. Usar humor sarcástico e inteligente para motivar.

---

## 2. FUNCIONALIDADES CORE

### 2.1 Timer Pomodoro
✅ **ACORDADO:**
- Períodos configuráveis (padrão: 25min foco, 5min pausa curta, 15min pausa longa)
- Sistema de ciclos (4 pomodoros = 1 pausa longa)
- Avisos sonoros a cada 5min (configurável)
- Tremor da janela nos 5min finais
- Ampulheta gigante estilo MSN antes da pausa

### 2.2 Gadget Flutuante
✅ **ACORDADO:**
- Always on top (frente de todas as janelas)
- Redimensionável (arrastar bordas como janela normal)
- Arrastável
- Relógio flip analógico minimalista e moderno
- Mudança de cor gradual conforme tempo passa
- Barra progressiva na borda
- Visível na taskbar do Windows

### 2.3 Detecção de Inatividade
✅ **ACORDADO:**
- Pausa automática quando mouse/teclado parados
- Tempo configurável pelo usuário
- Estilo Netflix "tem alguém aí?"

---

## 3. SISTEMA DE BLOQUEIO

### 3.1 Nível Suave
✅ **ACORDADO:**
- Pode pular pausa
- 3 mensagens desmotivacionais consecutivas
- Usuário precisa concordar clicando cada uma
- Pedir justificativa ao final

**Frases:** Agressivas, sarcásticas, bem humoradas

### 3.2 Nível Médio
✅ **ACORDADO:**
- Pode pular apenas 3 vezes
- Sistema de punição 3x:
  - Pulou 5min → Próxima pausa: 15min
  - Pulou 15min → Próxima pausa: 45min
  - Pulou 45min → Próxima pausa: 135min
- Se pagar a pausa, volta ao normal
- Se intercalado, acumula apenas se não pagou
- Aviso ao tentar pular 3ª vez
- Pedir justificativa

### 3.3 Nível Extremo
✅ **ACORDADO:**
- SEM ESCAPE
- Bloqueio total de tela
- Só reiniciando o PC (usuário sabe o risco)

### 3.4 Bloqueio de Tela
✅ **ACORDADO:**
- Fullscreen em TODOS os monitores
- Interface ajustada para cada resolução
- Contador replicado e visível em todos
- Sugestões de atividades em slide
- Áudio/música relaxante opcional
- Pausa automática de vídeos/músicas do sistema

---

## 4. INTERFACE E VISUAL

### 4.1 Gadget Timer (Modo Trabalho)
✅ **ACORDADO:**
- Relógio flip analógico (números virando)
- Redimensionável e arrastável
- Always on top
- Mudança de cor + barra progressiva
- Tremor nos minutos finais com efeitos e som
- Plano de fundo customizável (imagens)
- Conteúdo ajusta automaticamente

### 4.2 Tela de Bloqueio (Modo Pausa)
✅ **ACORDADO:**
- Fullscreen em todos os monitores
- Cronômetro grande e visível
- Sugestões de atividades rolando em slide
- Widget de clima/hora
- Player de música relaxante
- Frases motivacionais

### 4.3 Cores e Temas
✅ **ACORDADO:**
- Customizável pelo usuário (cores + degradê)
- 2 conjuntos padrão: preto/branco/cinza e branco/preto/cinza
- Cinza para contornos, sombras, efeitos
- Modo escuro automático (por horário ou tema Windows)

### 4.4 Ampulheta de Aviso
✅ **ACORDADO:**
- Estilo "chamar atenção" do MSN
- Aparece no centro da tela
- Avisa que pausa vai começar
- Tremor + efeitos visuais

---

## 5. GAMIFICAÇÃO

### 5.1 Sistema de Conquistas
✅ **ACORDADO:**
- Conquistas desbloqueáveis
- Usuário define próprio prêmio ao atingir objetivo
- Mensagens de incentivo do sistema (humor + sarcasmo)
- Badges/ícones
- Sistema de pontos

### 5.2 Sistema de Reputação
✅ **ACORDADO:**
- Nomes criativos e divertidos conforme progresso
- Discipline Score
- Consistency Score
- Níveis dinâmicos
- Streak de dias consecutivos

### 5.3 Desbloqueáveis por Conquista
✅ **ACORDADO:**
- Temas especiais
- Sons exclusivos
- **Atalho de Pânico:** Desbloqueável após provar consistência
  - Requer 3 confirmações mesmo após desbloquear
  - Pede justificativa
  - Marca como "negativo" no boletim

### 5.4 Animações de Recompensa
✅ **ACORDADO:**
- Tela cheia OU próximo ao gadget (configurável)
- Várias animações disponíveis
- Opção de ativar/desativar
- Confete, fogos, efeitos

---

## 6. SISTEMA DE FRASES

### 6.1 Categorias de Frases
✅ **ACORDADO:**

**Frases Agressivas/Sarcásticas (Nível Suave):**
- Banco de frases rotativo
- Diferentes a cada skip
- Humor inteligente e sarcástico

**Frases Motivacionais (Durante Pausa):**
- Banco separado
- Motivação pelo descanso
- Humor positivo

**Lembretes Durante Foco:**
- Beber água
- Alongar
- Comer fruta
- Piscar olhos
- Olhar para longe

**Justificativas:**
- Prompts variados
- "Vale o burnout?"
- "Virou herdeiro?"
- Sempre diferentes

---

## 7. PROJETOS E CONFIGURAÇÕES

### 7.1 Sistema de Projetos
✅ **ACORDADO:**
- Criação ilimitada de projetos
- Cada projeto com nome, ícone, cor
- Metas de pomodoros por projeto
- Configurações INDIVIDUAIS por projeto

### 7.2 Configurações por Projeto
✅ **ACORDADO:**
- Durações (foco, pausas)
- Nível de bloqueio
- Cores e temas
- Sons e volumes (individual)
- Avisos e notificações
- Inatividade
- Tudo específico para aquele projeto

### 7.3 Interface de Configurações
✅ **ACORDADO:**
- 8 Abas:
  1. **Geral:** Nível bloqueio, durações, multi-monitor
  2. **Visual:** Cores, tamanho gadget, posição inicial
  3. **Áudio:** Sons, avisos, música relaxante, volumes individuais
  4. **Projetos:** Gerenciar projetos e metas
  5. **Notificações:** Customizar notificações
  6. **Background:** Planos de fundo
  7. **Privacidade:** Telemetria opt-in
  8. **Integrações:** Spotify, YouTube, etc

### 7.4 Som Customizável
✅ **ACORDADO:**
- Tique-taque do relógio flip (opcional)
- Sons de alerta com arquivo próprio
- Volume individual por tipo
- Som padrão + customizável
- Sons ambientes durante foco (chuva, lareira, café, etc)
- Música relaxante durante pausa (local, URL, Spotify, YouTube)

---

## 8. ESTATÍSTICAS E RELATÓRIOS

### 8.1 Métricas
✅ **ACORDADO:**
- Pomodoros completados
- Tempo focado total
- Streak (dias consecutivos)
- Taxa de pulos de pausa
- Comparação mês anterior
- Por projeto

### 8.2 Dashboard
✅ **ACORDADO:**
- Gráficos de produtividade (dia, semana, mês)
- Projeto mais produtivo
- Análise de horários (quando é mais produtivo) - v2.0
- Sugestões de melhores horários - v2.0

### 8.3 Boletins
✅ **ACORDADO:**
- Formato de boletim escolar
- Semanal e mensal
- Notas e pontuação
- Humor nas mensagens
- Exportável em PDF

### 8.4 Exportar Relatórios
✅ **ACORDADO:**
- PDF/CSV
- Compartilhável
- Útil para freelancers (horas trabalhadas)

---

## 9. INTEGRAÇÕES

### 9.1 Controle de Mídia
✅ **ACORDADO:**
- Pausa Spotify
- Pausa vídeos em Chrome/Edge
- YouTube
- Se não pausar, problema do usuário

### 9.2 Multi-Monitor
✅ **ACORDADO:**
- Bloqueio em TODOS os monitores
- Interface duplicada e ajustada
- Cada monitor com sua resolução

### 9.3 Modo Não Perturbe
✅ **ACORDADO:**
- Opcional nas configurações
- Ativa DND do Windows durante foco

### 9.4 Tray Icon
✅ **ACORDADO:**
- Ícone na bandeja
- Menu completo (Start/Pause/Settings/Sair)
- Tooltip com tempo restante

### 9.5 Atalhos Customizáveis
✅ **ACORDADO:**
- Atalhos de teclado globais
- Configuráveis pelo usuário

### 9.6 Taskbar do Windows
✅ **ACORDADO:**
- Tempo visível na taskbar
- Progress bar
- Não minimizar (precisa ver o tempo)

---

## 10. FEATURES EXTRAS

### 10.1 Sessão Rápida
❌ **NÃO ACORDADO** (Usuário rejeitou)
- Usuário sempre dedica tempo a um projeto específico

### 10.2 Modo Furtivo
✅ **ACORDADO:**
- Para reuniões/apresentações
- Timer continua em background
- Pausa é silenciosa/discreta
- Precisa justificar porque está se escondendo

### 10.3 Pausa vs Encerrar
✅ **ACORDADO:**
- Pausa: mantém progresso
- Encerrar: perde ciclo atual

### 10.4 Session Recovery
✅ **ACORDADO:**
- A1: Questiona se quer retomar ao reabrir
- B1: Pergunta se quer recuperar em caso de crash/reinicialização

### 10.5 Notificações Windows
✅ **ACORDADO:**
- Avisar quando pausa vai começar
- Notificar quando ciclo terminar
- Notificar inatividade detectada
- Customizáveis (ativar/desativar, volume, som)

### 10.6 Música Durante Pausa
✅ **ACORDADO:**
- Pasta local
- URL streaming
- MP3 próprio
- Playlist Spotify
- YouTube (conectar conta)

### 10.7 Onboarding
✅ **ACORDADO:**
- Tutorial interativo
- Wizard: criar primeiro projeto
- Opção de explorar livremente
- Campo para ver tutorial sempre disponível

### 10.8 Idioma
✅ **ACORDADO:**
- Padrão: idioma do SO
- Estrutura para múltiplos idiomas
- Fácil adicionar novos

### 10.9 Auto-Update
✅ **ACORDADO:**
- Implementar verificação
- Notificar usuário de novidades da versão
- GitHub releases

### 10.10 Telemetria
✅ **ACORDADO:**
- Usuário decide na primeira interação
- Máximo de informações sobre falhas (se aceitar)
- Modo anônimo disponível
- Pode mudar depois

### 10.11 Regra 20-20-20
✅ **ACORDADO:**
- Timer extra independente do Pomodoro
- A cada 20min, olhar 20 pés (6m) por 20seg
- Lembrete sutil (não bloqueia)

### 10.12 Widget Clima/Hora
✅ **ACORDADO:**
- Durante pausa na tela de bloqueio
- Hora atual + clima local
- "Está sol lá fora, que tal dar uma volta?"

### 10.13 Histórico "Por que pulei"
✅ **ACORDADO:**
- Campo opcional ao pular
- Estatísticas: "Pulou 5x por 'reunião urgente'"
- Auto-reflexão

### 10.14 Lembretes de Saúde
✅ **ACORDADO:**
- Checklist visual durante pausa
- ☐ Bebi água
- ☐ Pisquei os olhos
- ☐ Alonguei
- ☐ Olhei para longe
- Banco de dados próprio
- Frases sempre diferentes

### 10.15 Sons Binaurais/ASMR
✅ **ACORDADO v1.0:**
- Frequências para foco
- ASMR para relaxamento
- Expandir variedade nas próximas versões

### 10.16 Countdown para Meta
✅ **ACORDADO:**
- "Faltam 3 pomodoros para sua meta diária"
- Visual no gadget

### 10.17 Modo Sessão Livre
✅ **ACORDADO:**
- Sem projeto específico
- Só usar o timer
- Não salva estatísticas
- Para uso casual/teste

### 10.18 Recompensas Visuais Múltiplas
✅ **ACORDADO:**
- Animações variadas
- Tela cheia OU gadget
- Ativar/desativar
- Confete, fogos, etc

---

## 11. TECNOLOGIA

### 11.1 Stack
✅ **ACORDADO:**
- **Opção A:** Electron + React (escolhida)
- Framework: Vite
- Database: SQLite
- Animations: Framer Motion

### 11.2 Arquitetura
✅ **ACORDADO:**
- Modular e bem organizada
- Fácil manutenção
- Preparada para futuras implementações
- Separação: main/renderer/core/data

---

## 12. FUNCIONALIDADES FUTURAS (PLANEJADAS)

### v2.0
✅ **ACORDADO:**
- Bloqueio de sites/apps específicos
- Análise de produtividade por horário
- Integração com calendários
- Backup na nuvem
- Pomodoro invertido (criatividade)

### v3.0
✅ **ACORDADO:**
- Exercícios de respiração guiados
- Integração com smart lights
- Marketplace de temas

---

## 13. REQUISITOS NÃO-FUNCIONAIS

### 13.1 Performance
✅ **ACORDADO (implícito):**
- Leve e rápido
- Não travar o PC
- Consumo mínimo de recursos

### 13.2 Confiabilidade
✅ **ACORDADO (implícito):**
- Não perder dados
- Session recovery
- Database seguro

### 13.3 Usabilidade
✅ **ACORDADO:**
- Interface intuitiva
- Tutorial completo
- Fácil de usar

---

## ✅ RESUMO QUANTITATIVO

**Total de Requisitos Acordados:** 150+

### Distribuição por Categoria:
- ✅ Core Features: 25
- ✅ Sistema de Bloqueio: 15
- ✅ Interface/Visual: 20
- ✅ Gamificação: 15
- ✅ Frases: 10
- ✅ Projetos/Config: 20
- ✅ Estatísticas: 10
- ✅ Integrações: 15
- ✅ Features Extras: 20+

---

**Documento gerado em:** 2025-01-11
**Próxima etapa:** Comparação com implementação real
