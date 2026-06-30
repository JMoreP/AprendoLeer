// ── Manual de Usuario ──────────────────────────────────────────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { STUDENT_SECTIONS, TEACHER_SECTIONS } from './UserManualData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function UserManual({ show, onClose }) {
  const [tab, setTab] = useState('student');
  const [isDownloading, setIsDownloading] = useState(false);
  const sections = tab === 'student' ? STUDENT_SECTIONS : TEACHER_SECTIONS;

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const element = document.getElementById('pdf-manual-content');
    if (!element) {
      setIsDownloading(false);
      return;
    }

    try {
      // Forzamos un pequeño delay para asegurar el renderizado
      await new Promise((r) => setTimeout(r, 100));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Márgenes de 15mm
      const m = 15;
      const usableWidth = pdfWidth - 2 * m;
      const usableHeight = pageHeight - 2 * m;
      const pdfHeight = (canvas.height * usableWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', m, m + position, usableWidth, pdfHeight);

      // Cubrir el margen inferior con un rectángulo blanco para que no se vea la imagen cortada
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, pageHeight - m, pdfWidth, m, 'F');

      heightLeft -= usableHeight;

      while (heightLeft > 0) {
        position -= usableHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', m, m + position, usableWidth, pdfHeight);

        // Cubrir el margen superior e inferior con rectángulos blancos
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pdfWidth, m, 'F');
        pdf.rect(0, pageHeight - m, pdfWidth, m, 'F');

        heightLeft -= usableHeight;
      }

      pdf.save(`Manual_${tab === 'student' ? 'Estudiante' : 'Profesor'}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-3"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 p-6 pb-4 relative overflow-hidden shrink-0">
                {/* Decorative circles */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />

                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                      📖 Manual
                    </h2>
                    <p className="text-cyan-100 font-semibold text-sm mt-1">Aprende a usar la app</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownloadPdf}
                      disabled={isDownloading}
                      className="h-10 px-4 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-sm hover:bg-white/30 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isDownloading ? '⏳ Generando...' : '📄 Descargar PDF'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-lg hover:bg-white/30 transition-colors shadow-sm"
                    >
                      ✕
                    </motion.button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-4 relative z-10">
                  <button
                    onClick={() => setTab('student')}
                    className={`flex-1 py-2.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 ${tab === 'student'
                        ? 'bg-white text-cyan-700 shadow-lg'
                        : 'bg-white/15 text-white/80 hover:bg-white/25'
                      }`}
                  >
                    🧒 Estudiante
                  </button>
                  <button
                    onClick={() => setTab('teacher')}
                    className={`flex-1 py-2.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 ${tab === 'teacher'
                        ? 'bg-white text-purple-700 shadow-lg'
                        : 'bg-white/15 text-white/80 hover:bg-white/25'
                      }`}
                  >
                    👨‍🏫 Profesor
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: tab === 'student' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: tab === 'student' ? 20 : -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {sections.map((section, i) => (
                      <ManualSection key={i} section={section} index={i} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/80">
                <p className="text-center text-xs text-gray-400 font-bold">
                  Aprender A Leer — © {new Date().getFullYear()} · Versión 1.0
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Div for PDF Generation - using a very large width to ensure good rendering */}
      <div
        className="fixed left-[-9999px] top-0 w-[800px] bg-white text-slate-800 font-sans p-8"
        id="pdf-manual-content"
      >
        <div className="border-b-4 border-cyan-500 pb-6 mb-8 text-center">
          <h1 className="text-4xl font-black text-cyan-700 uppercase tracking-tighter mb-2">
            📖 Manual de Usuario
          </h1>
          <p className="text-xl font-bold text-slate-500 uppercase tracking-widest">
            Sección: {tab === 'student' ? '🧒 Estudiante' : '👨‍🏫 Profesor'}
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
                <span className="text-3xl">{section.icon}</span>
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.map((line, j) => (
                  <p key={j} className="text-lg text-slate-600 font-medium leading-relaxed pl-4">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t-2 border-slate-100 text-center text-slate-400 font-bold">
          Generado automáticamente por AprendoLeer
        </div>
      </div>
    </>
  );
}

function ManualSection({ section, index }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-100/70 transition-colors"
      >
        <span className="text-2xl flex-shrink-0">{section.icon}</span>
        <span className="flex-1 font-black text-slate-700 text-sm md:text-base">{section.title}</span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 text-lg flex-shrink-0"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-2">
              {section.content.map((line, j) => (
                <p key={j} className="text-sm text-gray-600 font-medium leading-relaxed pl-9">
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
