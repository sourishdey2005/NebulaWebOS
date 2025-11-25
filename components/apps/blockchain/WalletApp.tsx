
import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Copy, History, CreditCard, ChevronLeft, Send, QrCode, CheckCircle2, Loader2 } from 'lucide-react';

// Types
interface Transaction {
  id: number;
  type: 'receive' | 'send' | 'buy';
  amount: number;
  symbol: string;
  from?: string;
  to?: string;
  date: string;
  status: 'Confirmed' | 'Pending';
}

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  change: number; // percentage
}

export const WalletApp: React.FC = () => {
  const [address] = useState('0x71C...9A23');
  const [view, setView] = useState<'home' | 'send' | 'receive' | 'buy'>('home');
  const [activeTab, setActiveTab] = useState<'assets' | 'history'>('assets');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Initial State
  const [assets, setAssets] = useState<Asset[]>([
    { symbol: 'ETH', name: 'Ethereum', balance: 2.5, price: 3200.00, change: 2.4 },
    { symbol: 'SOL', name: 'Solana', balance: 145.2, price: 145.00, change: 5.1 },
    { symbol: 'NBL', name: 'Nebula Coin', balance: 10000, price: 0.05, change: 12.8 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'receive', amount: 0.5, symbol: 'ETH', from: '0x88...21B', date: '2 mins ago', status: 'Confirmed' },
    { id: 2, type: 'send', amount: 1.2, symbol: 'ETH', to: 'Nebula Store', date: '1 hour ago', status: 'Confirmed' },
    { id: 3, type: 'receive', amount: 5.0, symbol: 'SOL', from: 'Coinbase', date: '1 day ago', status: 'Confirmed' },
  ]);

  // Forms State
  const [sendForm, setSendForm] = useState({ to: '', amount: '', assetSymbol: 'ETH' });
  const [buyAmount, setBuyAmount] = useState('');

  // Calculate Total Balance
  const totalBalance = assets.reduce((acc, curr) => acc + (curr.balance * curr.price), 0);

  // Live Price Simulation
  useEffect(() => {
    const interval = setInterval(() => {
        setAssets(prev => prev.map(asset => {
            // Random fluctuation between -0.5% and +0.5%
            const volatility = 0.005; 
            const change = (Math.random() * volatility * 2) - volatility;
            const newPrice = Math.max(0.01, asset.price * (1 + change));
            return {
                ...asset,
                price: newPrice,
                change: asset.change + (change * 100) // Update change % slightly
            };
        }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Actions
  const handleSend = () => {
    const amount = parseFloat(sendForm.amount);
    const asset = assets.find(a => a.symbol === sendForm.assetSymbol);

    if (!sendForm.to || !amount || !asset) {
        alert("Please fill in all fields correctly.");
        return;
    }
    if (amount > asset.balance) {
        alert(`Insufficient ${asset.symbol} balance.`);
        return;
    }

    setIsLoading(true);
    setTimeout(() => {
        // Deduct Balance
        setAssets(prev => prev.map(a => a.symbol === asset.symbol ? { ...a, balance: a.balance - amount } : a));
        // Add Transaction
        const newTx: Transaction = {
            id: Date.now(),
            type: 'send',
            amount: amount,
            symbol: asset.symbol,
            to: sendForm.to,
            date: 'Just now',
            status: 'Confirmed'
        };
        setTransactions(prev => [newTx, ...prev]);
        
        setIsLoading(false);
        setSuccessMsg(`Sent ${amount} ${asset.symbol} successfully!`);
        setTimeout(() => {
            setSuccessMsg('');
            setView('home');
            setSendForm({ to: '', amount: '', assetSymbol: 'ETH' });
        }, 1500);
    }, 1500);
  };

  const handleBuy = () => {
    const usdAmount = parseFloat(buyAmount);
    if (!usdAmount || usdAmount <= 0) return;

    const ethPrice = assets.find(a => a.symbol === 'ETH')?.price || 3200;
    const ethAmount = usdAmount / ethPrice;

    setIsLoading(true);
    setTimeout(() => {
        setAssets(prev => prev.map(a => a.symbol === 'ETH' ? { ...a, balance: a.balance + ethAmount } : a));
        const newTx: Transaction = {
            id: Date.now(),
            type: 'buy',
            amount: ethAmount,
            symbol: 'ETH',
            date: 'Just now',
            status: 'Confirmed'
        };
        setTransactions(prev => [newTx, ...prev]);
        
        setIsLoading(false);
        setSuccessMsg(`Purchased ${ethAmount.toFixed(4)} ETH!`);
        setTimeout(() => {
            setSuccessMsg('');
            setView('home');
            setBuyAmount('');
        }, 1500);
    }, 2000);
  };

  const simulateReceive = () => {
    setIsLoading(true);
    setTimeout(() => {
        const amount = Number((Math.random() * 2).toFixed(4));
        setAssets(prev => prev.map(a => a.symbol === 'ETH' ? { ...a, balance: a.balance + amount } : a));
        const newTx: Transaction = {
            id: Date.now(),
            type: 'receive',
            amount: amount,
            symbol: 'ETH',
            from: 'Faucet',
            date: 'Just now',
            status: 'Confirmed'
        };
        setTransactions(prev => [newTx, ...prev]);
        setIsLoading(false);
        setSuccessMsg(`Received ${amount} ETH from Faucet!`);
        setTimeout(() => setSuccessMsg(''), 2000);
    }, 1000);
  };

  // --- VIEWS ---

  const renderHome = () => (
    <>
        {/* Header Card */}
        <div className="p-6 bg-gradient-to-br from-blue-600 to-purple-700 shrink-0 shadow-lg relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-2 text-blue-100 text-xs font-mono bg-black/20 px-3 py-1 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Mainnet
                </div>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><RefreshCw size={16} /></button>
            </div>
            
            <div className="text-center mb-8 relative z-10">
                <span className="text-blue-200 text-sm font-medium">Total Balance</span>
                <h1 className="text-4xl font-bold mt-1 tracking-tight">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
                <span className="text-green-300 text-xs font-bold flex items-center justify-center gap-1 mt-2 bg-green-500/20 py-1 px-2 rounded-lg inline-flex">
                    <ArrowUpRight size={12} /> +$245.50 (2.1%)
                </span>
            </div>

            <div className="flex justify-center gap-8 relative z-10">
                <button onClick={() => setView('send')} className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 bg-white/20 group-hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-lg group-hover:-translate-y-1">
                        <ArrowUpRight size={20} />
                    </div>
                    <span className="text-xs font-medium">Send</span>
                </button>
                <button onClick={() => setView('receive')} className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 bg-white/20 group-hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-lg group-hover:-translate-y-1">
                        <ArrowDownLeft size={20} />
                    </div>
                    <span className="text-xs font-medium">Receive</span>
                </button>
                <button onClick={() => setView('buy')} className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 bg-white/20 group-hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-lg group-hover:-translate-y-1">
                        <CreditCard size={20} />
                    </div>
                    <span className="text-xs font-medium">Buy</span>
                </button>
            </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-white/10 bg-slate-900 sticky top-0 z-20">
            <button 
                onClick={() => setActiveTab('assets')}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'assets' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
                Assets
                {activeTab === 'assets' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
            </button>
            <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
                Activity
                {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-900">
            {activeTab === 'assets' && (
                <div className="space-y-3">
                    {assets.map(asset => (
                        <div key={asset.symbol} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border border-white/5 group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-bold text-xs shadow-inner border border-white/10">
                                    {asset.symbol[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{asset.name}</div>
                                    <div className="text-xs text-gray-400">{asset.balance.toLocaleString()} {asset.symbol}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium text-sm">${(asset.balance * asset.price).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                                <div className={`text-xs ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'history' && (
                <div className="space-y-4">
                    {transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${
                                    tx.type === 'receive' ? 'bg-green-500/20 text-green-400' : 
                                    tx.type === 'send' ? 'bg-red-500/20 text-red-400' : 
                                    'bg-blue-500/20 text-blue-400'
                                }`}>
                                    {tx.type === 'receive' ? <ArrowDownLeft size={16} /> : 
                                     tx.type === 'send' ? <ArrowUpRight size={16} /> :
                                     <CreditCard size={16} />}
                                </div>
                                <div>
                                    <div className="text-sm font-medium capitalize">{tx.type} {tx.symbol}</div>
                                    <div className="text-xs text-gray-500">{tx.date}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-sm font-bold ${tx.type === 'receive' ? 'text-green-400' : 'text-white'}`}>
                                    {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.symbol}
                                </div>
                                <div className="text-xs text-gray-500">{tx.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        {/* Address Bar Footer */}
        <div className="p-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400 font-mono bg-white/5 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors" onClick={() => navigator.clipboard.writeText(address)}>
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                {address}
            </div>
            <button 
                onClick={() => navigator.clipboard.writeText(address)}
                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
                <Copy size={14} />
            </button>
        </div>
    </>
  );

  const renderSend = () => (
    <div className="flex flex-col h-full bg-slate-900">
        <div className="p-4 border-b border-white/10 flex items-center gap-4">
            <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-lg"><ChevronLeft /></button>
            <h2 className="font-bold text-lg">Send Assets</h2>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Asset</label>
                <div className="grid grid-cols-3 gap-2">
                    {assets.map(a => (
                        <button 
                            key={a.symbol}
                            onClick={() => setSendForm(prev => ({ ...prev, assetSymbol: a.symbol }))}
                            className={`p-3 rounded-xl border ${sendForm.assetSymbol === a.symbol ? 'bg-blue-600 border-blue-500' : 'bg-white/5 border-white/10 hover:bg-white/10'} transition-all`}
                        >
                            <div className="font-bold">{a.symbol}</div>
                            <div className="text-xs opacity-70">{a.balance.toFixed(2)}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Recipient Address</label>
                <input 
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm font-mono outline-none focus:border-blue-500 transition-colors"
                    placeholder="0x..."
                    value={sendForm.to}
                    onChange={e => setSendForm(prev => ({ ...prev, to: e.target.value }))}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Amount</label>
                <div className="relative">
                    <input 
                        type="number"
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm font-mono outline-none focus:border-blue-500 transition-colors"
                        placeholder="0.00"
                        value={sendForm.amount}
                        onChange={e => setSendForm(prev => ({ ...prev, amount: e.target.value }))}
                    />
                    <button 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded"
                        onClick={() => {
                            const asset = assets.find(a => a.symbol === sendForm.assetSymbol);
                            if(asset) setSendForm(prev => ({ ...prev, amount: asset.balance.toString() }));
                        }}
                    >
                        MAX
                    </button>
                </div>
            </div>

            <div className="mt-auto">
                <button 
                    onClick={handleSend}
                    disabled={isLoading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                    {isLoading ? 'Sending...' : 'Confirm Send'}
                </button>
            </div>
        </div>
    </div>
  );

  const renderReceive = () => (
    <div className="flex flex-col h-full bg-slate-900">
        <div className="p-4 border-b border-white/10 flex items-center gap-4">
            <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-lg"><ChevronLeft /></button>
            <h2 className="font-bold text-lg">Receive</h2>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
            <div className="bg-white p-4 rounded-2xl shadow-xl">
                {/* Placeholder QR Code */}
                <div className="w-48 h-48 bg-black flex flex-wrap">
                    {Array.from({length: 100}).map((_, i) => (
                        <div key={i} className={`w-[10%] h-[10%] ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`} />
                    ))}
                    {/* Center Logo */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
                            <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xs">NBL</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center space-y-2 w-full">
                <span className="text-gray-400 text-xs uppercase font-bold">Your Wallet Address</span>
                <div 
                    onClick={() => navigator.clipboard.writeText(address)}
                    className="bg-black/30 border border-white/10 rounded-xl p-4 font-mono text-xs text-center break-all cursor-pointer hover:bg-black/50 hover:border-blue-500/50 transition-all group"
                >
                    {address}
                    <span className="block text-[10px] text-blue-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to Copy</span>
                </div>
            </div>

            <button 
                onClick={simulateReceive}
                disabled={isLoading}
                className="mt-auto w-full py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
            >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowDownLeft size={16} />}
                Simulate Incoming Tx (Faucet)
            </button>
        </div>
    </div>
  );

  const renderBuy = () => (
    <div className="flex flex-col h-full bg-slate-900">
        <div className="p-4 border-b border-white/10 flex items-center gap-4">
            <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-lg"><ChevronLeft /></button>
            <h2 className="font-bold text-lg">Buy Crypto</h2>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-white/80">**** **** **** 4242</span>
                    <CreditCard className="text-white/80" />
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-xs text-white/60 uppercase">Holder</div>
                        <div className="font-medium">Nebula User</div>
                    </div>
                    <div>
                        <div className="text-xs text-white/60 uppercase">Exp</div>
                        <div className="font-medium">12/28</div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">You Pay (USD)</label>
                <input 
                    type="number"
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-xl font-bold outline-none focus:border-indigo-500 transition-colors"
                    placeholder="0.00"
                    value={buyAmount}
                    onChange={e => setBuyAmount(e.target.value)}
                />
            </div>

            <div className="flex justify-center">
                <div className="bg-white/5 rounded-full p-2">
                    <ArrowDownLeft className="text-gray-400" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">You Receive (ETH)</label>
                <div className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xl font-bold text-gray-400">
                    {buyAmount ? (parseFloat(buyAmount) / (assets.find(a => a.symbol === 'ETH')?.price || 3200)).toFixed(6) : '0.00'}
                </div>
            </div>

            <div className="mt-auto">
                <button 
                    onClick={handleBuy}
                    disabled={isLoading}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                    {isLoading ? 'Processing...' : 'Buy Now'}
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white relative overflow-hidden">
        {/* Global Notification Overlay */}
        {successMsg && (
            <div className="absolute top-4 left-4 right-4 z-50 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={18} />
                <span className="font-medium text-sm">{successMsg}</span>
            </div>
        )}

        {view === 'home' && renderHome()}
        {view === 'send' && renderSend()}
        {view === 'receive' && renderReceive()}
        {view === 'buy' && renderBuy()}
    </div>
  );
};
