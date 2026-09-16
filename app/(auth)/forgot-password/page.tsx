'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Brain, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSent(true);
      }
    } catch (err: any) {
      setErrorMsg('Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-slate-700/80 p-0.5 flex items-center justify-center">
              <img src="/cyclops-icon.png" alt="Cyclops" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="text-xl font-black text-white">Cyclops</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
          <p className="text-xs text-slate-400">Enter your email to receive a password reset link</p>
        </div>

        {sent ? (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Password Reset Email Sent</h3>
            <p className="text-xs text-slate-300">Check your inbox ({email}) for instructions to reset your password.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <span>Sending Reset Link...</span> : <span>Send Reset Link</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
