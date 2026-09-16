'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled platform runtime exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-red-950/50 border border-red-500/30 flex items-center justify-center shadow-xl">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400">
            System Diagnostics • Error 500
          </span>
          <h1 className="text-2xl font-black text-white">Temporary Service Disruption</h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred while processing this request. Your data and session credentials remain safe.
          </p>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-left text-xs font-mono text-slate-400 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Diagnostic Details:</span>
          <p className="text-red-300 break-words">{error.message || 'Unknown application exception'}</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-xs font-bold shadow-md"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            >
              <Home className="w-4 h-4" /> Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
