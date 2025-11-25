
import React, { useState, useRef, useEffect } from 'react';
import { Pen, Eraser, Trash2, StickyNote } from 'lucide-react';

export const WhiteboardApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#000000');
  
  // Set canvas size on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        canvas.width = canvas.parentElement?.clientWidth || 800;
        canvas.height = canvas.parentElement?.clientHeight || 600;
    }
  }, []);

  const start = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const end = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.lineWidth = tool === 'eraser' ? 20 : 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#f8fafc' : color; // Eraser matches bg

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
        <div className="h-14 bg-white border-b flex items-center px-4 gap-4 shadow-sm">
            <button 
                onClick={() => setTool('pen')} 
                className={`p-2 rounded-lg ${tool === 'pen' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <Pen size={20} />
            </button>
            <button 
                onClick={() => setTool('eraser')} 
                className={`p-2 rounded-lg ${tool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <Eraser size={20} />
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex gap-1">
                {['#000000', '#ef4444', '#3b82f6', '#10b981'].map(c => (
                    <button 
                        key={c} 
                        onClick={() => { setColor(c); setTool('pen'); }}
                        className={`w-6 h-6 rounded-full border-2 ${color === c && tool === 'pen' ? 'border-gray-400 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                    />
                ))}
            </div>
            <div className="flex-1" />
            <button onClick={clear} className="text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>
        </div>
        
        <div className="flex-1 relative cursor-crosshair overflow-hidden">
            <canvas 
                ref={canvasRef}
                onMouseDown={start}
                onMouseUp={end}
                onMouseMove={draw}
                onMouseLeave={end}
                className="absolute inset-0 w-full h-full"
            />
        </div>
    </div>
  );
};
