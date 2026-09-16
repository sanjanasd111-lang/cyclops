"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, Search, MapPin, Clock, ArrowRight, Building2, CheckCircle2, AlertTriangle, Sparkles, X, Info, ShieldCheck, DollarSign, Calendar } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Opportunity, StudentProfile, UserSkill } from '@/lib/types';

export default function StudentOpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatchExplain, setSelectedMatchExplain] = useState<any | null>(null);

  useEffect(() => {
    fetchPersonalizedFeed();
  }, []);

  const fetchPersonalizedFeed = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/opportunities');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOpportunities(data.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter((item) => {
    const opp = item.opp || item;
    const matchesSearch =
      opp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || opp.opportunity_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <PortalLayout role="STUDENT">
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[11px] font-mono text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" /> Personalized Intelligence Feed
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">Opportunity Intelligence & Matching</h1>
            <p className="text-xs text-slate-400">Opportunities calculated dynamically against your verified skills, branch, readiness, and target career goal.</p>
          </div>
          <Link href="/student/copilot">
            <Button variant="outline" size="sm" className="gap-1.5 border-slate-800 text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Ask AI Copilot</span>
            </Button>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, organization, skills, or city..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs overflow-x-auto">
            {['ALL', 'INTERNSHIP', 'JOB', 'INDUSTRIAL_TRAINING'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium whitespace-nowrap ${
                  filterType === type ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === 'ALL' ? 'All Opportunities' : type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Feed Cards List */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs font-mono">
            Calculating personalized candidate match scores against database listings...
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <Card className="p-8 text-center bg-slate-900/50 border-slate-800 text-slate-400 text-xs">
            No opportunities match your current filter parameters.
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOpportunities.map((item) => {
              const opp: Opportunity = item.opp || item;
              const matchScore: number = item.matchScore ?? item.match_score ?? 0;
              const rawBreakdown = item.breakdown || item.match_breakdown || {};
              const breakdown = {
                skillScore: rawBreakdown.skillScore ?? 0,
                educationScore: rawBreakdown.educationScore ?? 0,
                projectScore: rawBreakdown.projectScore ?? 0,
                certScore: rawBreakdown.certScore ?? rawBreakdown.certificationScore ?? 0,
                expScore: rawBreakdown.expScore ?? rawBreakdown.experienceScore ?? 0,
                locationScore: rawBreakdown.locationScore ?? 0,
              };
              const matchedSkills: string[] = (
                item.matchedSkills ||
                (Array.isArray(rawBreakdown.matchedSkills)
                  ? rawBreakdown.matchedSkills.map((s: any) => typeof s === 'string' ? s : s.skillName)
                  : [])
              );
              const missingSkills: string[] = (
                item.missingSkills ||
                (Array.isArray(rawBreakdown.missingSkills)
                  ? rawBreakdown.missingSkills.map((s: any) => typeof s === 'string' ? s : s.skillName)
                  : [])
              );

              const isInternal = !opp.source || opp.source === 'INTERNAL' || opp.source.includes('Cyclops') || opp.source.includes('AYUSHSetu');
              const sourceLabel = isInternal ? 'Posted by Cyclops Industry Partner' : `Source: ${opp.source}`;

              return (
                <Card key={opp.id} className="border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl card-hover-lift transition-all">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="border-slate-700 text-slate-300 font-mono text-[10px]">
                          {opp.opportunity_type}
                        </Badge>
                        <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" /> {opp.company_name}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                          isInternal ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {sourceLabel}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{opp.title}</h3>
                    </div>

                    {/* Match Score Display */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedMatchExplain({ opp, matchScore, breakdown, matchedSkills, missingSkills })}
                        className="text-left bg-slate-950 hover:bg-slate-800/80 p-2 rounded-lg border border-slate-800 transition-colors group cursor-pointer"
                      >
                        <div className="text-xl font-black text-emerald-400 font-mono group-hover:scale-105 transition-transform flex items-center gap-1">
                          {matchScore}%
                          <Info className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400" />
                        </div>
                        <div className="text-[9px] uppercase font-mono text-emerald-500/90 font-bold underline">Why am I a {matchScore}% match?</div>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{opp.description}</p>

                  {/* Required Skills Chips */}
                  {opp.required_skills && opp.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 font-mono mr-1">Required Skills:</span>
                      {opp.required_skills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-950 text-slate-300 border border-slate-800 rounded text-[11px]">
                          {s.skill_name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer details & Action */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/60 text-xs">
                    <div className="flex flex-wrap items-center gap-4 text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-500" /> {opp.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-500" /> {opp.duration_months || 3} Months</span>
                      <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" /> Stipend: ₹{(opp.stipend_amount || 15000).toLocaleString()}/mo
                      </span>
                      {opp.application_deadline && (
                        <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <Calendar className="h-3 w-3" /> Deadline: {opp.application_deadline}
                        </span>
                      )}
                    </div>

                    <Link href={`/student/opportunities/${opp.id}`}>
                      <Button variant="emerald" size="sm" className="gap-1 font-bold">
                        <span>View Opportunity & Apply</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Explainable Match Modal */}
        {selectedMatchExplain && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="bg-slate-900 border-slate-800 text-white max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setSelectedMatchExplain(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-mono text-[10px]">
                  Explainable Matching Engine
                </Badge>
              </div>

              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">{selectedMatchExplain.opp.title}</h3>
                <p className="text-xs text-slate-400">{selectedMatchExplain.opp.company_name} • {selectedMatchExplain.opp.location}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-mono">Overall Deterministic Match</div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">{selectedMatchExplain.matchScore}%</div>
                </div>
                <Badge className="bg-emerald-950 text-emerald-300 border-emerald-700">7-Tier Weighted Breakdown</Badge>
              </div>

              {/* Breakdown Dimension Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Skill Compatibility:</span>
                  <span className="font-bold font-mono text-emerald-400">{selectedMatchExplain.breakdown.skillScore}%</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Education Eligibility:</span>
                  <span className="font-bold font-mono text-emerald-400">{selectedMatchExplain.breakdown.educationScore}%</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Project Relevance:</span>
                  <span className="font-bold font-mono text-indigo-400">{selectedMatchExplain.breakdown.projectScore}%</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Certification Relevance:</span>
                  <span className="font-bold font-mono text-indigo-400">{selectedMatchExplain.breakdown.certScore}%</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Experience:</span>
                  <span className="font-bold font-mono text-blue-400">{selectedMatchExplain.breakdown.expScore}%</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Location Compatibility:</span>
                  <span className="font-bold font-mono text-blue-400">{selectedMatchExplain.breakdown.locationScore}%</span>
                </div>
              </div>

              {/* Matched vs Missing Skills Lists */}
              <div className="space-y-2 pt-1 text-xs">
                <div>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Matched Skills:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedMatchExplain.matchedSkills.length > 0 ? (
                      selectedMatchExplain.matchedSkills.map((s: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-emerald-950/80 text-emerald-200 border border-emerald-800 rounded text-[11px]">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">None matched</span>
                    )}
                  </div>
                </div>

                {selectedMatchExplain.missingSkills.length > 0 && (
                  <div>
                    <span className="font-semibold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Missing / Weak Skills:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedMatchExplain.missingSkills.map((s: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-amber-950/80 text-amber-200 border border-amber-800 rounded text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                <span className="text-indigo-400 font-bold">Action Tip:</span> Improve these missing skills in your Learning Roadmap to increase your candidate match score.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedMatchExplain(null)}>
                  Close
                </Button>
                <Link href={`/student/opportunities/${selectedMatchExplain.opp.id}`}>
                  <Button variant="emerald" size="sm">
                    View Opportunity Details
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}

      </div>
    </PortalLayout>
  );
}
