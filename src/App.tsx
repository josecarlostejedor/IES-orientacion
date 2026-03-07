import { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import CourseSelection from './components/CourseSelection';
import RaceInterface from './components/RaceInterface';
import ResultsView from './components/ResultsView';
import { UserData, RaceState, COURSES } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import WelcomeScreen from './components/WelcomeScreen';
import BorgScale from './components/BorgScale';

type AppStep = 'welcome' | 'selection' | 'race' | 'borg' | 'results';

export default function App() {
  const [step, setStep] = useState<AppStep>('welcome');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [raceState, setRaceState] = useState<RaceState | null>(null);

  const handleRegistrationComplete = (data: UserData) => {
    setUserData(data);
    setStep('selection');
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setStep('race');
  };

  const handleRaceFinish = (state: RaceState) => {
    setRaceState(state);
    setStep('borg');
  };

  const handleBorgSelect = async (borgValue: number) => {
    if (!raceState) return;

    const score = raceState.controls.filter(c => c.isCorrect).length;
    const finalState = {
      ...raceState,
      borgScale: borgValue,
      score: score,
    };

    setRaceState(finalState);
    setStep('results');

    // Save to Google Sheets
    const googleSheetsUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbyUv7-v574stJg366eH31ukQfUvQIT57Bn50LYziITiHSnUZQLNliMtE33JXUxzp_dT7A/exec';
    if (userData) {
      try {
        const payload = {
          nombre: userData.firstName,
          apellidos: userData.lastName,
          curso: userData.course,
          grupo: userData.group,
          borg: finalState.borgScale,
          puntuacion: finalState.score,
          tiempo: finalState.duration,
          aciertos: finalState.controls.filter(c => c.isCorrect).length,
          fecha: new Date().toLocaleString()
        };

        fetch(googleSheetsUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error('Error en Google Sheets:', error);
      }
    }

    // Save to local database
    if (userData && selectedCourseId) {
      const course = COURSES.find(c => c.id === selectedCourseId);
      try {
        const response = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...userData,
            group_num: userData.group,
            selectedRoute: course?.name,
            startTime: new Date(finalState.startTime!).toISOString(),
            endTime: new Date(finalState.endTime!).toISOString(),
            duration: finalState.duration,
            controls: finalState.controls,
            borgScale: finalState.borgScale,
            score: finalState.score,
          }),
        });
        if (response.ok) {
          console.log('Local database results saved successfully');
        } else {
          console.error('Local database save failed:', await response.text());
        }
      } catch (error) {
        console.error('Error saving to local database:', error);
      }
    }
  };

  const handleRestart = () => {
    setStep('welcome');
    setUserData(null);
    setSelectedCourseId(null);
    setRaceState(null);
  };

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">O</div>
            <h1 className="font-bold text-xl tracking-tight">Orienteer Pro</h1>
          </div>
          {userData && (
            <div className="hidden sm:flex items-center gap-3 text-sm font-medium text-slate-500">
              <span className="bg-slate-100 px-3 py-1 rounded-full">{userData.firstName} {userData.lastName}</span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">{userData.course}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WelcomeScreen onRegister={handleRegistrationComplete} />
            </motion.div>
          )}

          {step === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CourseSelection onSelect={handleCourseSelect} />
            </motion.div>
          )}

          {step === 'race' && selectedCourse && (
            <motion.div
              key="race"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <RaceInterface
                courseName={selectedCourse.name}
                controls={selectedCourse.controls}
                onFinish={handleRaceFinish}
              />
            </motion.div>
          )}

          {step === 'borg' && (
            <motion.div
              key="borg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <BorgScale onSelect={handleBorgSelect} />
            </motion.div>
          )}

          {step === 'results' && userData && raceState && selectedCourse && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ResultsView
                userData={userData}
                raceState={raceState}
                courseName={selectedCourse.name}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto py-8 text-center text-slate-400 text-sm">
        &copy; 2026 Orienteer Pro &bull; Aprendiendo a Orientarse en clase de Educación Física.
      </footer>
    </div>
  );
}
