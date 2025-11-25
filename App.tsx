
import React, { useState, useEffect } from 'react';
import { APPS, INITIAL_WALLPAPER, WALLPAPERS, DEFAULT_FS } from './constants';
import { WindowState, SystemState, ContextMenuState, Notification, FileSystemNode, StickyNote, DesktopIcon, Toast } from './types';
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
import { SpotlightSearch } from './components/system/SpotlightSearch';
import { ToastManager } from './components/system/ToastManager';

type ActivePanel = 'start' | 'control' | 'calendar' | 'notifications' | null;

function App() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [wallpaper, setWallpaper] = useState(INITIAL_WALLPAPER);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  
  // System State
  const [systemState, setSystemState] = useState<SystemState>({
    wifi: true,
    bluetooth: true,
    brightness: 80,
    volume: 60,
    theme: 'dark',
    nightShift: false,
    username: 'Guest User',
    accentColor: '#3b82f6',
    powerMode: 'balanced',
    privacy: { location: true, camera: true, microphone: true }
  });

  // New State for Features
  const [fs, setFs] = useState<FileSystemNode>(DEFAULT_FS);
  const [installedAppIds, setInstalledAppIds] = useState<string[]>([
    'files', 'store', 'terminal', 'monitor', 'assistant', 'music', 
    'internet', 'calculator', 'notepad', 'settings', 'camera', 
    'tictactoe', 'trash', 'taskmanager', 'clipboard', 
    'paint', 'recorder', 'photo', 'video', 'markdown',
    'kanban', 'spreadsheet', 'pdf', 'stickynotes', 'clock',
    'code', 'colorpicker', 'json', 'regex',
    'weather', 'pomodoro', 'minesweeper', 'memory', 'unit', 'password', 'qrcode', 'snake', '2048', 'typing', 'tts', 'currency', 'periodic', 'whiteboard', 'diff', 'mail', 'disk', 'meeting', 'wallet', 'vault', 'chain'
  ]);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>([]);
  
  // Screensaver State
  const [idleTime, setIdleTime] = useState(0);
  const [isScreenSaverActive, setIsScreenSaverActive] = useState(false);
  const IDLE_THRESHOLD = 300; 

  // Dialogs
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Load state from local storage...
  useEffect(() => {
    const savedFs = localStorage.getItem('nebula-fs-v1');
    if (savedFs) try { setFs(JSON.parse(savedFs)); } catch(e) {}
    
    const savedApps = localStorage.getItem('nebula-apps-v1');
    if (savedApps) try { setInstalledAppIds(JSON.parse(savedApps)); } catch(e) {}

    const savedNotes = localStorage.getItem('nebula-notes-v1');
    if (savedNotes) try { setStickyNotes(JSON.parse(savedNotes)); } catch(e) {}

    const savedSystem = localStorage.getItem('nebula-system-v1');
    if (savedSystem) try { setSystemState(prev => ({...prev, ...JSON.parse(savedSystem)})); } catch(e) {}

    const savedIcons = localStorage.getItem('nebula-desktop-icons-v1');
    if (savedIcons) {
        try { setDesktopIcons(JSON.parse(savedIcons)); } catch(e) {}
    } else {
        const icons: DesktopIcon[] = [];
        APPS.forEach((app, index) => {
            icons.push({
                id: `icon-${app.id}`,
                appId: app.id,
                x: 20,
                y: 20 + (index * 90)
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
  useEffect(() => { localStorage.setItem('nebula-system-v1', JSON.stringify(systemState)); }, [systemState]);

  // Screensaver Logic
  useEffect(() => {
    const timer = setInterval(() => {
        setIdleTime(prev => {
            if (prev >= IDLE_THRESHOLD && !isScreenSaverActive && !isLocked) setIsScreenSaverActive(true);
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

  // Keyboard Shortcuts (Run, Spotlight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
            e.preventDefault();
            setIsRunDialogOpen(true);
        }
        if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
            e.preventDefault();
            setIsSpotlightOpen(prev => !prev);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => cycleWallpaper(), 600000);
    return () => clearInterval(interval);
  }, [wallpaper]);

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ isOpen: false, x: 0, y: 0 });

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [{ id: Date.now().toString(), timestamp: new Date(), read: false, ...notif }, ...prev]);
  };

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleOpenApp = (appId: string) => {
    if (!installedAppIds.includes(appId) && appId !== 'store' && appId !== 'trash') return;
    const app = APPS.find((a) => a.id === appId);
    if (!app) return;

    const instanceId = `${appId}-${Date.now()}`;
    const newZIndex = maxZIndex + 1;
    setWindows([...windows, {
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
    }]);
    setActiveWindowId(instanceId);
    setMaxZIndex(newZIndex);
    setActivePanel(null);
  };

  const handleCloseWindow = (id: string) => {
    setWindows(prev => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
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
    setWindows(windows.map(win => win.id === id ? { ...win, isMinimized: false, zIndex: maxZIndex + 1 } : win));
    setMaxZIndex(maxZIndex + 1);
    setActiveWindowId(id);
  };

  const handleMoveWindow = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  };

  const handleResizeWindow = (id: string, size: { width: number; height: number }, position?: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size, position: position || w.position } : w));
  };

  const handleSnapWindow = (id: string, type: 'left' | 'right' | null) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isSnapped: type } : w));
  };

  const togglePanel = (panel: ActivePanel) => setActivePanel(current => current === panel ? null : panel);

  const cycleWallpaper = () => {
    const nextIndex = (WALLPAPERS.indexOf(wallpaper) + 1) % WALLPAPERS.length;
    setWallpaper(WALLPAPERS[nextIndex]);
  };

  // Unlock Logic
  const handleUnlock = (input: string, method: 'password' | 'wallet' = 'password') => {
    if (method === 'password') {
        if (!systemState.password) {
            setSystemState(prev => ({ ...prev, password: input }));
        }
    } else if (method === 'wallet') {
        setSystemState(prev => ({ ...prev, walletAddress: input, username: `${input.substring(0, 6)}...` }));
        addToast(`Welcome back! Connected: ${input.substring(0, 6)}...`, 'success');
    }
    setIsLocked(false);
  };

  const visibleApps = APPS.filter(app => installedAppIds.includes(app.id));

  const handleUpdateIconPosition = (id: string, x: number, y: number) => {
    setDesktopIcons(prev => prev.map(icon => icon.id === id ? { ...icon, x, y } : icon));
  };

  return (
    <>
    {isLocked && (
        <LockScreen 
            username={systemState.username} 
            storedPassword={systemState.password} 
            onUnlock={handleUnlock} 
        />
    )}
    {isScreenSaverActive && <ScreenSaver onWake={() => setIsScreenSaverActive(false)} />}
    
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center select-none text-sm font-sans"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onContextMenu={(e) => { e.preventDefault(); setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY }); }}
    >
      <div className={`pointer-events-none fixed inset-0 z-[1] bg-orange-500/10 transition-opacity duration-1000 ${systemState.nightShift ? 'opacity-100' : 'opacity-0'}`} />

      <div className="absolute inset-0 z-[10] overflow-hidden">
        <Desktop 
            apps={visibleApps} 
            onOpenApp={handleOpenApp} 
            stickyNotes={stickyNotes} 
            setStickyNotes={setStickyNotes}
            desktopIcons={desktopIcons}
            onUpdateIconPosition={handleUpdateIconPosition}
        />
      </div>

      <div className="absolute inset-0 z-[20] pointer-events-none overflow-hidden">
        {windows.map((window) => {
            let component = window.component;
            // Inject Props based on App ID
            // Core FS Apps
            if (['terminal', 'files', 'trash', 'recorder', 'notepad', 'kanban'].includes(window.appId)) {
                component = React.cloneElement(window.component as React.ReactElement, { fs, setFs });
            }
            // Settings
            else if (window.appId === 'settings') {
                component = React.cloneElement(window.component as React.ReactElement, { onWallpaperChange: setWallpaper, currentWallpaper: wallpaper, systemState, setSystemState });
            }
            // Task Manager
            else if (window.appId === 'taskmanager') {
                component = React.cloneElement(window.component as React.ReactElement, { windows, onCloseWindow: handleCloseWindow });
            }
            // Store
            else if (window.appId === 'store') {
                component = React.cloneElement(window.component as React.ReactElement, { installedApps: installedAppIds, setInstalledApps: setInstalledAppIds });
            }
            // Sticky Notes
            else if (window.appId === 'stickynotes') {
                component = React.cloneElement(window.component as React.ReactElement, { stickyNotes, setStickyNotes });
            }
            // Vault
            else if (window.appId === 'vault') {
                component = React.cloneElement(window.component as React.ReactElement, { systemState });
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
                onSnap={handleSnapWindow}
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
        {isRunDialogOpen && <RunDialog isOpen={isRunDialogOpen} onClose={() => setIsRunDialogOpen(false)} onRun={handleOpenApp} />}
        <SpotlightSearch isOpen={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} apps={visibleApps} onLaunchApp={handleOpenApp} />
        <ToastManager toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
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

      <StartMenu isOpen={activePanel === 'start'} apps={visibleApps} onOpenApp={handleOpenApp} onClose={() => setActivePanel(null)} username={systemState.username} />
      <ControlCenter isOpen={activePanel === 'control'} onClose={() => setActivePanel(null)} systemState={systemState} setSystemState={setSystemState} />
      <CalendarWidget isOpen={activePanel === 'calendar'} onClose={() => setActivePanel(null)} />
      <NotificationCenter isOpen={activePanel === 'notifications'} onClose={() => setActivePanel(null)} notifications={notifications} onClearAll={() => setNotifications([])} onCloseNotification={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} />
    </div>
    </>
  );
}
export default App;
