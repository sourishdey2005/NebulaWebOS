
import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Paintbrush, Download, Trash2, Square, Circle as CircleIcon, Minus } from 'lucide-react';

type Tool = 'brush' | 'eraser' | 'rect' | 'circle' | 'line';

export const PaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<Tool>('brush');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.nativeEvent.offsetX; // Relative to target
    const y = e.nativeEvent.offsetY;

    setIsDrawing(true);
    setStartPos({ x, y });
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (tool === 'brush' || tool === 'eraser') {
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = brushSize;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (snapshot) {
      // Restore state to draw shapes dynamically
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;

      if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `nebula-paint-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-slate-200">
      {/* Toolbar */}
      <div className="h-14 bg-slate-800 flex items-center px-4 gap-4 shadow-md shrink-0 overflow-x-auto">
        
        {/* Tools */}
        <div className="flex items-center gap-1 bg-slate-700/50 p-1 rounded-lg border border-white/10">
          <button onClick={() => setTool('brush')} className={`p-2 rounded ${tool === 'brush' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/10'}`} title="Brush"><Paintbrush size={18}/></button>
          <button onClick={() => setTool('eraser')} className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/10'}`} title="Eraser"><Eraser size={18}/></button>
        </div>

        {/* Shapes */}
        <div className="flex items-center gap-1 bg-slate-700/50 p-1 rounded-lg border border-white/10">
          <button onClick={() => setTool('rect')} className={`p-2 rounded ${tool === 'rect' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/10'}`} title="Rectangle"><Square size={18}/></button>
          <button onClick={() => setTool('circle')} className={`p-2 rounded ${tool === 'circle' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/10'}`} title="Circle"><CircleIcon size={18}/></button>
          <button onClick={() => setTool('line')} className={`p-2 rounded ${tool === 'line' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/10'}`} title="Line"><Minus size={18} className="rotate-45"/></button>
        </div>

        <div className="w-px h-8 bg-white/10" />

        {/* Properties */}
        <div className="flex items-center gap-4">
           <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
              title="Color Picker"
           />
           <div className="flex flex-col w-24">
              <label className="text-[10px] text-gray-400">Size: {brushSize}px</label>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={brushSize} 
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer"
              />
           </div>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
            <button onClick={clearCanvas} className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Clear Canvas"><Trash2 size={18}/></button>
            <button onClick={downloadImage} className="p-2 text-green-400 hover:bg-green-500/10 rounded transition-colors" title="Download"><Download size={18}/></button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto bg-slate-400 p-4 flex items-center justify-center cursor-crosshair relative">
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="bg-white shadow-xl cursor-crosshair touch-none"
        />
      </div>
    </div>
  );
};
