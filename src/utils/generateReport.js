// ── Generador de Informe PDF ─────────────────────────────────────────────────
import { jsPDF } from 'jspdf';

// ── Activity Metadata ────────────────────────────────────────────────────────
const ACTIVITY_META = {
  1: {
    name: 'Reconocimiento de Letras',
    icon: '🔤',
    weaknessMsg: 'El niño muestra dificultad en el reconocimiento fonético de las letras. Se recomienda trabajar con juegos de asociación letra-sonido y actividades multisensoriales para reforzar la memoria auditiva.',
    strengthMsg: 'Excelente dominio en el reconocimiento de letras. El niño identifica con fluidez los sonidos de cada letra, lo que demuestra una sólida base fonética.',
  },
  2: {
    name: 'Reconocimiento de Sonidos',
    icon: '🎵',
    weaknessMsg: 'Se recomienda reforzar la asociación consonante-vocal para la formación de sílabas. Actividades de lectura repetitiva con sílabas directas pueden ayudar a mejorar esta competencia.',
    strengthMsg: 'El niño maneja con destreza la formación de sílabas, mostrando una buena comprensión de la relación entre consonantes y vocales.',
  },
  3: {
    name: 'Reconocimiento de Palabras',
    icon: '✏️',
    weaknessMsg: 'Se sugiere practicar la escritura de palabras frecuentes comenzando por monosílabas. Utilizar dictados cortos y ejercicios de completar palabras puede mejorar significativamente esta habilidad.',
    strengthMsg: 'El niño demuestra una excelente capacidad para reconocer y escribir palabras, con un vocabulario fonético bien desarrollado.',
  },
  4: {
    name: 'Escribo el Nombre',
    icon: '🖼️',
    weaknessMsg: 'El niño necesita reforzar el vocabulario visual. Se recomienda trabajar con tarjetas de imágenes y sus nombres escritos, practicando la asociación imagen-palabra de forma lúdica.',
    strengthMsg: 'El niño asocia correctamente imágenes con sus nombres escritos, lo que indica un excelente vocabulario visual y capacidad de escritura.',
  },
};

// ── Avatar Mapping ──────────────────────────────────────────────────────────
const AVATAR_MAP = {
  '🦁': 'León',
  '🐸': 'Rana',
  '🐼': 'Panda',
  '🦊': 'Zorro',
  '🐨': 'Koala',
  '🐯': 'Tigre',
  '🐙': 'Pulpo',
  '🦋': 'Mariposa',
};

// ── Helper: Draw a horizontal line ──────────────────────────────────────────
function drawLine(doc, y, margin, pageWidth) {
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
}

// ── Helper: Check page overflow and add new page if needed ──────────────────
function checkPageBreak(doc, y, neededSpace, pageHeight, margin) {
  if (y + neededSpace > pageHeight - margin) {
    doc.addPage();
    return margin + 10;
  }
  return y;
}

// ── Main PDF Generator ──────────────────────────────────────────────────────
export function generateStudentReport({ childName, childAvatar, metrics, gameProgress, teacherEmail }) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  // ── HEADER ──────────────────────────────────────────────────────────────
  // Blue header bar
  doc.setFillColor(8, 145, 178); // cyan-600
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Aprendo a Leer', margin, 18);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Informe de Progreso del Alumno', margin, 27);

  // Date on the right
  doc.setFontSize(9);
  doc.text(dateStr, pageWidth - margin, 18, { align: 'right' });
  if (teacherEmail) {
    doc.text(`Profesor: ${teacherEmail}`, pageWidth - margin, 25, { align: 'right' });
  }

  y = 50;

  // ── STUDENT INFO ────────────────────────────────────────────────────────
  doc.setTextColor(30, 30, 30);
  doc.setFillColor(240, 249, 255); // sky-50
  doc.roundedRect(margin, y, contentWidth, 25, 4, 4, 'F');

  const avatarLabel = AVATAR_MAP[childAvatar] || childAvatar || 'León';

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Alumno: ${childName}`, margin + 8, y + 10);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Avatar: ${avatarLabel}`, margin + 8, y + 18);
  doc.text(`Fecha del informe: ${dateStr}`, pageWidth - margin - 8, y + 18, { align: 'right' });

  y += 35;

  // ── GLOBAL SUMMARY ──────────────────────────────────────────────────────
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen General', margin, y);
  y += 3;
  drawLine(doc, y, margin, pageWidth);
  y += 8;

  const totalStars = gameProgress?.stars || 0;
  const totalScore = gameProgress?.score || 0;
  const totalMistakes = gameProgress?.mistakes || 0;
  const totalSuccesses = gameProgress?.successes || 0;
  const totalAttempts = totalMistakes + totalSuccesses;
  const successRate = totalAttempts > 0 ? Math.round((totalSuccesses / totalAttempts) * 100) : 0;
  const activityProgress = gameProgress?.activityProgress || {};
  const completedActivities = Object.values(activityProgress).filter(a => a.completed).length;

  // Summary table (no emojis)
  const summaryData = [
    ['Estrellas Totales', `${totalStars} estrellas`],
    ['Puntuación Total', `${totalScore} pts`],
    ['Aciertos', `${totalSuccesses} aciertos`],
    ['Errores', `${totalMistakes} errores`],
    ['Tasa de Acierto', `${successRate}%`],
    ['Actividades Completadas', `${completedActivities} / 4`],
  ];

  const colWidth = contentWidth / 2;
  const rowHeight = 9;

  // Table header
  doc.setFillColor(8, 145, 178);
  doc.rect(margin, y, contentWidth, rowHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Indicador', margin + 4, y + 6);
  doc.text('Valor', margin + colWidth + 4, y + 6);
  y += rowHeight;

  summaryData.forEach((row, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
    }
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(row[0], margin + 4, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.text(row[1], margin + colWidth + 4, y + 6);
    y += rowHeight;
  });

  y += 12;

  // ── ACTIVITY BREAKDOWN ─────────────────────────────────────────────────
  y = checkPageBreak(doc, y, 60, pageHeight, margin);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Desglose por Actividad', margin, y);
  y += 3;
  drawLine(doc, y, margin, pageWidth);
  y += 8;

  // Activity table header
  doc.setFillColor(8, 145, 178);
  doc.rect(margin, y, contentWidth, rowHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const actColWidths = [contentWidth * 0.4, contentWidth * 0.2, contentWidth * 0.2, contentWidth * 0.2];
  doc.text('Actividad', margin + 4, y + 6);
  doc.text('Estado', margin + actColWidths[0] + 4, y + 6);
  doc.text('Estrellas', margin + actColWidths[0] + actColWidths[1] + 4, y + 6);
  doc.text('Mejor Punt.', margin + actColWidths[0] + actColWidths[1] + actColWidths[2] + 4, y + 6);
  y += rowHeight;

  [1, 2, 3, 4].forEach((actId, i) => {
    const meta = ACTIVITY_META[actId];
    const prog = activityProgress[actId];
    const status = prog?.completed ? 'Completada' : prog ? 'En progreso' : 'No iniciada';
    const stars = prog?.starsEarned || 0;
    const best = prog?.bestScore || 0;

    if (i % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`${actId}. ${meta.name}`, margin + 4, y + 6);

    // Status color
    if (status === 'Completada') {
      doc.setTextColor(22, 163, 74); // green
    } else if (status === 'En progreso') {
      doc.setTextColor(234, 179, 8); // yellow
    } else {
      doc.setTextColor(156, 163, 175); // gray
    }
    doc.text(status, margin + actColWidths[0] + 4, y + 6);

    doc.setTextColor(60, 60, 60);
    doc.text(`${stars} / 3`, margin + actColWidths[0] + actColWidths[1] + 4, y + 6);
    doc.text(`${best} pts`, margin + actColWidths[0] + actColWidths[1] + actColWidths[2] + 4, y + 6);

    y += rowHeight;
  });

  y += 15;

  // ── STRENGTHS & WEAKNESSES ANALYSIS ────────────────────────────────────
  y = checkPageBreak(doc, y, 80, pageHeight, margin);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Análisis de Fortalezas y Debilidades', margin, y);
  y += 3;
  drawLine(doc, y, margin, pageWidth);
  y += 10;

  // Analyze each activity
  [1, 2, 3, 4].forEach((actId) => {
    const meta = ACTIVITY_META[actId];
    const prog = activityProgress[actId];

    if (!prog) {
      // Not started - skip detailed analysis
      return;
    }

    y = checkPageBreak(doc, y, 35, pageHeight, margin);

    const stars = prog.starsEarned || 0;
    const bestScore = prog.bestScore || 0;

    // Determine strength/weakness based on stars earned
    let analysisType, bgColor, textColor, borderColor;
    if (stars >= 2) {
      analysisType = 'FORTALEZA';
      bgColor = [240, 253, 244]; // green-50
      textColor = [22, 101, 52]; // green-800
      borderColor = [74, 222, 128]; // green-400
    } else {
      analysisType = 'ÁREA DE MEJORA';
      bgColor = [254, 242, 242]; // red-50
      textColor = [153, 27, 27]; // red-800
      borderColor = [248, 113, 113]; // red-400
    }

    // Activity analysis box
    doc.setFillColor(...bgColor);
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);

    const analysisText = stars >= 2 ? meta.strengthMsg : meta.weaknessMsg;
    const wrappedText = doc.splitTextToSize(analysisText, contentWidth - 16);
    const boxHeight = 20 + (wrappedText.length * 5);

    doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'FD');

    // Label
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text(`${analysisType} — ${meta.name}`, margin + 8, y + 8);

    // Stars indicator
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Estrellas: ${stars} de 3 | Mejor puntaje: ${bestScore} pts`, margin + 8, y + 15);

    // Analysis text
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(wrappedText, margin + 8, y + 22);

    y += boxHeight + 8;
  });

  // If no activities were started
  if (Object.keys(activityProgress).length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('El alumno aún no ha iniciado ninguna actividad.', margin + 4, y);
    y += 15;
  }

  // ── RECENT ACTIVITY HISTORY ────────────────────────────────────────────
  y = checkPageBreak(doc, y, 50, pageHeight, margin);
  y += 5;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Historial de Actividad Reciente', margin, y);
  y += 3;
  drawLine(doc, y, margin, pageWidth);
  y += 8;

  if (metrics && metrics.length > 0) {
    // History table header
    doc.setFillColor(8, 145, 178);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const histColW = contentWidth / 5;
    doc.text('Fecha', margin + 4, y + 6);
    doc.text('Estrellas', margin + histColW + 4, y + 6);
    doc.text('Puntaje', margin + histColW * 2 + 4, y + 6);
    doc.text('Aciertos', margin + histColW * 3 + 4, y + 6);
    doc.text('Errores', margin + histColW * 4 + 4, y + 6);
    y += rowHeight;

    metrics.slice(0, 14).forEach((m, i) => {
      y = checkPageBreak(doc, y, rowHeight + 2, pageHeight, margin);

      if (i % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, y, contentWidth, rowHeight, 'F');
      }

      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      const formattedDate = new Date(m.date + 'T12:00:00').toLocaleDateString('es-ES', {
        day: 'numeric', month: 'short',
      });

      doc.text(formattedDate, margin + 4, y + 6);
      doc.text(`${m.stars || 0}`, margin + histColW + 4, y + 6);
      doc.text(`${m.score || 0}`, margin + histColW * 2 + 4, y + 6);

      doc.setTextColor(22, 163, 74);
      doc.text(`${m.successes || 0}`, margin + histColW * 3 + 4, y + 6);
      doc.setTextColor(220, 38, 38);
      doc.text(`${m.mistakes || 0}`, margin + histColW * 4 + 4, y + 6);

      y += rowHeight;
    });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('Sin actividad registrada recientemente.', margin + 4, y);
    y += 10;
  }

  // ── FOOTER ─────────────────────────────────────────────────────────────
  const footerY = pageHeight - 15;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generado automáticamente por AprendoLeer — ${now.toLocaleString('es-ES')}`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  // ── SAVE PDF ───────────────────────────────────────────────────────────
  const fileName = `Informe_${childName.replace(/\s+/g, '_')}_${now.toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
