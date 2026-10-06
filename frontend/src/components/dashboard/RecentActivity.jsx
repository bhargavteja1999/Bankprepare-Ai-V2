import React from 'react';
import { HelpCircle, FileText, Layers, Zap, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const iconMap = {
  quiz_completed: HelpCircle,
  quiz_created: HelpCircle,
  doc_uploaded: FileText,
  flashcard_created: Layers,
  game_played: Zap,
};

export default function RecentActivity({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No recent activities yet. Start by uploading a document or taking a speed drill!
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {activities.map((act) => {
        const Icon = iconMap[act.activity_type] || Clock;
        return (
          <div key={act.id} className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-slate-50/70 rounded-xl transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {act.title}
                </p>
                {act.details && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.details}</p>
                )}
              </div>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0">
              {formatDate(act.created_at)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
