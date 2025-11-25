
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut, Download, Printer } from 'lucide-react';

export const PDFViewerApp: React.FC = () => {
  // Using a sample PDF that is CORS friendly or embedded
  // Ideally this would be a real file from the FS, but for prototype we use a reliable sample URL
  const [pdfUrl, setPdfUrl] = useState('https://pdfobject.com/pdf/sample.pdf');
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex flex-col h-full bg-slate-700">
      {/* Toolbar */}
      <div className="h-12 bg-slate-800 border-b border-white/10 flex items-center justify-between px-4 text-gray-300 shadow-md z-10">
        <div className="flex items-center gap-1 font-medium text-white text-sm">
            Sample_Document.pdf
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1">
            <button className="p-1.5 hover:bg-slate-700 rounded"><ZoomOut size={16} onClick={() => setZoom(z => Math.max(50, z - 10))} /></button>
            <span className="text-xs w-10 text-center">{zoom}%</span>
            <button className="p-1.5 hover:bg-slate-700 rounded"><ZoomIn size={16} onClick={() => setZoom(z => Math.min(200, z + 10))} /></button>
        </div>

        <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-700 rounded"><Printer size={18} /></button>
            <button className="p-2 bg-blue-600 text-white hover:bg-blue-500 rounded"><Download size={18} /></button>
        </div>
      </div>

      {/* Viewer Area */}
      <div className="flex-1 bg-slate-500 overflow-auto flex justify-center p-8 relative">
        <div 
            className="bg-white shadow-2xl transition-all duration-200"
            style={{ 
                width: `${800 * (zoom / 100)}px`,
                height: '100%' 
            }}
        >
            <iframe 
                src={pdfUrl} 
                className="w-full h-full border-none"
                title="PDF Viewer" 
            />
        </div>
      </div>
    </div>
  );
};