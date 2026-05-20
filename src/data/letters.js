// ── Datos del Abecedario ───────────────────────────────────────────────────────
// phonetic: cómo se pronuncia la letra para Web Speech API

export const LETTERS = [
  { char: 'A', phonetic: 'a',   color: 'bg-red-400',    textColor: 'text-white' },
  { char: 'B', phonetic: 'be',  color: 'bg-blue-400',   textColor: 'text-white' },
  { char: 'C', phonetic: 'ce',  color: 'bg-green-400',  textColor: 'text-white' },
  { char: 'D', phonetic: 'de',  color: 'bg-yellow-400', textColor: 'text-gray-800' },
  { char: 'E', phonetic: 'e',   color: 'bg-purple-400', textColor: 'text-white' },
  { char: 'F', phonetic: 'efe', color: 'bg-pink-400',   textColor: 'text-white' },
  { char: 'G', phonetic: 'je',  color: 'bg-orange-400', textColor: 'text-white' },
  { char: 'H', phonetic: 'ache',color: 'bg-teal-400',   textColor: 'text-white' },
  { char: 'I', phonetic: 'i',   color: 'bg-cyan-400',   textColor: 'text-white' },
  { char: 'J', phonetic: 'jota',color: 'bg-lime-400',   textColor: 'text-gray-800' },
  { char: 'K', phonetic: 'ka',  color: 'bg-indigo-400', textColor: 'text-white' },
  { char: 'L', phonetic: 'ele', color: 'bg-rose-400',   textColor: 'text-white' },
  { char: 'M', phonetic: 'eme', color: 'bg-amber-400',  textColor: 'text-gray-800' },
  { char: 'N', phonetic: 'ene', color: 'bg-emerald-400',textColor: 'text-white' },
  { char: 'Ñ', phonetic: 'eñe', color: 'bg-violet-400', textColor: 'text-white' },
  { char: 'O', phonetic: 'o',   color: 'bg-sky-400',    textColor: 'text-white' },
  { char: 'P', phonetic: 'pe',  color: 'bg-fuchsia-400',textColor: 'text-white' },
  { char: 'Q', phonetic: 'cu',  color: 'bg-red-300',    textColor: 'text-white' },
  { char: 'R', phonetic: 'erre',color: 'bg-blue-300',   textColor: 'text-white' },
  { char: 'S', phonetic: 'ese', color: 'bg-green-300',  textColor: 'text-white' },
  { char: 'T', phonetic: 'te',  color: 'bg-yellow-300', textColor: 'text-gray-800' },
  { char: 'U', phonetic: 'u',   color: 'bg-purple-300', textColor: 'text-white' },
  { char: 'V', phonetic: 've',  color: 'bg-pink-300',   textColor: 'text-white' },
  { char: 'W', phonetic: 'doble ve', color: 'bg-orange-300', textColor: 'text-white' },
  { char: 'X', phonetic: 'equis',color: 'bg-teal-300',  textColor: 'text-white' },
  { char: 'Y', phonetic: 'ye',  color: 'bg-cyan-300',   textColor: 'text-white' },
  { char: 'Z', phonetic: 'zeta',color: 'bg-lime-300',   textColor: 'text-gray-800' },
];

// Niveles de dificultad en Actividad 1
export const LETTER_LEVELS = {
  1: ['A', 'E', 'I', 'O', 'U'],                    // Solo vocales
  2: ['M', 'P', 'S', 'L', 'T', 'N'],               // Consonantes más comunes
  3: ['B', 'D', 'F', 'G', 'R', 'C', 'H'],          // Consonantes medias
  4: ['J', 'V', 'K', 'Ñ', 'X', 'Y', 'Z', 'W'],    // Consonantes difíciles
};

export function getLetterData(char) {
  return LETTERS.find((l) => l.char === char);
}

export function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Genera opciones para Actividad 1: 1 correcta + N distractores del mismo nivel o aleatoriamente
export function generateLetterOptions(correct, allOptions, count = 5) {
  const distractors = shuffleArray(allOptions.filter((l) => l !== correct)).slice(0, count - 1);
  return shuffleArray([correct, ...distractors]);
}
