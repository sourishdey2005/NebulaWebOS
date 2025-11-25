
import React, { useState } from 'react';
import { Plus, MoreHorizontal, X } from 'lucide-react';

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

export const KanbanApp: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-red-500',
      tasks: [
        { id: '1', content: 'Design System Draft' },
        { id: '2', content: 'User Research' },
      ],
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      color: 'bg-yellow-500',
      tasks: [
        { id: '3', content: 'Homepage Animation' },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: 'bg-emerald-500',
      tasks: [
        { id: '4', content: 'Project Setup' },
        { id: '5', content: 'Repo Creation' },
      ],
    },
  ]);

  const addTask = (colId: string) => {
    const text = prompt('Enter task description:');
    if (text) {
      setColumns(prev => prev.map(col => {
        if (col.id === colId) {
          return {
            ...col,
            tasks: [...col.tasks, { id: Date.now().toString(), content: text }]
          };
        }
        return col;
      }));
    }
  };

  const moveTask = (taskId: string, sourceColId: string, direction: 'left' | 'right') => {
    const colIndex = columns.findIndex(c => c.id === sourceColId);
    if (colIndex === -1) return;
    
    const newColIndex = direction === 'left' ? colIndex - 1 : colIndex + 1;
    if (newColIndex < 0 || newColIndex >= columns.length) return;

    const sourceCol = columns[colIndex];
    const targetCol = columns[newColIndex];
    const task = sourceCol.tasks.find(t => t.id === taskId);
    
    if (!task) return;

    setColumns(prev => {
        const newCols = [...prev];
        // Remove from source
        newCols[colIndex] = {
            ...sourceCol,
            tasks: sourceCol.tasks.filter(t => t.id !== taskId)
        };
        // Add to target
        newCols[newColIndex] = {
            ...targetCol,
            tasks: [...targetCol.tasks, task]
        };
        return newCols;
    });
  };

  const deleteTask = (taskId: string, colId: string) => {
    setColumns(prev => prev.map(col => {
        if (col.id === colId) {
            return {
                ...col,
                tasks: col.tasks.filter(t => t.id !== taskId)
            };
        }
        return col;
    }));
  };

  return (
    <div className="flex h-full bg-slate-100 overflow-x-auto p-6 gap-6">
        {columns.map((col, index) => (
            <div key={col.id} className="w-80 flex-shrink-0 flex flex-col bg-gray-200 rounded-xl max-h-full">
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${col.color}`} />
                        <h3 className="font-bold text-gray-700">{col.title}</h3>
                        <span className="bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                            {col.tasks.length}
                        </span>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700">
                        <MoreHorizontal size={16} />
                    </button>
                </div>

                {/* Tasks Container */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {col.tasks.map((task) => (
                        <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
                            <p className="text-sm text-gray-800">{task.content}</p>
                            
                            {/* Hover Actions */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => deleteTask(task.id, col.id)} className="text-gray-400 hover:text-red-500">
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="flex justify-between mt-3 pt-2 border-t border-gray-50">
                                <button 
                                    disabled={index === 0}
                                    onClick={() => moveTask(task.id, col.id, 'left')}
                                    className="text-[10px] text-gray-400 hover:text-blue-500 disabled:opacity-30 uppercase font-bold"
                                >
                                    Prev
                                </button>
                                <button 
                                    disabled={index === columns.length - 1}
                                    onClick={() => moveTask(task.id, col.id, 'right')}
                                    className="text-[10px] text-gray-400 hover:text-blue-500 disabled:opacity-30 uppercase font-bold"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-3">
                    <button 
                        onClick={() => addTask(col.id)}
                        className="w-full py-2 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-300 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Plus size={16} /> Add Task
                    </button>
                </div>
            </div>
        ))}
    </div>
  );
};