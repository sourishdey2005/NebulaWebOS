
import React, { useState } from 'react';
import { Sigma, Save, Download } from 'lucide-react';

export const SpreadsheetApp: React.FC = () => {
  const ROWS = 20;
  const COLS = 10; // A to J
  
  const getColLabel = (index: number) => String.fromCharCode(65 + index);

  const [data, setData] = useState<{[key: string]: string}>({
    'A1': 'Item', 'B1': 'Cost', 'C1': 'Qty', 'D1': 'Total',
    'A2': 'Apple', 'B2': '1.50', 'C2': '10', 'D2': '=B2*C2',
    'A3': 'Banana', 'B3': '0.80', 'C3': '20', 'D3': '=B3*C3',
    'A4': 'Orange', 'B4': '1.20', 'C4': '15', 'D4': '=B4*C4',
    'C5': 'Total:', 'D5': '=SUM(D2:D4)'
  });

  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const parseFormula = (value: string) => {
    if (!value.startsWith('=')) return value;
    
    const formula = value.substring(1).toUpperCase();
    
    // Simple SUM range: SUM(D2:D4)
    if (formula.startsWith('SUM(') && formula.endsWith(')')) {
        const range = formula.substring(4, formula.length - 1);
        const [start, end] = range.split(':');
        if (start && end) {
            const startCol = start.charAt(0);
            const startRow = parseInt(start.substring(1));
            const endRow = parseInt(end.substring(1));
            let sum = 0;
            for (let r = startRow; r <= endRow; r++) {
                const val = parseFloat(parseFormula(data[`${startCol}${r}`] || '0'));
                if (!isNaN(val)) sum += val;
            }
            return sum.toFixed(2);
        }
    }
    
    // Simple arithmetic (very basic parser for A1*B1 etc)
    try {
        let expression = formula;
        // Replace cell refs with values
        expression = expression.replace(/[A-J][0-9]+/g, (match) => {
            const val = parseFormula(data[match] || '0');
            return isNaN(parseFloat(val)) ? '0' : val;
        });
        // eslint-disable-next-line no-eval
        return eval(expression).toString();
    } catch {
        return '#ERROR';
    }
  };

  const handleCellChange = (cell: string, value: string) => {
    setData(prev => ({ ...prev, [cell]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-800">
      {/* Toolbar */}
      <div className="h-10 border-b flex items-center px-2 bg-gray-50 gap-2 shrink-0">
         <div className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded">
            <Sigma size={18} />
         </div>
         <div className="flex-1 text-sm font-medium text-gray-500 px-2">
            {selectedCell ? `${selectedCell}: ${data[selectedCell] || ''}` : 'Select a cell'}
         </div>
         <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Save"><Save size={16}/></button>
         <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Download CSV"><Download size={16}/></button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto bg-gray-100 relative">
        <table className="border-collapse w-full">
            <thead>
                <tr>
                    <th className="w-10 bg-gray-200 border border-gray-300"></th>
                    {Array.from({ length: COLS }).map((_, i) => (
                        <th key={i} className="bg-gray-200 border border-gray-300 w-24 text-xs font-normal text-gray-600 h-6">
                            {getColLabel(i)}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: ROWS }).map((_, r) => (
                    <tr key={r}>
                        <td className="bg-gray-200 border border-gray-300 text-center text-xs text-gray-500 font-mono">
                            {r + 1}
                        </td>
                        {Array.from({ length: COLS }).map((_, c) => {
                            const cellId = `${getColLabel(c)}${r + 1}`;
                            const rawValue = data[cellId] || '';
                            const displayValue = selectedCell === cellId ? rawValue : parseFormula(rawValue);
                            
                            return (
                                <td key={c} className="border border-gray-300 bg-white p-0 relative">
                                    <input
                                        type="text"
                                        className={`w-full h-full px-1 py-0.5 outline-none text-sm border-2 border-transparent focus:border-blue-500 focus:z-10 absolute inset-0 ${selectedCell === cellId ? 'bg-blue-50' : ''}`}
                                        value={displayValue}
                                        onChange={(e) => handleCellChange(cellId, e.target.value)}
                                        onFocus={() => setSelectedCell(cellId)}
                                        onBlur={() => setSelectedCell(null)}
                                    />
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};