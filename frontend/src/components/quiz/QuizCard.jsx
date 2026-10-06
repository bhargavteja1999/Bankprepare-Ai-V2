import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, HelpCircle, Award, ChevronRight, BookOpen, Trash2 } from 'lucide-react';
import Button from '../common/Button';

export default function QuizCard({ quiz, onDelete }) {
  const difficultyColors = {
    easy: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    medium: 'text-amber-700 bg-amber-50 border-amber-200',
    hard: 'text-rose-700 bg-rose-50 border-rose-200',
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyColors[quiz.difficulty] || difficultyColors.medium}`}>
            {(quiz.difficulty || 'Medium').toUpperCase()}
          </span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {quiz.subject || 'Quantitative'}
          </span>
        </div>

        <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition text-base mb-1.5 line-clamp-2">
          {quiz.title}
        </h3>
        
        {quiz.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-4">
            {quiz.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
            <span>{quiz.questions_count || 5} Questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            <span>{quiz.time_limit_minutes || 15} Mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-brand-600" />
            <span>{quiz.total_marks || 10} Marks</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-600 font-medium">
            <span>- {quiz.negative_marking || 0.25} Negative</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Link to={`/take-quiz/${quiz.id}`} className="flex-1">
          <Button variant="primary" size="sm" className="w-full justify-between group-hover:bg-brand-700">
            <span>Start Test</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(quiz.id)}
            title="Delete Quiz"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
