
import React, { useState, useEffect } from 'react';
import { Activity, XCircle, Cpu, HardDrive } from 'lucide-react';
import { WindowState } from '../../types';

interface TaskManagerProps {
  windows?: WindowState[];
  onCloseWindow?: (id: string) => void;
}

export const TaskManagerApp: React.FC<TaskManagerProps> = ({ windows = [], onCloseWindow }) => {
  const [stats, setStats] = useState<{ [key: string]: { cpu: number; mem: number } }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newStats: any = {};
      windows.forEach(w => {
        newStats[w.id] = {
          cpu: Math.floor(Math.random() * 20),
          mem: Math.floor(Math.random() * 200) + 50
        };
      });
      setStats(newStats);
    }, 2000);
    return () => clearInterval(interval);
  }, [windows]);

  return (
    <div className="flex flex-col h-full bg-slate-100 text-gray-800">
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="text-blue-500" /> Processes
        </h2>
        <div className="text-xs text-gray-500">
            {windows.length} active apps
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b sticky top-0">
                <tr>
                    <th className="px-4 py-2 font-medium">Application Name</th>
                    <th className="px-4 py-2 font-medium w-24">CPU</th>
                    <th className="px-4 py-2 font-medium w-24">Memory</th>
                    <th className="px-4 py-2 font-medium w-20">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {windows.map((w) => (
                    <tr key={w.id} className="hover:bg-blue-50 group">
                        <td className="px-4 py-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                <w.icon size={18} className="text-gray-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{w.title}</span>
                                <span className="text-xs text-gray-400 font-mono">{w.id}</span>
                            </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-600">
                            {stats[w.id]?.cpu || 0}%
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-600">
                            {stats[w.id]?.mem || 0} MB
                        </td>
                        <td className="px-4 py-3">
                            <button 
                                onClick={() => onCloseWindow?.(w.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="End Task"
                            >
                                <XCircle size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        {windows.length === 0 && (
            <div className="p-8 text-center text-gray-400">
                No active applications
            </div>
        )}
      </div>

      <div className="h-16 bg-gray-50 border-t flex items-center justify-around px-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded text-blue-600"><Cpu size={20} /></div>
            <div>
                <div className="text-xs text-gray-500">Total CPU</div>
                <div className="text-sm font-bold text-gray-800">12%</div>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded text-purple-600"><HardDrive size={20} /></div>
            <div>
                <div className="text-xs text-gray-500">Memory Used</div>
                <div className="text-sm font-bold text-gray-800">42%</div>
            </div>
        </div>
      </div>
    </div>
  );
};
