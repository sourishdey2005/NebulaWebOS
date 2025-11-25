
import React, { useState, useEffect } from 'react';
import { Save, File, CornerUpLeft, CheckCircle2 } from 'lucide-react';
import { FileSystemNode } from '../../types';

interface NotepadProps {
  fs?: FileSystemNode;
  setFs?: React.Dispatch<React.SetStateAction<FileSystemNode>>;
}

export const Notepad: React.FC<NotepadProps> = ({ fs, setFs }) => {
  const [content, setContent] = useState('');
  const [notification, setNotification] = useState('');
  
  // Specific path for default notes
  const filePath = ['home', 'guest', 'documents', 'notes.txt'];

  // Helper to get nested node
  const getNode = (root: FileSystemNode, path: string[]) => {
    let current = root;
    for (const p of path) {
        if (current.children && current.children[p]) {
            current = current.children[p];
        } else {
            return null;
        }
    }
    return current;
  };

  // Load from File System on mount
  useEffect(() => {
    if (fs) {
        const node = getNode(fs, filePath);
        if (node && node.type === 'file') {
            setContent(node.content || '');
        } else {
            setContent('Welcome to Nebula OS Notepad.\n\nStart typing...');
        }
    }
  }, [fs]); // Only run when fs is initially available or changes externally

  const handleSave = () => {
    if (!fs || !setFs) {
        setNotification('Error: File System unavailable');
        return;
    }

    try {
      const newFs = JSON.parse(JSON.stringify(fs));
      // Ensure path exists - simple check for this prototype
      if (!newFs.children.home.children.guest.children.documents) {
         newFs.children.home.children.guest.children.documents = { type: 'dir', children: {} };
      }
      
      newFs.children.home.children.guest.children.documents.children['notes.txt'] = {
          type: 'file',
          content: content
      };

      setFs(newFs);
      setNotification('Saved to System Disk');
      
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
          title="Save to Virtual File System"
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
