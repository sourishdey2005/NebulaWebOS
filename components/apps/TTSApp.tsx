
import React, { useState } from 'react';
import { Play, Square } from 'lucide-react';

export const TTSApp: React.FC = () => {
  const [text, setText] = useState('Welcome to Nebula OS. How can I help you today?');
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setSpeaking(false);
        setSpeaking(true);
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Browser does not support TTS');
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 p-6">
        <textarea 
            className="flex-1 w-full bg-gray-50 border rounded-lg p-4 resize-none outline-none focus:border-blue-500 text-lg"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something to speak..."
        />
        
        <div className="mt-4 flex gap-4">
            <button 
                onClick={speak}
                disabled={speaking}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
            >
                <Play size={20} /> Speak
            </button>
            <button 
                onClick={stop}
                disabled={!speaking}
                className="w-16 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center"
            >
                <Square size={20} fill="currentColor" />
            </button>
        </div>
    </div>
  );
};
