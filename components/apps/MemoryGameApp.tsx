
import React, { useState, useEffect } from 'react';
import { Cat, Dog, Fish, Bird, Rabbit, Snail, Squirrel, Turtle } from 'lucide-react';

const ICONS = [Cat, Dog, Fish, Bird, Rabbit, Snail, Squirrel, Turtle];

export const MemoryGameApp: React.FC = () => {
  const [cards, setCards] = useState<{ id: number; iconId: number; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    restart();
  }, []);

  const restart = () => {
    const deck = [...ICONS, ...ICONS]
      .map((_, i) => ({ id: i, iconId: i % ICONS.length, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((c, i) => ({ id: i, iconId: c.iconId, isFlipped: false, isMatched: false }));
    setCards(deck);
    setFlipped([]);
    setMoves(0);
  };

  const handleCardClick = (id: number) => {
    if (flipped.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (newCards[first].iconId === newCards[second].iconId) {
        // Match
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlipped([]);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, isFlipped: false } : c));
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const IconComponent = ({ id }: { id: number }) => {
    const Icon = ICONS[id];
    return <Icon size={32} />;
  };

  return (
    <div className="flex flex-col h-full bg-emerald-900 p-6 text-white">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-emerald-100">Memory Match</h2>
            <div className="flex gap-4 items-center">
                <span className="text-emerald-300 font-mono">Moves: {moves}</span>
                <button onClick={restart} className="bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded shadow">Restart</button>
            </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 flex-1">
            {cards.map((card) => (
                <div 
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`
                        aspect-square rounded-xl cursor-pointer transition-all duration-300 transform perspective-1000 flex items-center justify-center shadow-xl
                        ${card.isFlipped ? 'bg-white text-emerald-600 rotate-y-180' : 'bg-emerald-800 border-2 border-emerald-700 hover:bg-emerald-700'}
                    `}
                >
                    {card.isFlipped ? <IconComponent id={card.iconId} /> : <div className="text-emerald-900 font-bold text-2xl">?</div>}
                </div>
            ))}
        </div>
    </div>
  );
};
