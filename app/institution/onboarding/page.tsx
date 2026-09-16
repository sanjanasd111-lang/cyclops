'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, ArrowRight } from 'lucide-react';

export default function InstitutionOnboardingPage() {
  const router = useRouter();
  const [instName, setInstName] = useState('RUAS Institute of Technology');
  const [type, setType] = useState('State University / UGC Accredited');

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/institution/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans">
      <form onSubmit={handleFinish} className="w-full max-w-lg p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-teal-400" />
            <span>Institution Administration Setup</span>
          </h2>
          <p className="text-xs text-slate-400">Configure university metrics and placement intelligence settings</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Institution Name</label>
            <input
              type="text"
              required
              value={instName}
              onChange={(e) => setInstName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Institution Category</label>
            <input
              type="text"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <span>Open Placement Command Center</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
