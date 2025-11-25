
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Trash2, Check, AlertCircle, Info, Shield } from 'lucide-react';
import { Notification } from '../../types';
import { format } from 'date-fns';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onClearAll: () => void;
  onCloseNotification: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onCloseNotification
}) => {
  const getIcon = (source?: string, type?: string) => {
    if (source === 'Security') return <Shield size={16} className="text-emerald-400" />;
    if (type === 'error') return <AlertCircle size={16} className="text-red-400" />;
    if (type === 'success') return <Check size={16} className="text-green-400" />;
    if (type === 'warning') return <AlertCircle size={16} className="text-amber-400" />;
    return <Info size={16} className="text-blue-400" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            // Adjusted height to account for 56px (h-14) taskbar
            className="absolute top-0 right-0 h-[calc(100vh-56px)] w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-900/50">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-blue-400" />
                <span className="font-semibold text-white">Notifications</span>
                <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {notifications.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button 
                    onClick={onClearAll}
                    className="p-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 opacity-50">
                  <Bell size={48} strokeWidth={1} />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="relative group bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 rounded-xl p-3 transition-colors"
                  >
                    <button 
                      onClick={() => onCloseNotification(notif.id)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <X size={14} />
                    </button>
                    
                    <div className="flex gap-3">
                      <div className="mt-1 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                        {getIcon(notif.source, notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between mb-0.5 pr-4">
                            <span className="text-xs font-semibold text-gray-200 truncate">{notif.source || 'System'}</span>
                            <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">{format(notif.timestamp, 'h:mm a')}</span>
                        </div>
                        <h4 className="text-sm font-medium text-white mb-0.5">{notif.title}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{notif.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/5 bg-slate-900/50">
               <button className="w-full py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  Manage Notifications
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
