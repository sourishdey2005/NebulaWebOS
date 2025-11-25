
import React, { useState, useEffect } from 'react';
import { AppDefinition, WindowState } from '../types';
import { Wifi, Volume2, Monitor, Search, Grid3x3 } from 'lucide-react';
import { format } from 'date-fns';

interface TaskbarProps {
  apps: AppDefinition[];
  openWindows: WindowState[];
  activeWindowId: string | null;
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
  onToggleControlCenter: () => void;
  onToggleCalendar: () => void;
  onToggleNotifications: () => void;
  notificationCount: number;
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
  onToggleNotifications,
  notificationCount,
  onOpenApp,
  onMinimizeWindow,
  onFocusWindow
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Defined pinned apps based on the screenshot: Terminal, AI, Internet, Notepad, Camera
  const pinnedAppIds = ['terminal', 'assistant', 'internet', 'notepad', 'camera'];
  const pinnedApps = pinnedAppIds
    .map(id => apps.find(app => app.id === id))
    .filter((app): app is AppDefinition => !!app);

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
    <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-4 z-50 shadow-[0_-1px_0_rgba(255,255,255,0.05)]">
      
      {/* Left Group: Start & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleStartMenu}
          className={`p-2 rounded-lg transition-all duration-200 group ${isStartMenuOpen ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-slate-300 hover:text-white'}`}
        >
          <Grid3x3 size={24} className="transition-transform group-hover:scale-110" />
        </button>
        
        <div className="hidden sm:flex items-center gap-3 bg-[#1e293b]/80 rounded-full px-4 py-2 border border-white/5 hover:border-white/10 hover:bg-[#1e293b] transition-all w-80 cursor-text group">
          <Search size={16} className="text-slate-500 group-hover:text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Nebula..." 
            className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder-slate-500 w-full"
          />
        </div>
      </div>

      {/* Right Group: System Tray, Clock, Apps */}
      <div className="flex items-center gap-6">
        
        {/* System Tray: Wifi, Volume, Monitor (to match screenshot visual) */}
        <button 
          onClick={onToggleControlCenter}
          className="hidden sm:flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors cursor-default"
        >
          <Wifi size={18} className="text-slate-300" />
          <Volume2 size={18} className="text-slate-300" />
          <Monitor size={18} className="text-slate-300" />
        </button>
        
        {/* Clock */}
        <button 
          onClick={onToggleCalendar}
          className="flex flex-col items-end justify-center px-3 py-1 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors cursor-default min-w-[90px]"
        >
          <span className="text-sm font-semibold text-slate-200 leading-tight">
            {format(currentTime, 'h:mm aa')}
          </span>
          <span className="text-[11px] text-slate-400 font-medium leading-tight">
            {format(currentTime, 'MMM d, yyyy')}
          </span>
        </button>

        {/* App Dock (Right Side) - No Divider, No Bell */}
        <div className="flex items-center gap-3 pl-2">
          {pinnedApps.map((app) => {
            const isOpen = openWindows.some(w => w.appId === app.id);
            const isActive = openWindows.some(w => w.appId === app.id && w.id === activeWindowId && !w.isMinimized);
            
            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className={`
                  group relative p-2 rounded-lg transition-all duration-300
                  ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                `}
              >
                <app.icon 
                  size={24} 
                  className={`transition-all duration-300 drop-shadow-lg ${isActive ? 'text-blue-400' : 'text-slate-300 group-hover:text-white'}`} 
                />
                
                {/* Active Indicator */}
                {isOpen && (
                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                )}
                
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1e293b] text-white text-[11px] font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 border border-white/10 pointer-events-none whitespace-nowrap shadow-xl transform translate-y-2 group-hover:translate-y-0 z-50">
                  {app.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
