
import React, { useState } from 'react';
import { Copy, RefreshCw, ShieldCheck } from 'lucide-react';

export const PasswordGenApp: React.FC = () => {
  const [length, setLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [password, setPassword] = useState('');

  const generate = () => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const syms = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    let chars = lower;
    if (includeUppercase) chars += upper;
    if (includeNumbers) chars += nums;
    if (includeSymbols) chars += syms;

    let pass = "";
    for (let i = 0; i < length; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  // Init
  React.useEffect(() => { generate(); }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white p-6">
        <div className="bg-black/30 rounded-xl p-6 mb-6 border border-white/10 flex flex-col gap-2 relative">
            <span className="text-xs text-gray-500 font-bold uppercase">Generated Password</span>
            <div className="text-2xl font-mono break-all text-green-400">{password}</div>
            <button 
                onClick={() => navigator.clipboard.writeText(password)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
                <Copy size={18} />
            </button>
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Length: {length}</label>
                <input 
                    type="range" min="8" max="64" 
                    value={length} onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-48"
                />
            </div>
            
            <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm">Include Uppercase</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm">Include Numbers</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm">Include Symbols</span>
                </label>
            </div>

            <button 
                onClick={generate}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center justify-center gap-2 mt-4"
            >
                <RefreshCw size={18} /> Generate New
            </button>
        </div>
    </div>
  );
};
