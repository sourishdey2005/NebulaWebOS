
import React, { useState, useEffect } from 'react';
import { Bomb, Flag, RefreshCw } from 'lucide-react';

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
};

export const MinesweeperApp: React.FC = () => {
  const ROWS = 10;
  const COLS = 10;
  const MINES = 15;

  const [grid, setGrid] = useState<Cell[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newGrid: Cell[] = Array(ROWS * COLS).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborCount: 0
    }));

    // Place Mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const idx = Math.floor(Math.random() * (ROWS * COLS));
      if (!newGrid[idx].isMine) {
        newGrid[idx].isMine = true;
        minesPlaced++;
      }
    }

    // Calc Neighbors
    for (let i = 0; i < newGrid.length; i++) {
      if (newGrid[i].isMine) continue;
      let count = 0;
      const neighbors = getNeighbors(i);
      neighbors.forEach(n => {
        if (newGrid[n].isMine) count++;
      });
      newGrid[i].neighborCount = count;
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
  };

  const getNeighbors = (index: number) => {
    const neighbors = [];
    const r = Math.floor(index / COLS);
    const c = index % COLS;
    
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const nr = r + i;
        const nc = c + j;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          neighbors.push(nr * COLS + nc);
        }
      }
    }
    return neighbors;
  };

  const handleCellClick = (index: number) => {
    if (gameOver || win || grid[index].isFlagged) return;

    const newGrid = [...grid];
    if (newGrid[index].isMine) {
      // Boom
      newGrid.forEach(c => { if (c.isMine) c.isRevealed = true; });
      setGrid(newGrid);
      setGameOver(true);
    } else {
      reveal(newGrid, index);
      setGrid(newGrid);
      checkWin(newGrid);
    }
  };

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    if (gameOver || win || grid[index].isRevealed) return;
    const newGrid = [...grid];
    newGrid[index].isFlagged = !newGrid[index].isFlagged;
    setGrid(newGrid);
  };

  const reveal = (board: Cell[], index: number) => {
    if (board[index].isRevealed || board[index].isFlagged) return;
    board[index].isRevealed = true;
    if (board[index].neighborCount === 0) {
      const neighbors = getNeighbors(index);
      neighbors.forEach(n => reveal(board, n));
    }
  };

  const checkWin = (board: Cell[]) => {
    const revealedCount = board.filter(c => c.isRevealed).length;
    if (revealedCount === (ROWS * COLS - MINES)) {
      setWin(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-200 p-4 items-center justify-center select-none">
      <div className="bg-gray-300 p-2 border-4 border-gray-400 rounded mb-4 w-full max-w-[300px] flex justify-between items-center shadow-inner">
         <div className="bg-black text-red-500 font-mono text-xl px-2 py-1 rounded">{MINES}</div>
         <button onClick={startNewGame} className="p-1 bg-gray-200 border-2 border-gray-400 active:border-gray-500 rounded text-2xl">
            {gameOver ? '😵' : win ? '😎' : '🙂'}
         </button>
         <div className="bg-black text-red-500 font-mono text-xl px-2 py-1 rounded">000</div>
      </div>

      <div className="grid grid-cols-10 gap-[1px] bg-gray-400 border-4 border-gray-400">
        {grid.map((cell, i) => (
            <div 
                key={i}
                onClick={() => handleCellClick(i)}
                onContextMenu={(e) => handleRightClick(e, i)}
                className={`
                    w-8 h-8 flex items-center justify-center font-bold text-sm cursor-default
                    ${cell.isRevealed 
                        ? 'bg-gray-200 border-[0.5px] border-gray-300' 
                        : 'bg-gray-300 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-500 active:border-none'
                    }
                `}
            >
                {cell.isRevealed && !cell.isMine && cell.neighborCount > 0 && (
                    <span style={{ color: ['blue', 'green', 'red', 'darkblue', 'brown'][cell.neighborCount-1] || 'black' }}>
                        {cell.neighborCount}
                    </span>
                )}
                {cell.isRevealed && cell.isMine && <Bomb size={16} />}
                {!cell.isRevealed && cell.isFlagged && <Flag size={14} className="text-red-600" fill="currentColor" />}
            </div>
        ))}
      </div>
    </div>
  );
};
