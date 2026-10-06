import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { documentService } from '../../services/documentService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import {
  Sparkles,
  HelpCircle,
  Clock,
  Award,
  Layers,
  FileText,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { BANKING_SUBJECTS, DIFFICULTY_LEVELS } from '../../utils/constants';

export default function GenerateQuiz() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(searchParams.get('document_id') || '');
  const [topic, setTopic] = useState(searchParams.get('topic') || 'RBI Monetary Policy & Inflation Control');
  const [subject, setSubject] = useState(searchParams.get('subject') || 'General/Banking Awareness');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLimit, setTimeLimit] = useState(10);
  const [negativeMarking, setNegativeMarking] = useState(0.25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await documentService.listDocuments();
        setDocuments(docs);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDocs();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        document_id: selectedDocId ? parseInt(selectedDocId) : null,
        topic,
        subject,
        num_questions: parseInt(numQuestions),
        difficulty,
        time_limit_minutes: parseInt(timeLimit),
        negative_marking: parseFloat(negativeMarking),
        question_types: ['mcq', 'true_false'],
      };

      const quiz = await quizService.generateQuiz(payload);
      navigate(`/take-quiz/${quiz.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-brand-600" />
          <span>AI Mock Quiz Generator</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Generate rigorous, exam-pattern questions tailored for PO/Clerk prelims and mains.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleGenerate} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Document Selection (Optional) */}
        {documents.length > 0 && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>Source Document (Optional)</span>
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => {
                setSelectedDocId(e.target.value);
                const doc = documents.find(d => String(d.id) === e.target.value);
                if (doc) {
                  setTopic(doc.title);
                  setSubject(doc.subject);
                }
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="">-- No Document (Generate directly from Topic) --</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.subject})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Topic Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Quiz Topic / Chapter Name
          </label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Syllogism 'Only a Few', Quadratic Equations, RBI Repo Rate"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Subject and Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Subject Area
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {BANKING_SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Difficulty Tier
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {DIFFICULTY_LEVELS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Parameters: Num Questions, Time, Negative Marking */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Number of Questions
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Time Limit (Minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Negative Marking
            </label>
            <select
              value={negativeMarking}
              onChange={(e) => setNegativeMarking(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="0.25">0.25 (Standard Banking)</option>
              <option value="0.33">0.33 (SSC / Railways)</option>
              <option value="0.0">No Negative Marking</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Generates MCQs with immediate feedback, detailed steps & references.
          </p>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={Sparkles}
            className="w-full sm:w-auto"
          >
            Generate & Launch Quiz
          </Button>
        </div>
      </form>
    </div>
  );
}
