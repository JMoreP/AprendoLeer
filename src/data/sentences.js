// ── Oraciones para Comprensión Lectora (Actividad 5) ──────────────────────────

export const SENTENCES = [
  {
    id: 1,
    sentence: 'El gato toma ___.',
    options: ['leche', 'zapato', 'luna'],
    correct: 'leche',
    explanation: '¡Correcto! Los gatos toman leche. 🥛🐱',
  },
  {
    id: 2,
    sentence: 'El niño juega con la ___.',
    options: ['pelota', 'camisa', 'mesa'],
    correct: 'pelota',
    explanation: '¡Muy bien! El niño juega con la pelota. ⚽😊',
  },
  {
    id: 3,
    sentence: 'La mamá prepara la ___.',
    options: ['canción', 'comida', 'pelota'],
    correct: 'comida',
    explanation: '¡Excelente! La mamá prepara la comida. 🍽️👩',
  },
  {
    id: 4,
    sentence: 'El pájaro vuela en el ___.',
    options: ['mar', 'cielo', 'suelo'],
    correct: 'cielo',
    explanation: '¡Fantástico! El pájaro vuela en el cielo. 🦅☁️',
  },
  {
    id: 5,
    sentence: 'La flor necesita ___ para crecer.',
    options: ['agua', 'arena', 'zapatos'],
    correct: 'agua',
    explanation: '¡Correcto! Las flores necesitan agua. 🌸💧',
  },
  {
    id: 6,
    sentence: 'Pedro duerme en su ___.',
    options: ['silla', 'cama', 'cocina'],
    correct: 'cama',
    explanation: '¡Muy bien! Pedro duerme en su cama. 🛏️😴',
  },
  {
    id: 7,
    sentence: 'El perro mueve la ___.',
    options: ['cola', 'oreja', 'pata'],
    correct: 'cola',
    explanation: '¡Excelente! El perro mueve la cola cuando está feliz. 🐕🐾',
  },
  {
    id: 8,
    sentence: 'En la noche vemos la ___ y las estrellas.',
    options: ['sol', 'luna', 'nube'],
    correct: 'luna',
    explanation: '¡Fantástico! De noche vemos la luna. 🌙⭐',
  },
  {
    id: 9,
    sentence: 'Ana usa ___ en los pies.',
    options: ['sombrero', 'zapatos', 'guantes'],
    correct: 'zapatos',
    explanation: '¡Correcto! Ana usa zapatos en los pies. 👟👣',
  },
  {
    id: 10,
    sentence: 'El pez vive en el ___.',
    options: ['árbol', 'agua', 'jardín'],
    correct: 'agua',
    explanation: '¡Muy bien! El pez vive en el agua. 🐟🌊',
  },
  {
    id: 11,
    sentence: 'La mariposa tiene alas de muchos ___.',
    options: ['colores', 'sabores', 'números'],
    correct: 'colores',
    explanation: '¡Excelente! La mariposa tiene alas de muchos colores. 🦋🎨',
  },
  {
    id: 12,
    sentence: 'Los niños van a la escuela a ___.',
    options: ['dormir', 'aprender', 'nadar'],
    correct: 'aprender',
    explanation: '¡Fantástico! En la escuela aprendemos muchas cosas. 📚✏️',
  },
];

export function shuffleSentences() {
  return [...SENTENCES].sort(() => Math.random() - 0.5);
}
