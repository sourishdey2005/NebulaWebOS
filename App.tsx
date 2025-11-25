
import React, { useState, useEffect } from 'react';
import { APPS, INITIAL_WALLPAPER, WALLPAPERS } from './constants';
import { WindowState, SystemState, ContextMenuState, Notification } from './types';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { Window } from './components/Window';
import { StartMenu } from './components/StartMenu';
import { ControlCenter } from './components/system/ControlCenter';
import { CalendarWidget } from './components/system/CalendarWidget';
import { ContextMenu } from './components/system/ContextMenu';
import { NotificationCenter } from './components/system/NotificationCenter';
import { ShieldCheck } from 'lucide-react';

type ActivePanel = 'start' | 'control' | 'calendar' | 'notifications' | null;

function App() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [wallpaper, setWallpaper] = useState(INITIAL_WALLPAPER);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0
  });
  
  const [systemState, setSystemState] = useState<SystemState>({
    wifi: true,
    bluetooth: true,
    brightness: 80,
    volume: 60,
    theme: 'dark',
    nightShift: false,
    username: 'John Doe',
    powerMode: 'balanced',
    privacy: {
      location: true,
      camera: true,
      microphone: true
    }
  });

  // Startup Notification
  useEffect(() => {
    // Add a welcome notification after a short delay
    const timer = setTimeout(() => {
        addNotification({
            title: 'Welcome to Nebula OS',
            message: 'System initialization complete. All systems are running normally. Explore the AI features in Nebula Chat.',
            source: 'System',
            type: 'success'
        });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
        ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleOpenApp = (appId: string) => {
    const app = APPS.find((a) => a.id === appId);
    if (!app) return;

    const instanceId = `${appId}-${Date.now()}`;
    const newZIndex = maxZIndex + 1;

    const newWindow: WindowState = {
      id: instanceId,
      appId: app.id,
      title: app.title,
      icon: app.icon,
      component: app.component,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZIndex,
      position: { x: 50 + (windows.length * 20), y: 50 + (windows.length * 20) },
      size: { width: app.defaultWidth || 600, height: app.defaultHeight || 400 },
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(instanceId);
    setMaxZIndex(newZIndex);
    setActivePanel(null); // Close any panels when opening an app
  };

  const handleCloseWindow = (id: string) => {
    setWindows(windows.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id);
      if (remaining.length > 0) {
        const nextTop = remaining.reduce((prev, current) => (prev.zIndex > current.zIndex ? prev : current));
        setActiveWindowId(nextTop.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows(windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
    setActiveWindowId(null);
  };

  const handleMaximizeWindow = (id: string) => {
    setWindows(windows.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)));
    handleFocusWindow(id);
  };

  const handleFocusWindow = (id: string) => {
    const w = windows.find((w) => w.id === id);
    if (!w) return;

    if (w.isMinimized) {
        setWindows(windows.map(win => win.id === id ? { ...win, isMinimized: false, zIndex: maxZIndex + 1 } : win));
    } else {
        setWindows(windows.map(win => win.id === id ? { ...win, zIndex: maxZIndex + 1 } : win));
    }
    
    setMaxZIndex(maxZIndex + 1);
    setActiveWindowId(id);
  };

  const handleMoveWindow = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  };

  const handleResizeWindow = (id: string, size: { width: number; height: number }, position?: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size, position: position || w.position } : w));
  };

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel(current => current === panel ? null : panel);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const cycleWallpaper = () => {
    const currentIndex = WALLPAPERS.indexOf(wallpaper);
    const nextIndex = (currentIndex + 1) % WALLPAPERS.length;
    setWallpaper(WALLPAPERS[nextIndex]);
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center select-none text-sm transition-[background-image] duration-500 ease-in-out font-sans"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onContextMenu={handleContextMenu}
    >
      {/* Night Shift Overlay */}
      <div className={`pointer-events-none fixed inset-0 z-[1] bg-orange-500/10 transition-opacity duration-1000 ${systemState.nightShift ? 'opacity-100' : 'opacity-0'}`} />

      {/* Desktop Layer */}
      <div className="relative z-[10]">
        <Desktop apps={APPS} onOpenApp={handleOpenApp} />
      </div>

      {/* Floating Widgets Layer */}
      <div className="absolute right-4 top-20 z-[15] flex flex-col gap-4">
         {/* Security Shield Widget matching screenshot */}
         <button 
            onClick={() => addNotification({ title: 'Security Scan Complete', message: 'No threats found. Your system is secure.', source: 'Security', type: 'success' })}
            className="w-12 h-12 rounded-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 flex items-center justify-center shadow-lg group cursor-pointer hover:bg-blue-600/30 transition-all active:scale-95"
         >
            <ShieldCheck size={24} className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <div className="absolute right-14 bg-slate-900/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap">
                System Secure
            </div>
         </button>
      </div>

      {/* Windows Layer */}
      <div className="relative z-[20]">
        {windows.map((window) => {
            // Inject props into specific apps that need system state
            let component = window.component;
            
            if (window.appId === 'settings') {
            component = React.cloneElement(window.component as React.ReactElement<any>, {
                onWallpaperChange: setWallpaper,
                currentWallpaper: wallpaper,
                systemState: systemState,
                setSystemState: setSystemState
            });
            }

            return (
            <Window
                key={window.id}
                windowState={{...window, component}}
                isActive={window.id === activeWindowId}
                onClose={handleCloseWindow}
                onMinimize={handleMinimizeWindow}
                onMaximize={handleMaximizeWindow}
                onFocus={handleFocusWindow}
                onMove={handleMoveWindow}
                onResize={handleResizeWindow}
            />
            );
        })}
      </div>

      {/* Context Menu */}
      <div className="relative z-[100]">
         <ContextMenu 
            {...contextMenu}
            onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
            onRefresh={() => window.location.reload()}
            onChangeWallpaper={() => { cycleWallpaper(); setContextMenu(prev => ({ ...prev, isOpen: false })); }}
            onOpenSettings={() => { handleOpenApp('settings'); setContextMenu(prev => ({ ...prev, isOpen: false })); }}
        />
      </div>

      {/* Taskbar - Direct Child to fix positioning */}
      <Taskbar
        apps={APPS}
        openWindows={windows}
        activeWindowId={activeWindowId}
        isStartMenuOpen={activePanel === 'start'}
        onToggleStartMenu={() => togglePanel('start')}
        onToggleControlCenter={() => togglePanel('control')}
        onToggleCalendar={() => togglePanel('calendar')}
        onToggleNotifications={() => togglePanel('notifications')}
        notificationCount={notifications.length}
        onOpenApp={handleOpenApp}
        onMinimizeWindow={handleMinimizeWindow}
        onFocusWindow={handleFocusWindow}
      />

      {/* System Panels - Direct Children to fix positioning */}
      <StartMenu
        isOpen={activePanel === 'start'}
        apps={APPS}
        onOpenApp={handleOpenApp}
        onClose={() => setActivePanel(null)}
        username={systemState.username}
      />

      <ControlCenter
        isOpen={activePanel === 'control'}
        onClose={() => setActivePanel(null)}
        systemState={systemState}
        setSystemState={setSystemState}
      />

      <CalendarWidget
        isOpen={activePanel === 'calendar'}
        onClose={() => setActivePanel(null)}
      />

      <NotificationCenter
        isOpen={activePanel === 'notifications'}
        onClose={() => setActivePanel(null)}
        notifications={notifications}
        onClearAll={() => setNotifications([])}
        onCloseNotification={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />
    </div>
  );
}

export default App;
