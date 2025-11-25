import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 right-4 w-80 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 p-4 text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</span>
              <div className="flex items-center gap-1">
                <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs text-gray-400 font-medium py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-full cursor-default
                    ${!isSameMonth(day, monthStart) ? 'text-gray-600' : 'text-gray-200'}
                    ${isSameDay(day, today) ? 'bg-blue-600 text-white font-bold' : 'hover:bg-white/10'}
                  `}
                >
                  {format(day, 'd')}
                </div>
              ))}
            </div>

            {/* Events Placeholder */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Today's Events</div>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="w-1 h-full bg-blue-500 rounded-full" />
                    <div>
                        <div className="text-xs font-medium text-gray-200">System Update</div>
                        <div className="text-[10px] text-gray-500">2:00 PM - 3:00 PM</div>
                    </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};