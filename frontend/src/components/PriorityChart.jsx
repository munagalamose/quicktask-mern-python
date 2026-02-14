import React from 'react';

const PRIORITY_ORDER = ['High', 'Medium', 'Low'];
const COLORS = { High: 'bg-rose-500', Medium: 'bg-amber-500', Low: 'bg-slate-500' };

export default function PriorityChart({ stats }) {
  const byPriority = stats?.byPriority ?? {};
  const total = Object.values(byPriority).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-4">
      {PRIORITY_ORDER.map((p) => {
        const count = byPriority[p] ?? 0;
        const pct = Math.round((count / total) * 100);
        return (
          <div key={p}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">{p}</span>
              <span className="text-slate-400">{count} tasks</span>
            </div>
            <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
              <div className={`h-full rounded-full ${COLORS[p]}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
      {total === 0 && <p className="text-slate-500 text-sm">No tasks yet.</p>}
    </div>
  );
}
