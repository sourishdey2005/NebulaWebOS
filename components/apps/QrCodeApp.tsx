
import React, { useState } from 'react';
import { Download } from 'lucide-react';

export const QrCodeApp: React.FC = () => {
  const [text, setText] = useState('https://nebula-os.web.app');
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`;

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 p-6 items-center">
        <h2 className="text-xl font-bold mb-6">QR Code Generator</h2>
        
        <div className="bg-white p-4 border-2 border-slate-900 rounded-xl mb-6 shadow-xl">
            <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
        </div>

        <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 mb-4"
            placeholder="Enter URL or text..."
        />

        <p className="text-xs text-center text-gray-500 max-w-xs">
            Scan this code with your mobile device to open the link or view text.
        </p>
    </div>
  );
};
