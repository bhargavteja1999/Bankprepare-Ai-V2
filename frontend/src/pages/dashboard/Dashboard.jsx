import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { quizService } from '../../services/quizService';
import StatsCard from '../../components/dashboard/StatsCard';
import ProgressCard from '../../components/dashboard/ProgressCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import QuizCard from '../../components/quiz/QuizCard';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import {
  FileUp,
  Sparkles,
  Zap,
  Layers,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  ChevronRight,
  HelpCircle,
  TrendingUp
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analytics, quizList] = await Promise.all([
        quizService.getDashboardAnalytics(),
        quizService.listQuizzes()
      ]);
      setDashboardData(analytics);
      setQuizzes(quizList);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await quizService.deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } catch (err) {
      alert("Failed to delete quiz");
    }
  };

  if (loading) {
    return <Loader message="Loading your dashboard analytics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-brand-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-3 border border-brand-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Targeting: {user?.target_exam || 'IBPS / SBI PO'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.full_name || 'Aspirant'}! 🎯
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Transform banking study notes into mock questions, master weak topics, and track real-time exam readiness.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/documents">
              <Button variant="outline" size="sm" icon={FileUp} className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Upload Doc
              </Button>
            </Link>
            <Link to="/generate-quiz">
              <Button variant="primary" size="sm" icon={Sparkles} className="bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold">
                Generate AI Quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Tests Completed"
          value={dashboardData?.total_quizzes_taken || 0}
          subtitle="Mock attempts"
          icon={Award}
          color="brand"
        />
        <StatsCard
          title="Overall Accuracy"
          value={`${dashboardData?.average_accuracy || 0}%`}
          subtitle="Negative mark adjusted"
          icon={TrendingUp}
          color="emerald"
        />
        <StatsCard
          title="Practice Streak"
          value={`${dashboardData?.streak_days || 1} Days`}
          subtitle="Daily study consistency"
          icon={Flame}
          color="amber"
        />
        <StatsCard
          title="Flashcards Mastered"
          value={dashboardData?.flashcards_mastered || 0}
          subtitle="Spaced repetition cards"
          icon={Layers}
          color="purple"
        />
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/documents" className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-brand-500 hover:shadow-md transition group">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <FileUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition text-sm">Upload Study PDFs</h3>
          <p className="text-xs text-slate-500 mt-1">Upload syllabus guides, monthly capsules, or question banks.</p>
        </Link>

        <Link to="/games" className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-500 hover:shadow-md transition group">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition text-sm">60-Sec Speed Drill</h3>
          <p className="text-xs text-slate-500 mt-1">Sharpen mental calculation speed and formula recall.</p>
        </Link>

        <Link to="/flashcards" className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-purple-500 hover:shadow-md transition group">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition text-sm">Spaced Flashcards</h3>
          <p className="text-xs text-slate-500 mt-1">Revise banking terms, RBI committees, and financial shortcuts.</p>
        </Link>
      </div>

      {/* Main Content Grid: Recent Quizzes & Right Side Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Quizzes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-600" />
              <span>Available Quizzes & Mocks</span>
            </h2>
            <Link to="/generate-quiz" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <span>Create New</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {quizzes.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No Quizzes Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload a document or choose a banking topic to generate your first AI mock quiz in seconds.
              </p>
              <Link to="/generate-quiz">
                <Button variant="primary" size="sm" icon={Sparkles} className="mt-2">
                  Generate Your First Quiz
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.slice(0, 6).map((q) => (
                <QuizCard key={q.id} quiz={q} onDelete={handleDeleteQuiz} />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Subject Performance & Activity */}
        <div className="space-y-6">
          {/* Subject Mastery */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Subject Performance</span>
            </h3>
            {dashboardData?.subject_performances?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.subject_performances.map((perf, idx) => (
                  <ProgressCard
                    key={idx}
                    subject={perf.subject}
                    accuracy={perf.accuracy_percentage}
                    quizzesCount={perf.quizzes_taken}
                    questionsSolved={perf.total_questions}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                Take quizzes to see your subject-wise accuracy breakdown!
              </p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Recent Activity</span>
            </h3>
            <RecentActivity activities={dashboardData?.recent_activities} />
          </div>
        </div>
      </div>
    </div>
  );
}
