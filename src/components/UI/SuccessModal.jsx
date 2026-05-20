// ── Success Modal with Confetti ────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import { playActivityEnd } from '../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

const CONFETTI_COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
  '#c77dff', '#ff9f43', '#00d2d3', '#ff6b81',
];

function Confetti() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left:  `${Math.random() * 100}%`,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1.5,
    size: 8 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left:             p.left,
            top:              '-20px',
            width:            p.size,
            height:           p.size,
            backgroundColor:  p.color,
            borderRadius:     Math.random() > 0.5 ? '50%' : '2px',
            animationDuration:`${p.duration}s`,
            animationDelay:   `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function SuccessModal({ show, message, subMessage, onContinue }) {
  useEffect(() => {
    if (show) {
      playActivityEnd();
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <>
          <Confetti />
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 40 }}
              animate={{ scale: 1,   opacity: 1, y: 0 }}
              exit={{    scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              {/* Trophy */}
              <motion.div
                animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="text-7xl mb-4"
              >
                🏆
              </motion.div>

              <h2 className="text-3xl font-black text-primary-600 mb-2">
                {message || '¡Excelente!'}
              </h2>
              {subMessage && (
                <p className="text-gray-500 font-semibold mb-6">{subMessage}</p>
              )}

              {/* Stars */}
              <div className="flex justify-center gap-2 mb-6">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
                    className="text-4xl star-animate"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onContinue}
                className="btn-primary w-full text-lg"
              >
                ¡Continuar! 🚀
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
