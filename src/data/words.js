// ── Palabras por complejidad (Actividad 3) ────────────────────────────────────

export const WORDS = [
  // Nivel 1 — Monosílabas (2-3 letras)
  { word: 'SOL',  audio: 'sol',  level: 1, hint: '☀️ Brilla en el cielo' },
  { word: 'MAR',  audio: 'mar',  level: 1, hint: '🌊 Agua grande y azul' },
  { word: 'PAN',  audio: 'pan',  level: 1, hint: '🍞 Lo comes en el desayuno' },
  { word: 'TEN',  audio: 'ten',  level: 1, hint: '✋ Agarra algo' },
  { word: 'MES',  audio: 'mes',  level: 1, hint: '📅 Enero es un...' },
  { word: 'PIE',  audio: 'pie',  level: 1, hint: '🦶 Parte del cuerpo' },
  { word: 'FIN',  audio: 'fin',  level: 1, hint: '🏁 El final' },
  { word: 'GAS',  audio: 'gas',  level: 1, hint: '💨 Aire invisible' },

  // Nivel 2 — Bisílabas (4-6 letras)
  { word: 'MAMA',  audio: 'mama',  level: 2, hint: '👩 Tu mamá te quiere' },
  { word: 'PAPA',  audio: 'papa',  level: 2, hint: '👨 Tu papá te cuida' },
  { word: 'MESA',  audio: 'mesa',  level: 2, hint: '🪑 Donde comes y estudias' },
  { word: 'CASA',  audio: 'casa',  level: 2, hint: '🏠 Donde vives' },
  { word: 'PATO',  audio: 'pato',  level: 2, hint: '🦆 Ave que nada' },
  { word: 'LUNA',  audio: 'luna',  level: 2, hint: '🌙 Brilla de noche' },
  { word: 'FLOR',  audio: 'flor',  level: 2, hint: '🌸 Es bonita y huele bien' },
  { word: 'MANO',  audio: 'mano',  level: 2, hint: '✋ Con esto escribes' },
  { word: 'POLO',  audio: 'polo',  level: 2, hint: '🍦 Helado en palito' },
  { word: 'BOTE',  audio: 'bote',  level: 2, hint: '⛵ Barco pequeño' },

  // Nivel 3 — Trisílabas (6-8 letras)
  { word: 'CAMISA',  audio: 'camisa',  level: 3, hint: '👕 Ropa que usas' },
  { word: 'ZAPATO',  audio: 'zapato',  level: 3, hint: '👟 Va en el pie' },
  { word: 'PALOMA',  audio: 'paloma',  level: 3, hint: '🕊️ Pájaro de la paz' },
  { word: 'PELOTA',  audio: 'pelota',  level: 3, hint: '⚽ Juegas con ella' },
  { word: 'CONEJO',  audio: 'conejo',  level: 3, hint: '🐰 Animal con orejas largas' },
  { word: 'MANZANA', audio: 'manzana', level: 3, hint: '🍎 Fruta roja y dulce' },

  // Nivel 4 — Polisílabas
  { word: 'MARIPOSA',  audio: 'mariposa',  level: 4, hint: '🦋 Insecto colorido' },
  { word: 'ELEFANTE',  audio: 'elefante',  level: 4, hint: '🐘 Animal grande con trompa' },
  { word: 'DINOSAURIO',audio: 'dinosaurio',level: 4, hint: '🦕 Animal prehistórico' },
];

export function getWordsByLevel(level) {
  return WORDS.filter((w) => w.level === level);
}

export function normalizeWord(str) {
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // quita tildes
    .replace(/\s+/g, '');
}
