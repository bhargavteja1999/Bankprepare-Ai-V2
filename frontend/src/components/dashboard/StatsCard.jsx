import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'brand' }) {
  const colorStyles = {
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${colorStyles[color] || colorStyles.brand}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
