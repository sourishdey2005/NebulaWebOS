import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Shuffle } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-black text-white">
      {/* Album Art Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
        <div className="relative group w-48 h-48 sm:w-64 sm:h-64 shadow-2xl transition-transform duration-500">
             <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-violet-600 rounded-2xl opacity-70 blur-xl group-hover:opacity-100 transition-opacity"></div>
             <img 
                src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop" 
                alt="Album Cover" 
                className="relative w-full h-full object-cover rounded-2xl shadow-inner"
             />
        </div>
        <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Midnight City</h2>
            <p className="text-gray-400 font-medium">Neon Dreams</p>
        </div>
      </div>
      
      {/* Controls Area */}
      <div className="bg-slate-900/50 backdrop-blur-md p-6 border-t border-white/5 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2 group">
             <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden cursor-pointer">
                <div className="bg-white group-hover:bg-green-400 h-full rounded-full transition-colors relative" style={{ width: `${progress}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1.5" />
                </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium font-mono">
                <span>1:12</span>
                <span>3:45</span>
            </div>
        </div>
        
        {/* Main Controls */}
        <div className="flex items-center justify-between max-w-sm mx-auto w-full">
            <button className="text-gray-400 hover:text-white transition-colors"><Shuffle size={18} /></button>
            
            <div className="flex items-center gap-6">
                <button className="text-gray-300 hover:text-white transition-colors"><SkipBack size={28} fill="currentColor" className="opacity-50" /></button>
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95"
                >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
                <button className="text-gray-300 hover:text-white transition-colors"><SkipForward size={28} fill="currentColor" className="opacity-50" /></button>
            </div>

            <button className="text-gray-400 hover:text-red-500 transition-colors"><Heart size={18} /></button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 justify-center max-w-xs mx-auto">
            <Volume2 size={16} className="text-gray-500" />
            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                <div className="h-full bg-gray-500 hover:bg-white transition-colors" style={{ width: `${volume}%` }} />
            </div>
        </div>
      </div>
    </div>
  );
};