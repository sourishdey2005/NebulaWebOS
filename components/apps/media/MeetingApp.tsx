
import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare } from 'lucide-react';

export const MeetingApp: React.FC = () => {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
        <div className="flex-1 p-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center border border-white/10">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <div className="absolute bottom-4 left-4 text-sm font-medium bg-black/50 px-2 py-1 rounded">Sarah (Product)</div>
            </div>
            <div className="bg-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center border border-white/10">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <div className="absolute bottom-4 left-4 text-sm font-medium bg-black/50 px-2 py-1 rounded">Mike (Eng)</div>
            </div>
            <div className="bg-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center border border-white/10">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <div className="absolute bottom-4 left-4 text-sm font-medium bg-black/50 px-2 py-1 rounded">Jessica (Design)</div>
            </div>
            <div className="bg-black rounded-xl relative overflow-hidden flex items-center justify-center border border-white/10">
                {cam ? (
                     <div className="text-gray-500">You</div>
                ) : (
                    <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold">You</div>
                )}
                <div className="absolute bottom-4 left-4 text-sm font-medium bg-black/50 px-2 py-1 rounded">You</div>
            </div>
        </div>

        <div className="h-20 bg-slate-950 flex items-center justify-center gap-4">
            <button 
                onClick={() => setMic(!mic)}
                className={`p-4 rounded-full transition-colors ${mic ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-500 hover:bg-red-600'}`}
            >
                {mic ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <button 
                onClick={() => setCam(!cam)}
                className={`p-4 rounded-full transition-colors ${cam ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-500 hover:bg-red-600'}`}
            >
                {cam ? <Video size={24} /> : <VideoOff size={24} />}
            </button>
            <button className="p-4 rounded-full bg-red-600 hover:bg-red-700 px-8 flex items-center gap-2">
                <PhoneOff size={24} /> <span className="font-bold">Leave</span>
            </button>
            <button className="p-4 rounded-full bg-slate-800 hover:bg-slate-700">
                <Users size={24} />
            </button>
            <button className="p-4 rounded-full bg-slate-800 hover:bg-slate-700">
                <MessageSquare size={24} />
            </button>
        </div>
    </div>
  );
};
