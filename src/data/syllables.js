// ── Sílabas simples (consonante + vocal) ─────────────────────────────────────
// Actividad 2: el niño arrastra las letras para formar la sílaba dada

export const SYLLABLES = [
  // Nivel 1 — M
  { syllable: 'MA', consonant: 'M', vowel: 'A', audio: 'ma' },
  { syllable: 'ME', consonant: 'M', vowel: 'E', audio: 'me' },
  { syllable: 'MI', consonant: 'M', vowel: 'I', audio: 'mi' },
  { syllable: 'MO', consonant: 'M', vowel: 'O', audio: 'mo' },
  { syllable: 'MU', consonant: 'M', vowel: 'U', audio: 'mu' },
  // Nivel 1 — P
  { syllable: 'PA', consonant: 'P', vowel: 'A', audio: 'pa' },
  { syllable: 'PE', consonant: 'P', vowel: 'E', audio: 'pe' },
  { syllable: 'PI', consonant: 'P', vowel: 'I', audio: 'pi' },
  { syllable: 'PO', consonant: 'P', vowel: 'O', audio: 'po' },
  { syllable: 'PU', consonant: 'P', vowel: 'U', audio: 'pu' },
  // Nivel 2 — S, L
  { syllable: 'SA', consonant: 'S', vowel: 'A', audio: 'sa' },
  { syllable: 'SE', consonant: 'S', vowel: 'E', audio: 'se' },
  { syllable: 'SO', consonant: 'S', vowel: 'O', audio: 'so' },
  { syllable: 'LA', consonant: 'L', vowel: 'A', audio: 'la' },
  { syllable: 'LE', consonant: 'L', vowel: 'E', audio: 'le' },
  { syllable: 'LO', consonant: 'L', vowel: 'O', audio: 'lo' },
  // Nivel 2 — T, D
  { syllable: 'TA', consonant: 'T', vowel: 'A', audio: 'ta' },
  { syllable: 'TE', consonant: 'T', vowel: 'E', audio: 'te' },
  { syllable: 'TI', consonant: 'T', vowel: 'I', audio: 'ti' },
  { syllable: 'DA', consonant: 'D', vowel: 'A', audio: 'da' },
  { syllable: 'DE', consonant: 'D', vowel: 'E', audio: 'de' },
  { syllable: 'DI', consonant: 'D', vowel: 'I', audio: 'di' },
  // Nivel 3 — N, R, B, F
  { syllable: 'NA', consonant: 'N', vowel: 'A', audio: 'na' },
  { syllable: 'NE', consonant: 'N', vowel: 'E', audio: 'ne' },
  { syllable: 'NI', consonant: 'N', vowel: 'I', audio: 'ni' },
  { syllable: 'NO', consonant: 'N', vowel: 'O', audio: 'no' },
  { syllable: 'RA', consonant: 'R', vowel: 'A', audio: 'ra' },
  { syllable: 'RE', consonant: 'R', vowel: 'E', audio: 're' },
  { syllable: 'BA', consonant: 'B', vowel: 'A', audio: 'ba' },
  { syllable: 'BE', consonant: 'B', vowel: 'E', audio: 'be' },
  { syllable: 'FI', consonant: 'F', vowel: 'I', audio: 'fi' },
  { syllable: 'FE', consonant: 'F', vowel: 'E', audio: 'fe' },
];

// Consonantes disponibles para mostrar como opciones en Actividad 2
export const CONSONANT_POOL = ['M','P','S','L','T','D','N','R','B','F','C','G','V'];
// Vocales
export const VOWELS = ['A','E','I','O','U'];
