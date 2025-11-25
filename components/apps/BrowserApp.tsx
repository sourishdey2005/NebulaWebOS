import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, Lock, Globe, AlertTriangle } from 'lucide-react';

export const BrowserApp: React.FC = () => {
  // Common URLs
  const GOOGLE_SEARCH_URL = 'https://www.google.com/search?igu=1&q=';
  const BING_SEARCH_URL = 'https://www.bing.com/search?q=';
  const WIKIPEDIA_URL = 'https://www.wikipedia.org/';

  const [currentSrc, setCurrentSrc] = useState<string | null>(null); // null = show start page
  const [urlInput, setUrlInput] = useState('https://www.google.com');
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleNavigate = (url: string) => {
    let target = url;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      // If it looks like a domain, add https. Otherwise treat as search.
      if (target.includes('.') && !target.includes(' ')) {
        target = `https://${target}`;
      } else {
        target = `${GOOGLE_SEARCH_URL}${encodeURIComponent(target)}`;
      }
    }

    // Google Embed Fix
    if (target.includes('google.com') && !target.includes('igu=1')) {
       target = target + (target.includes('?') ? '&igu=1' : '?igu=1');
    }

    setHistory(prev => [...prev, target]);
    setCurrentSrc(target);
    setUrlInput(target);
    setIframeKey(prev => prev + 1);
    setIsLoading(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigate(urlInput);
  };

  const handleHome = () => {
    setCurrentSrc(null);
    setUrlInput('');
    setIsLoading(false);
  };

  const handleRefresh = () => {
    if (currentSrc) {
        setIframeKey(prev => prev + 1);
        setIsLoading(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Browser Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-slate-200 border-b border-gray-300 shadow-sm z-10">
        <div className="flex gap-1">
            <button onClick={() => handleHome()} className="p-1.5 rounded-full hover:bg-slate-300 text-slate-600 transition-colors" title="Home">
                <Home size={16} />
            </button>
            <button className="p-1.5 rounded-full hover:bg-slate-300 text-slate-600 disabled:opacity-30 transition-colors" disabled>
                <ArrowLeft size={16} />
            </button>
            <button className="p-1.5 rounded-full hover:bg-slate-300 text-slate-600 disabled:opacity-30 transition-colors" disabled>
                <ArrowRight size={16} />
            </button>
            <button onClick={handleRefresh} className="p-1.5 rounded-full hover:bg-slate-300 text-slate-600 transition-colors">
                <RotateCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
        </div>
        
        <form onSubmit={handleFormSubmit} className="flex-1 flex items-center bg-white rounded-full px-3 py-1.5 border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 shadow-inner transition-all">
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
        {isLoading && currentSrc && (
            <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-100 z-20">
                <div className="h-full bg-blue-500 animate-[loading_1s_ease-in-out_infinite]" style={{ width: '50%' }} />
            </div>
        )}

        {currentSrc ? (
            <>
                <iframe 
                    key={iframeKey}
                    src={currentSrc}
                    className="flex-1 w-full border-none"
                    title="Web Browser"
                    onLoad={() => setIsLoading(false)}
                    referrerPolicy="no-referrer"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
                <div className="bg-yellow-50 text-yellow-800 text-[10px] px-2 py-1 text-center border-t border-yellow-200 flex justify-between items-center">
                    <span className="flex items-center gap-1"><AlertTriangle size={10} /> If the page is blank, the website blocked the connection.</span>
                    <button onClick={() => handleNavigate(WIKIPEDIA_URL)} className="underline hover:text-yellow-900">Try Wikipedia</button>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-white p-8 animate-in fade-in zoom-in duration-300">
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
                            className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-300 shadow-sm hover:shadow-md focus:shadow-md rounded-full py-3 pl-12 pr-4 text-base outline-none transition-all"
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
                
                <div className="absolute bottom-4 text-xs text-gray-400">
                    Nebula Browser &bull; Powered by Google Search
                </div>
            </div>
        )}
      </div>
    </div>
  );
};