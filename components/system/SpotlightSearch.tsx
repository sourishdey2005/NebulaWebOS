
import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, AppWindow, File } from 'lucide-react';
import { AppDefinition } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppDefinition[];
  onLaunchApp: (appId: string) => void;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({ isOpen, onClose, apps, onLaunchApp }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredApps = query 
    ? apps.filter(app => app.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => Math.min(prev + 1, filteredApps.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (filteredApps[selectedIndex]) {
        onLaunchApp(filteredApps[selectedIndex].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm" onClick={onClose} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-[600px] max-w-[90vw] flex flex-col shadow-2xl rounded-xl overflow-hidden bg-slate-900/90 border border-white/10 backdrop-blur-xl text-white"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <Search className="w-6 h-6 text-gray-400 mr-3" />
              <input 
                ref={inputRef}
                className="flex-1 bg-transparent text-xl outline-none placeholder-gray-500"
                placeholder="Spotlight Search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
              />
            </div>

            {filteredApps.length > 0 && (
              <div className="py-2 max-h-[300px] overflow-y-auto">
                <div className="px-4 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider">Applications</div>
                {filteredApps.map((app, idx) => (
                  <button
                    key={app.id}
                    onClick={() => { onLaunchApp(app.id); onClose(); }}
                    className={`w-full flex items-center px-4 py-2 text-left transition-colors ${idx === selectedIndex ? 'bg-blue-600' : 'hover:bg-white/5'}`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded mr-3">
                        <app.icon size={18} />
                    </div>
                    <span className="flex-1 font-medium">{app.title}</span>
                    {idx === selectedIndex && <ArrowRight size={16} className="text-white/50" />}
                  </button>
                ))}
              </div>
            )}
            
            {query && filteredApps.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No results found for "{query}"
                </div>
            )}
            
            {!query && (
                <div className="p-4 text-xs text-center text-gray-500 border-t border-white/5 bg-black/20">
                    Type to search apps, files, and settings...
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
