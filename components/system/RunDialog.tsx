
import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { APPS } from '../../constants';

interface RunDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRun: (cmd: string) => void;
}

export const RunDialog: React.FC<RunDialogProps> = ({ isOpen, onClose, onRun }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
        const cmd = input.toLowerCase().trim();
        // Check if it matches an app ID
        const app = APPS.find(a => a.id === cmd);
        if (app) {
            onRun(app.id);
        } else if (cmd === 'cmd') {
            onRun('terminal');
        } else if (cmd === 'calc') {
            onRun('calculator');
        } else {
            // Pass to file explorer logic or handle as error? For now just try to open
            onRun(input);
        }
        onClose();
        setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end left-4 bottom-16 sm:items-center sm:justify-center sm:inset-0 pointer-events-none">
        <div className="bg-slate-900 border border-white/10 rounded-lg shadow-2xl p-4 w-96 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-2 mb-3">
                <Play size={18} className="text-blue-400" />
                <h3 className="text-white font-medium">Run</h3>
            </div>
            <p className="text-xs text-gray-400 mb-3">Type the name of a program, folder, or document to open it.</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                    ref={inputRef}
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-1 text-sm text-white focus:border-blue-500 outline-none"
                    placeholder="e.g., terminal, calc, notepad"
                />
                <button type="submit" className="px-4 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors">
                    Run
                </button>
            </form>
        </div>
    </div>
  );
};
