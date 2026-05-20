// ── Login / Start Screen ────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { playClick, playCorrect } from '../../utils/SoundManager';
import { getChildrenProfiles, getGameProgress } from '../../firebase';

const AVATARS = ['🦁', '🐸', '🐼', '🦊', '🐨', '🐯', '🐙', '🦋'];

export default function LoginScreen() {
  const storePlayerName = useGameStore((s) => s.playerName);
  const storeAvatar = useGameStore((s) => s.avatar);
  const parentPin = useGameStore((s) => s.parentPin);
  const parentUid = useGameStore((s) => s.parentUid);
  
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const setAvatar = useGameStore((s) => s.setAvatar);
  const musicEnabled = useGameStore((s) => s.musicEnabled);
  const toggleMusic = useGameStore((s) => s.toggleMusic);
  const resetAll = useGameStore((s) => s.resetAll);

  const [showForm, setShowForm] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Perfiles registrados recibidos de Firebase
  const [registeredChildren, setRegisteredChildren] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(storePlayerName || '');
  const [avatar, setLocalAvatar] = useState(storeAvatar || '🦁');
  const navigate = useNavigate();

  // Cargar perfiles si el padre está logueado
  useEffect(() => {
    if (parentUid) {
      getChildrenProfiles(parentUid).then(setRegisteredChildren).catch(console.error);
    }
  }, [parentUid]);

  const handleStart = async (providedChild = null) => {
    const finalChild = providedChild || registeredChildren.find(p => p.name.toLowerCase() === name.trim().toLowerCase());
    
    playCorrect();
    resetAll(); // Limpieza para evitar mezcla de datos

    if (finalChild) {
      // PERFIL REGISTRADO (Se guarda progreso)
      setPlayerName(finalChild.name);
      setAvatar(finalChild.avatar);
      useGameStore.getState().setRegisteredProfile(true);
      
      const cloudProgress = await getGameProgress(parentUid, finalChild.name);
      if (cloudProgress) useGameStore.getState().loadGameProgress(cloudProgress);
    } else {
      // MODO INVITADO (No se guarda)
      setPlayerName(name.trim() || "Invitado");
      setAvatar(avatar);
      useGameStore.getState().setRegisteredProfile(false);
    }

    navigate('/menu');
  };

  const handlePinPress = (num) => {
    if (pinInput.length < 4) {
      const newPin = pinInput + num;
      setPinInput(newPin);
      if (newPin.length === 4) {
        if (newPin === parentPin) {
          setShowPinModal(false);
          setPinInput('');
          navigate('/parent');
        } else {
          setPinError(true);
          setTimeout(() => {
            setPinError(false);
            setPinInput('');
          }, 600);
        }
      }
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 bg-black"
      style={{
        backgroundImage: `url(/custom_space_bg.webp)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Botones Decorativos Superiores */}
      <div className="absolute top-4 left-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { playClick(); toggleMusic(); }}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 font-black text-xl transition-all duration-300 ${musicEnabled
            ? 'bg-cyan-700 border-cyan-500 text-white'
            : 'bg-gray-700 border-gray-500 text-gray-400'
            }`}
        >
          {musicEnabled ? '🎵' : '🔇'}
        </motion.button>
      </div>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-cyan-700 rounded-full flex items-center justify-center shadow-lg border-2 border-cyan-500 text-white font-black text-xl">⚙️</motion.button>
        <div className="flex flex-col items-center cursor-pointer" onClick={() => { playClick(); parentUid ? setShowPinModal(true) : navigate('/parent'); }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-400 text-gray-500 font-black text-2xl">👤</motion.button>
          <span className="text-[10px] text-white font-black opacity-60 mt-1 leading-tight text-center uppercase tracking-tighter">Zona<br />Padres</span>
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mt-[-5vh]">

        {/* Título original */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10 relative"
        >
          <h1
            className="text-5xl md:text-7xl font-black text-blue-100 uppercase tracking-tighter"
            style={{
              WebkitTextStroke: '2px #0284c7',
              textShadow: '0px 4px 0px #0284c7, 0px 8px 15px rgba(0,0,0,0.5)',
              transform: 'rotate(-3deg)'
            }}
          >
            Aprender
            <br />
            A Leer
          </h1>
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -bottom-8 right-10 text-6xl md:text-8xl font-black text-green-400"
            style={{ WebkitTextStroke: '3px white', textShadow: '0px 4px 10px rgba(0,0,0,0.5)' }}
          >
            1
          </motion.div>
        </motion.div>

        {/* Zona Central (Botón Play) */}
        <div className="flex flex-col w-full items-center justify-center px-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { playClick(); handleStart(); }}
            className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-green-300 to-green-500 rounded-full border-4 border-white/80 shadow-[0_0_30px_rgba(74,222,128,0.6)] flex items-center justify-center z-20 group relative"
          >
            <span className="absolute w-full h-full rounded-full bg-green-400 opacity-50 animate-ping z-[-1]"></span>
            <svg viewBox="0 0 24 24" fill="white" className="w-16 h-16 md:w-20 md:h-20 ml-2 drop-shadow-md group-hover:scale-110 transition-transform">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.button>

          {storePlayerName && (
            <div className="mt-6 text-center z-20">
              <p className="text-white font-black text-2xl drop-shadow-md mb-2">¡Hola, <span className="text-green-400">{storeAvatar} {storePlayerName}</span>!</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-white/60 hover:text-white font-bold text-sm underline underline-offset-4"
              >¿No eres tú? Cambiar perfil</button>
            </div>
          )}
          {!storePlayerName && (
             <button
              onClick={() => setShowForm(true)}
              className="mt-8 px-8 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-white font-black text-xs uppercase tracking-widest border border-white/20 hover:bg-white/20"
             >Configurar Niño</button>
          )}
        </div>
      </div>

      {/* MODAL PARA CAMBIAR PERFIL (Aquí integramos los perfiles registrados) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-lg relative overflow-hidden shadow-2xl"
            >
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-6 text-gray-400 font-bold">✕</button>
              
              <h2 className="text-2xl font-black text-cyan-800 text-center mb-6 uppercase tracking-tight">Cambiar Perfil</h2>

              {/* LISTA DE PERFILES REGISTRADOS POR EL PADRE */}
              {registeredChildren.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Tus Niños Registrados (Se guarda progreso)</p>
                  <div className="grid grid-cols-2 gap-4">
                    {registeredChildren.map(child => (
                      <button 
                        key={child.name}
                        onClick={() => handleStart(child)}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-cyan-50 border-2 border-transparent hover:border-cyan-200 transition-all font-bold"
                      >
                        <span className="text-4xl">{child.avatar}</span>
                        <span className="truncate">{child.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* OPCIÓN MANUAL (INVITADO) */}
              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Entrar con otro nombre (Invitado)</p>
                <div className="flex gap-2 mb-4">
                   <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Escribe el nombre..."
                    className="flex-1 p-4 bg-gray-100 rounded-2xl border-none font-bold outline-none focus:ring-2 ring-cyan-500"
                   />
                </div>
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {AVATARS.map(av => (
                    <button key={av} onClick={() => setLocalAvatar(av)} className={`text-2xl p-2 rounded-xl ${avatar === av ? 'bg-cyan-100' : ''}`}>{av}</button>
                  ))}
                </div>
                <button 
                   onClick={() => handleStart()}
                   className="w-full py-4 bg-cyan-600 text-white font-black rounded-2xl shadow-lg"
                >¡Listo! Jugar</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL DE PIN (CONTROL PARENTAL) */}
        {showPinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1, x: pinError ? [0, -10, 10, -10, 10, 0] : 0 }}
              className="bg-slate-800 border-2 border-slate-700 rounded-[2.5rem] p-8 w-full max-w-[320px]"
            >
               <h2 className="text-center text-white font-black uppercase mb-8">PIN Maestro</h2>
               <div className="flex justify-center gap-4 mb-8">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`w-4 h-4 rounded-full ${pinInput.length > i ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' : 'bg-slate-700'}`} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button key={n} onClick={() => { playClick(); handlePinPress(n.toString()); }} className="aspect-square bg-slate-700/50 text-white text-2xl font-black rounded-2xl border-b-4 border-slate-900 active:translate-y-1 transition-all">{n}</button>
                ))}
                <button onClick={() => setShowPinModal(false)} className="bg-red-500/10 text-red-500 font-bold rounded-2xl">✕</button>
                <button onClick={() => { playClick(); handlePinPress('0'); }} className="aspect-square bg-slate-700/50 text-white text-2xl font-black rounded-2xl border-b-4 border-slate-900">0</button>
                <button onClick={() => setPinInput(p => p.slice(0, -1))} className="bg-slate-600/50 text-white font-bold rounded-2xl">←</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
