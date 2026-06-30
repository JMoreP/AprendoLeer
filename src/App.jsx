// ── App Router ────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { auth } from './firebase';

import LoginScreen from './components/Auth/LoginScreen';
import TeacherAuth from './components/Auth/TeacherAuth';
import TeacherDashboard from './components/Auth/TeacherDashboard';
import MainMenu from './components/MainMenu';
import Activity1 from './activities/Activity1';
import Activity2 from './activities/Activity2';
import Activity3 from './activities/Activity3';
import Activity4 from './activities/Activity4';
import BackgroundMusic from './components/UI/BackgroundMusic';

function RequireAuth({ children }) {
  const playerName = useGameStore((s) => s.playerName);
  if (!playerName) return <Navigate to="/" replace />;
  return children;
}

function RequireUnlocked({ activityId, children }) {
  const isActivityUnlocked = useGameStore((s) => s.isActivityUnlocked);
  if (!isActivityUnlocked(activityId)) return <Navigate to="/menu" replace />;
  return children;
}

export default function App() {
  const setParentUid = useGameStore((s) => s.setParentUid);
  const [isFirebaseLoaded, setIsFirebaseLoaded] = useState(false);
  const [teacherLoggedIn, setTeacherLoggedIn] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Manejar el resultado de la redirección de Google
    getRedirectResult(auth)
      .then((result) => {
        if (result) console.log("Sesión de Google completada:", result.user.email);
      })
      .catch((error) => {
        console.error("Error en redirección de Google:", error);
        setAuthError(error.message);
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("App: Profesor autenticado:", user.email);
        setParentUid(user.uid);
        setTeacherLoggedIn(true);
      } else {
        setParentUid(null);
        setTeacherLoggedIn(false);
      }
      setIsFirebaseLoaded(true);
    });
    return () => unsubscribe();
  }, [setParentUid]);

  if (!isFirebaseLoaded) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold animate-pulse">Cargando aplicación...</div>;
  }

  return (
    <BrowserRouter>
      <BackgroundMusic />
      <Routes>
        {/* Welcome / Login Screen */}
        <Route
          path="/"
          element={<LoginScreen />}
        />

        {/* Zona Profesores */}
        <Route
          path="/teacher"
          element={teacherLoggedIn ? <TeacherDashboard /> : <TeacherAuth />}
        />

        {/* Main menu */}
        <Route path="/menu" element={
          <RequireAuth><MainMenu /></RequireAuth>
        } />

        {/* Activities */}
        <Route path="/actividad/1" element={<RequireAuth><Activity1 /></RequireAuth>} />
        <Route path="/actividad/2" element={<RequireAuth><RequireUnlocked activityId={2}><Activity2 /></RequireUnlocked></RequireAuth>} />
        <Route path="/actividad/3" element={<RequireAuth><RequireUnlocked activityId={3}><Activity3 /></RequireUnlocked></RequireAuth>} />
        <Route path="/actividad/4" element={<RequireAuth><RequireUnlocked activityId={4}><Activity4 /></RequireUnlocked></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
