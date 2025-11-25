
import React, { useEffect, useRef } from 'react';

export const ScreenSaver: React.FC<{ onWake: () => void }> = ({ onWake }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; z: number }[] = [];
    const numStars = 800;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: (Math.random() - 0.5) * canvas.width * 2,
            y: (Math.random() - 0.5) * canvas.height * 2,
            z: Math.random() * canvas.width
        });
    }

    let animationId: number;
    const animate = () => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < numStars; i++) {
            let star = stars[i];
            star.z -= 4; // speed

            if (star.z <= 0) {
                star.x = (Math.random() - 0.5) * canvas.width * 2;
                star.y = (Math.random() - 0.5) * canvas.height * 2;
                star.z = canvas.width;
            }

            const x = (star.x / star.z) * 200 + centerX;
            const y = (star.y / star.z) * 200 + centerY;
            const size = (1 - star.z / canvas.width) * 3;

            if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
                const alpha = (1 - star.z / canvas.width);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
        className="fixed inset-0 z-[1001] bg-black cursor-none" 
        onClick={onWake}
        onMouseMove={onWake}
        onKeyDown={onWake}
    >
        <canvas ref={canvasRef} className="block" />
        <div className="absolute bottom-10 left-10 text-white/50 text-xl font-thin tracking-[0.5em] animate-pulse">
            NEBULA OS
        </div>
    </div>
  );
};
