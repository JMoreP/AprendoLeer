// ── Main Menu ──────────────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import EnergyBar from './UI/EnergyBar';
import { playClick } from '../utils/SoundManager';

const ACTIVITIES = [
  {
    id: 1, route: '/actividad/1',
    title: 'Reconocimiento de Letras',
    desc: 'Escucha el sonido y selecciona la letra correcta',
    icon: '🔤', color: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-50', border: 'border-violet-200',
    num: '01',
  },
  {
    id: 2, route: '/actividad/2',
    title: 'Reconocimiento de Sonidos',
    desc: 'Arrastra las letras para formar sílabas',
    icon: '🎵', color: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-50', border: 'border-sky-200',
    num: '02',
  },
  {
    id: 3, route: '/actividad/3',
    title: 'Reconocimiento de Palabras',
    desc: 'Escucha y escribe la palabra que oyes',
    icon: '✏️', color: 'from-green-400 to-emerald-500',
    bg: 'bg-green-50', border: 'border-green-200',
    num: '03',
  },
  {
    id: 4, route: '/actividad/4',
    title: 'Escribo el Nombre',
    desc: 'Mira las imágenes y escribe su nombre',
    icon: '🖼️', color: 'from-orange-400 to-amber-500',
    bg: 'bg-orange-50', border: 'border-orange-200',
    num: '04',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 14 } },
};

export default function MainMenu() {
  const navigate = useNavigate();
  const playerName = useGameStore((s) => s.playerName);
  const energy = useGameStore((s) => s.energy);
  const stars = useGameStore((s) => s.stars);
  const score = useGameStore((s) => s.score);
  const activityProgress = useGameStore((s) => s.activityProgress);
  const resetAll = useGameStore((s) => s.resetAll);
  const setPlayerName = useGameStore((s) => s.setPlayerName);

  const completedCount = Object.values(activityProgress).filter((a) => a.completed).length;

  const handleNav = (route) => {
    playClick();
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 via-purple-50 to-indigo-100">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="bg-white shadow-md px-4 sm:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-primary-700">📚 ¡Aprendo Jugando!</h1>
            <p className="text-sm text-gray-400 font-semibold">Hola, {playerName} 👋</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-400">Puntos</p>
              <motion.p
                key={score}
                initial={{ scale: 1.4, color: '#7c3aed' }}
                animate={{ scale: 1, color: '#7c3aed' }}
                className="font-black text-primary-600 text-lg"
              >
                {score}
              </motion.p>
            </div>
            <button
              onClick={() => { playClick(); navigate('/'); }}
              className="text-xs text-gray-400 hover:text-primary-400 transition-colors font-semibold"
            >
              Salir
            </button>
          </div>
        </div>
        {/* Energy bar in header */}
        <div className="max-w-3xl mx-auto mt-3">
          <EnergyBar energy={energy} stars={stars} />
        </div>
      </header>

      {/* ── Progress Banner ────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-3xl p-5 text-white shadow-xl mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-purple-200 text-sm">Tu progreso</p>
              <p className="text-2xl font-black">{completedCount}/4 actividades</p>
            </div>
            <motion.div
              className="text-5xl"
              animate={{ rotate: completedCount === 4 ? [0, -15, 15, -10, 10, 0] : 0 }}
              transition={{ duration: 0.6 }}
            >
              {completedCount === 4 ? '🏆' : completedCount >= 2 ? '🌟' : '🎯'}
            </motion.div>
          </div>
          {/* Progress dots */}
          <div className="flex gap-2 mt-3">
            {ACTIVITIES.map((a) => (
              <motion.div
                key={a.id}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${activityProgress[a.id]?.completed ? 'bg-white' : 'bg-white/30'
                  }`}
                animate={activityProgress[a.id]?.completed ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Activity Cards ──────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 pb-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {ACTIVITIES.map((act) => {
            const done = activityProgress[act.id]?.completed;
            return (
              <motion.button
                key={act.id}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNav(act.route)}
                className={`${act.bg} ${act.border} border-2 rounded-3xl p-5 text-left shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden`}
              >
                {/* Completed badge */}
                {done && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                  >
                    ✓ Completada
                  </motion.div>
                )}

                {/* Level number watermark */}
                <span className="absolute bottom-2 right-4 text-6xl font-black opacity-5 select-none pointer-events-none">
                  {act.num}
                </span>

                {/* Gradient icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${act.color} flex items-center justify-center text-3xl shadow-lg mb-3`}>
                  {act.icon}
                </div>

                <p className="text-xs font-bold text-gray-400 mb-1">Nivel {act.id}</p>
                <h2 className="text-lg font-black text-gray-800 leading-tight mb-1">
                  {act.title}
                </h2>
                <p className="text-sm text-gray-500 font-semibold">{act.desc}</p>

                {/* Stars earned */}
                {done && (
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: activityProgress[act.id]?.starsEarned || 1 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-yellow-400"
                      >
                        ⭐
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}
