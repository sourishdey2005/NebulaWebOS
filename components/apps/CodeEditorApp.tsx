
import React, { useState } from 'react';
import { Play, Save, Settings, Search, FileCode } from 'lucide-react';

export const CodeEditorApp: React.FC = () => {
  const [code, setCode] = useState(`// Welcome to Nebula Code Studio
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));

// Write your JavaScript here...
`);

  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300 font-mono">
      {/* Title Bar */}
      <div className="h-10 bg-[#2d2d2d] flex items-center justify-between px-4 select-none">
         <div className="flex items-center gap-2 text-sm text-blue-400">
            <FileCode size={14} /> script.js
         </div>
         <div className="flex items-center gap-3">
            <button className="text-green-500 hover:text-green-400"><Play size={16} /></button>
            <button className="text-gray-400 hover:text-white"><Save size={16} /></button>
            <button className="text-gray-400 hover:text-white"><Settings size={16} /></button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-12 bg-[#252526] border-r border-[#3e3e42] flex flex-col items-center py-4 gap-4 text-gray-500">
            <FileCode size={24} className="text-white opacity-80" />
            <Search size={24} />
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative flex">
            {/* Line Numbers */}
            <div className="w-12 bg-[#1e1e1e] text-[#858585] text-right pr-3 pt-4 select-none text-sm leading-6">
                {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                ))}
            </div>

            {/* Text Area */}
            <textarea 
                className="flex-1 bg-transparent text-white p-0 pt-4 pl-1 resize-none outline-none leading-6 text-sm whitespace-pre"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
            />
        </div>
      </div>
      
      {/* Footer */}
      <div className="h-6 bg-[#007acc] text-white text-xs flex items-center px-4 justify-between select-none">
        <div className="flex gap-4">
            <span>main*</span>
            <span>0 errors</span>
        </div>
        <div className="flex gap-4">
            <span>Ln {lines.length}, Col 1</span>
            <span>UTF-8</span>
            <span>JavaScript</span>
        </div>
      </div>
    </div>
  );
};