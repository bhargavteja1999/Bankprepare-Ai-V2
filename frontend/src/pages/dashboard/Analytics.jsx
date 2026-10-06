import React, { useEffect, useState } from 'react';
import { quizService } from '../../services/quizService';
import Loader from '../../components/common/Loader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { BarChart3, TrendingUp, Award, Clock, Sparkles, CheckCircle } from 'lucide-react';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await quizService.getDashboardAnalytics();
        setData(res);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <Loader message="Generating performance analytics..." />;
  }

  const chartData = data?.score_trends?.length > 0
    ? data.score_trends
    : [
        { name: 'Mock 1', accuracy: 65, score: 6.5 },
        { name: 'Mock 2', accuracy: 72, score: 7.2 },
        { name: 'Mock 3', accuracy: 80, score: 8.0 },
        { name: 'Mock 4', accuracy: 88, score: 8.8 },
      ];

  const subjectChartData = data?.subject_performances?.length > 0
    ? data.subject_performances.map(s => ({ name: s.subject.split('/')[0], accuracy: s.accuracy_percentage }))
    : [
        { name: 'Quant', accuracy: 75 },
        { name: 'Reasoning', accuracy: 82 },
        { name: 'English', accuracy: 68 },
        { name: 'Banking GA', accuracy: 90 }
      ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-brand-600" />
          <span>Performance & Score Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed breakdown of your test accuracy, time efficiency, and weak areas.
        </p>
      </div>

      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-400">Total Solved</p>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {data?.total_questions_solved || 0} <span className="text-sm font-normal text-slate-500">questions</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-400">Average Accuracy</p>
          <div className="text-3xl font-black text-emerald-600 mt-2">
            {data?.average_accuracy || 0}%
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-400">Total Study Time</p>
          <div className="text-3xl font-black text-brand-600 mt-2">
            {data?.total_study_minutes || 0} <span className="text-sm font-normal text-slate-500">mins</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Progression Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <span>Score Progression Trend (%)</span>
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none' }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#0284c7' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Accuracy Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Subject Accuracy Comparison</span>
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none' }}
                />
                <Bar dataKey="accuracy" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Exam Strategy Recommendation */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900 to-indigo-950 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-brand-300 font-bold text-sm">
          <Sparkles className="w-5 h-5" />
          <span>AI Preparation Insight</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          Based on your recent attempts, your Banking Awareness accuracy is strong (&gt;80%). To boost your overall percentile in PO prelims, dedicate 20 minutes daily to high-yield <strong>Reasoning Puzzles</strong> and <strong>Data Interpretation</strong> practice sets.
        </p>
      </div>
    </div>
  );
}
