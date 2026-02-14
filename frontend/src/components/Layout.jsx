import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-700 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/dashboard" className="text-xl font-bold text-amber-400">QuickTask</NavLink>
          <nav className="flex items-center gap-6">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-amber-400 font-medium' : 'text-slate-300 hover:text-white'}>Dashboard</NavLink>
            <NavLink to="/tasks" className={({ isActive }) => isActive ? 'text-amber-400 font-medium' : 'text-slate-300 hover:text-white'}>Tasks</NavLink>
            <span className="text-slate-400 text-sm">{user?.email}</span>
            <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm">Logout</button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
