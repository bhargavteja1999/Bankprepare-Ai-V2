import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import QuizResultComponent from '../../components/quiz/QuizResult';
import Button from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

export default function QuizResultPage() {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>
      <QuizResultComponent result={result} />
    </div>
  );
}
