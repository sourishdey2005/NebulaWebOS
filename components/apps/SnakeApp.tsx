
import React, { useState, useEffect, useRef } from 'react';

export const SnakeApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const gridSize = 20;
  const tileCount = 20;

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let px = 10, py = 10;
    let gs = gridSize, tc = tileCount;
    let ax = 15, ay = 15;
    let xv = 0, yv = 0;
    let trail: {x: number, y: number}[] = [];
    let tail = 5;

    const game = () => {
        px += xv;
        py += yv;

        if (px < 0) px = tc - 1;
        if (px > tc - 1) px = 0;
        if (py < 0) py = tc - 1;
        if (py > tc - 1) py = 0;

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#4ade80';
        for (let i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
            if (trail[i].x === px && trail[i].y === py && (xv !== 0 || yv !== 0)) {
                setGameOver(true);
            }
        }

        trail.push({ x: px, y: py });
        while (trail.length > tail) {
            trail.shift();
        }

        if (ax === px && ay === py) {
            tail++;
            setScore(s => s + 10);
            ax = Math.floor(Math.random() * tc);
            ay = Math.floor(Math.random() * tc);
        }

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
    };

    const keyPush = (evt: KeyboardEvent) => {
        switch (evt.key) {
            case 'ArrowLeft': xv = -1; yv = 0; break;
            case 'ArrowUp': xv = 0; yv = -1; break;
            case 'ArrowRight': xv = 1; yv = 0; break;
            case 'ArrowDown': xv = 0; yv = 1; break;
        }
    };

    document.addEventListener('keydown', keyPush);
    const interval = setInterval(game, 1000 / 10);

    return () => {
        clearInterval(interval);
        document.removeEventListener('keydown', keyPush);
    };
  }, [gameStarted, gameOver]);

  return (
    <div className="flex flex-col h-full bg-slate-900 items-center justify-center p-4">
        <div className="mb-4 flex justify-between w-full max-w-[400px] text-white">
            <h2 className="text-xl font-bold">Snake</h2>
            <div className="font-mono text-green-400">Score: {score}</div>
        </div>
        
        <canvas ref={canvasRef} width="400" height="400" className="bg-black border-4 border-slate-700 rounded-lg shadow-2xl" />

        {(!gameStarted || gameOver) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">{gameOver ? 'Game Over' : 'Ready?'}</h1>
                    <button 
                        onClick={() => { setGameStarted(true); setGameOver(false); setScore(0); }}
                        className="px-6 py-3 bg-green-500 hover:bg-green-400 rounded-full font-bold text-lg transition-colors"
                    >
                        {gameOver ? 'Try Again' : 'Start Game'}
                    </button>
                    <p className="mt-4 text-sm text-gray-400">Use Arrow Keys to Move</p>
                </div>
            </div>
        )}
    </div>
  );
};
