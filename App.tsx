import React, { useState } from 'react';
import { APPS, INITIAL_WALLPAPER } from './constants';
import { WindowState, SystemState } from './types';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { Window } from './components/Window';
import { StartMenu } from './components/StartMenu';
import { ControlCenter } from './components/system/ControlCenter';
import { CalendarWidget } from './components/system/CalendarWidget';

type ActivePanel = 'start' | 'control' | 'calendar' | null;

function App() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  
  const [systemState, setSystemState] = useState<SystemState>({
    wifi: true,
    bluetooth: true,
    brightness: 80,
    volume: 60,
    theme: 'dark'
  });

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

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel(current => current === panel ? null : panel);
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center select-none text-sm"
      style={{ backgroundImage: `url(${INITIAL_WALLPAPER})` }}
    >
      {/* Desktop Icons */}
      <Desktop apps={APPS} onOpenApp={handleOpenApp} />

      {/* Windows Layer */}
      {windows.map((window) => (
        <Window
          key={window.id}
          windowState={window}
          isActive={window.id === activeWindowId}
          onClose={handleCloseWindow}
          onMinimize={handleMinimizeWindow}
          onMaximize={handleMaximizeWindow}
          onFocus={handleFocusWindow}
        />
      ))}

      {/* Taskbar */}
      <Taskbar
        apps={APPS}
        openWindows={windows}
        activeWindowId={activeWindowId}
        isStartMenuOpen={activePanel === 'start'}
        onToggleStartMenu={() => togglePanel('start')}
        onToggleControlCenter={() => togglePanel('control')}
        onToggleCalendar={() => togglePanel('calendar')}
        onOpenApp={handleOpenApp}
        onMinimizeWindow={handleMinimizeWindow}
        onFocusWindow={handleFocusWindow}
      />

      {/* System Panels */}
      <StartMenu
        isOpen={activePanel === 'start'}
        apps={APPS}
        onOpenApp={handleOpenApp}
        onClose={() => setActivePanel(null)}
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
    </div>
  );
}

export default App;