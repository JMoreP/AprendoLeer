// ── ConfettiService.js ────────────────────────────────────────────────────────
// Wraps canvas-confetti for easy use throughout the game.
import confetti from 'canvas-confetti';

/**
 * Fires a medium burst of confetti - used when earning a star.
 */
export function fireStarConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#a855f7', '#facc15', '#34d399', '#60a5fa', '#f472b6'],
    scalar: 1.2,
  });
}

/**
 * Fires a big celebratory burst - used when completing an activity.
 */
export function fireWinConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#a855f7', '#facc15', '#34d399'],
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#60a5fa', '#f472b6', '#fb923c'],
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/**
 * A small pop of confetti - for quick correct answers.
 */
export function fireQuickPop() {
  confetti({
    particleCount: 40,
    spread: 50,
    origin: { y: 0.7 },
    scalar: 0.9,
    colors: ['#a855f7', '#facc15', '#34d399', '#60a5fa'],
  });
}
