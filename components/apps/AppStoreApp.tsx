
import React from 'react';
import { Download, Check, Star, Search } from 'lucide-react';
import { APPS } from '../../constants';

interface AppStoreProps {
  installedApps?: string[];
  setInstalledApps?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const AppStoreApp: React.FC<AppStoreProps> = ({ installedApps = [], setInstalledApps }) => {
  const toggleApp = (id: string) => {
    if (!setInstalledApps) return;
    if (installedApps.includes(id)) {
      setInstalledApps(prev => prev.filter(appId => appId !== id));
    } else {
      setInstalledApps(prev => [...prev, id]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Nebula Store</h1>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search apps..." className="bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 w-64 outline-none" />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10 max-w-lg">
                <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded mb-4 inline-block">FEATURED</span>
                <h2 className="text-3xl font-bold mb-2">Nebula AI Assistant</h2>
                <p className="text-indigo-100 mb-6">Experience the next generation of AI integrated directly into your OS. Code, write, and create with Gemini.</p>
                <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-lg">
                    {installedApps.includes('assistant') ? 'Installed' : 'Install Now'}
                </button>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* App Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <h3 className="text-lg font-bold mb-4">Top Applications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {APPS.filter(a => a.id !== 'store').map(app => {
                const isInstalled = installedApps.includes(app.id);
                return (
                    <div key={app.id} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all flex items-start gap-4 group">
                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                            <app.icon size={32} className="text-slate-600 group-hover:text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{app.title}</h4>
                            <div className="flex items-center gap-1 text-xs text-yellow-500 mb-2">
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <span className="text-gray-400 ml-1">(4.9)</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">The official {app.title} application for Nebula OS.</p>
                            <button 
                                onClick={() => toggleApp(app.id)}
                                className={`
                                    px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5
                                    ${isInstalled 
                                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'}
                                `}
                            >
                                {isInstalled ? <><Check size={12} /> Installed</> : <><Download size={12} /> Get</>}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};
