import React from 'react';
import { Calculator, BrainCircuit, BookOpen, Landmark, CheckCircle2, ChevronRight } from 'lucide-react';

const iconsMap = {
  Calculator,
  BrainCircuit,
  BookOpen,
  Landmark,
};

export default function SubjectCard({ subject, isSelected, onClick }) {
  const IconComponent = iconsMap[subject.icon] || BookOpen;
  const completedTopics = subject.topics ? subject.topics.filter(t => t.completed).length : 0;
  const totalTopics = subject.topics ? subject.topics.length : 0;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between ${
        isSelected
          ? 'bg-white border-brand-600 shadow-lg shadow-brand-500/10 ring-4 ring-brand-50'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-4 w-full">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            isSelected ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'
          }`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
              {subject.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Weightage: ~{subject.weightage_percent}% in Prelims/Mains
            </p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 transition ${isSelected ? 'text-brand-600 translate-x-1' : 'text-slate-400'}`} />
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full">
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-1.5">
          <span>Syllabus Coverage</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-brand-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </button>
  );
}
