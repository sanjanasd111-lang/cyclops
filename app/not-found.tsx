'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, Home, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-center shadow-2xl">
          <Compass className="w-10 h-10 text-emerald-400 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
            Error 404 • Page Not Found
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Lost in the Ecosystem?
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            The page or workspace resource you requested could not be located on the platform. It may have been relocated or updated.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-xs font-bold w-full sm:w-auto shadow-md">
              <Home className="w-4 h-4" /> Go to Dashboard
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </button>
        </div>

        <div className="pt-8 border-t border-slate-900 text-[11px] font-mono text-slate-600">
          Cyclops Platform • Verified Academic Infrastructure
        </div>
      </div>
    </div>
  );
}
