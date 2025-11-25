
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const CurrencyApp: React.FC = () => {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');

  // Mock rates
  const rates: any = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 151.5,
    CAD: 1.36
  };

  const result = (amount / rates[from]) * rates[to];

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 p-6 justify-center">
        <h2 className="text-xl font-bold mb-8 text-center text-slate-600">Currency Exchange</h2>
        
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Amount</label>
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    className="w-full text-3xl font-bold border-b-2 border-slate-200 outline-none focus:border-blue-500 py-2"
                />
            </div>

            <div className="flex items-center gap-4">
                <select value={from} onChange={(e) => setFrom(e.target.value)} className="flex-1 p-2 bg-gray-100 rounded-lg font-medium">
                    {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ArrowRight className="text-gray-400" />
                <select value={to} onChange={(e) => setTo(e.target.value)} className="flex-1 p-2 bg-gray-100 rounded-lg font-medium">
                    {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="pt-4 border-t">
                <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                        {result.toFixed(2)} {to}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        1 {from} = {(rates[to] / rates[from]).toFixed(4)} {to}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
