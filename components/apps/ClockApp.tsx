
import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon, Timer, Hourglass, Globe } from 'lucide-react';

export const ClockApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'world' | 'stopwatch' | 'timer'>('world');
  const [time, setTime] = useState(new Date());

  // Stopwatch state
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);

  // Timer state
  const [timerTime, setTimerTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInput, setTimerInput] = useState(5); // minutes

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let t: any;
    if (swRunning) {
        t = setInterval(() => setSwTime(prev => prev + 10), 10);
    }
    return () => clearInterval(t);
  }, [swRunning]);

  useEffect(() => {
    let t: any;
    if (timerRunning && timerTime > 0) {
        t = setInterval(() => setTimerTime(prev => prev - 1), 1000);
    } else if (timerTime === 0 && timerRunning) {
        setTimerRunning(false);
        alert('Timer Done!');
    }
    return () => clearInterval(t);
  }, [timerRunning, timerTime]);

  const formatSw = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const milli = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${milli.toString().padStart(2, '0')}`;
  };

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const cities = [
    { name: 'Local', tz: 0, date: time },
    { name: 'New York', tz: -5, date: new Date(time.getTime() - 5 * 3600000) }, // Simplified offset
    { name: 'London', tz: 0, date: new Date(time.getTime()) },
    { name: 'Tokyo', tz: 9, date: new Date(time.getTime() + 9 * 3600000) },
  ];

  return (
    <div className="flex h-full bg-slate-900 text-white">
        {/* Sidebar */}
        <div className="w-20 bg-slate-950 flex flex-col items-center py-6 gap-6 border-r border-white/5">
            <button onClick={() => setActiveTab('world')} className={`p-3 rounded-xl transition-all ${activeTab === 'world' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-white/10'}`}>
                <Globe size={24} />
            </button>
            <button onClick={() => setActiveTab('stopwatch')} className={`p-3 rounded-xl transition-all ${activeTab === 'stopwatch' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-white/10'}`}>
                <ClockIcon size={24} />
            </button>
            <button onClick={() => setActiveTab('timer')} className={`p-3 rounded-xl transition-all ${activeTab === 'timer' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-white/10'}`}>
                <Hourglass size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {activeTab === 'world' && (
                <div className="w-full max-w-md space-y-4">
                    <h2 className="text-3xl font-light mb-8 text-center">World Clock</h2>
                    {cities.map(c => (
                        <div key={c.name} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                                <div className="text-gray-400 text-sm">{c.name}</div>
                                <div className="text-xs text-gray-500">{c.tz === 0 ? 'Today' : (c.tz > 0 ? `Today +${c.tz}h` : `Today ${c.tz}h`)}</div>
                            </div>
                            <div className="text-2xl font-mono">{c.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'stopwatch' && (
                <div className="text-center">
                    <div className="w-64 h-64 rounded-full border-4 border-blue-500 flex items-center justify-center mb-8 bg-slate-800/50 relative">
                        <div className="text-5xl font-mono font-light tracking-widest">{formatSw(swTime)}</div>
                        {swRunning && <div className="absolute inset-0 rounded-full border-t-4 border-white animate-spin opacity-20" />}
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => setSwRunning(!swRunning)}
                            className={`px-8 py-3 rounded-full text-lg font-medium transition-colors ${swRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                            {swRunning ? 'Stop' : 'Start'}
                        </button>
                        <button 
                            onClick={() => { setSwRunning(false); setSwTime(0); }}
                            className="px-6 py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-gray-300"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'timer' && (
                <div className="text-center">
                    {timerRunning || timerTime > 0 ? (
                        <div className="text-7xl font-mono font-bold mb-12 text-blue-400">{formatTimer(timerTime)}</div>
                    ) : (
                        <div className="mb-12 flex items-center justify-center gap-2">
                             <input 
                                type="number" 
                                value={timerInput} 
                                onChange={(e) => setTimerInput(parseInt(e.target.value))}
                                className="bg-transparent border-b-2 border-blue-500 text-6xl w-32 text-center outline-none"
                             />
                             <span className="text-xl text-gray-500">min</span>
                        </div>
                    )}
                    
                    <div className="flex gap-4 justify-center">
                         {!timerRunning && timerTime === 0 ? (
                             <button 
                                onClick={() => { setTimerTime(timerInput * 60); setTimerRunning(true); }}
                                className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
                            >
                                Start Timer
                            </button>
                         ) : (
                            <>
                                <button 
                                    onClick={() => setTimerRunning(!timerRunning)}
                                    className={`px-8 py-3 rounded-full font-medium ${timerRunning ? 'bg-orange-500' : 'bg-green-500'}`}
                                >
                                    {timerRunning ? 'Pause' : 'Resume'}
                                </button>
                                <button 
                                    onClick={() => { setTimerRunning(false); setTimerTime(0); }}
                                    className="px-6 py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-gray-300"
                                >
                                    Cancel
                                </button>
                            </>
                         )}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};