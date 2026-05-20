// ── Activity Header (EnergyBar + Back button) ─────────────────────────────────
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2 } from 'lucide-react';
import EnergyBar from './EnergyBar';
import { useGameStore } from '../../store/gameStore';

export default function ActivityHeader({ title, onPlayAudio }) {
  const navigate = useNavigate();
  const energy = useGameStore((s) => s.energy);
  const stars = useGameStore((s) => s.stars);

  return (
    <div className="w-full mb-6">
      {/* Top row: back + title + audio — frosted glass for world backgrounds */}
      <div className="flex items-center gap-4 mb-3 bg-black/30 backdrop-blur-md rounded-2xl px-3 py-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/menu')}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors flex-shrink-0"
        >
          <ArrowLeft size={20} />
        </motion.button>

        <h1 className="flex-1 text-xl md:text-2xl font-black text-white drop-shadow truncate">
          {title}
        </h1>

        {onPlayAudio && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onPlayAudio}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors flex-shrink-0"
          >
            <Volume2 size={20} />
          </motion.button>
        )}
      </div>

      {/* Energy bar — also frosted */}
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-3 py-2">
        <EnergyBar energy={energy} stars={stars} />
      </div>
    </div>
  );
}
