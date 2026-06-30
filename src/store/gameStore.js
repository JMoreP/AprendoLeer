// ── Zustand Game Store ────────────────────────────────────────────────────────
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fireStarConfetti, fireWinConfetti } from '../utils/ConfettiService';
import { playStar, playVictory } from '../utils/SoundManager';
import { playEnergyBurst } from '../utils/audio';
import { saveDailyMetrics, saveGameProgress } from '../firebase';

const STORAGE_KEY = 'juego-educativo-progreso';
export const STARS_TO_UNLOCK = 2;

export const useGameStore = create(
  persist(
    (set, get) => ({
      // ── Player & Parent Auth ────────────────────────────────────────────────
      playerName: '',
      avatar: '🦁',
      setPlayerName: (name) => set({ playerName: name }),
      setAvatar: (av) => set({ avatar: av }),
      parentPin: '1234',
      setParentUid: (uid) => set({ parentUid: uid }),
      setParentPin: (pin) => set({ parentPin: pin }),
      isRegisteredProfile: false, // Flag to indicate if current child is registered in Parent Zone
      setRegisteredProfile: (val) => set({ isRegisteredProfile: val }),

      // ── Firebase Sync Sincronizador ─────────────────────────────────────────
      syncMetricsToFirebase: () => {
        const s = get();
        // PROGRESS IS ONLY SAVED IF CHILD IS REGISTERED (isRegisteredProfile === true)
        if (s.parentUid && s.playerName && s.isRegisteredProfile) {
          // Guardar métricas diarias (historial de actividad)
          saveDailyMetrics(s.parentUid, s.playerName, {
            stars: s.stars,
            score: s.score,
            energy: s.energy,
            mistakes: s.mistakes,
            successes: s.successes,
            lastPlayed: new Date().toISOString(),
          }).catch((err) => console.error("Error saving metrics:", err));

          // Guardar PROGRESO GLOBAL (Estado actual acumulado)
          saveGameProgress(s.parentUid, s.playerName, {
            stars: s.stars,
            score: s.score,
            mistakes: s.mistakes,
            successes: s.successes,
            activityProgress: s.activityProgress,
            lastUpdated: new Date().toISOString(),
          }).catch((err) => console.error("Error saving full progress:", err));
        }
      },

      loadGameProgress: (data) => {
        if (!data) return;
        set((s) => ({
          stars: data.stars ?? s.stars,
          score: data.score ?? s.score,
          mistakes: data.mistakes ?? s.mistakes,
          successes: data.successes ?? s.successes,
          activityProgress: data.activityProgress ?? s.activityProgress,
          energy: 0, // Opción A: Reiniciar energía al cargar sesión nueva
        }));
      },

      // ── Energy Bar (0–100) ───────────────────────────────────────────────────
      energy: 0,
      addEnergy: async (amount = 20) => {
        let earnedStar = false;
        set((s) => {
          const next = Math.min(100, s.energy + amount);
          earnedStar = next === 100;
          return { energy: earnedStar ? 0 : next, stars: earnedStar ? s.stars + 1 : s.stars };
        });

        get().syncMetricsToFirebase();

        if (earnedStar) {
          // Fire visual confetti immediately
          fireStarConfetti();
          playStar();
          // Wait for the vocal audio to finish before resuming the game flow
          await playEnergyBurst();
        }
      },
      loseEnergy: (amount = 10) => {
        set((s) => ({ energy: Math.max(0, s.energy - amount) }));
        get().syncMetricsToFirebase();
      },
      resetEnergy: () => set({ energy: 0 }),


      // ── Stars, Score, Mistakes & Successes ──────────────────────────────────
      stars: 0,
      score: 0,
      mistakes: 0,
      successes: 0,
      addScore: (points = 10) => {
        set((s) => ({ score: s.score + points }));
        get().syncMetricsToFirebase();
      },
      addMistake: () => {
        set((s) => ({ mistakes: s.mistakes + 1 }));
        get().syncMetricsToFirebase();
      },
      addSuccess: () => {
        set((s) => ({ successes: s.successes + 1 }));
        get().syncMetricsToFirebase();
      },

      // ── Activity Progress ────────────────────────────────────────────────────
      // { activityId: { completed: bool, bestScore: number, starsEarned: number } }
      activityProgress: {},
      recordActivityProgress: (activityId, sessionMistakes) => {
        set((s) => {
          const prog = s.activityProgress[activityId] || { completed: false, bestScore: 0, starsEarned: 3 };
          
          let currentStars = 3;
          if (sessionMistakes >= 6) currentStars = 0;
          else if (sessionMistakes >= 3) currentStars = 1;
          else if (sessionMistakes >= 1) currentStars = 2;

          return {
            activityProgress: {
              ...s.activityProgress,
              [activityId]: {
                ...prog,
                // Only lower stars if it's not completed, or if new stars are somehow better (rare if they make mistakes)
                starsEarned: prog.completed ? Math.max(prog.starsEarned, currentStars) : currentStars,
              }
            }
          };
        });
        get().syncMetricsToFirebase();
      },
      completeActivity: (activityId, scoreEarned, sessionMistakes = 0) => {
        let newStars = 3;
        if (sessionMistakes >= 6) newStars = 0;
        else if (sessionMistakes >= 3) newStars = 1;
        else if (sessionMistakes >= 1) newStars = 2;

        setTimeout(() => { fireWinConfetti(); playVictory(); }, 150);
        set((s) => ({
          activityProgress: {
            ...s.activityProgress,
            [activityId]: {
              completed: true,
              bestScore: Math.max(
                scoreEarned,
                s.activityProgress[activityId]?.bestScore ?? 0
              ),
              starsEarned: Math.max(newStars, s.activityProgress[activityId]?.starsEarned ?? 0),
            },
          },
        }));
        get().syncMetricsToFirebase();
      },

      // ── Activity Unlock Check ─────────────────────────────────────────────
      // Activity 1 always unlocked; Activity N needs Activity N-1 with >= STARS_TO_UNLOCK stars
      isActivityUnlocked: (activityId) => {
        if (activityId <= 1) return true;
        const prev = get().activityProgress[activityId - 1];
        return prev && prev.starsEarned >= STARS_TO_UNLOCK;
      },

      // ── Current Activity State ───────────────────────────────────────────────
      currentActivity: null,
      setCurrentActivity: (id) => set({ currentActivity: id }),

      // ── Audio Settings ─────────────────────────────────────────────────────
      musicEnabled: true,
      toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),

      resetAll: () =>
        set({
          energy: 0,
          stars: 0,
          score: 0,
          mistakes: 0,
          successes: 0,
          activityProgress: {},
          currentActivity: null,
          playerName: '',
          avatar: '🦁',
          parentPin: '1234',
          isRegisteredProfile: false
        }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({
        playerName: s.playerName,
        avatar: s.avatar,
        stars: s.stars,
        score: s.score,
        mistakes: s.mistakes,
        successes: s.successes,
        activityProgress: s.activityProgress,
        parentPin: s.parentPin,
        musicEnabled: s.musicEnabled,
        isRegisteredProfile: s.isRegisteredProfile
      }),
    }
  )
);
