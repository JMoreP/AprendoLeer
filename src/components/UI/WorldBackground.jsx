// ── WorldBackground — Themed backgrounds per activity ─────────────────────────
import worldForest from '../../assets/world_forest.webp';
import worldSpace from '../../assets/world_space.webp';
import worldOcean from '../../assets/world_ocean.webp';
import worldDesert from '../../assets/world_desert.webp';
import worldCandy from '../../assets/world_candy.webp';

// One world per activity ID (1–5)
export const WORLDS = {
  1: {
    image: worldForest,
    overlay: 'rgba(30, 10, 60, 0.45)',
    accent: '#a855f7',
  },
  2: {
    image: worldSpace,
    overlay: 'rgba(5, 10, 40, 0.50)',
    accent: '#38bdf8',
  },
  3: {
    image: worldOcean,
    overlay: 'rgba(0, 30, 60, 0.45)',
    accent: '#34d399',
  },
  4: {
    image: worldDesert,
    overlay: 'rgba(60, 30, 0, 0.40)',
    accent: '#fbbf24',
  },
  5: {
    image: worldCandy,
    overlay: 'rgba(60, 0, 40, 0.35)',
    accent: '#f472b6',
  },
};

/**
 * Renders a fullscreen world-themed background.
 * Wrap the activity content inside this.
 * @param {number} activityId - 1 to 5
 * @param {React.ReactNode} children
 */
export default function WorldBackground({ activityId, children }) {
  const world = WORLDS[activityId];

  if (!world) {
    // Fallback for unknown activity
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-100 to-purple-50">
        {children}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image layer */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${world.image})` }}
      />
      {/* Dark overlay for readability */}
      <div
        className="fixed inset-0"
        style={{ background: world.overlay }}
      />

      {/* Content on top */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
