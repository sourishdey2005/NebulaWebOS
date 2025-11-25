
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Save, RotateCcw } from 'lucide-react';
import { FileSystemNode } from '../../types';

interface VoiceRecorderProps {
  fs?: FileSystemNode;
  setFs?: React.Dispatch<React.SetStateAction<FileSystemNode>>;
}

export const VoiceRecorderApp: React.FC<VoiceRecorderProps> = ({ fs, setFs }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (audioContextRef.current) audioContextRef.current.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        chunksRef.current = [];
        
        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Visualization Setup
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      visualize();

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => setRecordingTime(prev => prev + 1), 1000);

    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone access is required to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  };

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#1e293b'; // Slate 800 background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        
        // Gradient Bar
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#3b82f6'); // Blue
        gradient.addColorStop(1, '#a855f7'); // Purple
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    };

    draw();
  };

  const saveRecording = () => {
    if (!audioURL || !fs || !setFs) return;
    
    // Simulate save to FS
    // In a real app we'd convert Blob to base64, but for this prototype we'll mock the FS entry
    const newFs = JSON.parse(JSON.stringify(fs));
    const fileName = `recording_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
    
    // Navigate/Create home/guest/recordings
    if (!newFs.children.home.children.guest.children.recordings) {
        newFs.children.home.children.guest.children.recordings = { type: 'dir', children: {} };
    }
    
    // Convert blob to base64 for storage (mocked here as we can't easily sync large blobs to localstorage safely in this env without hitting limits, storing simple ref)
    newFs.children.home.children.guest.children.recordings.children[fileName] = {
        type: 'file',
        content: '[Binary Audio Data]'
    };

    setFs(newFs);
    
    // Also trigger browser download
    const a = document.createElement('a');
    a.href = audioURL;
    a.download = fileName;
    a.click();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Visualizer Area */}
      <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center p-4">
        <canvas ref={canvasRef} width={600} height={200} className="w-full h-48 rounded-lg bg-slate-800/50" />
        <div className="absolute top-8 font-mono text-4xl font-light tracking-wider text-blue-400">
            {formatTime(recordingTime)}
        </div>
      </div>

      {/* Controls */}
      <div className="h-24 bg-slate-800 border-t border-white/5 flex items-center justify-center gap-6">
        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Mic size={24} />
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Square size={24} fill="currentColor" />
          </button>
        )}

        {audioURL && !isRecording && (
          <>
            <audio src={audioURL} controls className="h-10 w-48 rounded-full" />
            <button 
                onClick={() => { setAudioURL(null); setRecordingTime(0); }}
                className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
                title="Reset"
            >
                <RotateCcw size={20} />
            </button>
            <button 
                onClick={saveRecording}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors text-white"
                title="Save"
            >
                <Save size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
