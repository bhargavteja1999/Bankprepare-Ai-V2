import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import confetti from 'canvas-confetti';
import { Zap, Timer, CheckCircle, XCircle, Award, RotateCcw, ArrowLeft } from 'lucide-react';

export default function GamePlay() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [drill, setDrill] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null); // { correct: boolean, chosen: int }

  useEffect(() => {
    const fetchDrill = async () => {
      try {
        setLoading(true);
        const data = await quizService.getSpeedChallenge();
        setDrill(data);
        setSecondsLeft(data.time_limit_seconds || 90);
      } catch (err) {
        alert('Failed to load drill');
        navigate('/games');
      } finally {
        setLoading(false);
      }
    };
    fetchDrill();
  }, [navigate]);

  useEffect(() => {
    if (isGameOver || !drill) return;
    if (secondsLeft <= 0) {
      handleEndGame();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, isGameOver, drill]);

  const handleEndGame = async () => {
    setIsGameOver(true);
    try {
      await quizService.submitGameScore({
        title: drill?.title || 'Speed Drill',
        score: score,
      });
      if (score > 200) {
        confetti({ particleCount: 100, spread: 70 });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnswer = (optIndex) => {
    if (feedback !== null || isGameOver) return;

    const currentQ = drill.questions[currentIndex];
    const isCorrect = optIndex === currentQ.correct_index;

    if (isCorrect) {
      setScore((prev) => prev + 100);
      setCorrectCount((prev) => prev + 1);
    }

    setFeedback({ correct: isCorrect, chosen: optIndex });

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < drill.questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        handleEndGame();
      }
    }, 700);
  };

  if (loading) {
    return <Loader message="Loading speed drill questions..." />;
  }

  if (isGameOver) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
          <Award className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Drill Completed!</h2>
          <p className="text-xs text-slate-500 mt-1">Great mental calculation sprint.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2">
          <p className="text-xs uppercase text-slate-400 font-bold">Total Score Earned</p>
          <div className="text-4xl font-black text-amber-400">{score} PTS</div>
          <p className="text-xs text-slate-300">{correctCount} of {drill.questions.length} Correct</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1"
            icon={RotateCcw}
            onClick={() => {
              setIsGameOver(false);
              setCurrentIndex(0);
              setScore(0);
              setCorrectCount(0);
              setSecondsLeft(drill.time_limit_seconds || 90);
            }}
          >
            Play Again
          </Button>
          <Link to="/games" className="flex-1">
            <Button variant="primary" className="w-full">
              Done
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = drill.questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Score: {score}
          </span>
          <span className="text-xs text-slate-400">
            Q {currentIndex + 1}/{drill.questions.length}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono font-bold text-sm bg-slate-100 px-3.5 py-1.5 rounded-full text-slate-800">
          <Timer className="w-4 h-4 text-amber-600" />
          <span>{secondsLeft}s</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center leading-snug">
          {currentQ.prompt}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900';
            if (feedback) {
              if (idx === currentQ.correct_index) {
                btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-900 font-bold';
              } else if (feedback.chosen === idx && !feedback.correct) {
                btnStyle = 'border-rose-500 bg-rose-100 text-rose-900 font-bold';
              }
            }

            return (
              <button
                key={idx}
                disabled={feedback !== null}
                onClick={() => handleAnswer(idx)}
                className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {feedback && idx === currentQ.correct_index && (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {feedback && feedback.chosen === idx && !feedback.correct && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
