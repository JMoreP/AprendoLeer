import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, getRecentMetrics, getGameProgress, logoutParent, saveChildProfile, getChildrenProfiles } from '../../firebase';
import { useGameStore } from '../../store/gameStore';
import { generateStudentReport } from '../../utils/generateReport';

const AVATARS = ['🦁', '🐸', '🐼', '🦊', '🐨', '🐯', '🐙', '🦋'];

export default function TeacherDashboard() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [gameProgress, setGameProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const navigate = useNavigate();
  const setParentUid = useGameStore((s) => s.setParentUid);
  const parentPin = useGameStore((s) => s.parentPin);
  const setParentPin = useGameStore((s) => s.setParentPin);

  // New Child Form State
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('🦁');
  const [saving, setSaving] = useState(false);

  const fetchAllData = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/parent');
      return;
    }
    setParentUid(user.uid);

    try {
      const profiles = await getChildrenProfiles(user.uid);
      setChildren(profiles);
      
      // If we have children and none selected, select the first one to show metrics
      if (profiles.length > 0 && !selectedChild) {
        handleSelectChild(profiles[0]);
      }
    } catch (err) {
      console.error("Error al cargar perfiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [navigate, setParentUid]);

  const handleSelectChild = async (child) => {
    setSelectedChild(child);
    setLoading(true);
    setGameProgress(null);
    try {
      const [data, progress] = await Promise.all([
        getRecentMetrics(auth.currentUser.uid, child.name, 14),
        getGameProgress(auth.currentUser.uid, child.name),
      ]);
      setMetrics(data);
      setGameProgress(progress);
    } catch (err) {
      console.error("Error al cargar métricas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    const user = auth.currentUser;
    try {
      await saveChildProfile(user.uid, newName.trim(), {
        avatar: newAvatar,
      });
      setNewName('');
      setIsAddingChild(false);
      await fetchAllData();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logoutParent();
    useGameStore.getState().resetAll();
    setParentUid(null);
    navigate('/');
  };

  const handleGoToGame = async () => {
    if (selectedChild) {
      // Configuramos al niño seleccionado como el jugador activo
      useGameStore.getState().setPlayerName(selectedChild.name);
      useGameStore.getState().setAvatar(selectedChild.avatar);
      useGameStore.getState().setRegisteredProfile(true);

      // Cargamos su progreso de forma anticipada
      try {
        const { getGameProgress } = await import('../../firebase');
        const progress = await getGameProgress(auth.currentUser.uid, selectedChild.name);
        if (progress) {
          useGameStore.getState().loadGameProgress(progress);
        }
      } catch (err) {
        console.error("Error precargando progreso:", err);
      }
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col font-sans text-slate-800">
      <header className="max-w-6xl mx-auto w-full flex flex-wrap justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-2xl">📈</div>
          <div>
            <h1 className="text-2xl font-black text-cyan-900 uppercase tracking-tighter">Panel de Control</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{auth.currentUser?.email}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button onClick={handleLogout} className="px-4 py-2 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 rounded-xl transition-colors">Cerrar Sesión</button>
          <button onClick={handleGoToGame} className="px-6 py-2 bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">🕹️ Ir al Juego</button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar: Lista de Niños */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Mis Alumnos</h3>
              <button 
                onClick={() => setIsAddingChild(true)}
                className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold hover:bg-cyan-600 transition-colors"
              >+</button>
            </div>

            <div className="space-y-3">
              {children.map(child => (
                <button
                  key={child.name}
                  onClick={() => handleSelectChild(child)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border-2
                    ${selectedChild?.name === child.name 
                      ? 'bg-cyan-50 border-cyan-500 shadow-md' 
                      : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                >
                  <span className="text-2xl">{child.avatar}</span>
                  <span className="font-black text-slate-700 truncate">{child.name}</span>
                </button>
              ))}
              {children.length === 0 && (
                <p className="text-xs text-slate-400 font-bold text-center py-4">No hay alumnos registrados.</p>
              )}
            </div>
          </div>
        </aside>

        {/* Contenido Principal: Reportes y Registro */}
        <section className="lg:col-span-3 space-y-6">
          
          <AnimatePresence mode='wait'>
            {isAddingChild ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-cyan-100"
              >
                <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tighter">Registrar Nuevo Alumno</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nombre del Alumno</label>
                    <input 
                      type="text" 
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="Ej: David"
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-cyan-500 outline-none font-bold text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Elegir Avatar</label>
                    <div className="flex flex-wrap gap-2">
                      {AVATARS.map(av => (
                        <button 
                          key={av} 
                          onClick={() => setNewAvatar(av)}
                          className={`w-10 h-10 flex items-center justify-center text-xl rounded-xl transition-all border-2
                            ${newAvatar === av ? 'bg-cyan-100 border-cyan-500 scale-110 shadow-md' : 'bg-slate-50 border-transparent'}`}
                        >{av}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <button 
                    onClick={handleAddChild}
                    disabled={saving || !newName.trim()}
                    className="px-8 py-3 bg-cyan-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-cyan-100 disabled:opacity-50"
                  >{saving ? 'Guardando...' : 'Guardar Alumno'}</button>
                  <button onClick={() => setIsAddingChild(false)} className="px-8 py-3 text-slate-400 font-black text-xs uppercase tracking-widest">Cancelar</button>
                </div>
              </motion.div>
            ) : selectedChild ? (
              <motion.div 
                key="report"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Header del Niño Seleccionado */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-200">
                  <div className="flex items-center gap-6">
                    <div className="text-5xl bg-slate-50 p-4 rounded-3xl border-2 border-slate-100">{selectedChild.avatar}</div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Reporte de {selectedChild.name}</h2>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Progreso acumulado y actividad reciente</p>
                    </div>
                  </div>
                  {/* PDF Download Button */}
                  <div className="mt-4 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={generatingPdf}
                      onClick={async () => {
                        setGeneratingPdf(true);
                        try {
                          generateStudentReport({
                            childName: selectedChild.name,
                            childAvatar: selectedChild.avatar,
                            metrics,
                            gameProgress,
                            teacherEmail: auth.currentUser?.email,
                          });
                        } catch (err) {
                          console.error('Error generando PDF:', err);
                          alert('Error al generar el informe PDF.');
                        } finally {
                          setGeneratingPdf(false);
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-200/50 disabled:opacity-50 transition-all hover:shadow-xl"
                    >
                      <span className="text-lg">{generatingPdf ? '⏳' : '📄'}</span>
                      {generatingPdf ? 'Generando...' : 'Descargar Informe PDF'}
                    </motion.button>
                  </div>
                </div>

                {/* Gráfica Semanal */}
                <WeeklyChart metrics={metrics} />

                {/* Lista de Actividad */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {metrics.map((m, i) => (
                    <div key={m.date} className="bg-white p-6 rounded-3xl border-2 border-slate-50 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">📅 {m.date}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl font-black text-yellow-500">⭐ {m.stars || 0}</span>
                        <span className="text-sm font-black text-cyan-600">🎯 {m.score || 0} pts</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-100 p-3 rounded-xl">
                        <span className="text-sm font-black text-green-600">✅ {m.successes || 0} Aciertos</span>
                        <span className="text-sm font-black text-red-500">❌ {m.mistakes || 0} Errores</span>
                      </div>
                    </div>
                  ))}
                  {metrics.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Sin actividad registrada esta semana</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="text-6xl opacity-20">👤</div>
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Selecciona un alumno para ver su progreso</p>
                <button 
                  onClick={() => setIsAddingChild(true)}
                  className="px-6 py-2 bg-cyan-100 text-cyan-700 rounded-xl font-black text-xs uppercase tracking-widest"
                >Añadir mi primer alumno</button>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

function WeeklyChart({ metrics }) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const dayMetric = metrics.find(m => m.date === date);
    return {
      date,
      stars: dayMetric?.stars || 0,
      label: new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()
    };
  });

  const maxStars = Math.max(...chartData.map(d => d.stars), 5);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
      <div className="flex items-end justify-between h-40 gap-3">
        {chartData.map((day, i) => (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
             <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.stars / maxStars) * 100}%` }}
                className={`w-full max-w-[32px] rounded-t-xl bg-gradient-to-t 
                  ${day.stars > 0 ? 'from-cyan-500 to-cyan-300 shadow-lg' : 'bg-slate-50'}`}
              />
            <span className="text-[10px] font-black text-slate-400">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
