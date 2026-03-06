import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface UserData {
  firstName: string;
  lastName: string;
  age: number;
  course: string;
  group: string;
}

export interface RaceState {
  startTime: number | null;
  endTime: number | null;
  duration: number;
  currentControlIndex: number;
  controls: ControlPoint[];
  isFinished: boolean;
  borgScale?: number;
  score?: number;
}

export interface ControlPoint {
  id: string;
  label: string;
  code: string;
  enteredCode?: string;
  timestamp?: number;
  isCorrect?: boolean;
}

export const COURSES = [
  { 
    id: '1', 
    name: 'Recorrido 1', 
    mapUrl: 'https://raw.githubusercontent.com/josecarlostejedor/IES-orientacion/main/Recorrido1ies.jpg',
    controls: [
      'IES Lucía de Medrano',
      'Cabuyería',
      'Parte de Movilidad Articular',
      'Frecuencia cardiaca teórica máxima',
      'Expresión Corporal',
      'Parte General'
    ] 
  },
  { 
    id: '2', 
    name: 'Recorrido 2', 
    mapUrl: 'https://raw.githubusercontent.com/josecarlostejedor/IES-orientacion/main/Recorrido2ies.jpg',
    controls: [
      'Expresión Corporal',
      'Condición Física y Salud',
      'Test de Burpee',
      'Parte específica del calentamiento',
      '220-edad=?',
      'Flexor del codo'
    ] 
  },
  { 
    id: '3', 
    name: 'Recorrido 3', 
    mapUrl: 'https://raw.githubusercontent.com/josecarlostejedor/IES-orientacion/main/Recorrido3ies.jpg',
    controls: [
      'Parte General',
      'Frecuencia cardiaca teórica máxima',
      '220-edad=?',
      'Gemelos',
      'IES Lucía de Medrano',
      'Test de Burpee'
    ] 
  },
  { 
    id: '4', 
    name: 'Recorrido 4', 
    mapUrl: 'https://raw.githubusercontent.com/josecarlostejedor/IES-orientacion/main/Recorrido4ies.jpg',
    controls: [
      'Actividades en el Medio Natural',
      'Frecuencia cardiaca teórica máxima',
      'Psoas Iliaco',
      'Entrenamiento Aeróbico',
      'Relajación',
      'Parte de Estiramientos'
    ] 
  },
  { 
    id: '5', 
    name: 'Recorrido 5', 
    mapUrl: 'https://raw.githubusercontent.com/josecarlostejedor/IES-orientacion/main/Recorrido5ies.jpg',
    controls: [
      'Parte de Estiramientos',
      'IES Lucía de Medrano',
      'Parte de Movilidad Articular',
      'Entrenamiento Aeróbico',
      'Parte de concentración',
      'Esgrima'
    ] 
  },
  { 
    id: '6', 
    name: 'Recorrido 6', 
    mapUrl: 'https://raw.githubusercontent.com/josecarlostejedor/IES-orientacion/main/Recorrido6ies.jpg',
    controls: [
      'Relajación',
      'Parte específica del calentamiento',
      'Parte General',
      'Expresión Corporal',
      'Frecuencia cardiaca teórica máxima',
      'Parte de concentración'
    ] 
  },
];

export const COURSE_OPTIONS = [
  '1º ESO',
  '2º ESO',
  '3º ESO',
  '1º BACHILLERATO',
  '2º BACHILLERATO',
  'FP BÁSICA',
  'Otro nivel educativo'
];

export const GROUP_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8'];
