
import React from 'react';
import { HardDrive, PieChart, Info } from 'lucide-react';

export const DiskUtilityApp: React.FC = () => {
  return (
    <div className="flex h-full bg-slate-100 text-slate-800">
        <div className="w-64 bg-slate-200 p-4 border-r border-slate-300">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Internal</h3>
            <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-lg border border-blue-200 cursor-pointer">
                <HardDrive className="text-blue-600" size={24} />
                <div>
                    <div className="font-bold text-sm">Nebula Disk</div>
                    <div className="text-xs text-gray-500">512 GB SSD</div>
                </div>
            </div>
        </div>
        <div className="flex-1 p-8 flex flex-col">
            <div className="flex items-start gap-6 mb-8">
                <HardDrive size={64} className="text-slate-400" />
                <div>
                    <h1 className="text-2xl font-bold">Nebula Disk</h1>
                    <p className="text-gray-500">APFS Volume • encrypted</p>
                    <div className="mt-4 flex gap-4 text-sm">
                        <div>
                            <span className="font-bold block">120 GB</span>
                            <span className="text-gray-500">Used</span>
                        </div>
                        <div>
                            <span className="font-bold block">392 GB</span>
                            <span className="text-gray-500">Available</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-300 h-8 rounded-lg overflow-hidden flex w-full mb-2">
                <div className="bg-red-500 w-[20%]" title="System" />
                <div className="bg-blue-500 w-[15%]" title="Apps" />
                <div className="bg-green-500 w-[10%]" title="Docs" />
                <div className="bg-yellow-500 w-[5%]" title="Other" />
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-1">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/> System</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"/> Apps</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"/> Documents</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"/> Other</div>
            </div>

            <div className="mt-auto flex justify-end gap-2">
                <button className="px-4 py-2 bg-white border rounded hover:bg-gray-50 shadow-sm">First Aid</button>
                <button className="px-4 py-2 bg-white border rounded hover:bg-gray-50 shadow-sm">Partition</button>
            </div>
        </div>
    </div>
  );
};
