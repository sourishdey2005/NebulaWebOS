
import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';

export const UnitConverterApp: React.FC = () => {
  const [category, setCategory] = useState('length');
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');

  const categories: any = {
    length: {
      units: { m: 1, ft: 3.28084, in: 39.3701, cm: 100, km: 0.001, mi: 0.000621371 },
      label: 'Length'
    },
    weight: {
      units: { kg: 1, lb: 2.20462, oz: 35.274, g: 1000 },
      label: 'Weight'
    },
    temperature: {
        units: { C: 'c', F: 'f', K: 'k' },
        label: 'Temperature'
    }
  };

  const convert = () => {
    if (category === 'temperature') {
        let tempInC = value;
        if (fromUnit === 'F') tempInC = (value - 32) * 5/9;
        if (fromUnit === 'K') tempInC = value - 273.15;
        
        if (toUnit === 'C') return tempInC;
        if (toUnit === 'F') return (tempInC * 9/5) + 32;
        if (toUnit === 'K') return tempInC + 273.15;
        return 0;
    } else {
        const base = value / categories[category].units[fromUnit];
        return base * categories[category].units[toUnit];
    }
  };

  const result = convert();

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 p-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
            {Object.keys(categories).map(c => (
                <button 
                    key={c}
                    onClick={() => { setCategory(c); setFromUnit(Object.keys(categories[c].units)[0]); setToUnit(Object.keys(categories[c].units)[1]); }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${category === c ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    {categories[c].label}
                </button>
            ))}
        </div>

        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Input</label>
                <div className="flex gap-4">
                    <input 
                        type="number" 
                        value={value} 
                        onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                        className="flex-1 bg-white border rounded-lg px-3 py-2 text-lg font-mono outline-none focus:border-blue-500" 
                    />
                    <select 
                        value={fromUnit} 
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="bg-white border rounded-lg px-3 py-2"
                    >
                        {Object.keys(categories[category].units).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex justify-center text-gray-400">
                <ArrowRightLeft className="rotate-90" />
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <label className="text-xs font-bold text-blue-500 uppercase mb-2 block">Result</label>
                <div className="flex gap-4 items-center">
                    <div className="flex-1 text-2xl font-mono font-bold text-blue-900 overflow-hidden text-ellipsis">
                        {typeof result === 'number' ? result.toFixed(2) : result}
                    </div>
                    <select 
                        value={toUnit} 
                        onChange={(e) => setToUnit(e.target.value)}
                        className="bg-white border rounded-lg px-3 py-2"
                    >
                        {Object.keys(categories[category].units).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>
        </div>
    </div>
  );
};
