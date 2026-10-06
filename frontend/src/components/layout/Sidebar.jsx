import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Layers,
  Map,
  Zap,
  BarChart3,
  User
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload & Docs', path: '/documents', icon: FileText },
  { name: 'Generate Quiz', path: '/generate-quiz', icon: HelpCircle },
  { name: 'Flashcards', path: '/flashcards', icon: Layers },
  { name: 'Syllabus Map', path: '/syllabus', icon: Map },
  { name: 'Speed Drills', path: '/games', icon: Zap },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Profile', path: '/profile', icon: User },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm shadow-brand-500/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Banking Exam Motivation Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-lg shadow-brand-600/20">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">Exam Strategy Tip</h4>
        </div>
        <p className="text-xs text-brand-100 leading-relaxed">
          Consistent 30-min sectional quizzes with negative-marking awareness improve exam accuracy by 40%.
        </p>
      </div>
    </aside>
  );
}
