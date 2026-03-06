import { useState } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

interface Props {
  onSelect: (value: number) => void;
}

export default function BorgScale({ onSelect }: Props) {
  const [value, setValue] = useState(13);

  const getLabel = (v: number) => {
    if (v <= 7) return 'Esfuerzo muy, muy ligero';
    if (v <= 9) return 'Esfuerzo muy ligero';
    if (v <= 11) return 'Esfuerzo ligero';
    if (v <= 13) return 'Esfuerzo algo duro';
    if (v <= 15) return 'Esfuerzo duro';
    if (v <= 17) return 'Esfuerzo muy duro';
    if (v <= 19) return 'Esfuerzo muy, muy duro';
    return 'Esfuerzo máximo';
  };

  const getColor = (v: number) => {
    if (v <= 11) return 'text-emerald-500';
    if (v <= 14) return 'text-yellow-500';
    if (v <= 17) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
          <Activity size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Escala de Borg</h2>
        <p className="text-slate-500 mt-2">Determina tu nivel subjetivo de esfuerzo</p>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <div className={`text-5xl font-bold mb-2 ${getColor(value)}`}>{value}</div>
          <div className="text-lg font-medium text-slate-700">{getLabel(value)}</div>
        </div>

        <div className="relative pt-2 pb-6">
          <input
            type="range"
            min="6"
            max="20"
            step="1"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            className="w-full h-4 rounded-lg appearance-none cursor-pointer relative z-10 bg-transparent"
            style={{
              background: 'linear-gradient(to right, #10b981 0%, #eab308 50%, #ef4444 100%)',
              WebkitAppearance: 'none'
            }}
          />
          <style>{`
            input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: 24px;
              width: 24px;
              border-radius: 50%;
              background: white;
              border: 3px solid #065f46;
              cursor: pointer;
              margin-top: -4px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            }
            input[type=range]::-moz-range-thumb {
              height: 24px;
              width: 24px;
              border-radius: 50%;
              background: white;
              border: 3px solid #065f46;
              cursor: pointer;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            }
          `}</style>
        </div>

        <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1 uppercase tracking-tighter">
          <span>6 (Mínimo)</span>
          <span>13 (Algo Duro)</span>
          <span>20 (Máximo)</span>
        </div>

        <button
          onClick={() => onSelect(value)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all transform active:scale-95"
        >
          Confirmar Esfuerzo
        </button>
      </div>
    </div>
  );
}
