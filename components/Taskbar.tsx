import React, { useState, useEffect } from 'react';
import { AppDefinition, WindowState } from '../types';
import { Grip, Wifi, Volume2, Battery, Search } from 'lucide-react';
import { format } from 'date-fns';

interface TaskbarProps {
  apps: AppDefinition[];
  openWindows: WindowState[];
  activeWindowId: string | null;
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
  onToggleControlCenter: () => void;
  onToggleCalendar: () => void;
  onOpenApp: (appId: string) => void;
  onMinimizeWindow: (windowId: string) => void;
  onFocusWindow: (windowId: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  apps,
  openWindows,
  activeWindowId,
  isStartMenuOpen,
  onToggleStartMenu,
  onToggleControlCenter,
  onToggleCalendar,
  onOpenApp,
  onMinimizeWindow,
  onFocusWindow
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter for pinned apps or just commonly used ones
  const pinnedApps = apps.slice(0, 5); 

  const handleAppClick = (appId: string) => {
    const openInstance = openWindows.find(w => w.appId === appId);
    if (openInstance) {
      if (openInstance.id === activeWindowId && !openInstance.isMinimized) {
        onMinimizeWindow(openInstance.id);
      } else {
        onFocusWindow(openInstance.id);
      }
    } else {
      onOpenApp(appId);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-950/70 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between px-3 z-50">
      
      {/* Start & Search */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleStartMenu}
          className={`p-2 rounded-md transition-all duration-200 ${isStartMenuOpen ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-300 hover:text-white'}`}
        >
          <Grip size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/5 hover:bg-white/10 transition-colors w-48 cursor-text">
          <Search size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400">Search Nebula...</span>
        </div>
      </div>

      {/* Centered App Dock */}
      <div className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2 h-full">
        {pinnedApps.map((app) => {
          const isOpen = openWindows.some(w => w.appId === app.id);
          const isActive = openWindows.some(w => w.appId === app.id && w.id === activeWindowId && !w.isMinimized);
          
          return (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="group relative p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <app.icon 
                size={22} 
                className={`transition-all duration-200 ${isActive ? 'text-blue-400 -translate-y-1' : 'text-gray-300 group-hover:text-white'}`} 
              />
              {isOpen && (
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isActive ? 'bg-blue-400 w-3' : 'bg-gray-500'} transition-all duration-200`} />
              )}
              
              {/* Tooltip */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none whitespace-nowrap">
                {app.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleControlCenter}
          className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors cursor-default"
        >
          <Wifi size={14} className="text-gray-300" />
          <Volume2 size={14} className="text-gray-300" />
          <Battery size={14} className="text-gray-300" />
        </button>
        
        <button 
          onClick={onToggleCalendar}
          className="flex flex-col items-end justify-center px-2 py-1 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors cursor-default text-right min-w-[80px]"
        >
          <span className="text-xs font-medium text-gray-200 leading-none mb-0.5">
            {format(currentTime, 'h:mm aa')}
          </span>
          <span className="text-[10px] text-gray-400 leading-none">
            {format(currentTime, 'MMM d, yyyy')}
          </span>
        </button>
      </div>
    </div>
  );
};