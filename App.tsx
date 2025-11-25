
import React, { useState, useEffect, useRef } from 'react';
import { APPS, INITIAL_WALLPAPER, WALLPAPERS, DEFAULT_FS } from './constants';
import { WindowState, SystemState, ContextMenuState, Notification, FileSystemNode, StickyNote, DesktopIcon } from './types';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { Window } from './components/Window';
import { StartMenu } from './components/StartMenu';
import { ControlCenter } from './components/system/ControlCenter';
import { CalendarWidget } from './components/system/CalendarWidget';
import { ContextMenu } from './components/system/ContextMenu';
import { NotificationCenter } from './components/system/NotificationCenter';
import { ShieldCheck } from 'lucide-react';
import { LockScreen } from './components/system/LockScreen';
import { ScreenSaver } from './components/system/ScreenSaver';
import { RunDialog } from './components/system/RunDialog';

type ActivePanel = 'start' | 'control' | 'calendar' | 'notifications' | null;

function App() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [wallpaper, setWallpaper] = useState(INITIAL_WALLPAPER);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  
  // New State for Features
  const [fs, setFs] = useState<FileSystemNode>(DEFAULT_FS);
  const [installedAppIds, setInstalledAppIds] = useState<string[]>([
    'files', 'store', 'terminal', 'monitor', 'assistant', 'music', 
    'internet', 'calculator', 'notepad', 'settings', 'camera', 
    'tictactoe', 'trash', 'taskmanager', 'clipboard', 
    'paint', 'recorder', 'photo', 'video', 'markdown',
    'kanban', 'spreadsheet', 'pdf', 'stickynotes', 'clock',
    'code', 'colorpicker', 'json', 'regex',
    // New default apps
    'weather', 'pomodoro', 'minesweeper', 'memory', 'unit', 'password', 'qrcode', 'snake', '2048', 'typing', 'tts', 'currency', 'periodic', 'whiteboard', 'diff'
  ]);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  
  // Desktop Icon Positioning
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>([]);
  
  // Screensaver State
  const [idleTime, setIdleTime] = useState(0);
  const [isScreenSaverActive, setIsScreenSaverActive] = useState(false);
  const IDLE_THRESHOLD = 300; // 5 minutes in seconds

  // Run Dialog
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);

  // Load FS from localStorage on mount
  useEffect(() => {
    const savedFs = localStorage.getItem('nebula-fs-v1');
    if (savedFs) {
        try {
            setFs(JSON.parse(savedFs));
        } catch(e) { console.error('FS Load Error', e); }
    }
    
    // Load Installed Apps
    const savedApps = localStorage.getItem('nebula-apps-v1');
    if (savedApps) {
        try {
            setInstalledAppIds(JSON.parse(savedApps));
        } catch(e) {}
    }

    // Load Sticky Notes
    const savedNotes = localStorage.getItem('nebula-notes-v1');
    if (savedNotes) {
        try {
            setStickyNotes(JSON.parse(savedNotes));
        } catch(e) {}
    }

    // Load Desktop Icons
    const savedIcons = localStorage.getItem('nebula-desktop-icons-v1');
    if (savedIcons) {
        try {
            setDesktopIcons(JSON.parse(savedIcons));
        } catch(e) {}
    } else {
        // Initialize default grid
        const icons: DesktopIcon[] = [];
        APPS.forEach((app, index) => {
            icons.push({
                id: `icon-${app.id}`,
                appId: app.id,
                x: 20, // Default column 1
                y: 20 + (index * 90) // Vertical stack
            });
        });
        setDesktopIcons(icons);
    }
  }, []);

  // Save State
  useEffect(() => { localStorage.setItem('nebula-fs-v1', JSON.stringify(fs)); }, [fs]);
  useEffect(() => { localStorage.setItem('nebula-apps-v1', JSON.stringify(installedAppIds)); }, [installedAppIds]);
  useEffect(() => { localStorage.setItem('nebula-notes-v1', JSON.stringify(stickyNotes)); }, [stickyNotes]);
  useEffect(() => { localStorage.setItem('nebula-desktop-icons-v1', JSON.stringify(desktopIcons)); }, [desktopIcons]);

  // Screensaver & Idle Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
        setIdleTime(prev => {
            if (prev >= IDLE_THRESHOLD && !isScreenSaverActive && !isLocked) {
                setIsScreenSaverActive(true);
            }
            return prev + 1;
        });
    }, 1000);

    const resetIdle = () => {
        setIdleTime(0);
        if (isScreenSaverActive) setIsScreenSaverActive(false);
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('click', resetIdle);

    return () => {
        clearInterval(timer);
        window.removeEventListener('mousemove', resetIdle);
        window.removeEventListener('keydown', resetIdle);
        window.removeEventListener('click', resetIdle);
    };
  }, [isScreenSaverActive, isLocked]);

  // Keyboard Shortcuts (Run Dialog)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
            e.preventDefault();
            setIsRunDialogOpen(true);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Wallpaper Slideshow (Every 10 mins)
  useEffect(() => {
    const interval = setInterval(() => {
        cycleWallpaper();
    }, 600000);
    return () => clearInterval(interval);
  }, [wallpaper]);

  // Night Light Automation
  const [systemState, setSystemState] = useState<SystemState>({
    wifi: true,
    bluetooth: true,
    brightness: 80,
    volume: 60,
    theme: 'dark',
    nightShift: false,
    username: 'Guest User',
    powerMode: 'balanced',
    privacy: {
      location: true,
      camera: true,
      microphone: true
    }
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 19 || hour < 6) {
        if (!systemState.nightShift) setSystemState(prev => ({ ...prev, nightShift: true }));
    } else {
        if (systemState.nightShift) setSystemState(prev => ({ ...prev, nightShift: false }));
    }
  }, []);

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0
  });

  // Startup Notification
  useEffect(() => {
    if (!isLocked) {
        const timer = setTimeout(() => {
            if (notifications.length === 0) {
                addNotification({
                    title: 'Welcome to Nebula OS',
                    message: 'System ready. Press Ctrl+R to run commands.',
                    source: 'System',
                    type: 'success'
                });
            }
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [isLocked]);

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
    if (!installedAppIds.includes(appId) && appId !== 'store' && appId !== 'trash') return;

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
    setActivePanel(null);
  };

  const handleCloseWindow = (id: string) => {
    setWindows(prev => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      setWindows(currentWindows => {
        const remaining = currentWindows.filter((w) => w.id !== id);
        if (remaining.length > 0) {
           const nextTop = remaining.reduce((prev, current) => (prev.zIndex > current.zIndex ? prev : current));
           setActiveWindowId(nextTop.id);
        } else {
           setActiveWindowId(null);
        }
        return remaining;
      });
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

  const visibleApps = APPS.filter(app => installedAppIds.includes(app.id));

  // Ensure desktop icons match installed apps (basic sync)
  useEffect(() => {
    const newIcons = [...desktopIcons];
    let changed = false;
    
    // Remove uninstalled
    const filtered = newIcons.filter(icon => visibleApps.find(a => a.id === icon.appId));
    if (filtered.length !== newIcons.length) {
        newIcons.length = 0;
        newIcons.push(...filtered);
        changed = true;
    }

    // Add newly installed (simplified placement)
    visibleApps.forEach((app) => {
        if (!newIcons.find(icon => icon.appId === app.id)) {
            newIcons.push({
                id: `icon-${app.id}`,
                appId: app.id,
                x: 20 + (newIcons.length % 8) * 100,
                y: 20 + Math.floor(newIcons.length / 8) * 100
            });
            changed = true;
        }
    });

    if (changed) setDesktopIcons(newIcons);
  }, [installedAppIds]);

  const handleUpdateIconPosition = (id: string, x: number, y: number) => {
    setDesktopIcons(prev => prev.map(icon => icon.id === id ? { ...icon, x, y } : icon));
  };

  return (
    <>
    {isLocked && <LockScreen username={systemState.username} onUnlock={() => setIsLocked(false)} />}
    {isScreenSaverActive && <ScreenSaver onWake={() => setIsScreenSaverActive(false)} />}
    
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center select-none text-sm transition-[background-image] duration-500 ease-in-out font-sans"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onContextMenu={handleContextMenu}
    >
      {/* Night Shift Overlay */}
      <div className={`pointer-events-none fixed inset-0 z-[1] bg-orange-500/10 transition-opacity duration-1000 ${systemState.nightShift ? 'opacity-100' : 'opacity-0'}`} />

      {/* Desktop Layer */}
      <div className="relative z-[10] w-full h-full">
        <Desktop 
            apps={visibleApps} 
            onOpenApp={handleOpenApp} 
            stickyNotes={stickyNotes} 
            setStickyNotes={setStickyNotes}
            desktopIcons={desktopIcons}
            onUpdateIconPosition={handleUpdateIconPosition}
        />
      </div>

      {/* Floating Widgets Layer */}
      <div className="absolute right-4 top-20 z-[15] flex flex-col gap-4">
         <button 
            onClick={() => addNotification({ title: 'Security Scan Complete', message: 'No threats found. Your system is secure.', source: 'Security', type: 'success' })}
            className="w-12 h-12 rounded-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 flex items-center justify-center shadow-lg group cursor-pointer hover:bg-blue-600/30 transition-all active:scale-95"
         >
            <ShieldCheck size={24} className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
         </button>
      </div>

      {/* Windows Layer */}
      <div className="relative z-[20]">
        {windows.map((window) => {
            // Inject props
            let component = window.component;
            
            if (window.appId === 'settings') {
                component = React.cloneElement(window.component as React.ReactElement<any>, {
                    onWallpaperChange: setWallpaper,
                    currentWallpaper: wallpaper,
                    systemState: systemState,
                    setSystemState: setSystemState
                });
            } else if (['terminal', 'files', 'trash', 'recorder'].includes(window.appId)) {
                component = React.cloneElement(window.component as React.ReactElement<any>, {
                    fs: fs,
                    setFs: setFs
                });
            } else if (window.appId === 'taskmanager') {
                component = React.cloneElement(window.component as React.ReactElement<any>, {
                    windows: windows,
                    onCloseWindow: handleCloseWindow
                });
            } else if (window.appId === 'store') {
                component = React.cloneElement(window.component as React.ReactElement<any>, {
                    installedApps: installedAppIds,
                    setInstalledApps: setInstalledAppIds
                });
            } else if (window.appId === 'stickynotes') {
                component = React.cloneElement(window.component as React.ReactElement<any>, {
                    stickyNotes: stickyNotes,
                    setStickyNotes: setStickyNotes
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

      <div className="relative z-[100]">
         <ContextMenu 
            {...contextMenu}
            onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
            onRefresh={() => window.location.reload()}
            onChangeWallpaper={() => { cycleWallpaper(); setContextMenu(prev => ({ ...prev, isOpen: false })); }}
            onOpenSettings={() => { handleOpenApp('settings'); setContextMenu(prev => ({ ...prev, isOpen: false })); }}
        />
        {isRunDialogOpen && (
            <RunDialog 
                isOpen={isRunDialogOpen} 
                onClose={() => setIsRunDialogOpen(false)} 
                onRun={handleOpenApp}
            />
        )}
      </div>

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

      <StartMenu
        isOpen={activePanel === 'start'}
        apps={visibleApps}
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
    </>
  );
}

export default App;
