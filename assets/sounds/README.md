# 🔊 Sons do Pomodoro Extreme

## Sons Incluídos (Padrão)

Este diretório contém sons básicos gerados automaticamente. **Você pode substituí-los** por seus próprios arquivos mantendo os mesmos nomes.

### Arquivos Necessários:

| Arquivo | Uso | Personalização |
|---------|-----|----------------|
| `tick.mp3` | Som do relógio (tick) a cada segundo | Substitua por qualquer som curto (~0.1s) |
| `tack.mp3` | Som do relógio (tack) alternado | Substitua por som complementar ao tick |
| `pomodoro-start.mp3` | Início de um pomodoro | Som motivacional/alerta |
| `pomodoro-complete.mp3` | Pomodoro concluído | Som de sucesso/conquista |
| `break-start.mp3` | Início da pausa | Som relaxante |
| `break-complete.mp3` | Fim da pausa | Som de atenção |
| `session-complete.mp3` | Sessão completa | Som de celebração |
| `achievement-unlock.mp3` | Conquista desbloqueada | Som épico/fanfarra |
| `music-focus.mp3` | Música de fundo (foco) | Música ambiente (opcional) |

## 🎵 Gerando Sons Customizados

Execute no navegador para gerar sons simples:

```bash
# Abra o app em modo dev
npm run dev

# No console do DevTools (F12), execute:
# (Os scripts estão em src/renderer/utils/audioGenerator.js)
```

## 🌐 Fontes Recomendadas para Sons

### Gratuitas e Livres (CC0):

1. **Freesound** - https://freesound.org
   - Filtrar por: License → CC0
   - Buscar: "clock tick", "bell", "achievement"

2. **Pixabay** - https://pixabay.com/sound-effects/
   - Todos os sons são CC0
   - Download direto em MP3

3. **Zapsplat** - https://www.zapsplat.com
   - Registro gratuito
   - Sons profissionais

4. **BBC Sound Effects** - https://sound-effects.bbcrewind.co.uk
   - 16,000+ efeitos gratuitos
   - Uso não comercial permitido

### Sons Padrão Incluídos:

Os sons padrão são **silenciosos/mínimos** para não incomodar. Recomendamos personalizar!

## 📋 Como Substituir:

1. Encontre o som que deseja (formato MP3, OGG ou WAV)
2. Renomeie para o nome do arquivo correspondente
3. Coloque em `assets/sounds/`
4. Reinicie o app (`npm run dev`)

## ⚙️ Configuração no App:

Vá em **Configurações → Aba Áudio** para:
- Ativar/desativar cada som
- Ajustar volume individual
- Testar sons

---

**Nota:** Os sons padrão são placeholder. Para melhor experiência, personalize com sons de sua preferência!
