
import React, { useState } from 'react';
import { Copy, Trash2, ClipboardList } from 'lucide-react';

export const ClipboardManagerApp: React.FC = () => {
  const [history, setHistory] = useState<string[]>([
    "Nebula Web OS",
    "https://google.com",
    "console.log('Hello World')",
    "Meeting at 2 PM",
    "#0f172a"
  ]);

  const copyToClipboard = (text: string) => {
    // In a real browser context without user permission on click this might fail, 
    // but within our simulated OS we can just "simulate" a copy or try the API.
    navigator.clipboard.writeText(text).then(() => {
        // success animation?
    }).catch(err => console.error('Failed to copy', err));
  };

  const deleteItem = (index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => setHistory([]);

  return (
    <div className="flex flex-col h-full bg-slate-50 text-gray-800">
      <div className="bg-white border-b p-3 flex items-center justify-between shadow-sm">
        <h2 className="font-semibold flex items-center gap-2">
            <ClipboardList className="text-blue-500" size={18} /> History
        </h2>
        <button onClick={clearAll} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors">
            Clear All
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50">
        {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                Clipboard is empty
            </div>
        ) : (
            history.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group relative">
                    <p className="text-sm text-gray-700 line-clamp-2 pr-6 font-mono break-all">{item}</p>
                    <div className="flex items-center gap-2 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => copyToClipboard(item)}
                            className="text-[10px] flex items-center gap-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 px-2 py-1 rounded transition-colors"
                        >
                            <Copy size={10} /> Copy
                        </button>
                    </div>
                    <button 
                        onClick={() => deleteItem(idx)}
                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
