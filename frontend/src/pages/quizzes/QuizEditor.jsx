import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import Button from '../../components/common/Button';
import { Plus, Trash2, CheckCircle2, Save, HelpCircle } from 'lucide-react';
import { BANKING_SUBJECTS } from '../../utils/constants';

export default function QuizEditor() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Quantitative Aptitude');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLimit, setTimeLimit] = useState(15);
  const [negativeMarking, setNegativeMarking] = useState(0.25);
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState([
    {
      question_text: '',
      marks: 1.0,
      negative_marks: 0.25,
      explanation: '',
      options: [
        { option_text: '', is_correct: true },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ],
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question_text: '',
        marks: 1.0,
        negative_marks: negativeMarking,
        explanation: '',
        options: [
          { option_text: '', is_correct: true },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index][field] = value;
      return next;
    });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex].options[optIndex].option_text = value;
      return next;
    });
  };

  const handleSetCorrectOption = (qIndex, optIndex) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex].options = next[qIndex].options.map((opt, i) => ({
        ...opt,
        is_correct: i === optIndex,
      }));
      return next;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title) {
      alert('Please provide a quiz title');
      return;
    }
    setLoading(true);

    try {
      const payload = {
        title,
        subject,
        topic: topic || 'Custom Practice',
        difficulty,
        time_limit_minutes: parseInt(timeLimit),
        negative_marking: parseFloat(negativeMarking),
        questions,
      };

      const created = await quizService.createManualQuiz(payload);
      navigate(`/take-quiz/${created.id}`);
    } catch (err) {
      alert('Failed to save manual quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-brand-600" />
          <span>Manual Quiz & Question Editor</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Craft custom mock tests and sectional exercises manually.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Quiz Meta */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. IBPS PO Mains Reasoning Sectional 1"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Subject
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
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                  Question #{qIdx + 1}
                </span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Question Statement
                </label>
                <textarea
                  rows={2}
                  required
                  value={q.question_text}
                  onChange={(e) => handleQuestionChange(qIdx, 'question_text', e.target.value)}
                  placeholder="Enter problem statement..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600">
                  Choices (Click radio to mark correct option)
                </label>
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct_opt_${qIdx}`}
                      checked={opt.is_correct}
                      onChange={() => handleSetCorrectOption(qIdx, optIdx)}
                      className="w-4 h-4 text-brand-600"
                    />
                    <input
                      type="text"
                      required
                      value={opt.option_text}
                      onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                      className={`flex-1 px-3 py-2 border rounded-xl text-sm ${
                        opt.is_correct ? 'border-brand-500 bg-brand-50/30' : 'border-slate-200'
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Solution Explanation
                </label>
                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                  placeholder="Step-by-step reasoning or formula used..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button type="button" variant="outline" onClick={handleAddQuestion} icon={Plus}>
            Add Another Question
          </Button>
          <Button type="submit" variant="primary" size="lg" loading={loading} icon={Save}>
            Save & Publish Quiz
          </Button>
        </div>
      </form>
    </div>
  );
}
