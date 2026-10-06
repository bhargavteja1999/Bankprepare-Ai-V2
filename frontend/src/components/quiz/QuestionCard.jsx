import React from 'react';
import { Check, X, Info, Lightbulb } from 'lucide-react';

export default function QuestionCard({
  question,
  index,
  total,
  selectedOptionId,
  userTextAnswer,
  onSelectOption,
  onTextChange,
  isReview = false
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      {/* Question Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
        <span className="px-3 py-1 bg-brand-50 text-brand-700 font-semibold text-xs rounded-full">
          Question {index + 1} of {total}
        </span>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="text-emerald-600 font-semibold">+{question.marks || 1} Marks</span>
          <span>•</span>
          <span className="text-rose-600 font-semibold">-{question.negative_marks || 0.25} Neg</span>
        </div>
      </div>

      {/* Question Text */}
      <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed mb-6">
        {question.question_text}
      </h2>

      {/* Options Selection */}
      <div className="space-y-3">
        {question.options && question.options.length > 0 ? (
          question.options.map((opt, optIdx) => {
            const isSelected = selectedOptionId === opt.id;
            let optionStyles = 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 text-slate-700';

            if (isReview) {
              if (opt.is_correct) {
                optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium';
              } else if (isSelected && !opt.is_correct) {
                optionStyles = 'border-rose-500 bg-rose-50 text-rose-900 font-medium';
              } else {
                optionStyles = 'border-slate-100 opacity-60 text-slate-500';
              }
            } else if (isSelected) {
              optionStyles = 'border-brand-600 bg-brand-50 text-brand-900 font-semibold shadow-sm shadow-brand-500/10';
            }

            return (
              <button
                key={opt.id || optIdx}
                disabled={isReview}
                onClick={() => onSelectOption && onSelectOption(opt.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center justify-between gap-4 ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-sm leading-snug">{opt.option_text}</span>
                </div>

                {isReview && opt.is_correct && (
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isReview && isSelected && !opt.is_correct && (
                  <X className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })
        ) : (
          <div>
            <input
              type="text"
              disabled={isReview}
              value={userTextAnswer || ''}
              onChange={(e) => onTextChange && onTextChange(e.target.value)}
              placeholder="Type your exact answer here..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Review Explanation Box */}
      {isReview && question.explanation && (
        <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-sm space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold text-amber-900">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Detailed Explanation</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90">
            {question.explanation}
          </p>
          {question.reference_note && (
            <p className="text-xs text-amber-700 italic border-t border-amber-200/60 pt-2 mt-2">
              Reference: {question.reference_note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
