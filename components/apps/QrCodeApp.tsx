
import React, { useState, useEffect } from 'react';
import { Download, Loader2, Share2, Link as LinkIcon } from 'lucide-react';

export const QrCodeApp: React.FC = () => {
  const [text, setText] = useState('https://nebula-web-os.vercel.app/');
  const [debouncedText, setDebouncedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce input to prevent API spam and flickering
  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, 600); // 600ms delay
    return () => clearTimeout(handler);
  }, [text]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(debouncedText)}`;

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const downloadQr = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download failed", e);
      // Fallback for simple browsers if fetch fails due to strict CORS
      const link = document.createElement('a');
      link.href = qrUrl;
      link.target = '_blank';
      link.download = 'qrcode.png';
      link.click();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 p-6 items-center justify-center">
        <div className="text-center mb-8 space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QR Generator
            </h2>
            <p className="text-sm text-gray-500">Transform links and text into scanable codes</p>
        </div>

        <div className="bg-white p-4 border border-gray-200 rounded-2xl mb-8 shadow-xl relative group transition-all hover:shadow-2xl hover:scale-105">
            <div className="w-64 h-64 relative flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
                {(isLoading) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin text-blue-500" size={32} />
                            <span className="text-xs font-medium text-gray-400">Generating...</span>
                        </div>
                    </div>
                )}
                <img
                    src={qrUrl}
                    alt="QR Code"
                    className="w-full h-full object-contain mix-blend-multiply"
                    onLoad={handleImageLoad}
                    crossOrigin="anonymous" 
                />
            </div>
            
            {/* Overlay Actions */}
            <div className="absolute -right-14 top-4 flex flex-col gap-3">
                <button 
                    onClick={downloadQr}
                    className="p-3 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 duration-200"
                    title="Download PNG"
                >
                    <Download size={18} />
                </button>
                <button 
                    onClick={() => navigator.clipboard.writeText(qrUrl)}
                    className="p-3 bg-white text-slate-800 border border-gray-200 rounded-full shadow-lg hover:bg-gray-50 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 duration-300 delay-75"
                    title="Copy Image Link"
                >
                    <Share2 size={18} />
                </button>
            </div>
        </div>

        <div className="w-full max-w-sm space-y-4 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <LinkIcon size={18} />
            </div>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full border-2 border-gray-200 bg-white rounded-xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm font-medium text-slate-600"
                placeholder="https://example.com"
                autoFocus
            />
        </div>
    </div>
  );
};
