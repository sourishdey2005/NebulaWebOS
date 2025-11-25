
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';

export const PomodoroApp: React.FC = () => {
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  const MODES = {
    focus: { label: 'Focus', time: 25 * 60, color: 'text-red-500' },
    short: { label: 'Short Break', time: 5 * 60, color: 'text-blue-500' },
    long: { label: 'Long Break', time: 15 * 60, color: 'text-green-500' }
  };

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // alert('Timer Finished!');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const switchMode = (m: 'focus' | 'short' | 'long') => {
    setIsActive(false);
    setMode(m);
    setTimeLeft(MODES[m].time);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800">
        <div className="flex justify-center p-4 gap-2 border-b">
            {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => (
                <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${mode === m ? 'bg-slate-800 text-white' : 'bg-slate-200 text-gray-500 hover:bg-slate-300'}`}
                >
                    {MODES[m].label}
                </button>
            ))}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className={`text-7xl font-mono font-bold tracking-tighter mb-8 ${MODES[mode].color} transition-colors`}>
                {formatTime(timeLeft)}
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={() => setIsActive(!isActive)}
                    className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                    {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
                <button 
                    onClick={() => setTimeLeft(MODES[mode].time)}
                    className="w-16 h-16 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shadow-lg hover:bg-gray-300 transition-all"
                >
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>

        <div className="p-4 bg-slate-100 text-xs text-center text-gray-500 flex items-center justify-center gap-2">
            <CheckCircle2 size={12} /> Stay productive
        </div>
    </div>
  );
};
