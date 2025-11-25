
import React, { useState } from 'react';
import { Shield, Lock, Unlock, FileText, AlertTriangle, Wallet } from 'lucide-react';
import { SystemState } from '../../types';

interface CryptoVaultProps {
  systemState?: SystemState;
}

export const CryptoVaultApp: React.FC<CryptoVaultProps> = ({ systemState }) => {
  const isUnlocked = !!systemState?.walletAddress;
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const secureFiles = [
    { name: 'private_keys.txt', size: '2 KB', date: '2023-10-01' },
    { name: 'project_omega_blueprints.pdf', size: '4.5 MB', date: '2023-11-15' },
    { name: 'contract_v2.sol', size: '12 KB', date: '2023-12-05' },
    { name: 'offshore_accounts.csv', size: '1.1 MB', date: '2023-12-20' },
  ];

  if (!isUnlocked) {
    return (
      <div className="flex flex-col h-full bg-slate-950 text-white items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/30 animate-pulse">
          <Lock size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h2>
        <p className="text-gray-400 mb-8 max-w-xs">
          This vault is encrypted. Please connect your hardware wallet or authenticate via the Lock Screen to decrypt contents.
        </p>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded border border-white/10 text-sm text-gray-500">
          <Wallet size={16} /> Wallet Disconnected
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Header */}
      <div className="h-16 bg-emerald-900/20 border-b border-emerald-500/20 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="font-bold text-emerald-100">Crypto Vault</h2>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              DECRYPTED VIA {systemState.walletAddress?.substring(0, 6)}...
            </div>
          </div>
        </div>
        <Unlock size={20} className="text-emerald-500/50" />
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between text-xs text-gray-500 px-4 pb-2 uppercase font-bold tracking-wider">
            <span>Filename</span>
            <span>Size</span>
          </div>
          {secureFiles.map((file, i) => (
            <div 
              key={i}
              onClick={() => setSelectedFile(file.name)}
              className={`
                flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all group
                ${selectedFile === file.name 
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'bg-slate-800/50 border-white/5 hover:bg-slate-800 hover:border-white/10'}
              `}
            >
              <div className="flex items-center gap-4">
                <FileText size={20} className={selectedFile === file.name ? 'text-emerald-400' : 'text-gray-400'} />
                <span className={selectedFile === file.name ? 'text-emerald-100 font-medium' : 'text-gray-300'}>{file.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs text-gray-500 font-mono">{file.date}</span>
                <span className="text-xs text-gray-500 font-mono w-12 text-right">{file.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-slate-950/50 text-xs text-gray-500 flex items-center gap-2">
        <AlertTriangle size={12} className="text-yellow-500" />
        Files are encrypted with AES-256. Loss of wallet keys results in permanent data loss.
      </div>
    </div>
  );
};
