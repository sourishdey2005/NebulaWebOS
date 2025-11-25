
import React from 'react';
import { AppDefinition, StickyNote, DesktopIcon } from '../types';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface DesktopProps {
  apps: AppDefinition[];
  onOpenApp: (appId: string) => void;
  stickyNotes?: StickyNote[];
  setStickyNotes?: React.Dispatch<React.SetStateAction<StickyNote[]>>;
  desktopIcons?: DesktopIcon[];
  onUpdateIconPosition?: (id: string, x: number, y: number) => void;
}

export const Desktop: React.FC<DesktopProps> = ({ 
    apps, 
    onOpenApp, 
    stickyNotes = [], 
    setStickyNotes,
    desktopIcons = [],
    onUpdateIconPosition
}) => {
  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (setStickyNotes) {
        setStickyNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleNoteChange = (id: string, text: string) => {
    if (setStickyNotes) {
        setStickyNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
    }
  };

  return (
    <div className="absolute inset-0 p-0 w-full h-[calc(100%-56px)] overflow-hidden">
      {/* Credit Watermark */}
      <div className="absolute bottom-6 right-6 text-white/30 text-sm font-medium select-none pointer-events-none z-0">
        Made by Sourish Dey
      </div>

      {/* Sticky Notes Layer */}
      {stickyNotes.map((note) => (
        <div 
            key={note.id}
            className="absolute p-4 rounded-lg shadow-lg w-48 min-h-[160px] flex flex-col animate-in zoom-in duration-200 z-[11]"
            style={{ 
                left: note.x, 
                top: note.y, 
                backgroundColor: note.color,
                color: '#1e293b'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-2 opacity-50 hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold uppercase tracking-wider">Note</span>
                <button onClick={(e) => handleDeleteNote(note.id, e)} className="hover:bg-black/10 rounded p-0.5"><X size={12}/></button>
            </div>
            <textarea
                className="flex-1 w-full bg-transparent resize-none outline-none text-sm font-medium placeholder-slate-500/50"
                value={note.text}
                onChange={(e) => handleNoteChange(note.id, e.target.value)}
                placeholder="Type a note..."
            />
        </div>
      ))}

      {/* App Icons Layer - Draggable */}
      {desktopIcons.map((icon) => {
        const app = apps.find(a => a.id === icon.appId);
        if (!app) return null;

        return (
            <motion.div
                key={icon.id}
                initial={{ x: icon.x, y: icon.y }}
                animate={{ x: icon.x, y: icon.y }}
                drag
                dragMomentum={false}
                onDragEnd={(_event, info) => {
                    if (onUpdateIconPosition) {
                        onUpdateIconPosition(icon.id, icon.x + info.offset.x, icon.y + info.offset.y);
                    }
                }}
                onClick={() => onOpenApp(app.id)}
                className="absolute flex flex-col items-center justify-center gap-2 w-24 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer active:cursor-grabbing z-[12]"
            >
                <div className="w-14 h-14 bg-slate-900/60 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl group-hover:scale-105 group-hover:bg-slate-800/80 transition-all duration-200 backdrop-blur-md group-hover:border-white/20">
                    <app.icon className="text-blue-100 drop-shadow-md opacity-90 group-hover:opacity-100 group-hover:text-white" size={28} />
                </div>
                <span className="text-xs text-blue-50 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center line-clamp-2 leading-tight tracking-wide group-hover:text-white pointer-events-none select-none">
                    {app.title}
                </span>
            </motion.div>
        );
      })}
    </div>
  );
};
