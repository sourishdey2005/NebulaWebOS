
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast } from '../../types';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastManagerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export const ToastManager: React.FC<ToastManagerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="pointer-events-auto bg-slate-800/90 backdrop-blur-md border border-white/10 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px]"
          >
            {toast.type === 'success' && <CheckCircle2 className="text-green-400" size={20} />}
            {toast.type === 'error' && <AlertCircle className="text-red-400" size={20} />}
            {toast.type === 'info' && <Info className="text-blue-400" size={20} />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
