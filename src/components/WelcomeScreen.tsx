import { motion } from 'motion/react';
import RegistrationForm from './RegistrationForm';
import { UserData } from '../lib/utils';

interface Props {
  onRegister: (data: UserData) => void;
}

export default function WelcomeScreen({ onRegister }: Props) {
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Welcome Section */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 text-center space-y-6">
        <header className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Recorridos del Orientación en el IES Lucía de Medrano</h1>
          <h2 className="text-lg font-semibold text-emerald-600">Departamento de Educación Física</h2>
          <p className="text-xs text-slate-400 italic">(App creada por Jose Carlos Tejedor)</p>
        </header>

        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-inner bg-slate-100 max-w-sm mx-auto">
          <img
            src="https://raw.githubusercontent.com/josecarlostejedor/IES-orientacion/main/recorridoorienta.jpg"
            alt="Recorrido Orientación"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        </div>

        <p className="text-base font-medium text-slate-700">
          ¡Bienvenidos a nuestra práctica de orientación en entorno próximo!
        </p>
        
        <div className="pt-4 border-t border-slate-50">
          <p className="text-xs text-slate-400 leading-relaxed">
            Completa el formulario a la derecha para comenzar tu recorrido. 
            Asegúrate de ingresar tus datos correctamente para generar tu reporte al finalizar.
          </p>
        </div>
      </div>

      {/* Registration Section */}
      <div className="lg:sticky lg:top-24 mt-8 lg:mt-0">
        <RegistrationForm onComplete={onRegister} />
      </div>
    </div>
  );
}
