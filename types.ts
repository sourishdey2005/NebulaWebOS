
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface AppDefinition {
  id: string;
  title: string;
  icon: LucideIcon;
  component: ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface WindowState {
  id: string; // Unique instance ID
  appId: string;
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  component: ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type Theme = 'dark' | 'light';

export interface SystemState {
  wifi: boolean;
  bluetooth: boolean;
  brightness: number;
  volume: number;
  theme: Theme;
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
}
