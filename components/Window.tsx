import React, { useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  windowState: WindowState;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
}

export const Window: React.FC<WindowProps> = ({
  windowState,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}) => {
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  // If minimized, don't render (or render hidden if we wanted animation from taskbar, but simple unmount/hidden is fine for now)
  if (windowState.isMinimized) {
    return null;
  }

  return (
    <motion.div
      drag={!windowState.isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        width: windowState.isMaximized ? '100%' : windowState.size.width,
        height: windowState.isMaximized ? '100%' : windowState.size.height,
        x: windowState.isMaximized ? 0 : windowState.position.x,
        y: windowState.isMaximized ? 0 : windowState.position.y,
        borderRadius: windowState.isMaximized ? 0 : '12px',
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      onPointerDown={() => onFocus(windowState.id)}
      style={{
        zIndex: windowState.zIndex,
        position: 'absolute',
        top: 0, 
        left: 0,
      }}
      className={`flex flex-col overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl transition-shadow duration-200 ${
        isActive ? 'shadow-blue-500/20 border-white/20' : ''
      }`}
    >
      {/* Title Bar */}
      <div
        className="h-10 flex items-center justify-between px-3 bg-white/5 select-none"
        onPointerDown={(e) => {
          dragControls.start(e);
          onFocus(windowState.id);
        }}
        onDoubleClick={() => onMaximize(windowState.id)}
      >
        <div className="flex items-center gap-2">
          <windowState.icon size={16} className="text-blue-400" />
          <span className="text-xs font-medium text-gray-200">{windowState.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }}
            className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(windowState.id); }}
            className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
          >
            {windowState.isMaximized ? <Maximize2 size={12} /> : <Square size={12} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
            className="p-1.5 hover:bg-red-500/80 rounded-md text-gray-400 hover:text-white transition-colors group"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {windowState.component}
        
        {/* Interaction overlay to prevent iframe stealing clicks when window not active (if we used iframes) */}
        {!isActive && <div className="absolute inset-0 bg-transparent" />}
      </div>
    </motion.div>
  );
};
