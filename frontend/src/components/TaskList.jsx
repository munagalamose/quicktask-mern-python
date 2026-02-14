import React from 'react';
import TaskForm from './TaskForm';

const PRIORITY_CLASS = { High: 'text-rose-400', Medium: 'text-amber-400', Low: 'text-slate-400' };
const STATUS_CLASS = { Completed: 'bg-emerald-500/20 text-emerald-400', 'In Progress': 'bg-amber-500/20 text-amber-400', Todo: 'bg-slate-600 text-slate-400' };

export default function TaskList({ tasks, onEdit, editingId, onUpdate, onStatusChange, onDelete }) {
  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString();
  };

  return (
    <ul className="space-y-3 mt-4">
      {tasks.map((task) => (
        <li key={task._id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          {editingId === task._id ? (
            <div className="p-4">
              <TaskForm task={task} onSubmit={(payload) => onUpdate(task._id, payload)} onCancel={() => onEdit(null)} />
            </div>
          ) : (
            <div className="p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{task.title}</p>
                {task.description && <p className="text-slate-400 text-sm mt-0.5 line-clamp-2">{task.description}</p>}
                <div className="flex flex-wrap gap-3 mt-2 text-sm">
                  <span className={PRIORITY_CLASS[task.priority]}>{task.priority}</span>
                  <span className="text-slate-500">Due: {formatDate(task.dueDate)}</span>
                </div>
              </div>
              <select value={task.status} onChange={(e) => onStatusChange(task._id, e.target.value)} className={`text-sm px-2 py-1 rounded ${STATUS_CLASS[task.status]} border-0 cursor-pointer`}>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="flex gap-2">
                <button type="button" onClick={() => onEdit(task._id)} className="px-3 py-1 rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-sm">Edit</button>
                <button type="button" onClick={() => onDelete(task._id)} className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-sm">Delete</button>
              </div>
            </div>
          )}
        </li>
      ))}
      {tasks.length === 0 && <p className="text-slate-500 py-8 text-center">No tasks match your filters.</p>}
    </ul>
  );
}
