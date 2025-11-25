import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Bluetooth, Moon, Sun, Volume2, Monitor, Shield, Battery } from 'lucide-react';
import { SystemState } from '../../types';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  systemState: SystemState;
  setSystemState: React.Dispatch<React.SetStateAction<SystemState>>;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({ 
  isOpen, 
  onClose,
  systemState,
  setSystemState
}) => {
  const toggleSetting = (key: keyof SystemState) => {
    if (typeof systemState[key] === 'boolean') {
      setSystemState(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSliderChange = (key: 'brightness' | 'volume', value: number) => {
    setSystemState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 right-4 w-80 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 p-4 text-white"
          >
            {/* Connectivity Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Wi-Fi */}
              <button 
                onClick={() => toggleSetting('wifi')}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  systemState.wifi 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
              >
                <Wifi size={20} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">Wi-Fi</span>
                  <span className="text-xs opacity-80">{systemState.wifi ? 'Connected' : 'Off'}</span>
                </div>
              </button>

              {/* Bluetooth */}
              <button 
                onClick={() => toggleSetting('bluetooth')}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  systemState.bluetooth 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
              >
                <Bluetooth size={20} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">Bluetooth</span>
                  <span className="text-xs opacity-80">{systemState.bluetooth ? 'On' : 'Off'}</span>
                </div>
              </button>
            </div>

            {/* Sliders */}
            <div className="space-y-4 mb-6">
              {/* Brightness */}
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-3 mb-2">
                  <Sun size={16} className="text-gray-300" />
                  <span className="text-xs font-medium text-gray-300">Display</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={systemState.brightness}
                  onChange={(e) => handleSliderChange('brightness', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                />
              </div>

              {/* Volume */}
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-3 mb-2">
                  <Volume2 size={16} className="text-gray-300" />
                  <span className="text-xs font-medium text-gray-300">Sound</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={systemState.volume}
                  onChange={(e) => handleSliderChange('volume', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                />
              </div>
            </div>

            {/* Bottom Toggles */}
            <div className="grid grid-cols-4 gap-2">
              <button className="aspect-square flex flex-col items-center justify-center gap-1 bg-white/10 rounded-xl hover:bg-white/15 transition-colors text-gray-300">
                <Moon size={18} />
                <span className="text-[10px]">Theme</span>
              </button>
              <button className="aspect-square flex flex-col items-center justify-center gap-1 bg-white/10 rounded-xl hover:bg-white/15 transition-colors text-gray-300">
                <Shield size={18} />
                <span className="text-[10px]">Privacy</span>
              </button>
              <button className="aspect-square flex flex-col items-center justify-center gap-1 bg-white/10 rounded-xl hover:bg-white/15 transition-colors text-gray-300">
                <Monitor size={18} />
                <span className="text-[10px]">Project</span>
              </button>
              <div className="aspect-square flex flex-col items-center justify-center gap-1 bg-white/5 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Battery size={18} />
                <span className="text-[10px]">100%</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};