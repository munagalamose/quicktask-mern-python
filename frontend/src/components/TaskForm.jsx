import React, { useState } from 'react';

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Todo', 'In Progress', 'Completed'];

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState(task?.priority ?? 'Medium');
  const [status, setStatus] = useState(task?.status ?? 'Todo');
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 10) : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), priority, status, dueDate: dueDate || null });
    if (!task) {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('Todo');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-slate-300 text-sm font-medium mb-1">Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white" placeholder="Task title" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-slate-300 text-sm font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white resize-none" placeholder="Optional" />
        </div>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white">
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1">Due date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white" />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium">{task ? 'Update' : 'Create'} Task</button>
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white">Cancel</button>}
      </div>
    </form>
  );
}
