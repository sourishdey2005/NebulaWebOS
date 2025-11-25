
import React from 'react';

export const Game2048App: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#faf8ef] items-center justify-center p-4 text-[#776e65]">
        <h1 className="text-4xl font-bold mb-2">2048</h1>
        <div className="bg-[#bbada0] p-2 rounded-lg relative w-[300px] h-[300px]">
             {/* Mock visual for prototype */}
             <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full">
                <div className="bg-[#eee4da] rounded flex items-center justify-center text-2xl font-bold">2</div>
                <div className="bg-[#cdc1b4] rounded"></div>
                <div className="bg-[#cdc1b4] rounded"></div>
                <div className="bg-[#ede0c8] rounded flex items-center justify-center text-2xl font-bold">4</div>
                
                <div className="bg-[#cdc1b4] rounded"></div>
                <div className="bg-[#f2b179] rounded flex items-center justify-center text-2xl font-bold text-white">8</div>
                <div className="bg-[#cdc1b4] rounded"></div>
                <div className="bg-[#cdc1b4] rounded"></div>

                <div className="bg-[#cdc1b4] rounded"></div>
                <div className="bg-[#cdc1b4] rounded"></div>
                <div className="bg-[#f59563] rounded flex items-center justify-center text-2xl font-bold text-white">16</div>
                <div className="bg-[#cdc1b4] rounded"></div>

                <div className="bg-[#edc22e] rounded flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_10px_gold]">2048</div>
                <div className="bg-[#cdc1b4] rounded"></div>
                <div className="bg-[#cdc1b4] rounded"></div>
                <div className="bg-[#cdc1b4] rounded"></div>
             </div>
             
             <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg">
                <div className="text-center">
                    <p className="font-bold mb-2">Demo Mode</p>
                    <button className="px-4 py-2 bg-[#8f7a66] text-white rounded font-bold">Play</button>
                </div>
             </div>
        </div>
        <p className="mt-4 text-xs text-center">Join the numbers and get to the <span className="font-bold">2048</span> tile!</p>
    </div>
  );
};
