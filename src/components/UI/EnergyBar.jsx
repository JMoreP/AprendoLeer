// ── EnergyBar Component ────────────────────────────────────────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Volume2, VolumeX } from 'lucide-react';
import { toggleMute, isMuted } from '../../utils/SoundManager';

export default function EnergyBar({ energy = 0, stars = 0 }) {
  const pct = Math.max(0, Math.min(100, energy));
  const [muted, setMuted] = useState(isMuted());

  const barColor =
    pct < 30 ? 'from-red-400 to-orange-400' :
      pct < 60 ? 'from-yellow-400 to-amber-400' :
        'from-green-400 to-emerald-400';

  const glowColor =
    pct < 30 ? 'rgba(248,113,113,0.6)' :
      pct < 60 ? 'rgba(250,204,21,0.6)' :
        'rgba(52,211,153,0.6)';

  const handleToggleMute = () => {
    const nowMuted = toggleMute();
    setMuted(nowMuted);
  };

  return (
    <div className="flex items-center gap-3 w-full">

      {/* Zap icon – pulses when high energy */}
      <motion.div
        animate={{ scale: pct > 80 ? [1, 1.3, 1] : 1 }}
        transition={{ repeat: Infinity, duration: 0.6 }}
      >
        <Zap
          size={24}
          className={pct > 50 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}
        />
      </motion.div>

      {/* Bar container */}
      <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner relative">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            boxShadow: pct > 30 ? `0 0 10px 2px ${glowColor}` : 'none',
          }}
        >
          {/* Shimmer effect */}
          {pct > 0 && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            />
          )}
        </motion.div>

        {/* Percentage label */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 mix-blend-multiply select-none">
          {pct}%
        </span>
      </div>

      {/* Stars counter */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stars}
          initial={{ scale: 1.6, color: '#facc15' }}
          animate={{ scale: 1, color: '#facc15' }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="flex items-center gap-1 font-bold text-sm text-yellow-400"
        >
          <span>⭐</span>
          <span>{stars}</span>
        </motion.div>
      </AnimatePresence>

      {/* Mute toggle */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleToggleMute}
        title={muted ? 'Activar sonido' : 'Silenciar'}
        className="text-gray-400 hover:text-primary-500 transition-colors"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </motion.button>
    </div>
  );
};
