'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center shadow-xl">
          <ShieldAlert className="w-8 h-8 text-amber-400" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
            Authorization Required • Error 403
          </span>
          <h1 className="text-2xl font-black text-white">Access Restricted</h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            You don&apos;t have permission to access this page. This workspace is restricted to authorized roles (such as Administrative Governance, Institution Leaders, or Faculty Mentors).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-xs font-bold w-full sm:w-auto shadow-md">
              <LogIn className="w-4 h-4" /> Switch Account Role
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Safety
          </button>
        </div>
      </div>
    </div>
  );
}
