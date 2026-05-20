// ── Imágenes para Actividad 4 ──────────────────────────────────────────────────
// emoji: renderizado como texto grande (fallback si no hay imagen)
// answer: respuesta correcta (normalizada, sin tilde)

export const IMAGE_ITEMS = [
  { id: 'sol',     emoji: '☀️',  answer: 'SOL',     hint: 'Es amarillo y calienta' },
  { id: 'gato',    emoji: '🐱',  answer: 'GATO',    hint: 'Animal que hace miau' },
  { id: 'flor',    emoji: '🌺',  answer: 'FLOR',    hint: 'Tiene pétalos' },
  { id: 'manzana', emoji: '🍎',  answer: 'MANZANA', hint: 'Fruta roja' },
  { id: 'casa',    emoji: '🏠',  answer: 'CASA',    hint: 'Donde vives' },
  { id: 'pato',    emoji: '🦆',  answer: 'PATO',    hint: 'Nada en el lago' },
  { id: 'luna',    emoji: '🌙',  answer: 'LUNA',    hint: 'Brilla de noche' },
  { id: 'pez',     emoji: '🐟',  answer: 'PEZ',     hint: 'Vive en el agua' },
  { id: 'arbol',   emoji: '🌳',  answer: 'ARBOL',   hint: 'Tiene hojas y ramas' },
  { id: 'perro',   emoji: '🐶',  answer: 'PERRO',   hint: 'El mejor amigo del humano' },
  { id: 'leche',   emoji: '🥛',  answer: 'LECHE',   hint: 'Bebida blanca' },
  { id: 'nube',    emoji: '⛅',  answer: 'NUBE',    hint: 'Flota en el cielo' },
];

// Genera un set aleatorio de N imágenes
export function getRandomImages(count = 4) {
  return [...IMAGE_ITEMS].sort(() => Math.random() - 0.5).slice(0, count);
}
