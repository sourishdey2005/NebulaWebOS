
import React, { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';

export const ColorPickerApp: React.FC = () => {
  const [color, setColor] = useState('#3b82f6');
  
  // Helper to hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(color);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex h-full bg-white text-slate-800">
       <div className="w-1/2 p-6 flex flex-col items-center justify-center gap-6 border-r bg-gray-50">
          <div 
             className="w-32 h-32 rounded-full shadow-xl border-4 border-white transition-colors"
             style={{ backgroundColor: color }}
          />
          <input 
             type="color" 
             value={color}
             onChange={(e) => setColor(e.target.value)}
             className="w-full h-12 cursor-pointer"
          />
          <div className="text-center">
             <h2 className="text-xl font-bold uppercase tracking-widest">{color}</h2>
             <p className="text-sm text-gray-500">Selected Color</p>
          </div>
       </div>

       <div className="w-1/2 p-6 flex flex-col justify-center gap-4">
          <div className="space-y-1">
             <label className="text-xs font-bold text-gray-400 uppercase">HEX</label>
             <div className="flex gap-2">
                <input readOnly value={color.toUpperCase()} className="flex-1 bg-gray-100 p-2 rounded font-mono border" />
                <button onClick={() => copyToClipboard(color)} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"><Copy size={18}/></button>
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-bold text-gray-400 uppercase">RGB</label>
             <div className="flex gap-2">
                <input readOnly value={rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ''} className="flex-1 bg-gray-100 p-2 rounded font-mono border" />
                <button onClick={() => copyToClipboard(rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '')} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"><Copy size={18}/></button>
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-bold text-gray-400 uppercase">CSS</label>
             <div className="flex gap-2">
                <input readOnly value={`background-color: ${color};`} className="flex-1 bg-gray-100 p-2 rounded font-mono border" />
                <button onClick={() => copyToClipboard(`background-color: ${color};`)} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"><Copy size={18}/></button>
             </div>
          </div>

          <div className="mt-4 pt-4 border-t">
             <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Palette</label>
             <div className="flex gap-2">
                {[1, 0.8, 0.6, 0.4, 0.2].map(opacity => (
                    <div 
                        key={opacity} 
                        className="h-8 flex-1 rounded cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color, opacity }}
                        title={`Opacity: ${opacity}`}
                    />
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};