
import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, User } from 'lucide-react';
import { format } from 'date-fns';

interface LockScreenProps {
  onUnlock: () => void;
  username: string;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, username }) => {
  const [password, setPassword] = useState('');
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password.length > 0) { // Accept any password for demo
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center text-white animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="mb-12 text-center">
          <h1 className="text-8xl font-thin tracking-tighter mb-2">
            {format(time, 'h:mm')}
          </h1>
          <p className="text-xl font-medium text-blue-200">
            {format(time, 'EEEE, MMMM d')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-2xl">
            <User size={48} className="text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-semibold">{username}</h2>

          <form onSubmit={handleUnlock} className="w-full relative group">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white/10 border ${error ? 'border-red-500 animate-shake' : 'border-white/20'} rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 outline-none focus:bg-white/20 focus:border-blue-400 transition-all text-center`}
              autoFocus
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
            <Lock size={12} /> System Locked
          </p>
        </div>
      </div>
      
      <div className="pb-8 text-xs text-gray-500">
        Press Enter to unlock
      </div>
    </div>
  );
};
