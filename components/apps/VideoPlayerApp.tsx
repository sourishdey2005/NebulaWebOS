
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, PictureInPicture, SkipBack, SkipForward } from 'lucide-react';

export const VideoPlayerApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  // Sample Video URL (Open source Big Buck Bunny or similar)
  // Using a reliable sample URL
  const [src, setSrc] = useState('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
        setProgress((video.currentTime / video.duration) * 100);
    };

    const updateDuration = () => {
        setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('loadedmetadata', updateDuration);
        video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
        if (isPlaying) videoRef.current.pause();
        else videoRef.current.play();
        setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) videoRef.current.currentTime = time;
    setProgress(parseFloat(e.target.value));
  };

  const togglePiP = async () => {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-black text-white group">
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        <video 
            ref={videoRef}
            src={src}
            className="w-full h-full object-contain"
            onClick={togglePlay}
        />
        
        {/* Play Overlay */}
        {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Play size={32} fill="white" className="ml-1" />
                </div>
            </div>
        )}

        {/* Controls Overlay - Hidden unless hovered */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Progress Bar */}
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress || 0}
                onChange={handleSeek}
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer mb-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full"
            />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="hover:text-blue-400 transition-colors">
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    </button>
                    
                    <div className="flex items-center gap-2 group/vol">
                        <button onClick={() => setIsMuted(!isMuted)}>
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <input 
                            type="range" min="0" max="1" step="0.1" 
                            value={isMuted ? 0 : volume}
                            onChange={(e) => { 
                                const v = parseFloat(e.target.value);
                                setVolume(v);
                                if (videoRef.current) videoRef.current.volume = v;
                                setIsMuted(v === 0);
                            }}
                            className="w-0 overflow-hidden group-hover/vol:w-20 transition-all h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <span className="text-xs font-mono text-gray-300">
                        {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={togglePiP} className="hover:text-blue-400 transition-colors" title="Picture in Picture">
                        <PictureInPicture size={20} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
