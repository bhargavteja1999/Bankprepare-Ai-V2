import React from 'react';

export default function Loader({ message = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-brand-600/20 animate-pulse" />
        </div>
      </div>
      {message && <p className="mt-4 text-sm font-medium text-slate-600">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        {content}
      </div>
    );
  }

  return content;
}
