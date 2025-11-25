import React, { useRef, useState } from 'react';
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
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, size: { width: number; height: number }, position?: { x: number; y: number }) => void;
}

export const Window: React.FC<WindowProps> = ({
  windowState,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize
}) => {
  const dragControls = useDragControls();
  const [isResizing, setIsResizing] = useState(false);

  // If minimized, don't render
  if (windowState.isMinimized) {
    return null;
  }

  const handleResizeStart = (e: React.PointerEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus(windowState.id);
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowState.size.width;
    const startHeight = windowState.size.height;
    const startPosX = windowState.position.x;
    const startPosY = windowState.position.y;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      if (direction.includes('e')) newWidth = Math.max(300, startWidth + deltaX);
      if (direction.includes('w')) {
        const w = Math.max(300, startWidth - deltaX);
        newWidth = w;
        newX = startPosX + (startWidth - w);
      }
      if (direction.includes('s')) newHeight = Math.max(200, startHeight + deltaY);
      if (direction.includes('n')) {
        const h = Math.max(200, startHeight - deltaY);
        newHeight = h;
        newY = startPosY + (startHeight - h);
      }

      onResize(windowState.id, { width: newWidth, height: newHeight }, { x: newX, y: newY });
    };

    const onPointerUp = () => {
      setIsResizing(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <motion.div
      drag={!windowState.isMaximized && !isResizing}
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
      transition={{ duration: 0 }} // Instant update for resize/drag
      exit={{ scale: 0.9, opacity: 0 }}
      onPointerDown={() => onFocus(windowState.id)}
      onDragEnd={(_e, info) => {
        if (!windowState.isMaximized) {
          onMove(windowState.id, windowState.position.x + info.offset.x, windowState.position.y + info.offset.y);
        }
      }}
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
      {/* Resize Handles - Only when not maximized */}
      {!windowState.isMaximized && (
        <>
            {/* Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50" onPointerDown={(e) => handleResizeStart(e, 'nw')} />
            <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50" onPointerDown={(e) => handleResizeStart(e, 'ne')} />
            <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50" onPointerDown={(e) => handleResizeStart(e, 'sw')} />
            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" onPointerDown={(e) => handleResizeStart(e, 'se')} />
            
            {/* Edges */}
            <div className="absolute top-0 left-4 right-4 h-2 cursor-n-resize z-40" onPointerDown={(e) => handleResizeStart(e, 'n')} />
            <div className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize z-40" onPointerDown={(e) => handleResizeStart(e, 's')} />
            <div className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize z-40" onPointerDown={(e) => handleResizeStart(e, 'w')} />
            <div className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize z-40" onPointerDown={(e) => handleResizeStart(e, 'e')} />
        </>
      )}

      {/* Title Bar */}
      <div
        className="h-10 flex items-center justify-between px-3 bg-white/5 select-none shrink-0"
        onPointerDown={(e) => {
          if (!windowState.isMaximized) {
            dragControls.start(e);
          }
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
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {windowState.component}
        
        {/* Interaction overlay to prevent iframe stealing clicks when moving/resizing or inactive */}
        {(!isActive || isResizing) && <div className="absolute inset-0 bg-transparent z-40" />}
      </div>
    </motion.div>
  );
};