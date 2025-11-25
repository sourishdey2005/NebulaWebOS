
import React, { useState, useEffect, useRef } from 'react';
import { FileSystemNode } from '../../types';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
  path?: string;
}

interface TerminalAppProps {
  fs?: FileSystemNode;
  setFs?: React.Dispatch<React.SetStateAction<FileSystemNode>>;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ fs, setFs }) => {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', content: 'Nebula OS Terminal [Version 1.2.0]' },
    { type: 'output', content: '(c) Nebula Corp. All rights reserved.\n' }
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState<string[]>(['home', 'guest']);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  if (!fs || !setFs) return <div className="p-4 text-red-400 font-mono">Error: File System not mounted.</div>;

  const getCurrentNode = (currentFs: FileSystemNode, path: string[]): FileSystemNode | null => {
    let current = currentFs;
    for (const part of path) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    return current;
  };

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) {
      setHistory(prev => [...prev, { type: 'input', content: '', path: formatPath(cwd) }]);
      return;
    }

    const [cmd, ...args] = trimmed.split(/\s+/);
    const newHistory: TerminalLine[] = [
      ...history,
      { type: 'input', content: cmdStr, path: formatPath(cwd) }
    ];

    switch (cmd) {
      case 'help':
        newHistory.push({ type: 'output', content: 
`Available commands:
  help              Show this help message
  clear             Clear terminal screen
  neofetch          Display system information
  ls                List directory contents
  cd [dir]          Change directory
  pwd               Print working directory
  echo [text]       Display a line of text
  cat [file]        Read a file
  touch [file]      Create a new file
  mkdir [dir]       Create a directory
  whoami            Print current user` 
        });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'neofetch':
        newHistory.push({ type: 'output', content: 
`       
      .-------.      guest@nebula-os
    .'         '.    ---------------
   /   o     o   \\   OS: Nebula WebOS x64
  |    .---.    |   Kernel: 5.15.0-web
  |   (     )   |   Uptime: ${(performance.now() / 60000).toFixed(2)} mins
   \\   '---'   /    Shell: bash 5.1
    '.         .'    Resolution: ${window.innerWidth}x${window.innerHeight}
      '-------'      Theme: Slate Dark
                     Icons: Lucide React
                     Browser: ${navigator.userAgent.split(' ').slice(-1)[0]}
`
        });
        break;

      case 'pwd':
        newHistory.push({ type: 'output', content: formatPath(cwd) });
        break;

      case 'whoami':
        newHistory.push({ type: 'output', content: 'guest' });
        break;

      case 'echo':
        newHistory.push({ type: 'output', content: args.join(' ') });
        break;

      case 'ls': {
        const node = getCurrentNode(fs, cwd);
        if (node && node.children) {
          const items = Object.keys(node.children).map(name => {
            const isDir = node.children![name].type === 'dir';
            return isDir ? `${name}/` : name;
          });
          newHistory.push({ type: 'output', content: items.join('  ') });
        } else {
          newHistory.push({ type: 'error', content: 'Error: Cannot list contents.' });
        }
        break;
      }

      case 'cd': {
        const target = args[0];
        if (!target || target === '~') {
          setCwd(['home', 'guest']);
        } else if (target === '..') {
          if (cwd.length > 0) {
            setCwd(prev => prev.slice(0, -1));
          }
        } else if (target === '/') {
          setCwd([]);
        } else {
          // Simple relative path support (one level)
          const node = getCurrentNode(fs, cwd);
          if (node && node.children && node.children[target] && node.children[target].type === 'dir') {
             setCwd(prev => [...prev, target]);
          } else {
             newHistory.push({ type: 'error', content: `cd: ${target}: No such directory` });
          }
        }
        break;
      }

      case 'cat': {
        const filename = args[0];
        if (!filename) {
            newHistory.push({ type: 'error', content: 'usage: cat [file]' });
            break;
        }
        const node = getCurrentNode(fs, cwd);
        if (node && node.children && node.children[filename]) {
             if (node.children[filename].type === 'file') {
                 newHistory.push({ type: 'output', content: node.children[filename].content || '' });
             } else {
                 newHistory.push({ type: 'error', content: `cat: ${filename}: Is a directory` });
             }
        } else {
            newHistory.push({ type: 'error', content: `cat: ${filename}: No such file` });
        }
        break;
      }

      case 'mkdir': {
        const dirName = args[0];
        if (!dirName) {
            newHistory.push({ type: 'error', content: 'usage: mkdir [directory]' });
            break;
        }
        // Clone FS
        const newFs = JSON.parse(JSON.stringify(fs));
        const currentNode = getCurrentNode(newFs, cwd);
        if (currentNode && currentNode.children) {
            if (currentNode.children[dirName]) {
                newHistory.push({ type: 'error', content: `mkdir: cannot create directory '${dirName}': File exists` });
            } else {
                currentNode.children[dirName] = { type: 'dir', children: {} };
                setFs(newFs);
                newHistory.push({ type: 'output', content: `Directory created: ${dirName}` });
            }
        }
        break;
      }

      case 'touch': {
        const fileName = args[0];
        if (!fileName) {
            newHistory.push({ type: 'error', content: 'usage: touch [file]' });
            break;
        }
        const newFs = JSON.parse(JSON.stringify(fs));
        const currentNode = getCurrentNode(newFs, cwd);
         if (currentNode && currentNode.children) {
            if (currentNode.children[fileName]) {
                 // Update timestamp effectively (no-op here for sim)
            } else {
                currentNode.children[fileName] = { type: 'file', content: '' };
                setFs(newFs);
            }
         }
        break;
      }

      default:
        newHistory.push({ type: 'error', content: `command not found: ${cmd}` });
    }

    setHistory(newHistory);
    setInput('');
  };

  const formatPath = (path: string[]) => {
    if (path.length === 0) return '/';
    const pathStr = '/' + path.join('/');
    if (pathStr.startsWith('/home/guest')) {
        return pathStr.replace('/home/guest', '~');
    }
    return pathStr;
  };

  return (
    <div 
      className="flex flex-col h-full bg-black text-gray-200 font-mono text-sm p-2 overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar" ref={scrollRef}>
        {history.map((line, i) => (
          <div key={i} className={`${line.type === 'error' ? 'text-red-400' : line.type === 'input' ? 'text-white' : 'text-green-400'} break-words whitespace-pre-wrap`}>
            {line.type === 'input' && (
                <span className="text-blue-400 mr-2">guest@nebula:{line.path}$</span>
            )}
            {line.content}
          </div>
        ))}
        
        {/* Active Input Line */}
        <div className="flex items-center">
             <span className="text-blue-400 mr-2 shrink-0">guest@nebula:{formatPath(cwd)}$</span>
             <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleCommand(input);
                    }
                }}
                className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0 m-0"
                autoFocus
                autoComplete="off"
                spellCheck={false}
             />
        </div>
      </div>
    </div>
  );
};
