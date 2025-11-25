
import React from 'react';
import { Navigation, MapPin, Search, Layers } from 'lucide-react';

export const MapsApp: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-100">
        <div className="absolute top-4 left-4 z-10 w-80 shadow-xl rounded-lg overflow-hidden bg-white flex flex-col">
            <div className="flex items-center p-3 border-b border-gray-100">
                <Search className="text-gray-400 ml-1" size={20} />
                <input className="flex-1 px-3 outline-none text-sm text-gray-700" placeholder="Search Google Maps" />
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button className="text-blue-600 p-1 hover:bg-blue-50 rounded"><Navigation size={20} /></button>
            </div>
        </div>

        <div className="flex-1 bg-blue-100 relative overflow-hidden flex items-center justify-center">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center grayscale" />
            
            <div className="text-center text-gray-500 select-none pointer-events-none">
                <MapPin size={48} className="mx-auto text-red-500 mb-2 drop-shadow-lg animate-bounce" />
                <h2 className="text-2xl font-bold">San Francisco, CA</h2>
            </div>

            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                 <button className="w-10 h-10 bg-white rounded shadow flex items-center justify-center hover:bg-gray-50"><Layers size={20} className="text-gray-600" /></button>
                 <button className="w-10 h-10 bg-white rounded shadow flex items-center justify-center hover:bg-gray-50 text-xl font-bold text-gray-600">+</button>
                 <button className="w-10 h-10 bg-white rounded shadow flex items-center justify-center hover:bg-gray-50 text-xl font-bold text-gray-600">-</button>
            </div>
        </div>
    </div>
  );
};
