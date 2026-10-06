import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import { User, Mail, Target, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BANKING_EXAMS } from '../../utils/constants';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [targetExam, setTargetExam] = useState(user?.target_exam || 'IBPS PO');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    try {
      const payload = {
        full_name: fullName,
        target_exam: targetExam,
      };
      if (newPassword) payload.password = newPassword;

      const updated = await authService.updateProfile(payload);
      updateUser(updated);
      setSuccessMsg('Profile updated successfully!');
      setNewPassword('');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-brand-600" />
          <span>Candidate Profile & Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal information and exam target preferences.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Registered Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              disabled
              value={user?.email || ''}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Target Banking Exam
          </label>
          <div className="relative">
            <Target className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {BANKING_EXAMS.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Change Password (Optional)
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave empty to keep current password"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button type="submit" variant="primary" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
