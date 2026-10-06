import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Landmark, Bell, User as UserIcon, LogOut, Sparkles, BookOpen } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              BankPrepare <span className="bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded-full font-semibold">AI</span>
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user?.target_exam && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Target: {user.target_exam}</span>
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <Link to="/profile" className="flex items-center gap-2.5 text-left group">
            <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-semibold text-sm">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-800 group-hover:text-brand-600 transition leading-tight">
                {user?.full_name || 'Candidate'}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
