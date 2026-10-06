import React from 'react';

export default function ProgressCard({ subject, accuracy, quizzesCount, questionsSolved }) {
  return (
    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
        <span>{subject}</span>
        <span className={`${accuracy >= 70 ? 'text-emerald-600' : accuracy >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>
          {accuracy}%
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            accuracy >= 70 ? 'bg-emerald-500' : accuracy >= 40 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, accuracy))}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>{quizzesCount} Tests taken</span>
        <span>{questionsSolved} Questions</span>
      </div>
    </div>
  );
}
