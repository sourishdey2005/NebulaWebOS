
import React, { useState, useEffect, useRef } from 'react';
import { Plus, MoreHorizontal, X, Trash2, Edit2, Check, GripVertical, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string; // Tailwind class for dot color
}

const DEFAULT_DATA: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-red-500',
    tasks: [
      { id: '1', content: 'Design System Draft', priority: 'high', createdAt: Date.now() },
      { id: '2', content: 'User Research', priority: 'medium', createdAt: Date.now() },
    ],
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    color: 'bg-yellow-500',
    tasks: [
      { id: '3', content: 'Homepage Animation', priority: 'high', createdAt: Date.now() },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-emerald-500',
    tasks: [
      { id: '4', content: 'Project Setup', priority: 'low', createdAt: Date.now() },
      { id: '5', content: 'Repo Creation', priority: 'low', createdAt: Date.now() },
    ],
  },
];

export const KanbanApp: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(DEFAULT_DATA);
  const [draggedTask, setDraggedTask] = useState<{ taskId: string; sourceColId: string } | null>(null);
  const [editingTask, setEditingTask] = useState<{ taskId: string; colId: string } | null>(null);
  const [newTaskInput, setNewTaskInput] = useState<{ colId: string; content: string } | null>(null);
  
  // Refs for auto-focusing inputs
  const editInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('nebula-kanban-v1');
    if (saved) {
      try {
        setColumns(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load kanban data");
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('nebula-kanban-v1', JSON.stringify(columns));
  }, [columns]);

  // Focus management
  useEffect(() => {
    if (editingTask && editInputRef.current) editInputRef.current.focus();
    if (newTaskInput && addInputRef.current) addInputRef.current.focus();
  }, [editingTask, newTaskInput]);

  // --- CRUD Operations ---

  const initiateAddTask = (colId: string) => {
    setNewTaskInput({ colId, content: '' });
  };

  const confirmAddTask = (colId: string) => {
    if (!newTaskInput || !newTaskInput.content.trim()) {
        setNewTaskInput(null);
        return;
    }

    setColumns(prev => prev.map(col => {
      if (col.id === colId) {
        return {
          ...col,
          tasks: [...col.tasks, { 
            id: Date.now().toString(), 
            content: newTaskInput.content,
            priority: 'medium',
            createdAt: Date.now()
          }]
        };
      }
      return col;
    }));
    setNewTaskInput(null);
  };

  const deleteTask = (taskId: string, colId: string) => {
    setColumns(prev => prev.map(col => {
      if (col.id === colId) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
      }
      return col;
    }));
  };

  const initiateEditTask = (taskId: string, colId: string) => {
    setEditingTask({ taskId, colId });
  };

  const saveEditTask = (e: React.ChangeEvent<HTMLInputElement>, taskId: string, colId: string) => {
    const newContent = e.target.value;
    setColumns(prev => prev.map(col => {
        if (col.id === colId) {
            return {
                ...col,
                tasks: col.tasks.map(t => t.id === taskId ? { ...t, content: newContent } : t)
            };
        }
        return col;
    }));
  };

  const finishEditTask = () => {
    setEditingTask(null);
  };

  const togglePriority = (taskId: string, colId: string) => {
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    setColumns(prev => prev.map(col => {
        if (col.id === colId) {
            return {
                ...col,
                tasks: col.tasks.map(t => {
                    if (t.id === taskId) {
                        const currentIdx = priorities.indexOf(t.priority);
                        const nextIdx = (currentIdx + 1) % 3;
                        return { ...t, priority: priorities[nextIdx] };
                    }
                    return t;
                })
            };
        }
        return col;
    }));
  };

  // --- Drag and Drop Handlers ---

  const handleDragStart = (e: React.DragEvent, taskId: string, sourceColId: string) => {
    setDraggedTask({ taskId, sourceColId });
    e.dataTransfer.effectAllowed = 'move';
    // Transparent drag image or default
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    if (!draggedTask) return;
    
    const { taskId, sourceColId } = draggedTask;
    
    // If dropped in same column, do nothing (or reorder if we implemented index logic)
    if (sourceColId === targetColId) return;

    // Find the task object
    const sourceColumn = columns.find(c => c.id === sourceColId);
    const taskToMove = sourceColumn?.tasks.find(t => t.id === taskId);
    
    if (!taskToMove) return;

    setColumns(prev => {
        const newCols = [...prev];
        
        // Remove from source
        const srcColIdx = newCols.findIndex(c => c.id === sourceColId);
        newCols[srcColIdx] = {
            ...newCols[srcColIdx],
            tasks: newCols[srcColIdx].tasks.filter(t => t.id !== taskId)
        };

        // Add to target
        const tgtColIdx = newCols.findIndex(c => c.id === targetColId);
        newCols[tgtColIdx] = {
            ...newCols[tgtColIdx],
            tasks: [...newCols[tgtColIdx].tasks, taskToMove]
        };

        return newCols;
    });
  };

  // Helper for priority badges
  const getPriorityColor = (p: string) => {
      switch(p) {
          case 'high': return 'bg-red-100 text-red-700 border-red-200';
          case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          default: return 'bg-blue-100 text-blue-700 border-blue-200';
      }
  };

  return (
    <div className="flex h-full bg-slate-100 overflow-x-auto p-6 gap-6 items-start">
        {columns.map((col) => (
            <div 
                key={col.id} 
                className="w-80 flex-shrink-0 flex flex-col bg-slate-200 rounded-xl max-h-full border border-slate-300 shadow-sm transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
            >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-300/50 bg-slate-200/50 rounded-t-xl sticky top-0 z-10 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${col.color} shadow-sm`} />
                        <h3 className="font-bold text-slate-700">{col.title}</h3>
                        <span className="bg-slate-300 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold min-w-[24px] text-center">
                            {col.tasks.length}
                        </span>
                    </div>
                    <button className="text-slate-500 hover:text-slate-800 transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>

                {/* Tasks Container */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {col.tasks.map((task) => (
                        <div 
                            key={task.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id, col.id)}
                            onDragEnd={handleDragEnd}
                            className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all group relative cursor-grab active:cursor-grabbing"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <button 
                                    onClick={() => togglePriority(task.id, col.id)}
                                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)} hover:brightness-95 transition-all`}
                                    title="Click to change priority"
                                >
                                    {task.priority}
                                </button>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button onClick={() => initiateEditTask(task.id, col.id)} className="p-1 text-slate-400 hover:text-blue-500 rounded"><Edit2 size={12}/></button>
                                    <button onClick={() => deleteTask(task.id, col.id)} className="p-1 text-slate-400 hover:text-red-500 rounded"><Trash2 size={12}/></button>
                                </div>
                            </div>
                            
                            {editingTask?.taskId === task.id ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={editInputRef}
                                        value={task.content}
                                        onChange={(e) => saveEditTask(e, task.id, col.id)}
                                        onKeyDown={(e) => e.key === 'Enter' && finishEditTask()}
                                        onBlur={finishEditTask}
                                        className="w-full text-sm p-1 border rounded focus:border-blue-500 outline-none"
                                    />
                                    <button onClick={finishEditTask} className="text-green-500"><Check size={14} /></button>
                                </div>
                            ) : (
                                <p 
                                    className="text-sm text-slate-800 font-medium leading-relaxed"
                                    onDoubleClick={() => initiateEditTask(task.id, col.id)}
                                >
                                    {task.content}
                                </p>
                            )}

                            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                                <div className="flex items-center gap-1">
                                    <Clock size={10} />
                                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-20">
                                    <GripVertical size={14} />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* New Task Input */}
                    {newTaskInput?.colId === col.id && (
                         <div className="bg-white p-3 rounded-lg border border-blue-400 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                            <input
                                ref={addInputRef}
                                placeholder="What needs to be done?"
                                value={newTaskInput.content}
                                onChange={(e) => setNewTaskInput(prev => prev ? { ...prev, content: e.target.value } : null)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') confirmAddTask(col.id);
                                    if (e.key === 'Escape') setNewTaskInput(null);
                                }}
                                className="w-full text-sm outline-none placeholder-gray-400"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => setNewTaskInput(null)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><X size={14}/></button>
                                <button onClick={() => confirmAddTask(col.id)} className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">Add</button>
                            </div>
                         </div>
                    )}
                </div>

                {/* Footer */}
                {newTaskInput?.colId !== col.id && (
                    <div className="p-3 pt-0">
                        <button 
                            onClick={() => initiateAddTask(col.id)}
                            className="w-full py-2 flex items-center justify-center gap-2 text-slate-500 hover:bg-white/50 hover:text-slate-700 hover:shadow-sm rounded-lg transition-all text-sm font-medium"
                        >
                            <Plus size={16} /> Add Task
                        </button>
                    </div>
                )}
            </div>
        ))}
    </div>
  );
};
