import React, { useState, useEffect, useRef } from 'react';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import { ControlPoint, RaceState, COURSES } from '../lib/utils';
import { Timer, CheckCircle2, XCircle, Map as MapIcon, Send, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  courseName: string;
  controls: string[];
  onFinish: (state: RaceState) => void;
}

export default function RaceInterface({ courseName, controls, onFinish }: Props) {
  const [raceState, setRaceState] = useState<RaceState>({
    startTime: Date.now(),
    endTime: null,
    duration: 0,
    currentControlIndex: 0,
    controls: controls.map((code, i) => ({
      id: `cp-${i}`,
      label: `Baliza ${i + 1}`,
      code: code,
    })),
    isFinished: false,
  });

  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (raceState.isFinished) return;

    const interval = setInterval(() => {
      setRaceState((prev) => ({
        ...prev,
        duration: Date.now() - (prev.startTime || 0),
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [raceState.isFinished, raceState.startTime]);

  const onUpdate = ({ x, y, scale }: { x: number; y: number; scale: number }) => {
    if (imgRef.current) {
      const value = make3dTransformValue({ x, y, scale });
      imgRef.current.style.setProperty('transform', value);
    }
  };

  const handleControlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentControl = raceState.controls[raceState.currentControlIndex];
    
    const updatedControls = [...raceState.controls];
    updatedControls[raceState.currentControlIndex] = {
      ...currentControl,
      enteredCode: inputCode.trim(),
      timestamp: Date.now(),
      isCorrect: inputCode.trim().toLowerCase() === currentControl.code.toLowerCase(),
    };

    const isLast = raceState.currentControlIndex === raceState.controls.length - 1;
    
    if (isLast) {
      const finalState = {
        ...raceState,
        controls: updatedControls,
        endTime: Date.now(),
        isFinished: true,
      };
      setRaceState(finalState);
      onFinish(finalState);
    } else {
      setRaceState((prev) => ({
        ...prev,
        controls: updatedControls,
        currentControlIndex: prev.currentControlIndex + 1,
      }));
    }
    setInputCode('');
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const deciseconds = Math.floor((ms % 1000) / 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${deciseconds}`;
  };

  // Using the map URL from the course data
  const mapUrl = COURSES.find(c => c.name === courseName)?.mapUrl || `https://picsum.photos/seed/orientation-map-${courseName}/1200/1600`;

  return (
    <div className={cn(
      "flex flex-col",
      isFullscreen ? "fixed inset-0 z-50 bg-slate-900" : "w-full max-w-2xl mx-auto"
    )}>
      {/* Header with Stats */}
      {!isFullscreen && (
        <div className="bg-white p-4 rounded-t-2xl border-b border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{courseName}</h2>
            <div className="flex items-center gap-3 sm:gap-4 mt-1">
              <div className="flex items-center gap-1 text-emerald-600 font-mono font-bold text-base sm:text-lg">
                <Timer size={16} className="sm:w-4.5 sm:h-4.5" />
                {formatTime(raceState.duration)}
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Baliza {raceState.currentControlIndex + 1} / {raceState.controls.length}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {raceState.controls.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors",
                  i < raceState.currentControlIndex ? "bg-emerald-500" : 
                  i === raceState.currentControlIndex ? "bg-emerald-200 animate-pulse" : "bg-slate-200"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Map Area */}
      <div className={cn(
        "relative overflow-hidden bg-white",
        isFullscreen ? "flex-1 bg-slate-900" : "w-full border-y border-slate-100"
      )}>
        <QuickPinchZoom onUpdate={onUpdate} wheelScaleFactor={0.1}>
          <div className={cn(
            "w-full flex items-center justify-center",
            isFullscreen ? "h-full" : "min-h-[200px]"
          )}>
            <img
              ref={imgRef}
              src={mapUrl}
              alt="Mapa de Orientación"
              className="w-full h-auto max-w-none"
              referrerPolicy="no-referrer"
            />
          </div>
        </QuickPinchZoom>
        
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-700 pointer-events-none">
          <MapIcon size={14} /> Pellizca para zoom
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-slate-700 hover:bg-white transition-all active:scale-90 flex items-center gap-2 font-bold text-xs"
        >
          {isFullscreen ? (
            <>
              <Minimize2 size={18} />
              <span>Cerrar Mapa</span>
            </>
          ) : (
            <>
              <Maximize2 size={18} />
              <span>Ampliar Mapa</span>
            </>
          )}
        </button>
      </div>

      {/* Control Input Area */}
      <div className={`bg-white p-4 sm:p-6 shadow-xl border-t border-slate-100 ${isFullscreen ? 'rounded-none' : 'rounded-b-2xl'}`}>
        <form onSubmit={handleControlSubmit} className="flex gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <input
              autoFocus
              type="text"
              inputMode="text"
              placeholder={`Código Baliza ${raceState.currentControlIndex + 1}`}
              className={cn(
                "w-full px-4 py-3 sm:py-4 rounded-xl border-2 outline-none transition-all font-bold text-base sm:text-lg uppercase tracking-widest border-slate-200 focus:border-emerald-500"
              )}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-8 left-0 text-red-500 text-[10px] sm:text-xs font-bold flex items-center gap-1"
                >
                  <XCircle size={12} className="sm:w-3.5 sm:h-3.5" /> Código incorrecto
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center gap-2"
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Siguiente</span>
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
