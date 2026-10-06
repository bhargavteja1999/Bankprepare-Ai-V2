import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p>© 2026 BankPrepare AI. Built for Bank PO & Clerk aspirants.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span>AI-Powered Prep</span>
          <span>•</span>
          <span>Adaptive Testing</span>
          <span>•</span>
          <span>Performance Analytics</span>
        </div>
      </div>
    </footer>
  );
}
