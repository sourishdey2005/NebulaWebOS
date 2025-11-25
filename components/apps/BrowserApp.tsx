
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, Lock, Globe, AlertTriangle, Plus, X } from 'lucide-react';

interface Tab {
  id: number;
  title: string;
  url: string;
  history: string[];
}

export const BrowserApp: React.FC = () => {
  const GOOGLE_SEARCH_URL = 'https://www.google.com/search?igu=1&q=';
  const BING_SEARCH_URL = 'https://www.bing.com/search?q=';
  const WIKIPEDIA_URL = 'https://www.wikipedia.org/';

  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, title: 'New Tab', url: '', history: [] }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const updateTab = (id: number, updates: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleNavigate = (url: string, tabId: number = activeTabId) => {
    let target = url;
    if (!target) return;
    
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      if (target.includes('.') && !target.includes(' ')) {
        target = `https://${target}`;
      } else {
        target = `${GOOGLE_SEARCH_URL}${encodeURIComponent(target)}`;
      }
    }

    if (target.includes('google.com') && !target.includes('igu=1')) {
       target = target + (target.includes('?') ? '&igu=1' : '?igu=1');
    }

    const currentTab = tabs.find(t => t.id === tabId);
    updateTab(tabId, { 
      url: target, 
      title: target, 
      history: [...(currentTab?.history || []), target] 
    });
    
    if (tabId === activeTabId) {
        setUrlInput(target);
        setIsLoading(true);
    }
  };

  const addTab = () => {
    const newId = Date.now();
    setTabs([...tabs, { id: newId, title: 'New Tab', url: '', history: [] }]);
    setActiveTabId(newId);
    setUrlInput('');
  };

  const closeTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
        setTabs([{ id: Date.now(), title: 'New Tab', url: '', history: [] }]);
        return;
    }
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
        setUrlInput(newTabs[newTabs.length - 1].url);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Tabs Bar */}
      <div className="flex items-center bg-slate-200 px-2 pt-2 gap-1 overflow-x-auto">
        {tabs.map(tab => (
            <div 
                key={tab.id}
                onClick={() => { setActiveTabId(tab.id); setUrlInput(tab.url); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs max-w-[160px] cursor-pointer group select-none ${activeTabId === tab.id ? 'bg-white shadow-sm text-slate-800' : 'bg-transparent text-slate-600 hover:bg-slate-300'}`}
            >
                <Globe size={12} className={activeTabId === tab.id ? 'text-blue-500' : 'text-slate-400'} />
                <span className="truncate flex-1">{tab.title || 'New Tab'}</span>
                <button onClick={(e) => closeTab(tab.id, e)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-200 rounded-full">
                    <X size={10} />
                </button>
            </div>
        ))}
        <button onClick={addTab} className="p-1 hover:bg-slate-300 rounded text-slate-600"><Plus size={14}/></button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex gap-1">
            <button onClick={() => handleNavigate('', activeTabId)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors" title="Home">
                <Home size={16} />
            </button>
            <button onClick={() => { setIsLoading(true); const u = activeTab.url; updateTab(activeTabId, { url: '' }); setTimeout(() => updateTab(activeTabId, { url: u }), 10); }} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
                <RotateCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleNavigate(urlInput); }} className="flex-1 flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Lock size={12} className="text-green-600 mr-2" />
            <input 
                className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none placeholder-gray-400"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Search Google or type a URL"
                onFocus={(e) => e.target.select()}
            />
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-white overflow-hidden flex flex-col">
        {isLoading && activeTab.url && (
            <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-100 z-20">
                <div className="h-full bg-blue-500 animate-[loading_1s_ease-in-out_infinite]" style={{ width: '50%' }} />
            </div>
        )}

        {activeTab.url ? (
            <>
                <iframe 
                    key={activeTabId} // Force remount on tab switch
                    src={activeTab.url}
                    className="flex-1 w-full border-none"
                    title="Web Browser"
                    onLoad={() => setIsLoading(false)}
                    referrerPolicy="no-referrer"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
                <div className="w-full max-w-md space-y-8 text-center">
                    <h1 className="text-6xl font-bold text-slate-800 tracking-tighter select-none">
                        <span className="text-blue-500">G</span>
                        <span className="text-red-500">o</span>
                        <span className="text-yellow-500">o</span>
                        <span className="text-blue-500">g</span>
                        <span className="text-green-500">l</span>
                        <span className="text-red-500">e</span>
                    </h1>
                    
                    <form onSubmit={(e) => { e.preventDefault(); handleNavigate(urlInput || 'google'); }} className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-300 shadow-sm hover:shadow-md rounded-full py-3 pl-12 pr-4 text-base outline-none transition-all"
                            placeholder="Search Google or type a URL"
                            value={urlInput === 'https://www.google.com' ? '' : urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            autoFocus
                        />
                    </form>

                    <div className="grid grid-cols-4 gap-4 pt-4">
                        {[
                            { name: 'Wikipedia', url: WIKIPEDIA_URL, icon: Globe, color: 'text-gray-600' },
                            { name: 'Bing', url: BING_SEARCH_URL, icon: Search, color: 'text-blue-600' },
                            { name: 'Weather', url: 'https://www.bing.com/search?q=weather', icon: Globe, color: 'text-orange-500' },
                            { name: 'News', url: 'https://www.bing.com/news', icon: Globe, color: 'text-red-500' },
                        ].map((site) => (
                            <button 
                                key={site.name}
                                onClick={() => handleNavigate(site.url)}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${site.color}`}>
                                    <site.icon size={24} />
                                </div>
                                <span className="text-xs text-gray-600 font-medium">{site.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
