
import React, { useState, useEffect } from 'react';
import { Cuboid, ArrowRight, Activity, Hash, Clock } from 'lucide-react';

interface Block {
  height: number;
  hash: string;
  txCount: number;
  time: string;
  miner: string;
}

export const ChainExplorerApp: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  
  useEffect(() => {
    // Initial Blocks
    const initial: Block[] = [];
    for(let i=0; i<5; i++) {
        initial.push(generateBlock(1000 - i));
    }
    setBlocks(initial);

    // Simulate new blocks
    const interval = setInterval(() => {
        setBlocks(prev => [generateBlock(prev[0].height + 1), ...prev.slice(0, 9)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const generateBlock = (height: number): Block => {
    return {
        height,
        hash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
        txCount: Math.floor(Math.random() * 50) + 1,
        time: new Date().toLocaleTimeString(),
        miner: 'Nebula_Validator_' + Math.floor(Math.random() * 9)
    };
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-mono">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-slate-950">
            <div className="flex items-center gap-3 mb-2">
                <Cuboid className="text-blue-500" size={24} />
                <h2 className="text-xl font-bold tracking-tight">Nebula Chain Explorer</h2>
            </div>
            <div className="flex gap-6 text-xs text-gray-400">
                <div className="flex items-center gap-1"><Activity size={12} className="text-green-400" /> TPS: 1245</div>
                <div className="flex items-center gap-1"><Hash size={12} className="text-purple-400" /> Latest Block: {blocks[0]?.height}</div>
            </div>
        </div>

        {/* Block List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {blocks.map((block, i) => (
                <div 
                    key={block.height}
                    className={`
                        relative p-4 rounded-xl border bg-slate-800/50 flex flex-col gap-2 transition-all duration-500
                        ${i === 0 ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)] animate-in slide-in-from-left-10 fade-in' : 'border-white/5'}
                    `}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">#{block.height}</span>
                            <span className="text-xs text-gray-500">{block.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            Validated by <span className="text-white">{block.miner}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg border border-white/5 text-xs">
                        <span className="text-gray-500 shrink-0">Hash</span>
                        <span className="truncate text-blue-400/80">{block.hash}</span>
                        <button className="ml-auto text-gray-600 hover:text-white"><ArrowRight size={14}/></button>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                        <span>Transactions: <span className="text-white">{block.txCount}</span></span>
                        <span>Size: <span className="text-white">{(Math.random() * 2).toFixed(2)} MB</span></span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
