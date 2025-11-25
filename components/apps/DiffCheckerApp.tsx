
import React, { useState } from 'react';

export const DiffCheckerApp: React.FC = () => {
  const [left, setLeft] = useState('Nebula OS v1.0\nFeatures:\n- Web based\n- Fast');
  const [right, setRight] = useState('Nebula OS v2.0\nFeatures:\n- Web based\n- Super Fast\n- AI Integrated');

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
        <div className="h-10 border-b border-white/10 flex items-center px-4 font-bold bg-slate-950">
            Diff Checker
        </div>
        <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 border-r border-white/10 flex flex-col">
                <div className="bg-slate-800 px-3 py-1 text-xs text-gray-400">Original</div>
                <textarea 
                    className="flex-1 bg-transparent p-4 resize-none outline-none font-mono text-sm" 
                    value={left} 
                    onChange={(e) => setLeft(e.target.value)} 
                />
            </div>
            <div className="flex-1 flex flex-col">
                <div className="bg-slate-800 px-3 py-1 text-xs text-gray-400">Modified</div>
                <textarea 
                    className="flex-1 bg-transparent p-4 resize-none outline-none font-mono text-sm" 
                    value={right} 
                    onChange={(e) => setRight(e.target.value)} 
                />
            </div>
        </div>
        <div className="h-8 bg-slate-950 flex items-center justify-center text-xs text-gray-500">
            Simple text comparison mode
        </div>
    </div>
  );
};
