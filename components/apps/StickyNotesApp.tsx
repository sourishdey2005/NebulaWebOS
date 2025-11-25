
import React from 'react';
import { Plus, Trash2, StickyNote as StickyIcon } from 'lucide-react';
import { StickyNote } from '../../types';

interface StickyNotesAppProps {
  stickyNotes?: StickyNote[];
  setStickyNotes?: React.Dispatch<React.SetStateAction<StickyNote[]>>;
}

export const StickyNotesApp: React.FC<StickyNotesAppProps> = ({ stickyNotes = [], setStickyNotes }) => {
  const addNote = (color: string) => {
    if (!setStickyNotes) return;
    const newNote: StickyNote = {
      id: Date.now().toString(),
      text: '',
      color,
      x: 300 + (stickyNotes.length * 30),
      y: 100 + (stickyNotes.length * 30),
    };
    setStickyNotes(prev => [...prev, newNote]);
  };

  const colors = [
    { name: 'Yellow', value: '#fef3c7' }, // amber-100
    { name: 'Blue', value: '#dbeafe' }, // blue-100
    { name: 'Green', value: '#dcfce7' }, // green-100
    { name: 'Pink', value: '#fce7f3' }, // pink-100
    { name: 'Purple', value: '#f3e8ff' }, // purple-100
  ];

  return (
    <div className="flex flex-col h-full bg-white text-slate-800">
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
            <StickyIcon size={18} className="text-amber-500" /> Sticky Notes
        </h2>
        <span className="text-xs text-gray-500">{stickyNotes.length} active</span>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
            {colors.map((c) => (
                <button
                    key={c.name}
                    onClick={() => addNote(c.value)}
                    className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    style={{ backgroundColor: c.value }}
                >
                    <Plus size={16} className="text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">{c.name}</span>
                </button>
            ))}
        </div>

        <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold mb-2 text-gray-600">Active Notes</h3>
            {stickyNotes.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No sticky notes on desktop.</p>
            ) : (
                <div className="space-y-2">
                    {stickyNotes.map(note => (
                        <div key={note.id} className="flex items-center justify-between p-2 rounded border bg-gray-50 text-sm">
                            <div className="flex items-center gap-2 truncate">
                                <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: note.color }} />
                                <span className="truncate max-w-[150px]">{note.text || 'Empty note'}</span>
                            </div>
                            <button 
                                onClick={() => setStickyNotes?.(prev => prev.filter(n => n.id !== note.id))}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
      
      <div className="p-3 bg-gray-50 border-t text-xs text-center text-gray-500">
        Notes are pinned to your desktop wallpaper
      </div>
    </div>
  );
};