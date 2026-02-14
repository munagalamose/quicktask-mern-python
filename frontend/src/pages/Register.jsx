import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-amber-400 text-center mb-2">QuickTask</h1>
        <p className="text-slate-400 text-center mb-8">Create an account</p>
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-8 border border-slate-700">
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300 text-sm">{error}</div>}
          <label className="block text-slate-300 text-sm font-medium mb-2">Name (optional)</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white mb-4" placeholder="Your name" />
          <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white mb-4" placeholder="you@example.com" />
          <label className="block text-slate-300 text-sm font-medium mb-2">Password (min 6)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white mb-6" placeholder="••••••••" />
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold disabled:opacity-50">Create Account</button>
        </form>
        <p className="text-center text-slate-400 mt-6">Already have an account? <Link to="/login" className="text-amber-400 hover:underline">Sign In</Link></p>
      </div>
    </div>
  );
}
