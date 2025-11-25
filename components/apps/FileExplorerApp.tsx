
import React, { useState } from 'react';
import { Folder, FileText, ArrowLeft, Trash2, Home, Search, ChevronRight, HardDrive, RefreshCw } from 'lucide-react';
import { FileSystemNode } from '../../types';

interface FileExplorerProps {
  initialPath?: string[];
  fs?: FileSystemNode;
  setFs?: React.Dispatch<React.SetStateAction<FileSystemNode>>;
}

export const FileExplorerApp: React.FC<FileExplorerProps> = ({ 
  initialPath = ['home', 'guest'],
  fs,
  setFs
}) => {
  const [path, setPath] = useState<string[]>(initialPath);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  if (!fs || !setFs) return <div className="p-8 text-white">Initializing File System...</div>;

  const getCurrentNode = (currentFs: FileSystemNode, currentPath: string[]): FileSystemNode | null => {
    let current = currentFs;
    for (const part of currentPath) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    return current;
  };

  const currentNode = getCurrentNode(fs, path);
  const items = currentNode && currentNode.children ? Object.entries(currentNode.children) : [];

  const handleNavigate = (item: string) => {
    const newPath = [...path, item];
    const target = getCurrentNode(fs, newPath);
    if (target && target.type === 'dir') {
      setPath(newPath);
      setSelectedItems([]);
    }
  };

  const goUp = () => {
    if (path.length > 0) {
      setPath(path.slice(0, -1));
      setSelectedItems([]);
    }
  };

  const deleteItems = () => {
    if (selectedItems.length === 0) return;

    // Check if we are in trash, if so, permanently delete
    const isTrash = path.length > 0 && path[0] === 'trash';
    
    // Create deep copy of FS
    const newFs = JSON.parse(JSON.stringify(fs));
    
    // Get parent node of current path
    const parentNode = getCurrentNode(newFs, path);
    if (!parentNode || !parentNode.children) return;

    if (isTrash) {
        // Permanent delete
        selectedItems.forEach(item => {
            delete parentNode.children![item];
        });
    } else {
        // Move to trash
        // Ensure trash exists
        if (!newFs.children['trash']) newFs.children['trash'] = { type: 'dir', children: {} };
        const trashNode = newFs.children['trash'];

        selectedItems.forEach(item => {
            // Move item
            if (parentNode.children![item]) {
                trashNode.children![`${item}_${Date.now()}`] = parentNode.children![item]; // Avoid name collisions
                delete parentNode.children![item];
            }
        });
    }

    setFs(newFs);
    setSelectedItems([]);
  };

  const getBreadcrumbs = () => {
    return (
        <div className="flex items-center gap-1 text-sm text-gray-500 px-2 overflow-hidden">
            <button onClick={() => setPath([])} className="hover:bg-gray-200 rounded p-1"><HardDrive size={14}/></button>
            {path.map((part, index) => (
                <React.Fragment key={index}>
                    <ChevronRight size={12} />
                    <button 
                        onClick={() => setPath(path.slice(0, index + 1))}
                        className="hover:bg-gray-200 px-1.5 py-0.5 rounded text-gray-700 font-medium"
                    >
                        {part}
                    </button>
                </React.Fragment>
            ))}
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-800">
      {/* Header / Toolbar */}
      <div className="h-12 border-b flex items-center px-2 bg-gray-50 gap-2 shrink-0">
        <button onClick={goUp} disabled={path.length === 0} className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors">
            <ArrowLeft size={18} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" onClick={() => {}}>
            <RefreshCw size={16} />
        </button>
        
        <div className="flex-1 h-8 bg-white border rounded flex items-center mx-2">
            {getBreadcrumbs()}
        </div>

        <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input className="h-8 pl-8 pr-3 rounded border text-sm focus:border-blue-500 outline-none w-48" placeholder="Search" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-gray-50 border-r flex flex-col p-2 gap-1 text-sm select-none">
            <button onClick={() => setPath(['home', 'guest'])} className={`flex items-center gap-2 px-3 py-1.5 rounded text-left ${JSON.stringify(path) === JSON.stringify(['home','guest']) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}>
                <Home size={16} className="text-blue-500" /> Home
            </button>
            <button onClick={() => setPath(['home', 'guest', 'documents'])} className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-200 text-left text-gray-700">
                <FileText size={16} className="text-orange-500" /> Documents
            </button>
            <button onClick={() => setPath(['home', 'guest', 'projects'])} className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-200 text-left text-gray-700">
                <Folder size={16} className="text-blue-500" /> Projects
            </button>
            <div className="flex-1" />
            <button onClick={() => setPath(['trash'])} className={`flex items-center gap-2 px-3 py-1.5 rounded text-left ${JSON.stringify(path) === JSON.stringify(['trash']) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}>
                <Trash2 size={16} className="text-red-500" /> Trash
            </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white p-4 overflow-y-auto" onClick={() => setSelectedItems([])}>
            {/* Toolbar Actions */}
            {selectedItems.length > 0 && (
                <div className="mb-4 p-2 bg-blue-50 rounded flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <span className="text-xs text-blue-700 font-medium">{selectedItems.length} selected</span>
                    <button onClick={deleteItems} className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded font-medium transition-colors">
                        <Trash2 size={12} /> {path[0] === 'trash' ? 'Delete Permanently' : 'Move to Trash'}
                    </button>
                </div>
            )}

            {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Folder size={48} className="mb-2 opacity-20" />
                    <span className="text-sm">Folder is empty</span>
                </div>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
                    {items.map(([name, node]) => {
                        const isSelected = selectedItems.includes(name);
                        return (
                            <div 
                                key={name}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (e.ctrlKey || e.metaKey) {
                                        setSelectedItems(prev => isSelected ? prev.filter(i => i !== name) : [...prev, name]);
                                    } else {
                                        setSelectedItems([name]);
                                    }
                                }}
                                onDoubleClick={() => handleNavigate(name)}
                                className={`
                                    flex flex-col items-center gap-1 p-2 rounded border transition-colors cursor-pointer group
                                    ${isSelected ? 'bg-blue-50 border-blue-200 shadow-sm' : 'border-transparent hover:bg-gray-50'}
                                `}
                            >
                                <div className="w-12 h-12 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">
                                    {node.type === 'dir' ? (
                                        <Folder size={40} className="text-blue-400 fill-blue-400/20" />
                                    ) : (
                                        <FileText size={36} className="text-gray-400" />
                                    )}
                                </div>
                                <span className="text-xs text-center w-full truncate px-1 select-none">
                                    {name.replace(/_\d+$/, '')}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="h-6 bg-blue-600 text-white text-[10px] flex items-center px-2 justify-between">
         <span>{items.length} items</span>
         <span>{path.join('/')}</span>
      </div>
    </div>
  );
};
