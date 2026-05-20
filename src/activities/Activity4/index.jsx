// ── Actividad 4: Escribo el Nombre de las Imágenes ───────────────────────────
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityHeader from '../../components/UI/ActivityHeader';
import SuccessModal   from '../../components/UI/SuccessModal';
import WorldBackground from '../../components/UI/WorldBackground';
import { useGameStore } from '../../store/gameStore';
import { getRandomImages } from '../../data/images';
import { normalizeWord } from '../../data/words';
import { speakWord, playInstructionAndWait, stopAllAudio, playSuccess, playHint } from '../../utils/audio';

const IMAGES_PER_ROUND = 4;

export default function Activity4() {
  const addEnergy  = useGameStore((s) => s.addEnergy);
  const loseEnergy = useGameStore((s) => s.loseEnergy);
  const addScore   = useGameStore((s) => s.addScore);
  const completeActivity = useGameStore((s) => s.completeActivity);

  const [images,   setImages]   = useState([]);
  const [answers,  setAnswers]  = useState({}); // { id: inputValue }
  const [feedback, setFeedback] = useState({}); // { id: 'correct'|'wrong'|null }
  const [round,    setRound]    = useState(1);
  const [score,    setScore]    = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const isMounted = useRef(true);

  const initRound = async (isFirstLoad = false) => {
    const imgs = getRandomImages(IMAGES_PER_ROUND);
    setImages(imgs);
    setAnswers(Object.fromEntries(imgs.map((i) => [i.id, ''])));
    setFeedback(Object.fromEntries(imgs.map((i) => [i.id, null])));

    if (isFirstLoad === true) {
      await playInstructionAndWait(4);
    }
  };

  useEffect(() => { 
    isMounted.current = true;
    initRound(true); 
    
    return () => {
      isMounted.current = false;
      stopAllAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (id, value) => {
    setAnswers((a) => ({ ...a, [id]: value.toUpperCase() }));
    // Clear feedback on new input
    setFeedback((f) => ({ ...f, [id]: null }));
  };

  const handleCheck = async (id, answer) => {
    const img = images.find((i) => i.id === id);
    if (!img) return;
    const correct = normalizeWord(answer) === normalizeWord(img.answer);
    setFeedback((f) => ({ ...f, [id]: correct ? 'correct' : 'wrong' }));
    
    if (correct) {
      await playSuccess();
      if (!isMounted.current) return;
      
      await addEnergy(20); addScore(15); setScore((s) => s + 15);
      speakWord(img.answer.toLowerCase());
    } else {
      playHint();
      loseEnergy(10);
    }
  };

  const handleCheckAll = () => {
    images.forEach((img) => {
      if (feedback[img.id] !== 'correct') {
        handleCheck(img.id, answers[img.id] || '');
      }
    });
  };

  const allCorrect = images.length > 0 && images.every((img) => feedback[img.id] === 'correct');

  useEffect(() => {
    if (allCorrect && images.length > 0) {
      setTimeout(() => setShowSuccess(true), 800);
    }
  }, [feedback, allCorrect]);

  const bgColors = [
    'from-violet-300 to-purple-400',
    'from-sky-300 to-blue-400',
    'from-green-300 to-emerald-400',
    'from-orange-300 to-amber-400',
  ];

  return (
    <WorldBackground activityId={4}>
      <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <ActivityHeader title="🖼️ Escribo el Nombre" />

        <p className="text-center text-gray-500 font-semibold mb-6">
          Mira las imágenes y escribe el nombre de cada una:
        </p>

        {/* Image grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {images.map((img, i) => {
            const fb = feedback[img.id];
            return (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                className={`bg-white rounded-3xl shadow-xl p-4 border-4 transition-all duration-300 ${
                  fb === 'correct' ? 'border-green-400 shadow-green-200/50' :
                  fb === 'wrong'   ? 'border-red-300   shake' :
                                     'border-transparent'
                }`}
              >
                {/* Emoji image */}
                <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${bgColors[i % bgColors.length]} flex items-center justify-center mb-3 shadow-inner`}>
                  <motion.span
                    animate={fb === 'correct' ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-7xl md:text-8xl select-none"
                  >
                    {img.emoji}
                  </motion.span>
                </div>

                {/* ✓ badge */}
                {fb === 'correct' && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-black"
                  >
                    ✓
                  </motion.div>
                )}

                {/* Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={answers[img.id] || ''}
                    onChange={(e) => handleChange(img.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheck(img.id, answers[img.id])}
                    placeholder="¿Qué es?"
                    disabled={fb === 'correct'}
                    className={`input-word text-xl w-full ${
                      fb === 'correct' ? 'bg-green-50 border-green-400 text-green-600' :
                      fb === 'wrong'   ? 'border-red-400' : ''
                    }`}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {fb === 'wrong' && (
                    <p className="text-xs text-red-400 font-bold mt-1 text-center">
                      Pista: {img.hint}
                    </p>
                  )}
                </div>

                {/* Check button */}
                {fb !== 'correct' && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCheck(img.id, answers[img.id])}
                    className="mt-2 w-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold rounded-xl py-2 text-sm transition-colors"
                  >
                    Verificar ✅
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Check all button */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleCheckAll}
          className="btn-primary w-full text-lg mb-4"
        >
          ¡Verificar todo! 🎯
        </motion.button>

        {/* Progress */}
        <div className="text-center text-gray-500 font-semibold">
          {images.filter((i) => feedback[i.id] === 'correct').length}/{images.length} correctas
        </div>
      </div>

      </div>

      <SuccessModal
        show={showSuccess}
        message="¡Todas correctas!"
        subMessage={`Escribiste ${IMAGES_PER_ROUND} nombres. Puntaje: ${score}`}
        onContinue={() => {
          completeActivity(4, score);
          setShowSuccess(false);
          setRound((r) => r + 1);
          setScore(0);
          initRound(false);
        }}
      />
    </WorldBackground>
  );
}
