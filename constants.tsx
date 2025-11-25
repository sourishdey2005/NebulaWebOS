
import React from 'react';
import { AppDefinition } from './types';
import { 
  Terminal, 
  FileText, 
  Settings, 
  Calculator, 
  Activity, 
  Image as ImageIcon,
  Chrome,
  MessageSquare,
  Music,
  Globe,
  Camera,
  Gamepad2
} from 'lucide-react';
import { GeminiChat } from './components/apps/GeminiChat';
import { Notepad } from './components/apps/Notepad';
import { SystemMonitor } from './components/apps/SystemMonitor';
import { CalculatorApp } from './components/apps/CalculatorApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { MusicPlayer } from './components/apps/MusicPlayer';
import { BrowserApp } from './components/apps/BrowserApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { CameraApp } from './components/apps/CameraApp';
import { TicTacToe } from './components/apps/TicTacToe';

export const WALLPAPERS = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", // Space
  "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop", // Mountains
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", // Cyberpunk
  "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=2155&auto=format&fit=crop", // Aurora
  "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop", // Ocean
];

// We define the registry of available apps here
export const APPS: AppDefinition[] = [
  {
    id: 'terminal',
    title: 'Terminal',
    icon: Terminal,
    component: <TerminalApp />,
    defaultWidth: 700,
    defaultHeight: 500,
  },
  {
    id: 'assistant',
    title: 'Nebula AI',
    icon: MessageSquare,
    component: <GeminiChat />,
    defaultWidth: 500,
    defaultHeight: 600,
  },
  {
    id: 'internet',
    title: 'Internet',
    icon: Globe,
    component: <BrowserApp />,
    defaultWidth: 1000,
    defaultHeight: 700,
  },
  {
    id: 'notepad',
    title: 'Notepad',
    icon: FileText,
    component: <Notepad />,
    defaultWidth: 600,
    defaultHeight: 400,
  },
  {
    id: 'camera',
    title: 'Camera',
    icon: Camera,
    component: <CameraApp />,
    defaultWidth: 640,
    defaultHeight: 520,
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    icon: Gamepad2,
    component: <TicTacToe />,
    defaultWidth: 400,
    defaultHeight: 500,
  },
  {
    id: 'monitor',
    title: 'System Monitor',
    icon: Activity,
    component: <SystemMonitor />,
    defaultWidth: 700,
    defaultHeight: 500,
  },
  {
    id: 'music',
    title: 'Music Player',
    icon: Music,
    component: <MusicPlayer />,
    defaultWidth: 400,
    defaultHeight: 600,
  },
  {
    id: 'calculator',
    title: 'Calculator',
    icon: Calculator,
    component: <CalculatorApp />,
    defaultWidth: 320,
    defaultHeight: 480,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    component: <SettingsApp />,
    defaultWidth: 600,
    defaultHeight: 500,
  },
  // Placeholder apps for visual completeness
  {
    id: 'gallery',
    title: 'Gallery',
    icon: ImageIcon,
    component: <div className="flex flex-wrap gap-4 p-4 overflow-auto h-full bg-slate-900">
        {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="relative group overflow-hidden rounded-lg cursor-pointer">
              <img src={`https://picsum.photos/300/200?random=${i}`} className="hover:scale-110 transition-transform duration-300" alt="Gallery item" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-medium">View Image</span>
              </div>
            </div>
        ))}
    </div>,
    defaultWidth: 700,
    defaultHeight: 500,
  }
];

export const INITIAL_WALLPAPER = WALLPAPERS[0];
