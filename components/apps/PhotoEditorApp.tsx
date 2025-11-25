
import React, { useState } from 'react';
import { Image, Sliders, Layers, RotateCw, Check, Download, Undo } from 'lucide-react';

export const PhotoEditorApp: React.FC = () => {
  // Default sample image
  const [imageSrc, setImageSrc] = useState('https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop');
  
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    blur: 0,
    sepia: 0,
  });

  const [rotation, setRotation] = useState(0);

  const handleFilterChange = (key: keyof typeof filters, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 0,
      blur: 0,
      sepia: 0,
    });
    setRotation(0);
  };

  const getFilterString = () => {
    return `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturate}%) 
      grayscale(${filters.grayscale}%) 
      blur(${filters.blur}px)
      sepia(${filters.sepia}%)
    `;
  };

  return (
    <div className="flex h-full bg-slate-900 text-white">
      {/* Sidebar Controls */}
      <div className="w-64 bg-slate-950 border-r border-white/5 flex flex-col p-4 overflow-y-auto custom-scrollbar">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Sliders size={16} /> Adjustments
        </h2>

        <div className="space-y-6">
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Brightness</label>
                <input 
                    type="range" min="0" max="200" 
                    value={filters.brightness} onChange={(e) => handleFilterChange('brightness', parseInt(e.target.value))} 
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Contrast</label>
                <input 
                    type="range" min="0" max="200" 
                    value={filters.contrast} onChange={(e) => handleFilterChange('contrast', parseInt(e.target.value))} 
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Saturation</label>
                <input 
                    type="range" min="0" max="200" 
                    value={filters.saturate} onChange={(e) => handleFilterChange('saturate', parseInt(e.target.value))} 
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div className="h-px bg-white/5 my-2" />
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Grayscale</label>
                <input 
                    type="range" min="0" max="100" 
                    value={filters.grayscale} onChange={(e) => handleFilterChange('grayscale', parseInt(e.target.value))} 
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Sepia</label>
                <input 
                    type="range" min="0" max="100" 
                    value={filters.sepia} onChange={(e) => handleFilterChange('sepia', parseInt(e.target.value))} 
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Blur</label>
                <input 
                    type="range" min="0" max="20" 
                    value={filters.blur} onChange={(e) => handleFilterChange('blur', parseInt(e.target.value))} 
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>

        <div className="mt-auto pt-4 space-y-2">
            <button 
                onClick={() => setRotation(r => r + 90)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm transition-colors flex items-center justify-center gap-2"
            >
                <RotateCw size={14} /> Rotate
            </button>
            <button 
                onClick={resetFilters}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm transition-colors flex items-center justify-center gap-2"
            >
                <Undo size={14} /> Reset All
            </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 bg-slate-900 border-b border-white/5 flex items-center justify-between px-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Image size={16} /> Sample_Image.jpg
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Download size={14} /> Save Copy
            </button>
        </div>

        {/* Image Display */}
        <div className="flex-1 overflow-hidden p-8 flex items-center justify-center bg-slate-950/50">
            <div className="relative shadow-2xl">
                <img 
                    src={imageSrc} 
                    alt="Editing" 
                    className="max-w-full max-h-[70vh] object-contain transition-all duration-200"
                    style={{ 
                        filter: getFilterString(),
                        transform: `rotate(${rotation}deg)`
                    }} 
                />
            </div>
        </div>
      </div>
    </div>
  );
};
