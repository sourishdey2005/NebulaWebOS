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
  Globe
} from 'lucide-react';
import { GeminiChat } from './components/apps/GeminiChat';
import { Notepad } from './components/apps/Notepad';
import { SystemMonitor } from './components/apps/SystemMonitor';
import { CalculatorApp } from './components/apps/CalculatorApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { MusicPlayer } from './components/apps/MusicPlayer';
import { BrowserApp } from './components/apps/BrowserApp';

// We define the registry of available apps here
export const APPS: AppDefinition[] = [
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
    component: <div className="flex flex-wrap gap-4 p-4 overflow-auto h-full">
        {[1,2,3,4,5,6].map(i => (
            <img key={i} src={`https://picsum.photos/300/200?random=${i}`} className="rounded-lg hover:scale-105 transition-transform cursor-pointer shadow-lg" alt="Gallery item" />
        ))}
    </div>,
    defaultWidth: 700,
    defaultHeight: 500,
  }
];

export const INITIAL_WALLPAPER = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";