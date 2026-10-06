import React, { useEffect, useState } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

export default function QuizTimer({ totalMinutes, onTimeUp, onTick }) {
  const [secondsLeft, setSecondsLeft] = useState((totalMinutes || 15) * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (onTick) onTick(next);
        if (next <= 0) {
          clearInterval(interval);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onTimeUp, onTick]);

  const isLowTime = secondsLeft < 120; // under 2 minutes

  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-sm font-bold border transition-colors ${
        isLowTime
          ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
          : 'bg-slate-100 text-slate-800 border-slate-200'
      }`}
    >
      {isLowTime ? (
        <AlertTriangle className="w-4 h-4 text-rose-600" />
      ) : (
        <Timer className="w-4 h-4 text-brand-600" />
      )}
      <span>{formatDuration(secondsLeft)}</span>
    </div>
  );
}
