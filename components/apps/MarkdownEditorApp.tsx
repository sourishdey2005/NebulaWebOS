
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Eye, Columns } from 'lucide-react';

export const MarkdownEditorApp: React.FC = () => {
  const [markdown, setMarkdown] = useState(`# Welcome to Nebula Markdown

This is a **split-screen** editor.

## Features
- Real-time preview
- Syntax highlighting
- Clean interface

Try typing on the left!
  `);

  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Toolbar */}
      <div className="h-10 bg-slate-800 border-b border-white/10 flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <FileText size={14} className="text-blue-400" /> untitled.md
        </div>
        
        <div className="flex bg-slate-700/50 rounded-lg p-0.5">
            <button 
                onClick={() => setViewMode('edit')}
                className={`px-2 py-1 rounded text-xs transition-colors ${viewMode === 'edit' ? 'bg-slate-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                Edit
            </button>
            <button 
                onClick={() => setViewMode('split')}
                className={`px-2 py-1 rounded text-xs transition-colors ${viewMode === 'split' ? 'bg-slate-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <Columns size={12} />
            </button>
            <button 
                onClick={() => setViewMode('preview')}
                className={`px-2 py-1 rounded text-xs transition-colors ${viewMode === 'preview' ? 'bg-slate-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <Eye size={12} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        {(viewMode === 'split' || viewMode === 'edit') && (
            <div className={`h-full border-r border-white/10 bg-slate-900 ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="w-full h-full bg-transparent p-4 text-sm font-mono text-gray-300 resize-none focus:outline-none leading-relaxed"
                    placeholder="Type markdown here..."
                    spellCheck={false}
                />
            </div>
        )}

        {/* Preview Pane */}
        {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`h-full bg-slate-800/50 overflow-y-auto custom-scrollbar p-6 ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                <article className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </article>
            </div>
        )}
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-slate-950 border-t border-white/5 flex items-center px-3 text-[10px] text-gray-500 justify-end gap-4">
        <span>{markdown.length} chars</span>
        <span>{markdown.split('\n').length} lines</span>
        <span>Markdown</span>
      </div>
    </div>
  );
};
