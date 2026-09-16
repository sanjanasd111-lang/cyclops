'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Target,
  Brain,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function InterviewPreparationPage() {
  const [loading, setLoading] = useState(true);
  const [prepData, setPrepData] = useState<any>(null);

  useEffect(() => {
    async function loadPrepData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const res = await fetch('/api/student/interview/preparation');
          const data = await res.json();
          if (data.data) {
            setPrepData(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load preparation data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPrepData();
  }, []);

  if (loading || !prepData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
          <span className="text-lg font-medium text-slate-300">Loading Placement Preparation Intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase">
            <Target className="w-3.5 h-3.5" />
            <span>Target Role: {prepData.targetRole}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Placement Preparation Center</h1>
          <p className="text-slate-300 text-sm">
            Targeted weakness detection, resume defense prep, and domain topic recommendations grounded in your authenticated profile and assessments.
          </p>
        </div>

        <Link
          href="/student/interview"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2 whitespace-nowrap"
        >
          <Zap className="w-4 h-4" />
          <span>Practice Mock Interview</span>
        </Link>
      </div>

      {/* Readiness Dimension Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Interview Readiness', score: prepData.interviewReadiness, color: 'text-blue-400' },
          { label: 'Technical Core', score: prepData.technicalScore, color: 'text-indigo-400' },
          { label: 'Communication & Delivery', score: prepData.communicationScore, color: 'text-emerald-400' },
          { label: 'Resume Defense', score: prepData.resumeDefenseScore, color: 'text-amber-400' },
        ].map((item, idx) => (
          <div key={idx} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</div>
            <div className={`text-3xl font-bold ${item.color}`}>{item.score}%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-current h-full" style={{ width: `${item.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Weak Areas & Recommended Topics */}
        <div className="space-y-6">
          {/* Weak Areas Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Top Detected Weak Areas</h3>
            </div>
            <p className="text-xs text-slate-400">
              Areas identified from low skill proficiency or past mock interview evaluations requiring reinforcement:
            </p>
            <div className="space-y-2.5">
              {prepData.weakAreas.map((area: string, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 flex items-center justify-between text-xs text-amber-200">
                  <span className="font-semibold">{area}</span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">REINFORCE</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Topics */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Recommended Study Topics</h3>
            </div>
            <div className="space-y-2.5">
              {prepData.recommendedTopics.map((topic: string, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center space-x-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded bg-blue-500/10 text-blue-400 font-bold flex items-center justify-center text-[11px]">{idx + 1}</div>
                  <span className="font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Resume Defense & Practice Questions */}
        <div className="space-y-6">
          {/* Resume & Projects Defense */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
              <FileText className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Resume Projects to Defense</h3>
            </div>
            <p className="text-xs text-slate-400">
              Be prepared to explain architectural choices, trade-offs, and metrics for your actual projects:
            </p>
            <div className="space-y-2.5">
              {prepData.projectsToPrepare.map((proj: string, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-xs text-indigo-200 font-medium">
                  • {proj}
                </div>
              ))}
            </div>
          </div>

          {/* Sample Questions */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Practice Sample Prompts</h3>
            </div>
            <div className="space-y-3">
              {prepData.practiceQuestions.map((q: string, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="text-xs font-bold text-slate-300">Prompt {idx + 1}</div>
                  <div className="text-xs text-slate-200 leading-relaxed font-mono">{`"${q}"`}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
