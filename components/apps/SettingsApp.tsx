
import React, { useState } from 'react';
import { User, Monitor, Wifi, Battery, Shield, Check, Lock, MapPin, Camera, Mic, Signal, Smartphone, LogOut, KeyRound } from 'lucide-react';
import { WALLPAPERS } from '../../constants';
import { SystemState } from '../../types';

interface SettingsAppProps {
  onWallpaperChange?: (url: string) => void;
  currentWallpaper?: string;
  systemState?: SystemState;
  setSystemState?: React.Dispatch<React.SetStateAction<SystemState>>;
}

type Tab = 'account' | 'display' | 'network' | 'power' | 'privacy';

export const SettingsApp: React.FC<SettingsAppProps> = ({ 
  onWallpaperChange,
  currentWallpaper,
  systemState,
  setSystemState
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('display');
  const [tempName, setTempName] = useState(systemState?.username || 'Guest');
  const [newPassword, setNewPassword] = useState('');

  // Handle undefined state gracefully
  if (!systemState || !setSystemState) return <div className="p-8 text-white">Loading Settings...</div>;

  const updateState = (key: keyof SystemState, value: any) => {
    setSystemState(prev => ({ ...prev, [key]: value }));
  };

  const updatePrivacy = (key: keyof SystemState['privacy'], value: boolean) => {
    setSystemState(prev => ({ 
        ...prev, 
        privacy: { ...prev.privacy, [key]: value } 
    }));
  };

  const handleNameSave = () => {
    updateState('username', tempName);
  };

  const handlePasswordChange = () => {
    if (newPassword.length < 4) {
        alert("Password too short");
        return;
    }
    updateState('password', newPassword);
    setNewPassword('');
    alert("Password updated successfully");
  };

  const menuItems: { id: Tab; icon: any; label: string }[] = [
    { id: 'account', icon: User, label: "Account" },
    { id: 'display', icon: Monitor, label: "Display" },
    { id: 'network', icon: Wifi, label: "Network" },
    { id: 'power', icon: Battery, label: "Power" },
    { id: 'privacy', icon: Shield, label: "Privacy" },
  ];

  return (
    <div className="flex h-full bg-slate-900 text-white">
      {/* Sidebar */}
      <div className="w-48 bg-slate-950/50 border-r border-white/5 p-4 space-y-1 flex flex-col">
        {menuItems.map((item) => (
            <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <item.icon size={16} />
                {item.label}
            </button>
        ))}
        
        <div className="mt-auto pt-4 border-t border-white/5">
            <div className="px-3 py-2 flex items-center gap-3 text-xs text-gray-500">
                <span>Nebula OS v1.3.0</span>
            </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {/* ACCOUNT SETTINGS */}
        {activeTab === 'account' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
                
                <div className="flex items-center gap-6 bg-slate-800/50 p-6 rounded-xl border border-white/5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg">
                        {systemState.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-white">{systemState.username}</h3>
                        <p className="text-sm text-gray-400">Administrator • Local Account</p>
                    </div>
                    <button className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 space-y-4">
                    <h4 className="text-sm font-medium text-gray-300">Profile Information</h4>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500">Display Name</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 w-64"
                            />
                            <button 
                                onClick={handleNameSave}
                                disabled={tempName === systemState.username}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 space-y-4">
                    <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2"><KeyRound size={16} /> Security</h4>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500">Update Password</label>
                        <div className="flex gap-2">
                            <input 
                                type="password" 
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 w-64"
                            />
                            <button 
                                onClick={handlePasswordChange}
                                disabled={!newPassword}
                                className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* DISPLAY SETTINGS */}
        {activeTab === 'display' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-2xl font-semibold mb-6">Display Settings</h2>
                
                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                    <label className="text-sm font-medium text-gray-300 mb-4 block">Wallpaper</label>
                    <div className="grid grid-cols-3 gap-4">
                        {WALLPAPERS.map((wp, i) => (
                            <button 
                                key={i} 
                                onClick={() => onWallpaperChange?.(wp)}
                                className={`
                                relative aspect-video rounded-lg overflow-hidden border-2 transition-all group
                                ${currentWallpaper === wp ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-transparent hover:border-white/30'}
                                `}
                            >
                                <img src={wp} className="w-full h-full object-cover" alt={`Wallpaper ${i + 1}`} />
                                {currentWallpaper === wp && (
                                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                        <div className="bg-blue-500 rounded-full p-1">
                                            <Check size={12} className="text-white" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-300 font-medium">Dark Mode</div>
                            <div className="text-xs text-gray-500">Adjust system colors for low light environments</div>
                        </div>
                        <button 
                            onClick={() => updateState('theme', systemState.theme === 'dark' ? 'light' : 'dark')}
                            className={`w-12 h-6 rounded-full relative transition-colors ${systemState.theme === 'dark' ? 'bg-blue-600' : 'bg-slate-600'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${systemState.theme === 'dark' ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                    
                    <div className="h-px bg-white/5" />

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-300 font-medium">Night Shift</div>
                            <div className="text-xs text-gray-500">Automatically shift colors to warmer spectrum after sunset</div>
                        </div>
                        <button 
                            onClick={() => updateState('nightShift', !systemState.nightShift)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${systemState.nightShift ? 'bg-blue-600' : 'bg-slate-600'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${systemState.nightShift ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-gray-300">Brightness</label>
                            <span className="text-xs text-gray-500">{systemState.brightness}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={systemState.brightness}
                            onChange={(e) => updateState('brightness', parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                        />
                    </div>
                </div>
            </div>
        )}

        {/* NETWORK SETTINGS */}
        {activeTab === 'network' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-2xl font-semibold mb-6">Network & Internet</h2>
                
                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${systemState.wifi ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-gray-400'}`}>
                                <Wifi size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">Wi-Fi</div>
                                <div className="text-xs text-gray-400">{systemState.wifi ? 'On' : 'Off'}</div>
                            </div>
                         </div>
                         <button 
                            onClick={() => updateState('wifi', !systemState.wifi)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${systemState.wifi ? 'bg-blue-600' : 'bg-slate-600'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${systemState.wifi ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>

                    {systemState.wifi && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Available Networks</div>
                            {[
                                { name: 'Nebula_5G_Guest', signal: 100, secure: true, connected: true },
                                { name: 'StarLink_Base', signal: 80, secure: true, connected: false },
                                { name: 'Coffee_Shop_Free', signal: 40, secure: false, connected: false }
                            ].map((net) => (
                                <div key={net.name} className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Signal size={16} className={net.signal > 50 ? 'text-white' : 'text-gray-500'} />
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-200">{net.name}</span>
                                            {net.connected && <span className="text-[10px] text-emerald-400">Connected</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {net.secure && <Lock size={12} className="text-gray-500" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${systemState.bluetooth ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-gray-400'}`}>
                                <Smartphone size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">Bluetooth</div>
                                <div className="text-xs text-gray-400">{systemState.bluetooth ? 'Discoverable as "Nebula PC"' : 'Off'}</div>
                            </div>
                         </div>
                         <button 
                            onClick={() => updateState('bluetooth', !systemState.bluetooth)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${systemState.bluetooth ? 'bg-blue-600' : 'bg-slate-600'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${systemState.bluetooth ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* POWER SETTINGS */}
        {activeTab === 'power' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-2xl font-semibold mb-6">Power & Battery</h2>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2">
                         <div className="text-4xl font-light text-emerald-400">100%</div>
                         <div className="text-sm text-gray-400">Fully Charged</div>
                         <div className="w-full h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-emerald-500 w-full" />
                         </div>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                        <h4 className="text-sm font-medium text-gray-300 mb-4">Power Mode</h4>
                        <div className="space-y-2">
                            {[
                                { id: 'performance', label: 'Best Performance' },
                                { id: 'balanced', label: 'Balanced' },
                                { id: 'saver', label: 'Power Saver' }
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => updateState('powerMode', mode.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${systemState.powerMode === mode.id ? 'bg-blue-600 text-white' : 'bg-black/20 text-gray-300 hover:bg-black/30'}`}
                                >
                                    {mode.label}
                                    {systemState.powerMode === mode.id && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* PRIVACY SETTINGS */}
        {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-2xl font-semibold mb-6">Privacy & Security</h2>
                
                <div className="bg-slate-800/50 rounded-xl border border-white/5 divide-y divide-white/5">
                    {[
                        { id: 'location', label: 'Location Services', icon: MapPin, desc: 'Allow apps to access your location' },
                        { id: 'camera', label: 'Camera Access', icon: Camera, desc: 'Allow apps to access your camera' },
                        { id: 'microphone', label: 'Microphone Access', icon: Mic, desc: 'Allow apps to access your microphone' }
                    ].map((item) => (
                        <div key={item.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-slate-700/50 text-gray-300">
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">{item.label}</div>
                                    <div className="text-xs text-gray-500">{item.desc}</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => updatePrivacy(item.id as any, !systemState.privacy[item.id as keyof typeof systemState.privacy])}
                                className={`w-12 h-6 rounded-full relative transition-colors ${systemState.privacy[item.id as keyof typeof systemState.privacy] ? 'bg-blue-600' : 'bg-slate-600'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${systemState.privacy[item.id as keyof typeof systemState.privacy] ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
