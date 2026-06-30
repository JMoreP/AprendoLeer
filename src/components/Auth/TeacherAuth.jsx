import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loginParent, registerParent, loginWithGoogle } from '../../firebase';

export default function TeacherAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await loginParent(email, password);
      } else {
        await registerParent(email, password);
      }
      navigate('/teacher');
    } catch (err) {
      console.error("Error de Auth:", err);
      setError(err.message || 'Error de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/teacher');
    } catch (err) {
      console.error("Error en Google Auth:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(`Error de Google: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 p-4">
      <div className="absolute top-4 left-4 z-10">
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }} 
          onClick={() => navigate('/login')}
          className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-400 font-black text-xl"
        >
          ⬅️
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <span className="text-6xl">👨‍🏫</span>
          </div>
          <h2 className="text-3xl font-black text-cyan-800">
            Zona para Profesores
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            {isLogin 
              ? 'Inicia sesión para ver el progreso de tu alumno/a.'
              : 'Regístrate para monitorear el avance educativo.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-semibold text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition-colors bg-gray-50 text-gray-800"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition-colors bg-gray-50 text-gray-800"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full py-4 mt-2 bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xl rounded-xl shadow-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Cargando...' : isLogin ? 'Entrar al Panel' : 'Crear Cuenta'}
          </motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400 font-bold uppercase italic">ó también</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:bg-gray-50 rounded-xl shadow transition-all disabled:opacity-50"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6,23.6c0-1.4-0.1-2.8-0.4-4.2H24v8h11.3c-0.5,2.7-2,5-4.3,6.5v5.4h6.9C42,35.1,43.6,29.7,43.6,23.6z"></path>
            <path fill="#FF3D00" d="M24,44c5.4,0,10-1.8,13.3-4.8l-6.9-5.4c-1.9,1.3-4.3,2-6.4,2c-6.1,0-11.2-4.1-13-9.6H4.1v5.6C7.4,38.6,15,44,24,44z"></path>
            <path fill="#4CAF50" d="M11,26.2c-0.5-1.4-0.8-2.9-0.8-4.5s0.3-3.1,0.8-4.5V11.6H4.1C2.5,14.8,1.6,18.3,1.6,22s0.9,7.2,2.5,10.4L11,26.2z"></path>
            <path fill="#1976D2" d="M24,10.8c3,0,5.6,1,7.7,3l5.8-5.8C33.6,4.6,29.3,3,24,3c-9,0-16.6,5.4-19.9,13.2l6.9,5.2C12.8,14.9,17.9,10.8,24,10.8z"></path>
          </svg>
          <span className="text-gray-700 font-bold">Continuar con Google</span>
        </motion.button>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-600 hover:text-cyan-800 font-bold transition-colors"
          >
            {isLogin 
              ? '¿No tienes cuenta? Regístrate aquí'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
