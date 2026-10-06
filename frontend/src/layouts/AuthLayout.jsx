import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Landmark, Sparkles, CheckCircle2, ShieldCheck, Target } from 'lucide-react';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left Hero Side */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 via-brand-950 to-brand-900 text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background decorative glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-300 text-slate-950 font-bold shadow-lg shadow-brand-500/30">
              <Landmark className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">BankPrepare AI</span>
          </div>

          <div className="mt-16 md:mt-24 space-y-4 max-w-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Exam Preparation
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Transform PDFs & Study Notes into Interactive Banking Quizzes
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Master SBI PO, IBPS PO, and RBI Grade B concepts through AI-generated mock tests, real-time negative marking, and automated spaced-repetition flashcards.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-12 space-y-3 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Standard Banking Exam 0.25 negative marking engine</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Syllabus mapped for Quant, Reasoning, English & GA</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant detailed explanations with references</span>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
