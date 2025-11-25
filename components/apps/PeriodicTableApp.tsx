
import React from 'react';

export const PeriodicTableApp: React.FC = () => {
  const elements = [
    { n: 1, s: 'H', name: 'Hydrogen', cat: 'other-nonmetal' },
    { n: 2, s: 'He', name: 'Helium', cat: 'noble-gas' },
    // Simplified subset for prototype visual
    { n: 3, s: 'Li', name: 'Lithium', cat: 'alkali-metal' },
    { n: 4, s: 'Be', name: 'Beryllium', cat: 'alkaline-earth' },
    { n: 5, s: 'B', name: 'Boron', cat: 'metalloid' },
    { n: 6, s: 'C', name: 'Carbon', cat: 'other-nonmetal' },
    { n: 7, s: 'N', name: 'Nitrogen', cat: 'other-nonmetal' },
    { n: 8, s: 'O', name: 'Oxygen', cat: 'other-nonmetal' },
    { n: 9, s: 'F', name: 'Fluorine', cat: 'halogen' },
    { n: 10, s: 'Ne', name: 'Neon', cat: 'noble-gas' },
  ];

  const getColor = (cat: string) => {
    switch(cat) {
        case 'other-nonmetal': return 'bg-blue-200 text-blue-900';
        case 'noble-gas': return 'bg-purple-200 text-purple-900';
        case 'alkali-metal': return 'bg-red-200 text-red-900';
        default: return 'bg-gray-200 text-gray-900';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Periodic Table of Elements</h2>
        <div className="grid grid-cols-5 gap-2">
            {elements.map(e => (
                <div key={e.n} className={`${getColor(e.cat)} p-2 rounded-lg aspect-square flex flex-col justify-between border border-black/5 hover:scale-105 transition-transform cursor-pointer`}>
                    <div className="text-xs font-bold opacity-50">{e.n}</div>
                    <div className="text-center font-bold text-xl">{e.s}</div>
                    <div className="text-[10px] text-center truncate">{e.name}</div>
                </div>
            ))}
            <div className="col-span-5 p-4 text-center text-gray-400 italic bg-gray-50 rounded-lg">
                + 108 more elements (Truncated for Prototype)
            </div>
        </div>
    </div>
  );
};
