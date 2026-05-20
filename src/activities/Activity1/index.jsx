// ── Actividad 1: Reconocimiento de Letras ────────────────────────────────────
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityHeader from '../../components/UI/ActivityHeader';
import SuccessModal from '../../components/UI/SuccessModal';
import WorldBackground from '../../components/UI/WorldBackground';
import { useGameStore } from '../../store/gameStore';
import { LETTERS, LETTER_LEVELS, generateLetterOptions, shuffleArray } from '../../data/letters';
import { speakLetter, playInstructionAndWait, stopAllAudio, playSuccess, playError } from '../../utils/audio';

const QUESTIONS_PER_ROUND = 8;

export default function Activity1() {
  const addEnergy = useGameStore((s) => s.addEnergy);
  const loseEnergy = useGameStore((s) => s.loseEnergy);
  const addScore = useGameStore((s) => s.addScore);
  const completeActivity = useGameStore((s) => s.completeActivity);

  const [level, setLevel] = useState(1);
  const levelRef = useRef(1);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [wrongLetter, setWrongLetter] = useState(null);
  const [count, setCount] = useState(0);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const isMounted = useRef(true);

  // Generate a new question
  const nextQuestion = useCallback(async (isFirstLoad = false) => {
    const pool = LETTER_LEVELS[levelRef.current] || LETTER_LEVELS[1];
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const allChars = shuffleArray(
      LETTERS.filter((l) => l.char !== correct.charAt(0)).map((l) => l.char)
    );
    const opts = generateLetterOptions(correct, allChars.slice(0, 10), 6);
    setQuestion(correct);
    setOptions(opts);
    setFeedback(null);
    setWrongLetter(null);

    // Reproducir la instrucción al entrar y pausar antes de la letra
    if (isFirstLoad === true) {
      await playInstructionAndWait(1);
      await new Promise((r) => setTimeout(r, 2000));
    } else {
      await new Promise((r) => setTimeout(r, 300));
    }

    if (!isMounted.current) return;

    const letterObj = LETTERS.find((l) => l.char === correct);
    if (letterObj) speakLetter(letterObj.char, letterObj.phonetic);
  }, []);

  // Iniciar la primera pregunta al montar el componente con la instrucción
  useEffect(() => {
    isMounted.current = true;
    nextQuestion(true);

    return () => {
      isMounted.current = false;
      stopAllAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = async (letter) => {
    if (feedback) return;
    if (letter === question) {
      setFeedback('correct');
      
      // Evitar empalmes: espera a que termine el audio O 1 segundo, lo que dure más
      await Promise.all([playSuccess(), new Promise((r) => setTimeout(r, 1000))]);
      if (!isMounted.current) return;

      await addEnergy(20);
      addScore(10);
      setScore((s) => s + 10);
      const newCount = count + 1;
      setCount(newCount);
      
      if (newCount >= QUESTIONS_PER_ROUND) {
        setShowSuccess(true);
      } else {
        nextQuestion();
        // Level up every 4 correct
        if (newCount % 4 === 0 && levelRef.current < 4) {
          setLevel((l) => l + 1);
          levelRef.current += 1;
        }
      }
    } else {
      setFeedback('wrong');
      playError();
      setWrongLetter(letter);
      loseEnergy(10);
      setTimeout(() => { 
        if (isMounted.current) {
          setFeedback(null); 
          setWrongLetter(null); 
        }
      }, 900);
    }
  };

  const playCurrentLetter = () => {
    if (!question) return;
    const letterObj = LETTERS.find((l) => l.char === question);
    if (letterObj) speakLetter(letterObj.char, letterObj.phonetic);
  };

  const handleContinue = () => {
    completeActivity(1, score);
    setShowSuccess(false);
    setCount(0);
    setScore(0);
    setLevel(1);
    levelRef.current = 1;
    // Ya no es el FirstLoad, es un salto a nivel 1 de nuevo, pero si quieres la instrucción se la podemos dar. 
    // Lo dejaremos sin instrucción porque "repetir" actividad no suele llevar instrucción de nuevo.
    nextQuestion(false);
  };

  const letterData = (char) => LETTERS.find((l) => l.char === char);

  return (
    <WorldBackground activityId={1}>
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <ActivityHeader
            title="🔤 Reconocimiento de Letras"
            onPlayAudio={playCurrentLetter}
          />

          {/* Level & Count indicator */}
          <div className="flex justify-between mb-4 text-sm font-bold text-gray-500">
            <span>Nivel {level} de 4</span>
            <span>{count}/{QUESTIONS_PER_ROUND} respondidas</span>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mb-8">
            {Array.from({ length: QUESTIONS_PER_ROUND }).map((_, i) => (
              <div
                key={i}
                className={`h-3 flex-1 rounded-full transition-all duration-500 ${i < count ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
              />
            ))}
          </div>

          {/* Instruction card */}
          <motion.div
            key={question}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6 text-center mb-8"
          >
            <p className="text-gray-500 font-semibold mb-4">Escucha la letra y selecciona la correcta:</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playCurrentLetter}
              className="bg-gradient-to-br from-primary-400 to-purple-500 text-white rounded-3xl px-10 py-6 text-6xl font-black shadow-2xl shadow-primary-300/50 flex items-center gap-4 mx-auto"
            >
              <span>🔊</span>
              <span className="text-3xl font-bold">Escuchar</span>
            </motion.button>
          </motion.div>

          {/* Letter options */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 display-flex justify-items-center">
            <AnimatePresence>
              {options.map((char, i) => {
                const ld = letterData(char) || { color: 'bg-gray-400', textColor: 'text-white' };
                const isWrong = wrongLetter === char && feedback === 'wrong';
                const isRight = char === question && feedback === 'correct';
                return (
                  <motion.button
                    key={`${char}-${i}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07, type: 'spring', damping: 12 }}
                    whileHover={{ scale: 1.08, y: -4 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleSelect(char)}
                    className={`letter-btn ${ld.color} ${ld.textColor}
                    ${isRight ? 'ring-4 ring-green-400 scale-110 shadow-green-300/50 shadow-2xl' : ''}
                    ${isWrong ? 'shake ring-4 ring-red-400' : ''}
                  `}
                  >
                    {char}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Feedback message */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-6 text-center text-2xl font-black rounded-2xl p-4 ${feedback === 'correct'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-500'
                  }`}
              >
                {feedback === 'correct' ? '¡Excelente! 🌟 +20% energía' : '¡Inténtalo de nuevo! 💪'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <SuccessModal
        show={showSuccess}
        message="¡Eres un campeón!"
        subMessage={`Completaste ${QUESTIONS_PER_ROUND} letras. Puntaje: ${score}`}
        onContinue={handleContinue}
      />
    </WorldBackground>
  );
}
