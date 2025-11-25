
import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, User, ShieldCheck, Wallet, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface LockScreenProps {
  onUnlock: (password: string, method?: 'password' | 'wallet') => void;
  username: string;
  storedPassword?: string;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, username, storedPassword }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(!storedPassword);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (isSetupMode) {
        if (password.length < 4) {
            setError(true);
            alert("Password must be at least 4 characters");
            return;
        }
        if (password !== confirmPassword) {
            setError(true);
            return;
        }
        onUnlock(password, 'password');
    } else {
        if (password === storedPassword) {
            onUnlock(password, 'password');
        } else {
            setError(true);
            setTimeout(() => setError(false), 500);
            setPassword('');
        }
    }
  };

  const handleConnectWallet = () => {
    setIsConnectingWallet(true);
    // Simulate Web3 Handshake
    setTimeout(() => {
        setIsConnectingWallet(false);
        // In a real app, this would check window.ethereum
        const mockWalletAddress = "0x71C7...9A23";
        onUnlock(mockWalletAddress, 'wallet');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center text-white animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="mb-12 text-center">
          <h1 className="text-8xl font-thin tracking-tighter mb-2">
            {format(time, 'h:mm')}
          </h1>
          <p className="text-xl font-medium text-blue-200">
            {format(time, 'EEEE, MMMM d')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-2xl relative">
            {isSetupMode ? <ShieldCheck size={48} className="text-emerald-400" /> : <User size={48} className="text-gray-400" />}
            <div className="absolute -bottom-2 bg-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-slate-900">SECURED</div>
          </div>
          
          <h2 className="text-2xl font-semibold">
            {isSetupMode ? "Create Account Password" : username}
          </h2>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <div className="relative w-full group">
                <input
                type="password"
                placeholder={isSetupMode ? "New Password" : "Enter Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-white/10 border ${error ? 'border-red-500 animate-shake' : 'border-white/20'} rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 outline-none focus:bg-white/20 focus:border-blue-400 transition-all text-center`}
                autoFocus
                />
                {!isSetupMode && (
                    <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    >
                    <ArrowRight size={18} />
                    </button>
                )}
            </div>

            {isSetupMode && (
                <>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full bg-white/10 border ${error ? 'border-red-500' : 'border-white/20'} rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:bg-white/20 focus:border-blue-400 transition-all text-center`}
                    />
                    <button 
                        type="submit"
                        className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                        Create Account
                    </button>
                </>
            )}
          </form>

          {!isSetupMode && (
            <div className="w-full flex flex-col items-center gap-3 mt-2">
                <div className="flex items-center gap-2 w-full">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="text-xs text-gray-500 uppercase">Or</span>
                    <div className="h-px bg-white/10 flex-1" />
                </div>
                <button 
                    onClick={handleConnectWallet}
                    disabled={isConnectingWallet}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all border border-white/10 shadow-lg disabled:opacity-70"
                >
                    {isConnectingWallet ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
                    <span className="text-sm font-medium">{isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
            <Lock size={12} /> {isSetupMode ? "Secure your Nebula OS" : "System Locked"}
          </p>
        </div>
      </div>
    </div>
  );
};
