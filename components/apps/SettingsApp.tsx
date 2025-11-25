import React from 'react';
import { User, Monitor, Wifi, Battery, Shield } from 'lucide-react';

export const SettingsApp: React.FC = () => {
  const menuItems = [
    { icon: User, label: "Account" },
    { icon: Monitor, label: "Display", active: true },
    { icon: Wifi, label: "Network" },
    { icon: Battery, label: "Power" },
    { icon: Shield, label: "Privacy" },
  ];

  return (
    <div className="flex h-full bg-slate-900 text-white">
      {/* Sidebar */}
      <div className="w-48 bg-slate-950/50 border-r border-white/5 p-4 space-y-1">
        {menuItems.map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${item.active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <item.icon size={16} />
                {item.label}
            </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6">Display Settings</h2>
        
        <div className="space-y-6">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                <label className="text-sm font-medium text-gray-300 mb-2 block">Wallpaper</label>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-24 h-16 rounded-lg bg-gray-700 shrink-0 border-2 border-transparent hover:border-blue-500 cursor-pointer overflow-hidden">
                             <img src={`https://picsum.photos/100/60?random=${i+10}`} className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Dark Mode</span>
                    <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Night Shift</span>
                    <div className="w-10 h-6 bg-slate-700 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                 </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                <label className="text-sm font-medium text-gray-300 mb-2 block">Resolution</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none">
                    <option>Default for Display (1920 x 1080)</option>
                    <option>Scaled</option>
                </select>
            </div>
        </div>
      </div>
    </div>
  );
};
