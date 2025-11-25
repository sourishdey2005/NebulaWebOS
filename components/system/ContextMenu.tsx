
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Image, FolderPlus, Settings, Info } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onOpenSettings: () => void;
  onChangeWallpaper: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  isOpen,
  onClose,
  onRefresh,
  onOpenSettings,
  onChangeWallpaper
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{ top: y, left: x }}
            className="fixed w-48 bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 py-1 overflow-hidden"
            onClick={onClose}
          >
            <button 
              onClick={onRefresh}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-blue-600 hover:text-white transition-colors text-left"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            
            <div className="h-px bg-white/10 my-1" />
            
            <button 
              onClick={onChangeWallpaper}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-blue-600 hover:text-white transition-colors text-left"
            >
              <Image size={14} />
              Next Wallpaper
            </button>
            
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-blue-600 hover:text-white transition-colors text-left">
              <FolderPlus size={14} />
              New Folder
            </button>
            
            <div className="h-px bg-white/10 my-1" />
            
            <button 
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-blue-600 hover:text-white transition-colors text-left"
            >
              <Settings size={14} />
              Settings
            </button>
            
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-blue-600 hover:text-white transition-colors text-left">
              <Info size={14} />
              System Info
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
