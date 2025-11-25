
import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

type SquareValue = 'X' | 'O' | null;

export const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const calculateWinner = (squares: SquareValue[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const result = calculateWinner(board);
  const isDraw = !result && board.every((square) => square !== null);

  const handleClick = (i: number) => {
    if (board[i] || result) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white p-4 items-center justify-center">
      <div className="mb-6 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          NEON TACTICS
        </h2>
        <div className="text-sm font-medium tracking-wide">
          {result ? (
            <span className="text-emerald-400 animate-pulse">Winner: {result.winner}</span>
          ) : isDraw ? (
            <span className="text-yellow-400">Draw Game</span>
          ) : (
            <span className={isXNext ? "text-blue-400" : "text-purple-400"}>
              Player {isXNext ? 'X' : 'O'}'s Turn
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-slate-800 p-2 rounded-xl shadow-2xl border border-white/5">
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={!!val || !!result}
            className={`
              w-20 h-20 sm:w-24 sm:h-24 rounded-lg text-4xl font-bold flex items-center justify-center transition-all duration-200
              ${!val && !result ? 'hover:bg-white/5' : ''}
              ${val === 'X' ? 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]'}
              ${result?.line.includes(i) ? 'bg-white/10 scale-105' : 'bg-slate-900'}
            `}
          >
            {val}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="mt-8 flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium text-gray-300"
      >
        <RotateCcw size={14} /> Restart
      </button>
    </div>
  );
};
