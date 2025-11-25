
import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react';

export const WeatherApp: React.FC = () => {
  // Simulated Weather Data
  const [temp, setTemp] = useState(72);
  const [condition, setCondition] = useState('Partly Cloudy');

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-400 to-blue-600 text-white p-6 relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] text-yellow-300 opacity-20">
            <Sun size={200} />
        </div>
        
        <div className="z-10 mt-4">
            <h2 className="text-3xl font-light">San Francisco</h2>
            <p className="text-blue-100 text-sm">Monday, 10:23 AM</p>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center z-10">
            <Cloud size={80} className="mb-4 text-white/90" />
            <h1 className="text-8xl font-thin tracking-tighter">{temp}°</h1>
            <p className="text-xl font-medium mt-2">{condition}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-md border border-white/20">
            <div className="flex flex-col items-center">
                <Wind size={20} className="mb-1 opacity-80" />
                <span className="text-sm font-bold">8 mph</span>
                <span className="text-[10px] opacity-70">Wind</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10 border-r">
                <Droplets size={20} className="mb-1 opacity-80" />
                <span className="text-sm font-bold">42%</span>
                <span className="text-[10px] opacity-70">Humidity</span>
            </div>
            <div className="flex flex-col items-center">
                <CloudRain size={20} className="mb-1 opacity-80" />
                <span className="text-sm font-bold">10%</span>
                <span className="text-[10px] opacity-70">Precip</span>
            </div>
        </div>
    </div>
  );
};
