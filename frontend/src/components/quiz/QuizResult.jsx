import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, MinusCircle, Clock, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import Button from '../common/Button';
import { formatDuration } from '../../utils/formatters';

export default function QuizResult({ result, onRetake }) {
  useEffect(() => {
    if (result && result.accuracy_percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [result]);

  if (!result) return null;

  const isPassed = result.accuracy_percentage >= 50;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl max-w-3xl mx-auto text-center animate-in zoom-in-95 duration-200">
      <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-500/30 mb-4">
        <Award className="w-8 h-8" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
        Test Attempt Completed!
      </h1>
      <p className="text-slate-500 text-sm mt-1">
        Here is your performance breakdown with standard banking exam marking.
      </p>

      {/* Score Summary Box */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-brand-950 text-white flex flex-col sm:flex-row items-center justify-around gap-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Score</p>
          <div className="text-3xl sm:text-4xl font-black text-brand-300 mt-1">
            {result.score} <span className="text-base text-slate-400 font-normal">/ {result.total_marks}</span>
          </div>
        </div>
        <div className="h-10 w-[1px] bg-slate-800 hidden sm:block" />
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Accuracy</p>
          <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
            {result.accuracy_percentage}%
          </div>
        </div>
        <div className="h-10 w-[1px] bg-slate-800 hidden sm:block" />
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Time Taken</p>
          <div className="text-3xl sm:text-4xl font-black text-white mt-1">
            {formatDuration(result.time_taken_seconds)}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Correct</span>
          </div>
          <span className="text-2xl font-bold text-emerald-900">{result.correct_count}</span>
        </div>

        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <div className="flex items-center justify-center gap-1.5 text-rose-700 mb-1">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Incorrect</span>
          </div>
          <span className="text-2xl font-bold text-rose-900">{result.incorrect_count}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
          <div className="flex items-center justify-center gap-1.5 text-slate-600 mb-1">
            <MinusCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Skipped</span>
          </div>
          <span className="text-2xl font-bold text-slate-800">{result.unattempted_count}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        {onRetake && (
          <Button variant="outline" onClick={onRetake} icon={RotateCcw}>
            Retake Quiz
          </Button>
        )}
        <Link to="/analytics">
          <Button variant="primary" icon={ArrowRight}>
            View Detailed Analytics
          </Button>
        </Link>
      </div>
    </div>
  );
}
