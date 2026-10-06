import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import QuestionCard from '../../components/quiz/QuestionCard';
import QuizTimer from '../../components/quiz/QuizTimer';
import QuizResult from '../../components/quiz/QuizResult';
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [question_id]: { selectedOptionId, textAnswer } }
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await quizService.getQuiz(id);
        setQuiz(data);
      } catch (err) {
        alert('Failed to load quiz');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  const handleSelectOption = (optId) => {
    const currentQ = quiz.questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        selectedOptionId: optId,
        textAnswer: null,
      },
    }));
  };

  const handleTextChange = (text) => {
    const currentQ = quiz.questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        selectedOptionId: null,
        textAnswer: text,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);

    const submissionPayload = {
      time_taken_seconds: timeTakenSeconds,
      answers: Object.keys(answers).map((qId) => ({
        question_id: parseInt(qId),
        selected_option_id: answers[qId].selectedOptionId,
        text_response: answers[qId].textAnswer,
      })),
    };

    try {
      const evaluation = await quizService.submitQuiz(quiz.id, submissionPayload);
      setResult(evaluation);
    } catch (err) {
      alert('Error submitting quiz answers');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);
    setTimeTakenSeconds(0);
  };

  if (loading) {
    return <Loader message="Loading quiz assessment..." />;
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
        <p className="text-slate-600">No questions found in this quiz.</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // If result is ready, display Result Summary & Detailed Review
  if (result) {
    const currentReviewQ = result.questions_review ? result.questions_review[currentIndex] : quiz.questions[currentIndex];
    const totalQ = result.questions_review ? result.questions_review.length : quiz.questions.length;

    return (
      <div className="space-y-8">
        <QuizResult result={result} onRetake={handleRetake} />

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Question-by-Question Detailed Review
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Question {currentIndex + 1} of {totalQ}
              </span>
            </div>
          </div>

          {/* Question Palette in Review */}
          <div className="flex flex-wrap gap-2">
            {result.questions_review?.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-xl font-bold text-xs border transition ${
                  currentIndex === idx
                    ? 'ring-2 ring-brand-500'
                    : ''
                } ${
                  q.is_user_correct
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : q.user_selected_option_id !== null || q.user_text_answer
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentReviewQ && (
            <QuestionCard
              question={currentReviewQ}
              index={currentIndex}
              total={totalQ}
              selectedOptionId={currentReviewQ.user_selected_option_id}
              userTextAnswer={currentReviewQ.user_text_answer}
              isReview={true}
            />
          )}

          {/* Review Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="md"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              icon={ChevronLeft}
            >
              Previous
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={currentIndex === totalQ - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(totalQ - 1, prev + 1))}
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const currentAnswer = answers[currentQ.id];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
            {quiz.title}
          </h1>
          <p className="text-xs text-slate-500">
            {quiz.subject} • {quiz.difficulty.toUpperCase()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <QuizTimer
            totalMinutes={quiz.time_limit_minutes || 15}
            onTimeUp={handleSubmit}
            onTick={(sec) => setTimeTakenSeconds((prev) => prev + 1)}
          />
          <Button
            variant="danger"
            size="sm"
            onClick={handleSubmit}
            loading={submitting}
            icon={CheckCircle2}
          >
            Submit Test
          </Button>
        </div>
      </div>

      {/* Question Palette Row */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2 shrink-0">
          Palette:
        </span>
        {quiz.questions.map((q, idx) => {
          const isAnswered = answers[q.id]?.selectedOptionId != null || answers[q.id]?.textAnswer;
          const isCurrent = currentIndex === idx;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-xl font-bold text-xs border shrink-0 transition ${
                isCurrent
                  ? 'border-brand-600 bg-brand-600 text-white shadow-sm ring-2 ring-brand-200'
                  : isAnswered
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Current Question Card */}
      <QuestionCard
        question={currentQ}
        index={currentIndex}
        total={totalQuestions}
        selectedOptionId={currentAnswer?.selectedOptionId}
        userTextAnswer={currentAnswer?.textAnswer}
        onSelectOption={handleSelectOption}
        onTextChange={handleTextChange}
      />

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="md"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          icon={ChevronLeft}
        >
          Previous
        </Button>

        {currentIndex === totalQuestions - 1 ? (
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            loading={submitting}
            icon={CheckCircle2}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Finish & Submit Quiz
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
