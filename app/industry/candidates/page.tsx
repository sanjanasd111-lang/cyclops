"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserCheck, Target, Search, ArrowRight, ShieldCheck, CheckCircle2, Award, GraduationCap } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function CandidateDiscoveryPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [opportunity, setOpportunity] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/industry/candidates');
      const data = await res.json();
      if (data.success) {
        setCandidates(data.data || []);
        setOpportunity(data.opportunity);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter((c) =>
    c.profile.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.profile.academic_stream.toLowerCase().includes(search.toLowerCase()) ||
    c.profile.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalLayout role="INDUSTRY">
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[11px] font-mono text-emerald-400">
              <Target className="h-3.5 w-3.5" /> Deterministic 7-Tier Candidate Discovery
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">Candidate Talent Ranking</h1>
            <p className="text-xs text-slate-400">Target Role: <strong className="text-white">{opportunity?.title || 'Clinical Research Associate Intern'}</strong></p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name or branch..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Candidate List */}
        <div className="space-y-3">
          {filteredCandidates.map((c, i) => (
            <Card key={c.profile.id} className="border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white font-black text-sm">
                    #{i + 1}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{c.profile.full_name}</h3>
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{c.profile.degree} • {c.profile.institution_name}</span>
                    </p>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      <Badge variant="emerald" className="text-[10px]">{c.profile.academic_stream}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{c.profile.department}</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-3xl font-black text-emerald-400 font-mono">{c.match_score}%</div>
                    <div className="text-[9px] uppercase font-mono text-slate-400">Match Compatibility</div>
                  </div>

                  <Link href={`/industry/candidates/${c.profile.id}`}>
                    <Button variant="emerald" size="sm" className="gap-1 font-bold text-xs">
                      <span>View Full Profile</span> <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>

              </div>

              {/* Match Explanation Bar */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="text-emerald-400 font-mono font-bold text-[10px]">WHY THIS RANKING?</span>
                <div className="flex flex-wrap gap-3 text-[11px] text-slate-300">
                  <span>• Skill Match: <strong className="text-emerald-400">{c.match_breakdown.skillScore}%</strong></span>
                  <span>• Education Fit: <strong className="text-white">{c.match_breakdown.educationScore}%</strong></span>
                  <span>• Project Relevance: <strong className="text-white">{c.match_breakdown.projectScore}%</strong></span>
                  {c.match_breakdown.missingSkills?.length > 0 && (
                    <span className="text-amber-400">• Development Gap: {c.match_breakdown.missingSkills[0].skillName} (-{c.match_breakdown.missingSkills[0].gap} pts)</span>
                  )}
                </div>
              </div>

            </Card>
          ))}
        </div>

      </div>
    </PortalLayout>
  );
}
