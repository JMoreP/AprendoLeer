// ── Actividad 3: Reconocimiento de Palabras — Escritura ──────────────────────
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityHeader from '../../components/UI/ActivityHeader';
import SuccessModal from '../../components/UI/SuccessModal';
import WorldBackground from '../../components/UI/WorldBackground';
import { useGameStore } from '../../store/gameStore';
import { WORDS, getWordsByLevel, normalizeWord } from '../../data/words';
import { speakWord, playInstructionAndWait, stopAllAudio, playSuccess, playError, playHint } from '../../utils/audio';

const QUESTIONS_PER_ROUND = 8;

export default function Activity3() {
  const addEnergy = useGameStore((s) => s.addEnergy);
  const loseEnergy = useGameStore((s) => s.loseEnergy);
  const addScore = useGameStore((s) => s.addScore);
  const completeActivity = useGameStore((s) => s.completeActivity);
  const addMistake = useGameStore((s) => s.addMistake);
  const addSuccess = useGameStore((s) => s.addSuccess);
  const recordActivityProgress = useGameStore((s) => s.recordActivityProgress);

  const [level, setLevel] = useState(1);
  const [word, setWord] = useState(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [count, setCount] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionMistakes, setSessionMistakes] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef(null);
  const isMounted = useRef(true);

  const getPoolForLevel = useCallback((lv) => {
    const pool = getWordsByLevel(lv);
    return pool.length ? pool : WORDS;
  }, []);

  const nextWord = useCallback(async (lv = level, isFirstLoad = false) => {
    const pool = getPoolForLevel(lv);
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setWord(chosen);
    setInput('');
    setFeedback(null);
    setAttempts(0);
    setShowHint(false);

    if (isFirstLoad === true) {
      await playInstructionAndWait(3);
      await new Promise((r) => setTimeout(r, 2000));
    } else {
      await new Promise((r) => setTimeout(r, 300));
    }

    if (!isMounted.current) return;

    speakWord(chosen.audio);
    inputRef.current?.focus();
  }, [level, getPoolForLevel]);

  useEffect(() => {
    isMounted.current = true;
    recordActivityProgress(3, 0);
    nextWord(1, true);

    return () => {
      isMounted.current = false;
      stopAllAudio();
    };
  }, []);

  const handleCheck = async () => {
    if (!word || !input.trim()) return;
    const normalized = normalizeWord(input);
    if (normalized === word.word) {
      setFeedback('correct');

      await Promise.all([playSuccess(), new Promise((r) => setTimeout(r, 1000))]);
      if (!isMounted.current) return;

      // Bonus points for fewer attempts
      const pts = attempts === 0 ? 15 : attempts === 1 ? 10 : 5;
      addSuccess();
      await addEnergy(20); addScore(pts); setScore((s) => s + pts);
      const newCount = count + 1;
      setCount(newCount);
      if (newCount >= QUESTIONS_PER_ROUND) {
        setShowSuccess(true);
      } else {
        const newLevel = newCount % 3 === 0 && level < 4 ? level + 1 : level;
        if (newLevel !== level) setLevel(newLevel);
        nextWord(newLevel, false);
      }
    } else {
      setFeedback('wrong');
      addMistake();
      setSessionMistakes((m) => {
        const next = m + 1;
        recordActivityProgress(3, next);
        return next;
      });
      loseEnergy(10);
      setScore((s) => Math.max(0, s - 10));
      setAttempts((a) => {
        const next = a + 1;
        if (next >= 2) {
          setShowHint(true);
          playHint();
        } else {
          playError();
        }
        return next;
      });
      setInput('');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const levelLabels = ['', 'Monosílabas', 'Bisílabas', 'Trisílabas', 'Polisílabas'];

  return (
    <WorldBackground activityId={3}>
      <div className="p-4">
        <div className="max-w-xl mx-auto">
          <ActivityHeader
            title="✏️ Reconocimiento de Palabras"
            onPlayAudio={() => word && speakWord(word.audio)}
          />

          <div className="flex justify-between mb-4 text-sm font-bold text-gray-500">
            <span>Nivel {level}: {levelLabels[level]}</span>
            <span>{count}/{QUESTIONS_PER_ROUND} palabras</span>
          </div>
          <div className="flex gap-2 mb-8">
            {Array.from({ length: QUESTIONS_PER_ROUND }).map((_, i) => (
              <div key={i} className={`h-3 flex-1 rounded-full ${i < count ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            ))}
          </div>

          {/* Main card */}
          <motion.div
            key={word?.word}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-6 mb-6"
          >
            <p className="text-gray-500 font-semibold text-center mb-4">
              Escucha la palabra y escríbela:
            </p>

            {/* Play button */}
            <div className="flex justify-center mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => word && speakWord(word.audio)}
                className="bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-3xl px-8 py-5 shadow-xl flex items-center gap-3 text-2xl font-black"
              >
                🔊 <span className="text-xl">Escuchar palabra</span>
              </motion.button>
            </div>

            {/* Hint (emoji hint) */}
            <AnimatePresence>
              {showHint && word && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 mb-4 text-center"
                >
                  <span className="text-2xl">💡</span>
                  <p className="text-sm font-semibold text-yellow-700">{word.hint}</p>
                  <p className="text-xs text-yellow-500 font-bold mt-1">
                    Tiene {word.word.length} letras
                  </p>
                  {/* Letter blanks */}
                  <div className="flex gap-2 justify-center mt-2">
                    {word.word.split('').map((ch, i) => (
                      <div key={i} className="w-8 h-8 border-b-4 border-yellow-400 flex items-center justify-center font-black text-yellow-500">
                        {attempts >= 3 ? ch : ''}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              placeholder="Escribe aquí..."
              className={`input-word mb-4 ${feedback === 'wrong' ? 'shake border-red-400' :
                  feedback === 'correct' ? 'border-green-400' : ''
                }`}
              autoComplete="off"
              spellCheck={false}
            />

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleCheck}
                disabled={!input.trim()}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                Comprobar ✅
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => word && speakWord(word.audio)}
                className="bg-green-100 text-green-700 font-bold rounded-2xl px-4 py-3 hover:bg-green-200 transition-colors"
              >
                🔊
              </motion.button>
            </div>
          </motion.div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`text-center text-xl font-black rounded-2xl p-4 ${feedback === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                  }`}
              >
                {feedback === 'correct'
                  ? `¡Correcto! La palabra es "${word?.word}" 🌟`
                  : `¡Casi! Escucha de nuevo e intenta otra vez 🎧`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <SuccessModal
        show={showSuccess}
        message="¡Escritor estrella!"
        subMessage={`Escribiste ${QUESTIONS_PER_ROUND} palabras. Puntaje: ${score}`}
        onContinue={() => { completeActivity(3, score, sessionMistakes); setShowSuccess(false); setCount(0); setScore(0); setSessionMistakes(0); setLevel(1); nextWord(1, false); }}
      />
    </WorldBackground>
  );
}
