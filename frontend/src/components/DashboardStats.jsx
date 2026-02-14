import React from 'react';

export default function DashboardStats({ tasks, stats }) {
  const total = tasks?.length ?? 0;
  const completed = tasks?.filter((t) => t.status === 'Completed').length ?? 0;
  const pending = total - completed;
  const rate = total ? Math.round((completed / total) * 100) : 0;
  const s = stats ?? { totalTasks: total, completedCount: completed, pendingCount: pending, completionRate: rate };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
        <p className="text-slate-400 text-sm font-medium">Total Tasks</p>
        <p className="text-2xl font-bold text-white mt-1">{s.totalTasks ?? total}</p>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
        <p className="text-slate-400 text-sm font-medium">Completed</p>
        <p className="text-2xl font-bold text-emerald-400 mt-1">{s.completedCount ?? completed}</p>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
        <p className="text-slate-400 text-sm font-medium">Pending</p>
        <p className="text-2xl font-bold text-amber-400 mt-1">{s.pendingCount ?? pending}</p>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
        <p className="text-slate-400 text-sm font-medium">Completion Rate</p>
        <p className="text-2xl font-bold text-white mt-1">{s.completionRate ?? rate}%</p>
      </div>
    </div>
  );
}
