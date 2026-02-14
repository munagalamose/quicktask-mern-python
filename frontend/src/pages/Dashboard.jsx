import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { analyticsApi } from '../api/client';
import DashboardStats from '../components/DashboardStats';
import PriorityChart from '../components/PriorityChart';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [productivity, setProductivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tasksRes, statsRes, prodRes] = await Promise.all([
          api.get('/tasks'),
          analyticsApi.get('/api/analytics/user-stats').catch(() => ({ data: null })),
          analyticsApi.get('/api/analytics/productivity').catch(() => ({ data: null })),
        ]);
        setTasks(tasksRes.data);
        setStats(statsRes.data);
        setProductivity(prodRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="text-slate-400">Loading dashboard...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  const recent = tasks.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <DashboardStats tasks={tasks} stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Tasks by Priority</h2>
          <PriorityChart stats={stats} />
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Productivity (last 30 days)</h2>
          {productivity && (
            <div className="space-y-2 text-slate-300">
              <p>Created: <span className="text-amber-400 font-medium">{productivity.createdInPeriod}</span></p>
              <p>Completed: <span className="text-emerald-400 font-medium">{productivity.completedInPeriod}</span></p>
              <p className="text-sm text-slate-400">{productivity.startDate} to {productivity.endDate}</p>
            </div>
          )}
          {(!productivity || productivity.dailyTrends?.length === 0) && <p className="text-slate-500">No activity in this period.</p>}
        </div>
      </div>
      <div className="mt-8 bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Tasks</h2>
          <Link to="/tasks" className="text-amber-400 hover:underline text-sm">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-slate-500">No tasks yet. <Link to="/tasks" className="text-amber-400 hover:underline">Create one</Link></p>
        ) : (
          <ul className="space-y-2">
            {recent.map((t) => (
              <li key={t._id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                <span className="text-slate-200 truncate">{t.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : t.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-600 text-slate-400'}`}>{t.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
