
import React from 'react';
import { AppDefinition } from '../types';

interface DesktopProps {
  apps: AppDefinition[];
  onOpenApp: (appId: string) => void;
}

export const Desktop: React.FC<DesktopProps> = ({ apps, onOpenApp }) => {
  return (
    <div className="absolute inset-0 p-6 flex flex-col flex-wrap content-start items-start gap-y-4 gap-x-4 w-fit h-[calc(100%-48px)]">
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onOpenApp(app.id)}
          className="group flex flex-col items-center justify-center gap-2 w-24 p-2 rounded-xl hover:bg-white/5 transition-colors focus:bg-white/10 focus:outline-none ring-0 outline-none"
        >
          <div className="w-14 h-14 bg-slate-900/60 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl group-hover:scale-105 group-hover:bg-slate-800/80 transition-all duration-200 backdrop-blur-md group-hover:border-white/20">
            <app.icon className="text-blue-100 drop-shadow-md opacity-90 group-hover:opacity-100 group-hover:text-white" size={28} />
          </div>
          <span className="text-xs text-blue-50 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center line-clamp-2 leading-tight tracking-wide group-hover:text-white">
            {app.title}
          </span>
        </button>
      ))}
    </div>
  );
};
