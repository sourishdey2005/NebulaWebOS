
import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Download, AlertCircle } from 'lucide-react';

export const CameraApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 150);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoUrl = canvas.toDataURL('image/png');
        setLastPhoto(photoUrl);
      }
    }
  };

  const downloadPhoto = () => {
    if (lastPhoto) {
      const link = document.createElement('a');
      link.href = lastPhoto;
      link.download = `nebula-photo-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black relative">
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-900">
        {!error ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="h-full w-full object-contain"
            />
            {isFlashing && (
              <div className="absolute inset-0 bg-white z-10 animate-out fade-out duration-150" />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-red-400 gap-2">
            <AlertCircle size={32} />
            <p>{error}</p>
            <button 
              onClick={startCamera}
              className="mt-4 px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 text-white text-sm"
            >
              Retry
            </button>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="h-20 bg-zinc-950/80 backdrop-blur border-t border-white/10 flex items-center justify-between px-8">
        <div className="w-12 h-12">
            {lastPhoto && (
                <button 
                    onClick={downloadPhoto}
                    className="w-full h-full rounded overflow-hidden border border-white/20 hover:opacity-80 transition-opacity relative group"
                    title="Download Last Photo"
                >
                    <img src={lastPhoto} className="w-full h-full object-cover" alt="Last capture" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Download size={16} className="text-white" />
                    </div>
                </button>
            )}
        </div>

        <button 
          onClick={takePhoto}
          className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 bg-white rounded-full" />
        </button>

        <button 
          onClick={() => { stopCamera(); startCamera(); }}
          className="p-3 rounded-full bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
};
