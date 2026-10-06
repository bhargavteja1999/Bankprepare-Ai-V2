import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Sparkles, ArrowUpRight } from 'lucide-react';
import Button from '../common/Button';

export default function TopicCard({ topic, subjectName, onToggleComplete }) {
  const difficultyBadge = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Hard: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      topic.completed ? 'bg-slate-50/70 border-slate-200 opacity-90' : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
    } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete && onToggleComplete(topic.id)}
          className="mt-0.5 text-slate-400 hover:text-brand-600 transition"
        >
          {topic.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 hover:text-brand-500" />
          )}
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h4 className={`text-sm font-semibold ${topic.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
              {topic.name}
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${difficultyBadge[topic.difficulty] || difficultyBadge.Medium}`}>
              {topic.difficulty}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mastery: {topic.progress}%
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Link to={`/generate-quiz?topic=${encodeURIComponent(topic.name)}&subject=${encodeURIComponent(subjectName)}`}>
          <Button variant="outline" size="sm" icon={Sparkles} className="text-xs">
            Generate Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
}
