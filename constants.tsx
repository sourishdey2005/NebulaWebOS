
import React from 'react';
import { AppDefinition, FileSystemNode } from './types';
import { 
  Terminal, FileText, Settings, Calculator, Activity, Image as ImageIcon,
  MessageSquare, Music, Globe, Camera, Gamepad2, Folder, Trash2, ShoppingBag,
  ClipboardList, Cpu, Palette, Mic, Video, Edit3, Layout, Grid, FileCode,
  StickyNote, Clock, Code, Pipette, Braces, Regex, CloudSun, Timer, Bomb,
  TableProperties, ArrowRightLeft, Key, QrCode, Ghost, Hash, Keyboard, Speech,
  Coins, FlaskConical, PenTool, GitCompare, Mail, Map, HardDrive, Phone, Wallet,
  Shield, Cuboid
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
import { FileExplorerApp } from './components/apps/FileExplorerApp';
import { TaskManagerApp } from './components/apps/TaskManagerApp';
import { AppStoreApp } from './components/apps/AppStoreApp';
import { ClipboardManagerApp } from './components/apps/ClipboardManagerApp';
import { PaintApp } from './components/apps/PaintApp';
import { VoiceRecorderApp } from './components/apps/VoiceRecorderApp';
import { PhotoEditorApp } from './components/apps/PhotoEditorApp';
import { VideoPlayerApp } from './components/apps/VideoPlayerApp';
import { MarkdownEditorApp } from './components/apps/MarkdownEditorApp';
import { KanbanApp } from './components/apps/KanbanApp';
import { SpreadsheetApp } from './components/apps/SpreadsheetApp';
import { PDFViewerApp } from './components/apps/PDFViewerApp';
import { StickyNotesApp } from './components/apps/StickyNotesApp';
import { ClockApp } from './components/apps/ClockApp';
import { CodeEditorApp } from './components/apps/CodeEditorApp';
import { ColorPickerApp } from './components/apps/ColorPickerApp';
import { JsonFormatterApp } from './components/apps/JsonFormatterApp';
import { RegexTesterApp } from './components/apps/RegexTesterApp';
import { WeatherApp } from './components/apps/WeatherApp';
import { PomodoroApp } from './components/apps/PomodoroApp';
import { MinesweeperApp } from './components/apps/MinesweeperApp';
import { MemoryGameApp } from './components/apps/MemoryGameApp';
import { UnitConverterApp } from './components/apps/UnitConverterApp';
import { PasswordGenApp } from './components/apps/PasswordGenApp';
import { QrCodeApp } from './components/apps/QrCodeApp';
import { SnakeApp } from './components/apps/SnakeApp';
import { Game2048App } from './components/apps/Game2048App';
import { TypingTestApp } from './components/apps/TypingTestApp';
import { TTSApp } from './components/apps/TTSApp';
import { CurrencyApp } from './components/apps/CurrencyApp';
import { PeriodicTableApp } from './components/apps/PeriodicTableApp';
import { WhiteboardApp } from './components/apps/WhiteboardApp';
import { DiffCheckerApp } from './components/apps/DiffCheckerApp';
import { MailApp } from './components/apps/productivity/MailApp';
import { MapsApp } from './components/apps/internet/MapsApp';
import { DiskUtilityApp } from './components/apps/utilities/DiskUtilityApp';
import { MeetingApp } from './components/apps/media/MeetingApp';
import { WalletApp } from './components/apps/blockchain/WalletApp';
import { CryptoVaultApp } from './components/apps/blockchain/CryptoVaultApp';
import { ChainExplorerApp } from './components/apps/blockchain/ChainExplorerApp';

export const WALLPAPERS = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=2155&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop", 
];

export const DEFAULT_FS: FileSystemNode = {
  type: 'dir',
  children: {
    'home': {
      type: 'dir',
      children: {
        'guest': {
          type: 'dir',
          children: {
            'projects': { 
                type: 'dir', 
                children: {
                    'kanban.json': { type: 'file', content: '[]' } 
                } 
            },
            'documents': { 
                type: 'dir', 
                children: {
                    'resume.txt': { type: 'file', content: 'John Doe - Developer' },
                    'budget.csv': { type: 'file', content: 'Date,Item,Cost\n2023-01-01,Coffee,5.00' },
                    'notes.txt': { type: 'file', content: 'Welcome to Nebula OS Notepad.\n\nStart typing...' } 
                } 
            },
            'recordings': { type: 'dir', children: {} },
            'welcome.txt': { type: 'file', content: 'Welcome to Nebula OS Terminal!\nType "help" to see available commands.' },
            'notes.txt': { type: 'file', content: 'TODO:\n- Explore the system\n- Try the AI assistant' }
          }
        }
      }
    },
    'trash': { type: 'dir', children: {} },
    'bin': { type: 'dir', children: {} },
    'etc': { type: 'dir', children: {} }
  }
};

export const APPS: AppDefinition[] = [
  // System
  { id: 'files', title: 'File Explorer', icon: Folder, component: <FileExplorerApp />, defaultWidth: 800, defaultHeight: 550 },
  { id: 'store', title: 'App Store', icon: ShoppingBag, component: <AppStoreApp />, defaultWidth: 900, defaultHeight: 650 },
  { id: 'settings', title: 'Settings', icon: Settings, component: <SettingsApp />, defaultWidth: 600, defaultHeight: 500 },
  { id: 'taskmanager', title: 'Task Manager', icon: Cpu, component: <TaskManagerApp />, defaultWidth: 500, defaultHeight: 600 },
  { id: 'monitor', title: 'System Monitor', icon: Activity, component: <SystemMonitor />, defaultWidth: 700, defaultHeight: 500 },
  { id: 'disk', title: 'Disk Utility', icon: HardDrive, component: <DiskUtilityApp />, defaultWidth: 600, defaultHeight: 450 },
  { id: 'trash', title: 'Recycle Bin', icon: Trash2, component: <FileExplorerApp initialPath={['trash']} />, defaultWidth: 700, defaultHeight: 500 },

  // Blockchain
  { id: 'wallet', title: 'Nebula Wallet', icon: Wallet, component: <WalletApp />, defaultWidth: 400, defaultHeight: 600 },
  { id: 'vault', title: 'Crypto Vault', icon: Shield, component: <CryptoVaultApp />, defaultWidth: 600, defaultHeight: 500 },
  { id: 'chain', title: 'Chain Explorer', icon: Cuboid, component: <ChainExplorerApp />, defaultWidth: 800, defaultHeight: 600 },

  // Productivity
  { id: 'mail', title: 'Mail', icon: Mail, component: <MailApp />, defaultWidth: 900, defaultHeight: 600 },
  { id: 'kanban', title: 'Nebula Tasks', icon: Layout, component: <KanbanApp />, defaultWidth: 900, defaultHeight: 600 },
  { id: 'spreadsheet', title: 'Sheets', icon: Grid, component: <SpreadsheetApp />, defaultWidth: 1000, defaultHeight: 700 },
  { id: 'notepad', title: 'Notepad', icon: FileText, component: <Notepad />, defaultWidth: 600, defaultHeight: 400 },
  { id: 'markdown', title: 'Markdown', icon: Edit3, component: <MarkdownEditorApp />, defaultWidth: 800, defaultHeight: 600 },
  { id: 'stickynotes', title: 'Sticky Notes', icon: StickyNote, component: <StickyNotesApp />, defaultWidth: 350, defaultHeight: 400 },
  { id: 'clipboard', title: 'Clipboard', icon: ClipboardList, component: <ClipboardManagerApp />, defaultWidth: 350, defaultHeight: 500 },
  { id: 'clock', title: 'Clock', icon: Clock, component: <ClockApp />, defaultWidth: 600, defaultHeight: 400 },
  { id: 'calculator', title: 'Calculator', icon: Calculator, component: <CalculatorApp />, defaultWidth: 320, defaultHeight: 480 },

  // Internet
  { id: 'internet', title: 'Browser', icon: Globe, component: <BrowserApp />, defaultWidth: 1000, defaultHeight: 700 },
  { id: 'maps', title: 'Maps', icon: Map, component: <MapsApp />, defaultWidth: 800, defaultHeight: 600 },

  // Media
  { id: 'music', title: 'Music', icon: Music, component: <MusicPlayer />, defaultWidth: 400, defaultHeight: 600 },
  { id: 'video', title: 'Video', icon: Video, component: <VideoPlayerApp />, defaultWidth: 700, defaultHeight: 450 },
  { id: 'meeting', title: 'Meet', icon: Phone, component: <MeetingApp />, defaultWidth: 800, defaultHeight: 600 },
  { id: 'photo', title: 'Photo Editor', icon: ImageIcon, component: <PhotoEditorApp />, defaultWidth: 800, defaultHeight: 600 },
  { id: 'paint', title: 'Paint', icon: Palette, component: <PaintApp />, defaultWidth: 800, defaultHeight: 600 },
  { id: 'recorder', title: 'Recorder', icon: Mic, component: <VoiceRecorderApp />, defaultWidth: 400, defaultHeight: 300 },
  { id: 'camera', title: 'Camera', icon: Camera, component: <CameraApp />, defaultWidth: 640, defaultHeight: 520 },

  // Dev
  { id: 'terminal', title: 'Terminal', icon: Terminal, component: <TerminalApp />, defaultWidth: 700, defaultHeight: 500 },
  { id: 'code', title: 'Code Studio', icon: Code, component: <CodeEditorApp />, defaultWidth: 900, defaultHeight: 650 },
  { id: 'assistant', title: 'Nebula AI', icon: MessageSquare, component: <GeminiChat />, defaultWidth: 500, defaultHeight: 600 },
  
  // Utilities
  { id: 'weather', title: 'Weather', icon: CloudSun, component: <WeatherApp />, defaultWidth: 400, defaultHeight: 600 },
  { id: 'colorpicker', title: 'Color Picker', icon: Pipette, component: <ColorPickerApp />, defaultWidth: 500, defaultHeight: 400 },
  { id: 'unit', title: 'Converter', icon: ArrowRightLeft, component: <UnitConverterApp />, defaultWidth: 400, defaultHeight: 500 },
  { id: 'pdf', title: 'PDF Viewer', icon: FileText, component: <PDFViewerApp />, defaultWidth: 800, defaultHeight: 700 },
  { id: 'json', title: 'JSON Tool', icon: Braces, component: <JsonFormatterApp />, defaultWidth: 800, defaultHeight: 600 },
  { id: 'regex', title: 'Regex', icon: Regex, component: <RegexTesterApp />, defaultWidth: 600, defaultHeight: 500 },
  
  // Games
  { id: 'tictactoe', title: 'Tic Tac Toe', icon: Gamepad2, component: <TicTacToe />, defaultWidth: 400, defaultHeight: 500 },
  { id: 'minesweeper', title: 'Minesweeper', icon: Bomb, component: <MinesweeperApp />, defaultWidth: 400, defaultHeight: 500 },
  { id: 'memory', title: 'Memory', icon: TableProperties, component: <MemoryGameApp />, defaultWidth: 500, defaultHeight: 550 },
  { id: 'snake', title: 'Snake', icon: Ghost, component: <SnakeApp />, defaultWidth: 420, defaultHeight: 480 },
  { id: '2048', title: '2048', icon: Hash, component: <Game2048App />, defaultWidth: 400, defaultHeight: 500 },
  
  // Misc
  { id: 'pomodoro', title: 'Pomodoro', icon: Timer, component: <PomodoroApp />, defaultWidth: 350, defaultHeight: 450 },
  { id: 'password', title: 'Passwords', icon: Key, component: <PasswordGenApp />, defaultWidth: 400, defaultHeight: 450 },
  { id: 'qrcode', title: 'QR Code', icon: QrCode, component: <QrCodeApp />, defaultWidth: 350, defaultHeight: 450 },
  { id: 'typing', title: 'Typing Test', icon: Keyboard, component: <TypingTestApp />, defaultWidth: 600, defaultHeight: 400 },
  { id: 'tts', title: 'TTS', icon: Speech, component: <TTSApp />, defaultWidth: 500, defaultHeight: 400 },
  { id: 'currency', title: 'Currency', icon: Coins, component: <CurrencyApp />, defaultWidth: 400, defaultHeight: 500 },
  { id: 'periodic', title: 'Periodic', icon: FlaskConical, component: <PeriodicTableApp />, defaultWidth: 900, defaultHeight: 600 },
  { id: 'whiteboard', title: 'Whiteboard', icon: PenTool, component: <WhiteboardApp />, defaultWidth: 800, defaultHeight: 600 },
  { id: 'diff', title: 'Diff Check', icon: GitCompare, component: <DiffCheckerApp />, defaultWidth: 900, defaultHeight: 600 },
];

export const INITIAL_WALLPAPER = WALLPAPERS[0];
