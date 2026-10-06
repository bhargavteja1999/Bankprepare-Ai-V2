import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Zap, Timer, Flame, Award, ArrowRight, Brain, Calculator } from 'lucide-react';

export default function Games() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Zap className="w-7 h-7 text-amber-500 fill-amber-400" />
          <span>Speed Drills & Mental Drills</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Sharpen mental arithmetic, number series intuition, and quick awareness under high-stress timers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Game 1: 60s Speed Drill */}
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                RAPID SPEED DRILL
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                60-Second Mental Math & Series
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Solve percentages, squares, missing number series, and blood relation logic in under 20s per question.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
              <span>⚡ 5 Rapid Questions</span>
              <span>•</span>
              <span>⏳ 90s Countdown</span>
              <span>•</span>
              <span>🏆 +100 Pts / correct</span>
            </div>
          </div>

          <div className="mt-6">
            <Link to="/games/play">
              <Button variant="primary" size="md" icon={ArrowRight} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none shadow-amber-500/20">
                Start Speed Drill
              </Button>
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-slate-900 to-brand-950 rounded-3xl p-6 text-white flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-300 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Why Speed Drills Matter</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In banking exams like SBI Clerk and IBPS PO Prelims, you have only 20 minutes for 35 quantitative aptitude questions. Daily drills improve your mental calculations, eliminating rough work delays.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-brand-200 mt-6">
            Tip: Practice squares up to 50, cubes up to 30, and fraction-to-percentage tables.
          </div>
        </div>
      </div>
    </div>
  );
}
