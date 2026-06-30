import jsPDF from 'jspdf';
import { STUDENT_SECTIONS, TEACHER_SECTIONS } from '../components/UI/UserManualData';

export function generateManualPdf(tab) {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = 170;
  let y = margin;

  const now = new Date();
  
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(8, 145, 178); // cyan-600
  doc.text('Manual de Usuario', margin, y);
  
  y += 10;
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text(tab === 'student' ? 'Sección: Estudiante' : 'Sección: Profesor', margin, y);
  
  y += 15;
  
  const sections = tab === 'student' ? STUDENT_SECTIONS : TEACHER_SECTIONS;
  
  sections.forEach((section) => {
    // Check page break for section title
    if (y > pageHeight - 30) {
      doc.addPage();
      y = margin;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    // Remove emojis and unsupported chars, keep ASCII, Latin-1, bullets, dashes
    const cleanTitle = section.title
      .replace(/[^\x20-\x7E\xA0-\xFF\u2022\u2013\u2014]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    doc.text(cleanTitle, margin, y);
    y += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    
    section.content.forEach((line) => {
      // Clean emojis and fix double spaces
      const cleanLine = line
        .replace(/[^\x20-\x7E\xA0-\xFF\u2022\u2013\u2014]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      const wrappedText = doc.splitTextToSize(cleanLine, contentWidth);
      
      const textHeight = wrappedText.length * 6;
      if (y + textHeight > pageHeight - 20) {
        doc.addPage();
        y = margin;
      }
      
      doc.text(wrappedText, margin, y);
      y += textHeight + 2;
    });
    
    y += 10;
  });
  
  // Footer
  const footerY = pageHeight - 15;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 5, 210 - margin, footerY - 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generado automáticamente por AprendoLeer — ${now.toLocaleDateString('es-ES')}`,
    210 / 2,
    footerY,
    { align: 'center' }
  );
  
  doc.save(`Manual_${tab === 'student' ? 'Estudiante' : 'Profesor'}.pdf`);
}
