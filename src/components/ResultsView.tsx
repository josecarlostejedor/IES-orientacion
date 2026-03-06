import { UserData, RaceState, COURSES } from '../lib/utils';
import { Trophy, Download, RefreshCcw, CheckCircle2, Clock, MapPin, Activity, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface Props {
  userData: UserData;
  raceState: RaceState;
  courseName: string;
  onRestart: () => void;
}

export default function ResultsView({ userData, raceState, courseName, onRestart }: Props) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const deciseconds = Math.floor((ms % 1000) / 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${deciseconds}`;
  };

  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const primaryColor = [0, 143, 76]; // Green from image
      const secondaryColor = [102, 102, 102]; // Grey
      const accentColor = [16, 185, 129]; // Emerald
      
      // Header Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18); // Reduced size to avoid overlap
      doc.setTextColor(0, 0, 0);
      doc.text('Recorridos de Orientación en el IES Lucía de Medrano', margin, 32);
      
      doc.setFontSize(11);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('DEPARTAMENTO DE E.F. IES LUCÍA DE MEDRANO', margin, 39);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(150, 150, 150);
      doc.text('(App creada por Jose Carlos Tejedor)', margin, 44);
      
      // Date on the right - Adjusted position to avoid overlap
      const now = new Date();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('FECHA DE EMISIÓN', pageWidth - margin, 12, { align: 'right' });
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(format(now, 'd/M/yyyy, HH:mm:ss'), pageWidth - margin, 18, { align: 'right' });
      
      // Thick Green Line
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(1.5);
      doc.line(margin, 50, pageWidth - margin, 50);
      
      // Two Column Layout for Summary
      const colWidth = (pageWidth - (margin * 2)) / 2;
      let currentY = 65;
      
      // Left Column: Datos del Corredor
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Datos del Corredor', margin + 8, currentY);
      // Simple User Icon (Circle + Rounded Rect)
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.circle(margin + 3, currentY - 2, 2);
      doc.roundedRect(margin, currentY + 1, 6, 3, 2, 2);
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.line(margin, currentY + 4, margin + colWidth - 10, currentY + 4);
      
      currentY += 15;
      const labelSize = 8;
      const valueSize = 12;
      
      // Name
      doc.setFontSize(labelSize);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('NOMBRE COMPLETO', margin, currentY);
      doc.setFontSize(valueSize);
      doc.setTextColor(0, 0, 0);
      doc.text(`${userData.firstName} ${userData.lastName}`, margin, currentY + 6);
      
      // Age
      doc.setFontSize(labelSize);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('EDAD', margin + 60, currentY);
      doc.setFontSize(valueSize);
      doc.setTextColor(0, 0, 0);
      doc.text(`${userData.age} años`, margin + 60, currentY + 6);
      
      currentY += 20;
      // Course
      doc.setFontSize(labelSize);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('CURSO', margin, currentY);
      doc.setFontSize(valueSize);
      doc.setTextColor(0, 0, 0);
      doc.text(userData.course, margin, currentY + 6);
      
      // Group
      doc.setFontSize(labelSize);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('GRUPO', margin + 60, currentY);
      doc.setFontSize(valueSize);
      doc.setTextColor(0, 0, 0);
      doc.text(userData.group, margin + 60, currentY + 6);
      
      // Right Column: Resumen de Carrera
      currentY = 65;
      const rightColX = margin + colWidth + 5;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Resumen de Carrera', rightColX + 8, currentY);
      // Simple Pulse Icon
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(rightColX, currentY, rightColX + 2, currentY);
      doc.line(rightColX + 2, currentY, rightColX + 3, currentY - 4);
      doc.line(rightColX + 3, currentY - 4, rightColX + 5, currentY + 4);
      doc.line(rightColX + 5, currentY + 4, rightColX + 6, currentY);
      doc.line(rightColX + 6, currentY, rightColX + 8, currentY);
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.line(rightColX, currentY + 4, pageWidth - margin, currentY + 4);
      
      currentY += 15;
      // Course Name
      doc.setFontSize(labelSize);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('RECORRIDO', rightColX, currentY);
      doc.setFontSize(valueSize);
      doc.setTextColor(0, 0, 0);
      doc.text(courseName, rightColX, currentY + 6);
      
      // Total Time
      doc.setFontSize(labelSize);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('TIEMPO TOTAL', rightColX + 60, currentY);
      doc.setFontSize(valueSize);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(formatTime(raceState.duration), rightColX + 60, currentY + 6);
      
      currentY += 20;
      // Score
      doc.setFontSize(labelSize);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('PUNTUACIÓN', rightColX, currentY);
      doc.setFontSize(valueSize);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`${raceState.score} / ${raceState.controls.length}`, rightColX, currentY + 6);
      
      // Borg
      doc.setFontSize(labelSize);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('ESCALA DE BORG', rightColX + 60, currentY);
      doc.setFontSize(valueSize);
      doc.setTextColor(0, 0, 0);
      doc.text(`${raceState.borgScale} / 10`, rightColX + 60, currentY + 6);
      
      // Beacon Breakdown Section
      currentY += 25;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Desglose de Balizas', margin, currentY);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.line(margin, currentY + 3, pageWidth - margin, currentY + 3);
      
      const tableData = raceState.controls.map((c, i) => [
        `Baliza ${i + 1}`,
        c.enteredCode || '-',
        c.isCorrect ? 'CORRECTO' : 'FALLIDO'
      ]);

      autoTable(doc, {
        startY: currentY + 8,
        head: [['DESCRIPCIÓN', 'CÓDIGO INGRESADO', 'RESULTADO']],
        body: tableData,
        theme: 'plain',
        headStyles: {
          fillColor: [250, 250, 250],
          textColor: [secondaryColor[0], secondaryColor[1], secondaryColor[2]],
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'left'
        },
        bodyStyles: {
          fontSize: 10,
          textColor: [0, 0, 0],
          cellPadding: 5
        },
        columnStyles: {
          2: { halign: 'center' }
        },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 2) {
            const isCorrect = data.cell.raw === 'CORRECTO';
            const bgColor = isCorrect ? [220, 252, 231] : [254, 226, 226];
            const textColor = isCorrect ? [22, 101, 52] : [153, 27, 27];
            
            // Draw badge background
            doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
            const padding = 1;
            doc.roundedRect(
              data.cell.x + 2,
              data.cell.y + 2,
              data.cell.width - 4,
              data.cell.height - 4,
              3, 3, 'F'
            );
            
            // Draw badge text
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.text(
              data.cell.raw as string,
              data.cell.x + data.cell.width / 2,
              data.cell.y + data.cell.height / 2 + 1,
              { align: 'center' }
            );
          }
        }
      });

      // Add Map Page
      doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text('Mapa del Recorrido Realizado', pageWidth / 2, 20, { align: 'center' });
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(1);
      doc.line(margin, 25, pageWidth - margin, 25);
      
      const course = COURSES.find(c => c.name === courseName);
      if (course?.mapUrl) {
        try {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = course.mapUrl;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => {
              const img2 = new Image();
              img2.src = course.mapUrl;
              img2.onload = resolve;
              img2.onerror = reject;
            };
            setTimeout(() => reject(new Error("Image timeout")), 5000);
          });
          
          const imgWidth = pageWidth - 40;
          const imgHeight = (img.height * imgWidth) / img.width;
          doc.addImage(img, 'JPEG', 20, 35, imgWidth, imgHeight);
        } catch (e) {
          console.error("Could not load map image for PDF", e);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(10);
          doc.text("No se pudo cargar la imagen del mapa en el PDF.", 20, 40);
        }
      }

      // Footer for all pages
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('IES Lucía de Medrano - Departamento de Educación Física', margin, pageHeight - 10);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      doc.save(`${userData.firstName}_${userData.lastName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
      >
        {/* Header */}
        <div className="bg-emerald-600 p-6 sm:p-8 text-center text-white">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Trophy size={32} className="sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">¡Carrera Finalizada!</h2>
          <p className="opacity-90 mt-2 text-sm sm:text-base">Excelente trabajo, {userData.firstName}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 border-b border-slate-100">
          <div className="p-4 sm:p-6 text-center border-r border-slate-100">
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
              <Clock size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline">Tiempo</span>
            </div>
            <div className="text-lg sm:text-2xl font-mono font-bold text-emerald-600">
              {formatTime(raceState.duration)}
            </div>
          </div>
          <div className="p-4 sm:p-6 text-center border-r border-slate-100">
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
              <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline">Puntos</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-slate-900">
              {raceState.score} / {raceState.controls.length}
            </div>
          </div>
          <div className="p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
              <Activity size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline">Borg</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-slate-900">
              {raceState.borgScale}
            </div>
          </div>
        </div>

        {/* Details List */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Desglose de Balizas</h3>
            <div className="space-y-3">
              {raceState.controls.map((control, i) => (
                <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] sm:text-xs font-bold text-slate-500">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">{control.code}</div>
                      <div className="text-[10px] sm:text-xs text-slate-500">
                        Ingresado: <span className="font-mono">{control.enteredCode}</span>
                      </div>
                    </div>
                  </div>
                  {control.isCorrect ? (
                    <CheckCircle2 className="text-emerald-500" size={18} />
                  ) : (
                    <XCircle className="text-red-500" size={18} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={generatePDF}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Download size={20} /> Imprimir Registro
            </button>
            <button
              onClick={onRestart}
              className="flex-1 bg-white border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 font-bold py-4 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <RefreshCcw size={20} /> Nueva Carrera
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

