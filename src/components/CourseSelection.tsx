import { COURSES } from '../lib/utils';
import { MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onSelect: (courseId: string) => void;
}

export default function CourseSelection({ onSelect }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Selección de Recorrido</h2>
        <p className="text-slate-500 mt-2">Elige el circuito que vas a completar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COURSES.map((course, index) => (
          <motion.button
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(course.id)}
            className="group flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{course.name}</h3>
                <p className="text-sm text-slate-500">{course.controls.length} balizas</p>
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
