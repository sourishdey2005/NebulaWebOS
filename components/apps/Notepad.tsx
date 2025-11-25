import React, { useState, useEffect } from 'react';
import { Save, File, CornerUpLeft, CheckCircle2 } from 'lucide-react';

export const Notepad: React.FC = () => {
  const [content, setContent] = useState('');
  const [notification, setNotification] = useState('');

  // Load from local storage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('nebula-notepad-content');
    if (savedContent !== null) {
      setContent(savedContent);
    } else {
      setContent('Welcome to Nebula OS Notepad.\n\nStart typing...');
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('nebula-notepad-content', content);
      setNotification('Saved successfully');
      
      // Clear notification after 2 seconds
      setTimeout(() => {
        setNotification('');
      }, 2000);
    } catch (e) {
      setNotification('Error saving');
    }
  };

  const handleNew = () => {
    if (content.trim().length > 0 && !window.confirm("Start a new file? Unsaved changes will be lost unless you save first.")) {
      return;
    }
    setContent('');
    setNotification('New file created');
    setTimeout(() => setNotification(''), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Menu Bar */}
      <div className="flex items-center gap-1 p-1 bg-slate-800 border-b border-white/10 shrink-0 select-none">
        <button 
          onClick={handleNew}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 hover:text-white rounded transition-colors focus:outline-none focus:bg-white/10"
          title="Create New File"
        >
          <File size={14} /> New
        </button>
        <button 
          onClick={handleSave}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 hover:text-white rounded transition-colors focus:outline-none focus:bg-white/10"
          title="Save to Local Storage"
        >
          <Save size={14} /> Save
        </button>
        <div className="h-4 w-px bg-white/10 mx-1" />
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 cursor-not-allowed rounded">
          <CornerUpLeft size={14} /> Undo
        </button>
        
        {/* Status Notification */}
        {notification && (
            <div className="ml-auto flex items-center gap-1.5 px-2 text-xs text-emerald-400 animate-in fade-in slide-in-from-right-2 duration-300">
                <CheckCircle2 size={12} />
                {notification}
            </div>
        )}
      </div>

      {/* Editor Area */}
      <textarea
        className="flex-1 w-full bg-slate-900/50 p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:bg-slate-900 transition-colors selection:bg-blue-500/30"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
        autoFocus
        placeholder="Type here..."
      />

      {/* Status Bar */}
      <div className="px-3 py-1 bg-slate-950 border-t border-white/5 text-[10px] text-gray-500 flex justify-between shrink-0 select-none">
        <span>UTF-8</span>
        <span>{content.length} chars | {content.split('\n').length} lines</span>
      </div>
    </div>
  );
};