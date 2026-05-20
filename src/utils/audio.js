// ── Audio helper using Local Audio Files exclusively ────────────

// Objeto para almacenar audios cacheados
const audioCache = {};

// Mantener registro del audio que está sonando actualmente
let currentPlayingAudio = null;
let currentFeedbackAudio = null; // Canal paralelo para no interrumpirse con instrucciones

// Detener de inmediato cualquier pista en ejecución y limpiar
export function stopAllAudio() {
  if (currentPlayingAudio) {
    currentPlayingAudio.pause();
    currentPlayingAudio.currentTime = 0;
  }
  if (currentFeedbackAudio) {
    currentFeedbackAudio.pause();
    currentFeedbackAudio.currentTime = 0;
  }
}

/**
 * Reproduce exclusivamente el archivo de audio local grabado.
 */
async function playLocalAudio(url) {
  try {
    // Si ya hay un audio sonando, lo detenemos para que no se superpongan
    if (currentPlayingAudio) {
      currentPlayingAudio.pause();
      currentPlayingAudio.currentTime = 0;
    }

    let audio = audioCache[url];

    if (!audio) {
      audio = new Audio(url);
      audioCache[url] = audio;
    }

    // Lo guardamos como el audio activo
    currentPlayingAudio = audio;

    // Reiniciar si ya estaba reproduciendo
    audio.currentTime = 0;

    await audio.play();
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.warn(`[Audio Missing] No se encontró el audio local: ${url}`, error);
    }
  }
}

/**
 * Reproduce audios de recompensas/feedback y devuelve Promise para que el UI espere.
 */
async function playFeedbackAudio(url) {
  return new Promise((resolve) => {
    if (currentFeedbackAudio) {
      currentFeedbackAudio.pause();
      currentFeedbackAudio.currentTime = 0;
    }
    let audio = audioCache[url];
    if (!audio) {
      audio = new Audio(url);
      audioCache[url] = audio;
    }
    currentFeedbackAudio = audio;
    audio.currentTime = 0;

    audio.onended = () => {
      audio.onended = null;
      audio.onerror = null;
      resolve();
    };

    audio.onerror = (e) => {
      console.warn(`[Feedback Audio Missing] Falta el archivo: ${url}`, e);
      audio.onended = null;
      audio.onerror = null;
      resolve();
    };

    audio.play().catch((err) => {
      if (err.name !== 'AbortError') {
        console.warn(`No se pudo auto-reproducir feedback ${url}`, err);
      }
      audio.onended = null;
      audio.onerror = null;
      resolve();
    });
  });
}

// ── Exportadas para integrarse en el código sin cambiar los parámetros de envio ──

/**
 * Reproduce un audio de instrucciones y bloquea la ejecución del nivel hasta que termina de hablar.
 */
export async function playInstructionAndWait(actNumber) {
  return new Promise((resolve) => {
    const url = `/audio/instrucciones/instruccion_act${actNumber}.aac`;

    if (currentPlayingAudio) {
      currentPlayingAudio.pause();
      currentPlayingAudio.currentTime = 0;
    }

    let audio = audioCache[url];
    if (!audio) {
      audio = new Audio(url);
      audioCache[url] = audio;
    }

    currentPlayingAudio = audio;
    audio.currentTime = 0;

    audio.onended = () => {
      audio.onended = null;
      audio.onerror = null;
      resolve();
    };

    audio.onerror = (e) => {
      console.warn(`[Audio Missing] Falta el audio de instrucción: ${url}`, e);
      audio.onended = null;
      audio.onerror = null;
      resolve();
    };

    audio.play().catch((err) => {
      if (err.name === 'AbortError') {
        return;
      }
      console.warn(`No se pudo auto-reproducir instrucción ${url}`, err);
      audio.onended = null;
      audio.onerror = null;
      resolve();
    });
  });
}

let successCount = 0;

export async function playSuccess() {
  successCount++;
  // Solo reproducimos cada 4 aciertos
  if (successCount % 4 === 0) {
    const file = Math.random() < 0.5 ? 'acierto_1' : 'acierto_2';
    return playFeedbackAudio(`/audio/feedback/${file}.aac`);
  }
  return Promise.resolve(); // Resuelve inmediatamente si no suena
}

export function playError() {
  return playFeedbackAudio('/audio/feedback/error_guia.aac');
}

export function playHint() {
  return playFeedbackAudio('/audio/feedback/pista_audio.aac');
}

export function playActivityEnd() {
  return playFeedbackAudio('/audio/feedback/final_actividad.aac');
}

export function playEnergyBurst() {
  return playFeedbackAudio('/audio/feedback/ganar_energia.aac');
}

export function speakLetter(char, _phonetic) {
  const url = `/audio/letras/${char.toLowerCase()}.aac`;
  playLocalAudio(url);
}

export function speakWord(word) {
  const url = `/audio/palabras/${word.toLowerCase()}.aac`;
  playLocalAudio(url);
}

export function speakSyllable(syllable) {
  const url = `/audio/silabas/${syllable.toLowerCase()}.aac`;
  playLocalAudio(url);
}

export function speakSentence(id, _sentence) {
  const url = `/audio/oraciones/${id}.aac`;
  playLocalAudio(url);
}

