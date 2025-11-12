class PhraseModel {
  constructor(db) {
    this.db = db;
    this.initializePhrases();
  }

  initializePhrases() {
    // Check if phrases already exist
    const count = this.db.get('SELECT COUNT(*) as count FROM phrases');
    if (count.count > 0) return;

    // Define phrase categories and their phrases
    const phrasesData = {
      skip_sarcastic: [
        {
          text: 'Sério mesmo que você vai pular? Seu cérebro tá fritando aí 🧠🔥',
          weight: 1
        },
        {
          text: 'Ok workaholic, mas não reclama da dor nas costas depois hein',
          weight: 1
        },
        {
          text: 'Parabéns, você ganhou 1 ticket para o burnout expresso 🎟️',
          weight: 1
        },
        {
          text: 'Descansar é pra fracos, né? (Spoiler: não é)',
          weight: 1
        },
        {
          text: 'Seus olhos estão pedindo socorro, mas tá tudo bem, vai pulando...',
          weight: 1
        },
        {
          text: 'Produtividade sem descanso = burnout garantido 🔥',
          weight: 1
        },
        {
          text: 'Seu corpo: "Socorro!" | Você: "Mais 5min..."',
          weight: 1
        },
        {
          text: 'Bill Gates descansa. Elon Musk descansa. Mas você não, né?',
          weight: 1
        },
        {
          text: 'Já pensou que talvez você não seja um robô? 🤖❌',
          weight: 1
        },
        {
          text: 'Sua coluna cervical mandou um abraço (de dor)',
          weight: 1
        }
      ],

      skip_justification: [
        {
          text: 'Descreva a justificativa que "vale o burnout":',
          weight: 1
        },
        {
          text: 'Parou porque? Acha que já virou herdeiro ou tem outro motivo?',
          weight: 1
        },
        {
          text: 'Me conte: qual a desculpa dessa vez?',
          weight: 1
        },
        {
          text: 'Anota aí pra gente: por que isso não pode esperar 5min?',
          weight: 1
        },
        {
          text: 'O que é tão urgente que não pode descansar?',
          weight: 1
        }
      ],

      break_motivational: [
        {
          text: 'Levanta daí e bebe água! Seu corpo agradece 💧',
          weight: 1
        },
        {
          text: '5 minutos de pausa = 1 hora de foco renovado ✨',
          weight: 1
        },
        {
          text: 'Respira fundo. Olha pela janela. Você merece esse break! 🌿',
          weight: 1
        },
        {
          text: 'Alongue esse pescoço! Seu futuro eu agradece 🙆',
          weight: 1
        },
        {
          text: 'Pausar não é perder tempo, é ganhar saúde 💪',
          weight: 1
        },
        {
          text: 'Seus olhos precisam ver algo além da tela 👀',
          weight: 1
        },
        {
          text: 'Aproveita e come uma fruta. Seu corpo vai amar! 🍎',
          weight: 1
        },
        {
          text: 'Descanso é parte do trabalho, não o oposto ☕',
          weight: 1
        },
        {
          text: 'Caminha um pouco! Sua circulação agradece 🚶',
          weight: 1
        },
        {
          text: 'Relaxa! Você tá indo muito bem 😊',
          weight: 1
        }
      ],

      focus_reminders: [
        {
          text: 'Psiu! Bebe água aí 💧',
          weight: 1
        },
        {
          text: 'Lembrete: você piscou nos últimos 5min? 👁️',
          weight: 1
        },
        {
          text: 'Ombros tensos? Relaxa eles rapidinho 🙆',
          weight: 1
        },
        {
          text: 'Respira fundo, vai... in... out... 🧘',
          weight: 1
        },
        {
          text: 'Postura! Coluna ereta = foco melhor 📏',
          weight: 1
        },
        {
          text: 'Alongue os dedos, vai... você tá digitando há tempos ✋',
          weight: 1
        },
        {
          text: 'Café? Água? Chá? Seu corpo pede hidratação ☕',
          weight: 1
        },
        {
          text: 'Olha pra longe por 20seg. Regra 20-20-20! 👀',
          weight: 1
        }
      ],

      health_tips: [
        {
          text: '💧 Beba água - Hidratação é fundamental',
          weight: 1
        },
        {
          text: '🚶 Levante e caminhe - Seu corpo precisa se mover',
          weight: 1
        },
        {
          text: '🙆 Alongue pescoço e ombros - Previne dores',
          weight: 1
        },
        {
          text: '👀 Olhe para longe - Descanse seus olhos',
          weight: 1
        },
        {
          text: '🧘 Respire fundo 5 vezes - Oxigena o cérebro',
          weight: 1
        },
        {
          text: '🍎 Coma uma fruta - Energia saudável',
          weight: 1
        },
        {
          text: '🪟 Olhe pela janela - Conecte-se com o mundo',
          weight: 1
        },
        {
          text: '🎵 Ouça música relaxante - Acalme a mente',
          weight: 1
        },
        {
          text: '📱 Desligue notificações - Desconecte de verdade',
          weight: 1
        },
        {
          text: '☕ Prepare um chá - Ritual de autocuidado',
          weight: 1
        }
      ],

      achievement_congratulations: [
        {
          text: 'UHUL! Você desbloqueou uma conquista! 🎉',
          weight: 1
        },
        {
          text: 'Olha você sendo produtivo! Conquista desbloqueada! 🏆',
          weight: 1
        },
        {
          text: 'Parabéns! Mais uma conquista na conta! 🌟',
          weight: 1
        },
        {
          text: 'Boa! Você tá arrebentando! Nova conquista! 💪',
          weight: 1
        },
        {
          text: 'Achievement unlocked! Você é demais! ⭐',
          weight: 1
        }
      ],

      stealth_mode_justification: [
        {
          text: 'Por que você precisa se esconder? (Reunião? Apresentação?)',
          weight: 1
        },
        {
          text: 'Contexto profissional? Conta aí...',
          weight: 1
        },
        {
          text: 'Justifique o modo furtivo (a gente não julga... muito):',
          weight: 1
        }
      ]
    };

    // Insert all phrases
    const stmt = this.db.db.prepare(`
      INSERT INTO phrases (category, text, weight, is_active)
      VALUES (?, ?, ?, 1)
    `);

    Object.keys(phrasesData).forEach((category) => {
      phrasesData[category].forEach((phrase) => {
        stmt.run(category, phrase.text, phrase.weight);
      });
    });
  }

  getRandom(category, count = 1) {
    const phrases = this.db.all(
      `
      SELECT * FROM phrases
      WHERE category = ? AND is_active = 1
      ORDER BY RANDOM()
      LIMIT ?
    `,
      [category, count]
    );

    return count === 1 ? (phrases[0] ? phrases[0].text : null) : phrases.map((p) => p.text);
  }

  getByCategory(category) {
    return this.db.all(
      'SELECT * FROM phrases WHERE category = ? AND is_active = 1',
      [category]
    );
  }

  add(category, text, weight = 1) {
    this.db.run(
      'INSERT INTO phrases (category, text, weight, is_active) VALUES (?, ?, ?, 1)',
      [category, text, weight]
    );
  }

  deactivate(id) {
    this.db.run('UPDATE phrases SET is_active = 0 WHERE id = ?', [id]);
  }

  activate(id) {
    this.db.run('UPDATE phrases SET is_active = 1 WHERE id = ?', [id]);
  }
}

module.exports = { PhraseModel };
