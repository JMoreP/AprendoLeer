// ── Actividad 2: Reconocimiento de Sonidos — Drag & Drop ─────────────────────
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, DragOverlay, useDraggable, useDroppable,
  MouseSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import ActivityHeader from '../../components/UI/ActivityHeader';
import SuccessModal   from '../../components/UI/SuccessModal';
import WorldBackground from '../../components/UI/WorldBackground';
import { useGameStore } from '../../store/gameStore';
import { SYLLABLES, CONSONANT_POOL, VOWELS } from '../../data/syllables';
import { speakSyllable, speakLetter, playInstructionAndWait, stopAllAudio, playSuccess, playError } from '../../utils/audio';

const QUESTIONS_PER_ROUND = 8;

// ── Draggable Letter Tile ────────────────────────────────────────────────────
function DraggableTile({ id, label, color }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = {
    touchAction: 'none', // Crucial para permitir arrastrar en dispositivos móviles sin hacer scroll
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`letter-btn ${color} text-white cursor-grab select-none
        ${isDragging ? 'opacity-30' : 'opacity-100'}`}
    >
      {label}
    </div>
  );
}

// ── Drop Zone ────────────────────────────────────────────────────────────────
function DropZone({ id, value, label }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`w-24 h-24 rounded-3xl border-4 border-dashed flex flex-col items-center justify-center transition-all duration-200
        ${isOver ? 'border-primary-500 bg-primary-50 scale-105' : 'border-gray-300 bg-white'}
        ${value ? 'border-solid border-green-400 bg-green-50' : ''}`}
    >
      {value ? (
        <span className="text-4xl font-black text-green-600">{value}</span>
      ) : (
        <span className="text-gray-300 font-bold text-sm text-center px-1">{label}</span>
      )}
    </div>
  );
}

// ── Main Activity ─────────────────────────────────────────────────────────────
export default function Activity2() {
  const addEnergy  = useGameStore((s) => s.addEnergy);
  const loseEnergy = useGameStore((s) => s.loseEnergy);
  const addScore   = useGameStore((s) => s.addScore);
  const completeActivity = useGameStore((s) => s.completeActivity);

  const [syllable, setSyllable] = useState(null);
  const [consonantTiles, setConsonantTiles] = useState([]);
  const [vowelTiles,     setVowelTiles]     = useState([]);
  const [droppedCons,    setDroppedCons]    = useState(null); // char
  const [droppedVowel,   setDroppedVowel]   = useState(null); // char
  const [activeDrag,     setActiveDrag]     = useState(null);
  const [feedback,       setFeedback]       = useState(null);
  const [count,  setCount]  = useState(0);
  const [score,  setScore]  = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const isMounted = useRef(true);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } })
  );

  const nextSyllable = useCallback(async (isFirstLoad = false) => {
    const syl = SYLLABLES[Math.floor(Math.random() * SYLLABLES.length)];
    setSyllable(syl);
    setDroppedCons(null);
    setDroppedVowel(null);
    setFeedback(null);

    // Build consonant pool (correct + 3 distractors)
    const wrongCons = CONSONANT_POOL
      .filter((c) => c !== syl.consonant)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setConsonantTiles(
      [syl.consonant, ...wrongCons].sort(() => Math.random() - 0.5)
    );

    // Build vowel pool (correct + 2 distractors)
    const wrongVowels = VOWELS
      .filter((v) => v !== syl.vowel)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    setVowelTiles(
      [syl.vowel, ...wrongVowels].sort(() => Math.random() - 0.5)
    );

    if (isFirstLoad === true) {
      await playInstructionAndWait(2);
      await new Promise((r) => setTimeout(r, 2000));
    } else {
      await new Promise((r) => setTimeout(r, 400));
    }

    if (!isMounted.current) return;

    speakSyllable(syl.audio);
  }, []);

  useEffect(() => { 
    isMounted.current = true;
    nextSyllable(true); 
    
    return () => {
      isMounted.current = false;
      stopAllAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!droppedCons || !droppedVowel || !syllable) return;
    const correct = droppedCons === syllable.consonant && droppedVowel === syllable.vowel;
    setFeedback(correct ? 'correct' : 'wrong');
    
    if (correct) {
      (async () => {
        await Promise.all([playSuccess(), new Promise((r) => setTimeout(r, 1000))]);
        if (!isMounted.current) return;

        await addEnergy(20); addScore(10); setScore((s) => s + 10);
        const newCount = count + 1;
        setCount(newCount);
        if (newCount >= QUESTIONS_PER_ROUND) {
          setShowSuccess(true);
        } else {
          nextSyllable();
        }
      })();
    } else {
      playError();
      loseEnergy(10);
      setTimeout(() => {
        setDroppedCons(null);
        setDroppedVowel(null);
        setFeedback(null);
      }, 1000);
    }
  }, [droppedCons, droppedVowel]);

  const handleDragStart  = ({ active }) => setActiveDrag(active.id);
  const handleDragEnd    = ({ active, over }) => {
    setActiveDrag(null);
    if (!over) return;
    const char = active.id.split('|')[1]; // e.g. "cons|M" or "vowel|A"
    const type = active.id.split('|')[0];
    if (over.id === 'drop-consonant' && type === 'cons') setDroppedCons(char);
    if (over.id === 'drop-vowel'     && type === 'vowel') setDroppedVowel(char);
  };

  const TILE_COLORS = {
    cons:  'bg-blue-500',
    vowel: 'bg-rose-500',
  };

  return (
    <WorldBackground activityId={2}>
      <div className="p-4">
      <div className="max-w-xl mx-auto">
        <ActivityHeader
          title="🎵 Reconocimiento de Sonidos"
          onPlayAudio={() => syllable && speakSyllable(syllable.audio)}
        />

        {/* Progress */}
        <div className="flex justify-between mb-4 text-sm font-bold text-gray-500">
          <span>{count}/{QUESTIONS_PER_ROUND} sílabas</span>
        </div>
        <div className="flex gap-2 mb-8">
          {Array.from({ length: QUESTIONS_PER_ROUND }).map((_, i) => (
            <div key={i} className={`h-3 flex-1 rounded-full ${i < count ? 'bg-sky-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Instruction */}
        <div className="bg-white rounded-3xl shadow-xl p-6 text-center mb-6">
          <p className="text-gray-500 font-semibold mb-3">Escucha la sílaba y forma la combinación correcta:</p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => syllable && speakSyllable(syllable.audio)}
            className="bg-gradient-to-br from-sky-400 to-blue-500 text-white rounded-3xl px-8 py-5 text-4xl font-black shadow-xl mx-auto flex items-center gap-3"
          >
            🔊 <span className="text-2xl">Escuchar</span>
          </motion.button>
        </div>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {/* Drop zones */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <p className="text-xs font-bold text-blue-500 mb-2">CONSONANTE</p>
              <DropZone id="drop-consonant" value={droppedCons} label="Suelta aquí" />
            </div>
            <div className="text-4xl font-black text-gray-400">+</div>
            <div className="text-center">
              <p className="text-xs font-bold text-rose-500 mb-2">VOCAL</p>
              <DropZone id="drop-vowel" value={droppedVowel} label="Suelta aquí" />
            </div>
            {(droppedCons || droppedVowel) && (
              <div className="text-center">
                <p className="text-xs font-bold text-green-500 mb-2">RESULTADO</p>
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-4xl font-black text-white shadow-xl">
                  {(droppedCons || '_') + (droppedVowel || '_')}
                </div>
              </div>
            )}
          </div>

          {/* Consonant tiles */}
          <div className="bg-blue-50 rounded-3xl p-4 mb-4">
            <p className="text-xs font-bold text-blue-500 mb-3">Consonantes — arrastra la correcta:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {consonantTiles.map((c) => (
                <DraggableTile key={c} id={`cons|${c}`} label={c} color="bg-blue-500" />
              ))}
            </div>
          </div>

          {/* Vowel tiles */}
          <div className="bg-rose-50 rounded-3xl p-4">
            <p className="text-xs font-bold text-rose-500 mb-3">Vocales — arrastra la correcta:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {vowelTiles.map((v) => (
                <DraggableTile key={v} id={`vowel|${v}`} label={v} color="bg-rose-500" />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeDrag ? (
              <div className={`letter-btn ${TILE_COLORS[activeDrag.split('|')[0]]} text-white opacity-90 dragging-letter`}>
                {activeDrag.split('|')[1]}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`mt-6 text-center text-xl font-black rounded-2xl p-4 ${
                feedback === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
              }`}
            >
              {feedback === 'correct' ? `¡Muy bien! La sílaba es ${syllable?.syllable} 🎉` : '¡Inténtalo de nuevo! Los colores te ayudan 🎨'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      </div>

      <SuccessModal
        show={showSuccess}
        message="¡Eres increíble!"
        subMessage={`Formaste ${QUESTIONS_PER_ROUND} sílabas. Puntaje: ${score}`}
        onContinue={() => { completeActivity(2, score); setShowSuccess(false); setCount(0); setScore(0); nextSyllable(false); }}
      />
    </WorldBackground>
  );
}
