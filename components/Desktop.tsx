import React from 'react';
import { AppDefinition } from '../types';

interface DesktopProps {
  apps: AppDefinition[];
  onOpenApp: (appId: string) => void;
}

export const Desktop: React.FC<DesktopProps> = ({ apps, onOpenApp }) => {
  return (
    <div className="absolute inset-0 p-4 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-4 content-start items-start w-fit">
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onOpenApp(app.id)}
          className="group flex flex-col items-center justify-center gap-2 w-24 p-2 rounded-lg hover:bg-white/10 transition-colors focus:bg-white/20 focus:outline-none"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-200 backdrop-blur-sm">
            <app.icon className="text-white drop-shadow-lg" size={28} />
          </div>
          <span className="text-xs text-white font-medium drop-shadow-md text-center line-clamp-2 leading-tight">
            {app.title}
          </span>
        </button>
      ))}
    </div>
  );
};
