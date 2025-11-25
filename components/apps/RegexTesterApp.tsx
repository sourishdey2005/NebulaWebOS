
import React, { useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle, FileSearch } from 'lucide-react';

export const RegexTesterApp: React.FC = () => {
  const [pattern, setPattern] = useState('[a-z]+@[a-z]+\\.[a-z]{2,}');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Contact us at support@nebula.os or admin@nebula.net for help.');

  const result = useMemo(() => {
    try {
        const regex = new RegExp(pattern, flags);
        const matches = [...text.matchAll(regex)];
        return { 
            valid: true, 
            matches: matches.map(m => ({ index: m.index, match: m[0] })),
            count: matches.length 
        };
    } catch (e: any) {
        return { valid: false, error: e.message };
    }
  }, [pattern, flags, text]);

  // Highlight logic (simplified)
  const renderHighlightedText = () => {
    if (!result.valid || result.count === 0) return text;
    
    let lastIndex = 0;
    const parts = [];
    
    result.matches!.forEach((m, i) => {
        if (m.index! > lastIndex) {
            parts.push(<span key={`text-${i}`}>{text.substring(lastIndex, m.index)}</span>);
        }
        parts.push(
            <span key={`match-${i}`} className="bg-blue-500/30 text-blue-200 rounded px-0.5 border-b border-blue-400">
                {m.match}
            </span>
        );
        lastIndex = m.index! + m.match.length;
    });

    if (lastIndex < text.length) {
        parts.push(<span key="tail">{text.substring(lastIndex)}</span>);
    }
    
    return parts;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white p-6 space-y-6">
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <FileSearch className="text-purple-400" />
                <h2 className="text-lg font-semibold">Regular Expression Tester</h2>
            </div>
            
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">/</span>
                    <input 
                        className={`w-full bg-black/20 border rounded-lg py-3 px-6 font-mono text-lg outline-none focus:ring-1 ${result.valid ? 'border-white/10 focus:border-purple-500' : 'border-red-500/50'}`}
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">/</span>
                </div>
                <input 
                    className="w-20 bg-black/20 border border-white/10 rounded-lg py-3 px-3 font-mono text-lg outline-none text-center"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    placeholder="flags"
                />
            </div>
            
            {!result.valid && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-2 rounded">
                    <AlertCircle size={14} /> {result.error}
                </div>
            )}
        </div>

        <div className="flex-1 space-y-2">
            <label className="text-xs text-gray-400 font-bold uppercase">Test String</label>
            <textarea 
                className="w-full h-32 bg-black/20 border border-white/10 rounded-lg p-4 text-sm font-mono outline-none focus:border-purple-500/50 resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-white/5 flex-1 overflow-auto">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-bold uppercase">Match Preview</span>
                {result.valid && <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">{result.count} matches</span>}
            </div>
            <div className="font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap break-all">
                {renderHighlightedText()}
            </div>
        </div>
    </div>
  );
};