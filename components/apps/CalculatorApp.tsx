import React, { useState } from 'react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handlePress = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      setEquation('');
    } else if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(equation + display); // Safe enough for this localized context
        setDisplay(String(result));
        setEquation('');
      } catch (e) {
        setDisplay('Error');
      }
    } else if (['+', '-', '*', '/'].includes(val)) {
      setEquation(equation + display + val);
      setDisplay('0');
    } else {
      setDisplay(display === '0' ? val : display + val);
    }
  };

  const buttons = [
    'C', '+/-', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex-1 flex flex-col items-end justify-end p-6 space-y-2">
        <span className="text-gray-400 text-sm h-6">{equation}</span>
        <span className="text-4xl font-light text-white">{display}</span>
      </div>
      <div className="grid grid-cols-4 gap-[1px] bg-slate-800 p-[1px]">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => handlePress(btn)}
            className={`
              h-16 text-xl font-medium transition-colors
              ${btn === '=' ? 'col-span-2 bg-orange-500 hover:bg-orange-400 text-white' : ''}
              ${['/', '*', '-', '+'].includes(btn) ? 'bg-slate-700 hover:bg-slate-600 text-white' : ''}
              ${!['=', '/', '*', '-', '+'].includes(btn) ? 'bg-slate-800 hover:bg-slate-700 text-gray-200' : ''}
            `}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};
