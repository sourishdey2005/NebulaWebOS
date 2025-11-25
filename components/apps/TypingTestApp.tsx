
import React, { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

const SENTENCES = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump.",
    "Sphinx of black quartz, judge my vow.",
    "Two driven jocks help fax my big quiz."
];

export const TypingTestApp: React.FC = () => {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    setText(SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
    setInput('');
    setStartTime(null);
    setWpm(0);
    setCompleted(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    if (!startTime) setStartTime(Date.now());

    if (val === text) {
        setCompleted(true);
        const time = (Date.now() - startTime!) / 60000;
        const words = text.split(' ').length;
        setWpm(Math.round(words / time));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white p-8 items-center justify-center">
        <div className="w-full max-w-2xl text-center space-y-8">
            <h2 className="text-gray-400 font-medium">Type the sentence below:</h2>
            
            <div className="text-2xl font-mono leading-relaxed bg-black/30 p-6 rounded-xl border border-white/10 relative">
                <span className="text-green-400">{text.substring(0, input.length)}</span>
                <span className="text-gray-500">{text.substring(input.length)}</span>
            </div>

            <input 
                type="text" 
                value={input}
                onChange={handleChange}
                disabled={completed}
                className="w-full bg-transparent border-b-2 border-blue-500 text-2xl font-mono text-center outline-none py-2 focus:border-blue-400 transition-colors"
                autoFocus
                placeholder="Start typing..."
            />

            {completed && (
                <div className="animate-in zoom-in duration-300">
                    <div className="text-6xl font-bold text-blue-400 mb-2">{wpm}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-widest">Words Per Minute</div>
                    
                    <button onClick={reset} className="mt-8 flex items-center gap-2 mx-auto text-gray-400 hover:text-white transition-colors">
                        <RefreshCcw size={16} /> Try Again
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};
