import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Cpu, CircuitBoard, HardDrive } from 'lucide-react';

const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    name: i.toString(),
    cpu: Math.floor(Math.random() * 30) + 10,
    memory: Math.floor(Math.random() * 20) + 40,
    network: Math.floor(Math.random() * 50) + 5,
  }));
};

export const SystemMonitor: React.FC = () => {
  const [data, setData] = useState(generateData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), {
          name: Date.now().toString(),
          cpu: Math.floor(Math.random() * 40) + 10, // 10-50% load simulation
          memory: Math.floor(Math.random() * 10) + 50, // 50-60% memory
          network: Math.floor(Math.random() * 80),
        }];
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-6 space-y-6 overflow-y-auto custom-scrollbar">
      
      {/* CPU Section */}
      <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
        <div className="flex items-center gap-2 mb-4">
            <Cpu className="text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-200">CPU Usage</h3>
            <span className="ml-auto text-xs font-mono text-blue-400">{data[data.length-1].cpu}%</span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                itemStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Memory Section */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
                <CircuitBoard className="text-purple-500" />
                <h3 className="text-sm font-semibold text-gray-200">Memory</h3>
                <span className="ml-auto text-xs font-mono text-purple-400">8.2 / 16 GB</span>
            </div>
            <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide domain={[0, 100]} />
                <Area type="monotone" dataKey="memory" stroke="#a855f7" fillOpacity={1} fill="url(#colorMem)" />
                </AreaChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* Storage Section */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
                <HardDrive className="text-emerald-500" />
                <h3 className="text-sm font-semibold text-gray-200">Storage</h3>
            </div>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Nebula Disk (C:)</span>
                        <span>450 GB / 1 TB</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[45%]" />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>External Drive</span>
                        <span>1.2 TB / 2 TB</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[60%]" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};