// ── SoundManager.js ────────────────────────────────────────────────────────────
// Lightweight sound system using the Web Audio API for short synth sounds.
// No external .mp3 files needed – sounds are generated procedurally.

const audioCtx = (() => {
  try { return new (window.AudioContext || window.webkitAudioContext)(); }
  catch { return null; }
})();

let muted = false;

export function toggleMute() {
  muted = !muted;
  return muted;
}

export function isMuted() { return muted; }

/**
 * Plays a short synth tone.
 * @param {number} frequency - Hz
 * @param {number} duration  - seconds
 * @param {string} type      - OscillatorType ('sine'|'square'|'triangle'|'sawtooth')
 * @param {number} gain      - 0–1
 */
function playTone(frequency, duration, type = 'sine', gain = 0.35) {
  if (muted || !audioCtx) return;
  try {
    const osc  = audioCtx.createOscillator();
    const vol  = audioCtx.createGain();
    osc.connect(vol);
    vol.connect(audioCtx.destination);
    osc.type      = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    vol.gain.setValueAtTime(gain, audioCtx.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn('SoundManager:', e);
  }
}

/** Happy "ding" for a correct answer */
export function playCorrect() {
  playTone(523.25, 0.12, 'sine', 0.4); // C5
  setTimeout(() => playTone(659.25, 0.18, 'sine', 0.35), 100); // E5
  setTimeout(() => playTone(783.99, 0.25, 'sine', 0.30), 200); // G5
}

/** Sad "boop" for a wrong answer */
export function playWrong() {
  playTone(250, 0.15, 'sawtooth', 0.3);
  setTimeout(() => playTone(200, 0.25, 'sawtooth', 0.25), 130);
}

/** Short click for UI interactions */
export function playClick() {
  playTone(880, 0.06, 'sine', 0.2);
}

/** Victory fanfare when completing an activity */
export function playVictory() {
  const notes = [
    [523.25, 0], [659.25, 120], [783.99, 240],
    [1046.5, 360], [783.99, 480], [1046.5, 560],
  ];
  notes.forEach(([hz, delay]) =>
    setTimeout(() => playTone(hz, 0.22, 'triangle', 0.4), delay)
  );
}

/** Star earned jingle */
export function playStar() {
  const notes = [[880, 0], [988, 80], [1108, 160], [1320, 240]];
  notes.forEach(([hz, delay]) =>
    setTimeout(() => playTone(hz, 0.15, 'sine', 0.3), delay)
  );
}
