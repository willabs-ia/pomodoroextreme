# ✅ CHECKLIST 2: Testes de Funcionalidades

Este checklist contém **TODOS os testes que você deve realizar** para verificar se o Pomodoro Extreme está funcionando corretamente.

**IMPORTANTE:** Complete TODOS os itens do `CHECKLIST_1_IMPLEMENTACAO_MANUAL.md` antes de começar estes testes!

---

## 🚀 PREPARAÇÃO PARA TESTES

### Passo 1: Iniciar o App em Modo Desenvolvimento

```bash
# No terminal, na pasta do projeto:
cd /caminho/para/pomodoroextreme
npm run dev
```

**Resultado esperado:**
- Terminal mostra "vite v..." e "Electron app started"
- Janela do Electron abre automaticamente
- Não deve ter erros vermelhos no console

**Se der erro:**
- Anote a mensagem de erro completa
- Verifique se fez `npm install` no Checklist 1
- Tente fechar e rodar `npm run dev` novamente

---

### Passo 2: Abrir DevTools

Para ver erros no console:

1. Com o app aberto, pressione: **F12** (Windows/Linux) ou **Cmd+Option+I** (Mac)
2. Vá na aba "Console"
3. Deixe aberto durante todos os testes

---

## 📋 PARTE 1: Testes de Interface Básica

### Teste 1.1: Navegação Entre Páginas

**O que testar:**
- HomePage carrega corretamente
- Consegue navegar para outras páginas

**Como testar:**

1. **HomePage (Inicial)**
   - [ ] Título "🍅 Pomodoro Extreme" visível
   - [ ] Botões "Configurações" e "Estatísticas" no footer
   - [ ] Card "+ Novo Projeto" visível

2. **Navegar para Estatísticas**
   - [ ] Clique em "📊 Estatísticas"
   - [ ] Página carrega sem erros
   - [ ] Vê título "📊 Estatísticas"
   - [ ] Vê cards de métricas (mesmo que zerados)

3. **Navegar para Configurações**
   - [ ] Volte para home (se tiver botão de volta)
   - [ ] Clique em "⚙️ Configurações"
   - [ ] Página carrega sem erros
   - [ ] Vê 5 abas: Geral, Visual, Áudio, Notificações, Atalhos

**Resultado esperado:**
- ✅ Todas as páginas carregam sem erro no console
- ✅ Interface está responsiva
- ✅ Textos estão legíveis

---

### Teste 1.2: Tema Dark/Light

**O que testar:**
- Tema escuro está ativo por padrão
- Componentes estão bem contrastados

**Como testar:**

1. Vá em **Configurações → Aba Visual**
2. [ ] Campo "Tema" mostra "🌙 Escuro" selecionado
3. [ ] Tente mudar para "☀️ Claro"
4. [ ] Interface muda de cor (fundo fica claro)
5. [ ] Volte para "🌙 Escuro"

**Resultado esperado:**
- ✅ Tema escuro é confortável para os olhos
- ✅ Textos são legíveis em ambos os temas
- ✅ Mudança de tema é instantânea

---

## 📋 PARTE 2: Testes de CRUD de Projetos

### Teste 2.1: Criar Novo Projeto

**O que testar:**
- Consegue criar um projeto
- Projeto aparece na lista

**Como testar:**

1. Vá para **HomePage**
2. [ ] Clique no card "+ Novo Projeto"
3. [ ] Modal "Criar Novo Projeto" abre
4. [ ] Digite no campo: "Projeto de Teste"
5. [ ] Clique em "Criar Projeto"
6. [ ] Modal fecha
7. [ ] Novo card "Projeto de Teste" aparece na grid
8. [ ] Card tem um ícone emoji (aleatório)
9. [ ] Card mostra "0 pomodoros" e "0m focado"

**Resultado esperado:**
- ✅ Projeto criado com sucesso
- ✅ Aparece na interface imediatamente
- ✅ Sem erros no console

**Se falhar:**
- Verifique console do DevTools
- Pode ser erro no banco de dados SQLite
- Tente criar outro projeto com nome diferente

---

### Teste 2.2: Editar Projeto

**O que testar:**
- Menu de opções do projeto funciona
- Consegue editar nome do projeto

**Como testar:**

1. Na **HomePage**, no card do "Projeto de Teste"
2. [ ] Passe o mouse sobre o card
3. [ ] Clique no ícone de menu (⚙️) no canto superior direito
4. [ ] Menu dropdown abre com 3 opções:
   - Editar Projeto
   - Configurações
   - Excluir Projeto

**Nota:** A edição pode não estar 100% implementada. Se der erro, anote e continue.

---

### Teste 2.3: Excluir Projeto

**O que testar:**
- Consegue excluir um projeto

**Como testar:**

1. Crie um projeto chamado "Para Excluir"
2. [ ] Clique no menu (⚙️) do card "Para Excluir"
3. [ ] Clique em "Excluir Projeto" (texto vermelho)
4. [ ] Confirme a exclusão (se houver popup)
5. [ ] Card desaparece da grid

**Resultado esperado:**
- ✅ Projeto excluído com sucesso
- ✅ Não aparece mais na lista
- ✅ Sem erros no console

---

## 📋 PARTE 3: Testes do Timer (CRÍTICO)

### Teste 3.1: Iniciar Timer de Foco

**O que testar:**
- Timer inicia quando clica em um projeto
- FlipClock aparece e funciona

**Como testar:**

1. Na **HomePage**, crie um projeto "Teste Timer"
2. [ ] Clique no card "Teste Timer"
3. [ ] **O QUE DEVE ACONTECER:**
   - App navega para TimerPage OU
   - Uma janela de gadget abre com o timer OU
   - Você vê um FlipClock em algum lugar

**IMPORTANTE:** Como o backend pode não estar 100% conectado, anote o que acontece:

**Cenário A:** Se abre a TimerPage:
- [ ] FlipClock está visível
- [ ] Mostra "25:00" (25 minutos)
- [ ] Badge mostra "🎯 FOCO"
- [ ] Botão "Iniciar" está visível

**Cenário B:** Se nada acontece:
- Verifique o console do DevTools
- Pode haver erro de IPC (main process → renderer)
- Anote o erro exato

---

### Teste 3.2: Timer Contando

**O que testar:**
- Timer decrementa a cada segundo
- FlipClock anima

**Como testar:**

1. Na TimerPage (se chegou lá)
2. [ ] Clique em "▶️ Iniciar"
3. [ ] Observe o FlipClock
4. [ ] Números devem mudar a cada segundo: 25:00 → 24:59 → 24:58...
5. [ ] Animação de "flip" dos dígitos

**Resultado esperado:**
- ✅ Timer conta corretamente
- ✅ FlipClock anima suavemente
- ✅ Sem lag ou travamentos

**Se não funcionar:**
- O TimerEngine pode não estar disparando eventos
- Verifique se há erros no terminal (main process)
- Anote a mensagem de erro

---

### Teste 3.3: Pausar e Retomar Timer

**O que testar:**
- Consegue pausar o timer
- Consegue retomar de onde parou

**Como testar:**

1. Com timer rodando (ex: 24:45 restantes)
2. [ ] Clique em "⏸️ Pausar"
3. [ ] Timer para de contar
4. [ ] Botão muda para "▶️ Retomar"
5. [ ] Clique em "▶️ Retomar"
6. [ ] Timer continua de onde parou

**Resultado esperado:**
- ✅ Pausa funciona instantaneamente
- ✅ Retoma do tempo exato

---

### Teste 3.4: Parar Timer

**O que testar:**
- Consegue parar o timer completamente

**Como testar:**

1. Com timer rodando
2. [ ] Clique em "⏹️ Parar"
3. [ ] Timer reseta (volta para 25:00)
4. [ ] Estado volta para "Iniciar"

**Resultado esperado:**
- ✅ Timer reseta corretamente

---

## 📋 PARTE 4: Testes de Bloqueio de Tela (CRÍTICO)

**ATENÇÃO:** Este é um teste importante mas pode falhar se o WindowManager não estiver 100% conectado.

### Teste 4.1: Completar um Pomodoro

**O que testar:**
- Ao completar 25 minutos, tela de bloqueio aparece

**Como testar:**

**Opção A - Teste Rápido (Alterar duração):**

1. Vá em **Configurações → Aba Geral**
2. [ ] Mude "Duração do Foco" para **1 minuto**
3. [ ] Salve (deve salvar automaticamente)
4. [ ] Volte para HomePage
5. [ ] Inicie um novo timer
6. [ ] Espere 1 minuto completo
7. [ ] **O QUE DEVE ACONTECER:**
   - Som de "pomodoro completado" toca (se assets estiverem instalados)
   - Tela de bloqueio fullscreen aparece OU
   - BlockPage carrega mostrando "☕ Pausa para Descanso"

**Opção B - Teste Manual (Forçar):**

Se quiser pular para a pausa sem esperar, você precisa modificar o código (não recomendado agora).

---

### Teste 4.2: Tela de Bloqueio - Modo Suave

**O que testar:**
- Botão "Tentar Pular Pausa" funciona
- Sistema de 3 mensagens aparece

**Como testar:**

1. Certifique-se que está em **Modo Suave** (Configurações → Geral → Nível de Bloqueio = "Suave")
2. [ ] Na tela de bloqueio (BlockPage), veja o botão "Tentar Pular Pausa"
3. [ ] Clique nele
4. [ ] SkipDialog modal deve abrir
5. [ ] Veja mensagem desmotivadora (ex: "🤔 Você realmente precisa fazer isso?")
6. [ ] Veja 3 dots de progresso (•••)
7. [ ] Clique em "Continuar"
8. [ ] Segunda mensagem aparece ("😰 Seu cérebro está implorando...")
9. [ ] Clique em "Continuar" novamente
10. [ ] Terceira mensagem + textarea de justificativa
11. [ ] Digite no mínimo 20 caracteres (ex: "Tenho uma reunião urgente que não pode esperar")
12. [ ] Clique em "Pular Pausa"
13. [ ] Modal fecha e você volta ao trabalho

**Resultado esperado:**
- ✅ Modal SkipDialog funciona
- ✅ Mensagens aparecem progressivamente
- ✅ Justificativa é obrigatória
- ✅ Só pode pular após 3 mensagens e justificativa válida

---

### Teste 4.3: Tela de Bloqueio - Modo Médio

**O que testar:**
- Sistema de penalidade 3x funciona
- Visual da penalidade é claro

**Como testar:**

1. Vá em **Configurações → Geral → Modo de Bloqueio**
2. [ ] Mude para "Médio - Penalidade 3x ao pular"
3. [ ] Inicie um novo timer de 1 minuto
4. [ ] Espere completar e chegar na pausa
5. [ ] Clique em "Tentar Pular Pausa"
6. [ ] SkipDialog modo Medium abre
7. [ ] Veja alert vermelho com "⚠️ Sistema de Penalidade Ativo"
8. [ ] Veja box grande mostrando "+15 minutos" (5min × 3)
9. [ ] Veja explicação "Sua próxima pausa será 15 minutos mais longa"
10. [ ] Veja box cinza explicando "1ª tentativa: +15 min, 2ª: +45 min, 3ª: +135 min"
11. [ ] Clique em "Aceitar Penalidade"
12. [ ] Modal fecha

**Resultado esperado:**
- ✅ Visual de penalidade é claro
- ✅ Matemática está correta (5 × 3 = 15)
- ✅ Usuário entende o custo

---

### Teste 4.4: Tela de Bloqueio - Modo Extremo

**O que testar:**
- NÃO consegue pular a pausa

**Como testar:**

1. **CUIDADO:** Só teste se tiver paciência, pois vai ficar travado!
2. Vá em **Configurações → Geral → Modo de Bloqueio**
3. [ ] Mude para "Extremo - Sem escapatória"
4. [ ] Inicie timer de 1 minuto de foco
5. [ ] Espere completar
6. [ ] Configure pausa curta para 1 minuto também (para não ficar muito tempo)
7. [ ] Quando chegar na pausa:
   - [ ] Botão "Tentar Pular Pausa" pode estar desabilitado OU
   - [ ] Clique nele e veja modal "🚫 Modo Extremo Ativo"
   - [ ] Veja mensagem "SEM ESCAPATÓRIA"
   - [ ] Veja texto sarcástico "Você literalmente pediu para isso acontecer"
   - [ ] Botão está desabilitado ("Não há botão de pular aqui 🤷")
8. [ ] Espere 1 minuto completo (não há como pular)

**Resultado esperado:**
- ✅ Impossível pular a pausa
- ✅ Mensagem sarcástica aparece
- ✅ Usuário entende que escolheu isso

**DICA:** Depois desse teste, volte para Modo Suave!

---

## 📋 PARTE 5: Testes de Configurações

### Teste 5.1: Aba Geral - Durações

**O que testar:**
- Consegue alterar durações
- Valores salvam

**Como testar:**

1. Vá em **Configurações → Aba Geral**
2. [ ] Mude "Duração do Foco" de 25 para **30 minutos**
3. [ ] Mude "Pausa Curta" de 5 para **7 minutos**
4. [ ] Veja badge "Salvando..." aparecer brevemente
5. [ ] Feche o app completamente
6. [ ] Reabra com `npm run dev`
7. [ ] Vá em Configurações → Geral novamente
8. [ ] Verifique se mostra 30 e 7 (valores que você colocou)

**Resultado esperado:**
- ✅ Valores salvam no banco de dados
- ✅ Persistem após fechar o app

---

### Teste 5.2: Aba Geral - Auto-Start

**O que testar:**
- Switches funcionam

**Como testar:**

1. **Configurações → Geral → Automação**
2. [ ] Toggle "Auto-iniciar Foco" (ON → OFF)
3. [ ] Switch anima
4. [ ] Toggle "Auto-iniciar Pausas" (OFF → ON)
5. [ ] Badge "Salvando..." aparece

**Resultado esperado:**
- ✅ Switches são interativos
- ✅ Estado salva

---

### Teste 5.3: Aba Visual - Tema

**Como testar:**

1. **Configurações → Aba Visual**
2. [ ] Dropdown "Tema" mostra opções: Claro, Escuro, Automático
3. [ ] Mude para "Claro"
4. [ ] Interface muda para tema claro instantaneamente
5. [ ] Mude para "Escuro"
6. [ ] Volta para tema escuro

**Resultado esperado:**
- ✅ Tema muda em tempo real

---

### Teste 5.4: Aba Visual - Cor de Destaque

**Como testar:**

1. **Configurações → Aba Visual → Cor de Destaque**
2. [ ] Vê um input type="color" (picker de cor)
3. [ ] Clique nele
4. [ ] Escolha uma cor diferente (ex: azul, verde)
5. [ ] Cor salva
6. [ ] Volte para HomePage ou TimerPage
7. [ ] Veja se elementos usam a nova cor (pode não ser visível em todos lugares ainda)

---

### Teste 5.5: Aba Áudio - Tick-Tack

**Como testar:**

1. **Configurações → Aba Áudio**
2. [ ] Toggle "Som do Relógio (Tick-Tack)" está ON
3. [ ] Slider "Volume do Tick-Tack" aparece
4. [ ] Arraste o slider (0% → 100%)
5. [ ] Número dentro do slider muda
6. [ ] Desligue o toggle
7. [ ] Slider desaparece

**Resultado esperado:**
- ✅ UI responsiva
- ✅ Slider funciona

**Nota:** O som só vai tocar quando o timer estiver rodando E se você baixou os assets de áudio.

---

### Teste 5.6: Aba Áudio - Alertas

**Como testar:**

1. **Configurações → Aba Áudio → Sons de Alerta**
2. [ ] Toggle ON
3. [ ] Slider de volume aparece
4. [ ] Ajuste para 50%
5. [ ] Salve
6. [ ] Inicie um timer e complete um pomodoro
7. [ ] **Resultado:** Som de alerta deve tocar (se assets instalados)

---

### Teste 5.7: Aba Áudio - Música de Pausas

**Como testar:**

1. **Configurações → Aba Áudio → Música de Fundo nas Pausas**
2. [ ] Toggle ON
3. [ ] Campo "Fonte da Música" aparece
4. [ ] Cole uma URL de MP3 (ex: de um som no Freesound) OU
5. [ ] Digite caminho local do `break-music.mp3`
6. [ ] Slider de volume aparece
7. [ ] Ajuste para 30%

**Teste real:**
8. [ ] Inicie um timer curto (1 min)
9. [ ] Espere completar
10. [ ] Na pausa, música deve começar a tocar (se URL/arquivo válido)

---

### Teste 5.8: Aba Notificações

**Como testar:**

1. **Configurações → Aba Notificações**
2. [ ] Toggle "Ativar Notificações" ON
3. [ ] Toggle "Som nas Notificações" ON
4. [ ] Dropdown "Posição na Tela" mostra 4 opções
5. [ ] Veja lista de tipos de notificações (7 itens)
6. [ ] Tudo mostra corretamente

**Teste real:**
7. [ ] Complete um pomodoro
8. [ ] **Resultado:** Notificação do sistema deve aparecer

**Nota:** Notificações podem pedir permissão no primeiro uso.

---

### Teste 5.9: Aba Atalhos

**Como testar:**

1. **Configurações → Aba Atalhos**
2. [ ] Vê 3 inputs de atalhos:
   - Iniciar/Pausar Timer
   - Parar Timer
   - Tentar Pular Pausa
3. [ ] Cada input mostra um atalho padrão (ex: "CommandOrControl+Shift+S")
4. [ ] Clique no primeiro input
5. [ ] Digite: "CommandOrControl+Shift+P"
6. [ ] Badge "Salvando..." aparece

**Teste real:**
7. [ ] Vá para HomePage
8. [ ] Pressione **Ctrl+Shift+P** (Windows/Linux) ou **Cmd+Shift+P** (Mac)
9. [ ] **Resultado:** Timer deve iniciar OU alguma ação acontecer

**Nota:** Atalhos globais podem não funcionar 100% ainda. Anote se falhar.

---

## 📋 PARTE 6: Testes de Estatísticas

### Teste 6.1: Visualizar Stats Zeradas

**Como testar:**

1. Vá para **Página de Estatísticas**
2. [ ] Vê 4 cards grandes:
   - Pomodoros Completados: 0
   - Tempo Focado: 0h 0m
   - Streak Atual: 🔥 0
   - Produtividade: 0%
3. [ ] Vê filtros:
   - Dropdown "Todos os projetos"
   - Dropdown "Hoje"
4. [ ] Vê seção "Visão Geral" com 3 cards:
   - Hoje: 0 pomodoros
   - Esta Semana: 0 pomodoros
   - Este Mês: 0 pomodoros
5. [ ] Vê progresso de conquistas: 0/12
6. [ ] Vê reputação: Iniciante, 0 pontos

**Resultado esperado:**
- ✅ Página carrega sem erros
- ✅ Todos os valores mostram 0 (normal para primeira vez)
- ✅ UI está organizada e legível

---

### Teste 6.2: Filtrar por Período

**Como testar:**

1. Na página de Estatísticas
2. [ ] Clique no dropdown "Hoje"
3. [ ] Vê opções: Hoje, Esta semana, Este mês, Este ano, Todo período
4. [ ] Selecione "Esta semana"
5. [ ] Cards atualizam (ainda mostram 0)
6. [ ] Dropdown mostra "Esta semana" selecionado

**Resultado esperado:**
- ✅ Filtro funciona
- ✅ UI atualiza

---

### Teste 6.3: Filtrar por Projeto

**Como testar:**

1. Se você criou projetos antes (ex: "Projeto de Teste")
2. [ ] Clique no dropdown "Todos os projetos"
3. [ ] Vê lista dos seus projetos
4. [ ] Selecione um projeto específico
5. [ ] Stats filtram para aquele projeto

**Resultado esperado:**
- ✅ Lista de projetos aparece
- ✅ Filtro funciona

---

### Teste 6.4: Botão Exportar

**Como testar:**

1. Na página de Estatísticas
2. [ ] Vê botão "📥 Exportar" no topo
3. [ ] Clique nele
4. [ ] **O QUE DEVE ACONTECER:**
   - Arquivo JSON baixa OU
   - Erro no console (ainda não implementado)

**Se falhar:** Normal, export pode não estar 100% funcional. Anote.

---

## 📋 PARTE 7: Testes de Conquistas

### Teste 7.1: Visualizar Página de Conquistas

**Como testar:**

1. Adicione rota no App.jsx (se não tiver):
   - Edite `src/renderer/App.jsx`
   - Adicione: `<Route path="/achievements" element={<AchievementsPage />} />`
2. Acesse no navegador: `/#/achievements` OU crie botão na HomePage
3. [ ] Página "🏆 Conquistas" carrega
4. [ ] Vê card de "Progresso Geral": 0%
5. [ ] Vê "0 / 12 conquistas desbloqueadas"
6. [ ] Vê card de "Reputação": Iniciante, 0 pontos
7. [ ] Vê seção "🔒 Bloqueadas (12)"
8. [ ] Vê grid com 12 cards de conquistas bloqueadas

**Resultado esperado:**
- ✅ Página carrega sem erros
- ✅ UI está organizada
- ✅ Cards de conquistas estão visíveis (mesmo bloqueadas)

---

### Teste 7.2: Detalhes de Conquista Bloqueada

**Como testar:**

1. Na página de Conquistas
2. [ ] Observe um card de conquista bloqueada
3. [ ] Vê:
   - Ícone 🏆 (ou similar)
   - Nome da conquista
   - Descrição
   - Barra de progresso (se tiver)
   - Ícone de cadeado 🔒

**Resultado esperado:**
- ✅ Informações claras
- ✅ Visual de "bloqueado" é óbvio

---

### Teste 7.3: Simular Desbloqueio (Teste Manual)

**IMPORTANTE:** Conquistas são desbloqueadas automaticamente pelo backend. Para testar manualmente:

1. Complete alguns pomodoros reais
2. [ ] Volte para página de Conquistas
3. [ ] Veja se alguma foi desbloqueada (ex: "Primeira Conquista")
4. [ ] Card deve estar:
   - Com cor mais vibrante
   - Badge verde "✅ Desbloqueado"
   - Sem cadeado
   - Data de desbloqueio visível

---

## 📋 PARTE 8: Testes de Audio (Se Assets Instalados)

**PULE ESTA PARTE se não baixou os assets de áudio ainda.**

### Teste 8.1: Som de Tick-Tack

**Como testar:**

1. Certifique-se que:
   - Assets `tick.mp3` e `tack.mp3` estão em `assets/sounds/`
   - Configurações → Áudio → Tick-Tack está ON
2. [ ] Inicie um timer
3. [ ] **OUÇA:** Som de "tick... tack... tick... tack..." alternando a cada segundo
4. [ ] Pause o timer
5. [ ] Som para
6. [ ] Retome o timer
7. [ ] Som volta

**Resultado esperado:**
- ✅ Som toca corretamente
- ✅ Alterna entre tick e tack
- ✅ Volume está ok (não muito alto/baixo)

**Se não tocar:**
- Verifique console do DevTools
- Verifique se arquivos existem: `ls assets/sounds/`
- Verifique se são MP3 válidos

---

### Teste 8.2: Som de Pomodoro Completado

**Como testar:**

1. Configure timer de 1 minuto
2. [ ] Espere completar
3. [ ] **OUÇA:** Som de alerta/ding/conquista deve tocar
4. [ ] Verifique se é o `pomodoro-complete.mp3`

**Resultado esperado:**
- ✅ Som toca ao completar pomodoro
- ✅ Volume adequado

---

### Teste 8.3: Música de Pausa

**Como testar:**

1. Configure música de pausa (URL ou arquivo local)
2. [ ] Complete um pomodoro
3. [ ] Na tela de bloqueio (pausa):
   - **OUÇA:** Música relaxante deve começar a tocar
   - [ ] Música está em loop (não para)
4. [ ] Complete a pausa
5. [ ] Música para

**Resultado esperado:**
- ✅ Música toca durante pausas
- ✅ Loop funciona
- ✅ Para ao sair da pausa

---

## 📋 PARTE 9: Testes de Multi-Monitor (OPCIONAL)

**PULE se tiver apenas 1 monitor.**

### Teste 9.1: Bloqueio em Múltiplos Monitores

**Como testar:**

1. Conecte 2 ou mais monitores
2. [ ] Inicie um timer curto (1 min)
3. [ ] Complete o pomodoro
4. [ ] **VERIFIQUE:** Tela de bloqueio aparece em TODOS os monitores simultaneamente
5. [ ] Não é possível "escapar" mudando de monitor

**Resultado esperado:**
- ✅ Todos os monitores são bloqueados
- ✅ Fullscreen em cada monitor

**Se falhar:**
- É um bug conhecido, anote para correção futura

---

## 📋 PARTE 10: Testes de Persistência de Dados

### Teste 10.1: Dados Salvam Após Fechar

**Como testar:**

1. Crie 3 projetos com nomes distintos
2. [ ] Complete 1 pomodoro
3. [ ] Vá em Configurações e mude algumas coisas
4. [ ] Feche o app COMPLETAMENTE (Ctrl+Q ou feche a janela)
5. [ ] Reabra com `npm run dev`
6. [ ] **VERIFIQUE:**
   - [ ] 3 projetos ainda estão lá
   - [ ] Configurações que você mudou foram salvas
   - [ ] Stats mostram o pomodoro completado

**Resultado esperado:**
- ✅ Todos os dados persistem
- ✅ Banco SQLite funciona

**Se dados sumirem:**
- ERRO GRAVE! Banco de dados pode não estar salvando
- Verifique se existe arquivo `pomodoro.db` na pasta userdata do Electron
- Verifique console/terminal por erros

---

### Teste 10.2: Localização do Banco de Dados

**Como testar:**

```bash
# No terminal:
# Windows:
dir %APPDATA%\pomodoro-extreme\

# macOS/Linux:
ls ~/Library/Application\ Support/pomodoro-extreme/
# ou
ls ~/.config/pomodoro-extreme/
```

**Deve ter:**
- `pomodoro.db` (banco SQLite)
- `pomodoro.db-shm` (temp)
- `pomodoro.db-wal` (write-ahead log)

**Resultado esperado:**
- ✅ Arquivo `pomodoro.db` existe e não está vazio (tamanho > 0 KB)

---

## 📋 PARTE 11: Testes de Performance

### Teste 11.1: Uso de CPU e Memória

**Como testar:**

1. Com o app aberto e timer rodando
2. [ ] Abra Gerenciador de Tarefas (Windows) / Activity Monitor (Mac)
3. [ ] Procure por "Electron" ou "Pomodoro Extreme"
4. [ ] **ANOTE:**
   - Uso de CPU: ____%
   - Uso de Memória (RAM): ____ MB

**Resultado esperado:**
- ✅ CPU < 5% em idle
- ✅ CPU < 10% com timer rodando
- ✅ RAM < 200 MB

**Se usar muito:**
- Pode ser normal em desenvolvimento
- App final (builded) usa menos recursos

---

### Teste 11.2: FlipClock - Suavidade

**Como testar:**

1. Com timer rodando
2. [ ] Observe o FlipClock por 30 segundos
3. [ ] Preste atenção se:
   - Animações estão suaves (60 FPS)
   - Não tem lag ou travamento
   - Números mudam exatamente a cada 1 segundo

**Resultado esperado:**
- ✅ Animações fluidas
- ✅ Sem lag perceptível

---

## 📋 PARTE 12: Testes de Casos Extremos

### Teste 12.1: Timer com 0 Segundos Restantes

**Como testar:**

1. Configure duração para 1 minuto
2. [ ] Inicie o timer
3. [ ] Quando chegar em 0:01...
4. [ ] Observe 0:00
5. [ ] **DEVE:** Transicionar automaticamente para a pausa

**Resultado esperado:**
- ✅ Não fica preso em 0:00
- ✅ Transição automática funciona

---

### Teste 12.2: Fechar App Durante Timer

**Como testar:**

1. [ ] Inicie um timer de 5 minutos
2. [ ] Espere chegar em 3:30 (ainda rodando)
3. [ ] Feche o app completamente
4. [ ] Reabra imediatamente
5. [ ] **O QUE DEVE ACONTECER:**
   - Popup "Sessão Interrompida Detectada" OU
   - Timer continua de onde parou OU
   - Timer reseta (comportamento depende da implementação)

**Resultado esperado:**
- ✅ App lida com fechamento gracefully
- ✅ Session recovery funciona (se implementado)

---

### Teste 12.3: Criar 50 Projetos

**Como testar:**

1. [ ] Crie 50 projetos (pode usar nomes como "Proj 1", "Proj 2", ...)
2. [ ] Observe se:
   - HomePage ainda carrega rápido
   - Scroll funciona
   - Sem lag

**Resultado esperado:**
- ✅ Suporta muitos projetos sem problemas

---

## 📋 PARTE 13: Checklist Final de Bugs Conhecidos

Anote se encontrou algum dos seguintes bugs:

- [ ] Timer não inicia (botão não responde)
- [ ] FlipClock não anima
- [ ] Tela de bloqueio não aparece ao completar pomodoro
- [ ] Multi-monitor não bloqueia todos monitores
- [ ] Sons não tocam (mesmo com assets instalados)
- [ ] Configurações não salvam
- [ ] Projetos somem ao fechar o app
- [ ] Skip dialog não abre
- [ ] Modo extremo permite pular pausa
- [ ] Estatísticas sempre mostram 0
- [ ] Conquistas não desbloqueiam
- [ ] Reputação não aumenta
- [ ] Notificações não aparecem
- [ ] Atalhos globais não funcionam
- [ ] App trava/crasha
- [ ] Alto uso de CPU/RAM

**Para cada bug encontrado, anote:**
1. O que você fez (passos para reproduzir)
2. O que esperava que acontecesse
3. O que realmente aconteceu
4. Mensagens de erro (console/terminal)

---

## 🎉 RESULTADO FINAL

### Se TODOS os testes passaram:

**PARABÉNS! 🎉**

O Pomodoro Extreme está funcionando perfeitamente e você pode:
- Começar a usar no dia-a-dia
- Fazer o build de produção: `npm run build`
- Distribuir para outras pessoas

---

### Se ALGUNS testes falharam:

**Normal!** É um projeto complexo. Foque nos bugs mais críticos primeiro:

**Bugs Críticos (resolver primeiro):**
1. Timer não inicia/conta
2. Tela de bloqueio não aparece
3. Dados não salvam
4. App crasha

**Bugs Importantes:**
5. Sons não tocam
6. Skip dialog não funciona
7. Configurações não salvam

**Bugs Menores:**
8. Estatísticas não atualizam
9. Conquistas não desbloqueiam
10. Multi-monitor falha

---

## 📊 Scorecard de Testes

Após completar todos os testes, preencha:

| Categoria | Testes OK | Testes Falharam | % Sucesso |
|-----------|-----------|-----------------|-----------|
| Interface Básica (1) | __ / 2 | __ | __% |
| CRUD Projetos (2) | __ / 3 | __ | __% |
| Timer (3) | __ / 4 | __ | __% |
| Bloqueio de Tela (4) | __ / 4 | __ | __% |
| Configurações (5) | __ / 9 | __ | __% |
| Estatísticas (6) | __ / 4 | __ | __% |
| Conquistas (7) | __ / 3 | __ | __% |
| Áudio (8) | __ / 3 | __ | __% |
| Multi-Monitor (9) | __ / 1 | __ | __% |
| Persistência (10) | __ / 2 | __ | __% |
| Performance (11) | __ / 2 | __ | __% |
| Casos Extremos (12) | __ / 3 | __ | __% |
| **TOTAL** | **__ / 40** | **__** | **__%** |

**Meta para lançamento:** ≥ 85% de sucesso (34/40 testes OK)

---

**Data de criação:** 2025-01-11
**Versão do checklist:** 1.0
**Autor:** Claude (Anthropic)

**Boa sorte com os testes! 🚀**
