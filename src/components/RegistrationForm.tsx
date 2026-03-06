import React, { useState } from 'react';
import { UserData, COURSE_OPTIONS, GROUP_OPTIONS } from '../lib/utils';

interface Props {
  onComplete: (data: UserData) => void;
}

export default function RegistrationForm({ onComplete }: Props) {
  const [formData, setFormData] = useState<UserData>({
    firstName: '',
    lastName: '',
    age: 12,
    course: COURSE_OPTIONS[0],
    group: GROUP_OPTIONS[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Registro</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Nombre</label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Apellidos</label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
              placeholder="Apellidos"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Edad</label>
            <input
              required
              type="number"
              min="5"
              max="99"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Grupo</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm bg-white"
              value={formData.group}
              onChange={(e) => setFormData({ ...formData, group: e.target.value })}
            >
              {GROUP_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>Grupo {opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Curso</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm bg-white"
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
          >
            {COURSE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 text-sm"
        >
          Comenzar Carrera
        </button>
      </form>
    </div>
  );
}
