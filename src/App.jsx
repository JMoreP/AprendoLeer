// ── App Router ────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { auth } from './firebase';

import LoginScreen from './components/Auth/LoginScreen';
import ParentAuth from './components/Auth/ParentAuth';
import ParentDashboard from './components/Auth/ParentDashboard';
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

export default function App() {
  const setParentUid = useGameStore((s) => s.setParentUid);
  const [isFirebaseLoaded, setIsFirebaseLoaded] = useState(false);
  const [parentLoggedIn, setParentLoggedIn] = useState(false);
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
        console.log("App: Padre autenticado:", user.email);
        setParentUid(user.uid);
        setParentLoggedIn(true);
      } else {
        setParentUid(null);
        setParentLoggedIn(false);
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

        {/* Zona Padres */}
        <Route
          path="/parent"
          element={parentLoggedIn ? <ParentDashboard /> : <ParentAuth />}
        />

        {/* Main menu */}
        <Route path="/menu" element={
          <RequireAuth><MainMenu /></RequireAuth>
        } />

        {/* Activities */}
        <Route path="/actividad/1" element={<RequireAuth><Activity1 /></RequireAuth>} />
        <Route path="/actividad/2" element={<RequireAuth><Activity2 /></RequireAuth>} />
        <Route path="/actividad/3" element={<RequireAuth><Activity3 /></RequireAuth>} />
        <Route path="/actividad/4" element={<RequireAuth><Activity4 /></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
