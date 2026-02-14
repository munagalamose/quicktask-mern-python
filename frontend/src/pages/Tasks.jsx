import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created date' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '', sort: 'createdAt', order: 'desc' });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.priority) params.set('priority', filters.priority);
      if (filters.search) params.set('search', filters.search);
      params.set('sort', filters.sort);
      params.set('order', filters.order);
      const { data } = await api.get(`/tasks?${params}`);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleCreate = async (payload) => {
    await api.post('/tasks', payload);
    fetchTasks();
  };

  const handleUpdate = async (id, payload) => {
    await api.put(`/tasks/${id}`, payload);
    setEditingId(null);
    fetchTasks();
  };

  const handleStatusChange = async (id, status) => {
    await api.patch(`/tasks/${id}/status`, { status });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    if (editingId === id) setEditingId(null);
    fetchTasks();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Tasks</h1>
      <TaskForm onSubmit={handleCreate} />
      <div className="mt-6 flex flex-wrap gap-4 items-center">
        <input type="text" placeholder="Search by title..." value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white w-48" />
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white">
          <option value="">All statuses</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white">
          <option value="">All priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select value={filters.sort} onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))} className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button type="button" onClick={() => setFilters((f) => ({ ...f, order: f.order === 'asc' ? 'desc' : 'asc' }))} className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white hover:bg-slate-600">
          {filters.order === 'asc' ? 'Asc' : 'Desc'}
        </button>
      </div>
      {loading ? <p className="text-slate-400 mt-4">Loading...</p> : <TaskList tasks={tasks} onEdit={setEditingId} editingId={editingId} onUpdate={handleUpdate} onStatusChange={handleStatusChange} onDelete={handleDelete} />}
    </div>
  );
}
