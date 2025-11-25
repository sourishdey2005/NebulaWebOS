import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDefinition } from '../types';
import { Power, User, Search, ChevronRight } from 'lucide-react';

interface StartMenuProps {
  isOpen: boolean;
  apps: AppDefinition[];
  onOpenApp: (appId: string) => void;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, apps, onOpenApp, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div className="fixed inset-0 z-40" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 left-2 w-[400px] h-[500px] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Search Bar */}
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search apps, settings, and documents..." 
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Pinned Apps Grid */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pinned</h3>
                <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">All apps <ChevronRight size={12}/></button>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => { onOpenApp(app.id); onClose(); }}
                    className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-slate-700 transition-colors shadow-lg border border-white/5">
                      <app.icon size={20} className="text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-300 text-center truncate w-full">{app.title}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 mb-3">
                 <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended</h3>
              </div>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left group">
                    <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                        <span className="text-xs font-bold">X</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-200 group-hover:text-white">Project_Nebula_Budget.xlsx</span>
                        <span className="text-xs text-gray-500">Just now</span>
                    </div>
                </button>
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left group">
                    <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                        <span className="text-xs font-bold">W</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-200 group-hover:text-white">Q3_Report_Draft.docx</span>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="h-14 bg-black/20 border-t border-white/5 flex items-center justify-between px-4">
              <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs border border-white/20">
                    JD
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-200">John Doe</span>
                    <span className="text-[10px] text-gray-400">Admin</span>
                </div>
              </button>
              <button className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                <Power size={18} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
