'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  BarChart3,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

export default function CandidateComparisonPage() {
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/recruitment/candidates/compare?opportunityId=opp-tech-01').then((r) => r.json());
        if (res.data) setComparison(res.data);
      } catch (err) {
        console.error('Failed to load comparison data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !comparison) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3 text-slate-300">
          <BarChart3 className="w-8 h-8 text-teal-400 animate-pulse" />
          <span className="text-lg font-medium">Computing Side-by-Side Candidate Match Matrix...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      <Link href="/industry/candidates" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Candidates Pool</span>
      </Link>

      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
        <h1 className="text-3xl font-black text-white flex items-center space-x-3">
          <BarChart3 className="w-7 h-7 text-teal-400" />
          <span>Candidate Comparison Matrix ({comparison.opportunityTitle})</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Compare candidate match scores, verified skills, projects, certifications, ATS scores, and interview performance side-by-side.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comparison.candidates?.map((cand: any, idx: number) => (
          <div key={idx} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{cand.student?.full_name || 'Aditi Sharma'}</h3>
                <div className="text-xs text-slate-400">{cand.student?.academic_stream || 'Computer Science'}</div>
              </div>
              <div className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-black text-sm">
                {cand.matchScore}% Match
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                <span className="text-slate-400 font-medium">Skills Match: </span>
                <span className="font-bold text-white">{cand.skillsMatchPercent}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                <span className="text-slate-400 font-medium">ATS Resume Score: </span>
                <span className="font-bold text-white">{cand.atsScore}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                <span className="text-slate-400 font-medium">Projects Score: </span>
                <span className="font-bold text-white">{cand.projectsMatchPercent}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                <span className="text-slate-400 font-medium">Interview Readiness: </span>
                <span className="font-bold text-white">{cand.interviewReadinessScore}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-emerald-400">Matched Skills</div>
              <div className="flex flex-wrap gap-1">
                {cand.matchedSkills?.map((s: string) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-medium border border-emerald-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
