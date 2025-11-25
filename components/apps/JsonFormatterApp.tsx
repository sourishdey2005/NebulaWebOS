
import React, { useState } from 'react';
import { Braces, Copy, Play } from 'lucide-react';

export const JsonFormatterApp: React.FC = () => {
  const [input, setInput] = useState('{"name":"Nebula","type":"OS","version":1.0,"features":["web","ai","react"]}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white p-4 gap-4">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
             <Braces className="text-yellow-400" /> JSON Prettifier
          </div>
          <button 
             onClick={format}
             className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium flex items-center gap-2"
          >
             <Play size={16} /> Format
          </button>
       </div>

       <div className="flex-1 flex gap-4 overflow-hidden">
          <div className="flex-1 flex flex-col gap-2">
             <label className="text-xs text-gray-400 font-bold uppercase">Input</label>
             <textarea 
                className="flex-1 bg-black/30 border border-white/10 rounded-lg p-4 font-mono text-xs resize-none outline-none focus:border-blue-500/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste JSON here..."
             />
          </div>
          
          <div className="flex-1 flex flex-col gap-2">
             <label className="text-xs text-gray-400 font-bold uppercase flex justify-between">
                Output
                {output && <button onClick={() => navigator.clipboard.writeText(output)} className="text-blue-400 hover:text-white flex items-center gap-1"><Copy size={12}/> Copy</button>}
             </label>
             <div className={`flex-1 bg-black/30 border rounded-lg p-4 font-mono text-xs overflow-auto whitespace-pre ${error ? 'border-red-500/50 text-red-400' : 'border-white/10 text-green-400'}`}>
                {error ? error : output || 'Result will appear here...'}
             </div>
          </div>
       </div>
    </div>
  );
};