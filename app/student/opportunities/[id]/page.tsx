"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Building2, Calendar, FileText, Send, X, HelpCircle, Lightbulb } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResumeRecord } from '@/lib/types';

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [showSmartApply, setShowSmartApply] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunityDetails();
    fetchStudentResumes();
  }, [params.id]);

  const fetchOpportunityDetails = async () => {
    try {
      const res = await fetch(`/api/opportunities/${params.id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOpportunity(data.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentResumes = async () => {
    try {
      const res = await fetch('/api/student/resume');
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : data.data?.resumes || [];
      if (list.length > 0) {
        setResumes(list);
        const defaultRes = list.find((r: ResumeRecord) => r.is_default) || list[0];
        setSelectedResumeId(defaultRes.id);
      }
    } catch {
      // Baseline
    }
  };

  const handleFetchAiAnalysis = async () => {
    setShowAiAssistant(true);
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/opportunity/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: params.id }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiAnalysis(data.data.analysis);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSmartApplySubmit = async () => {
    if (!opportunity) return;
    setApplying(true);
    setApplyMessage(null);
    setIsError(false);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity_id: opportunity.id,
          resume_id: selectedResumeId || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        try {
          const confetti = (await import('canvas-confetti')).default;
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#34D399', '#3B82F6', '#F59E0B'],
          });
        } catch {
          // Non-blocking fallback
        }
        setApplyMessage('Application submitted successfully! Redirecting to applications tracker...');
        setShowSmartApply(false);
        setTimeout(() => router.push('/student/applications'), 1500);
      } else {
        setIsError(true);
        setApplyMessage(data.error || 'Failed to submit application.');
      }
    } catch {
      setIsError(true);
      setApplyMessage('Network error submitting application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout role="STUDENT">
        <div className="p-8 text-center text-xs text-slate-400 font-mono">Loading opportunity details...</div>
      </PortalLayout>
    );
  }

  if (!opportunity) {
    return (
      <PortalLayout role="STUDENT">
        <div className="p-8 text-center text-xs text-slate-400 space-y-3 max-w-md mx-auto">
          <AlertCircle className="h-8 w-8 text-amber-400 mx-auto" />
          <p>Opportunity not found or no longer active.</p>
          <Link href="/student/opportunities">
            <Button variant="outline" size="sm" className="text-xs">Return to Opportunities</Button>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const matchScore = opportunity.match_score || 85;
  const breakdown = opportunity.match_breakdown || {
    skillScore: 85,
    educationScore: 100,
    projectScore: 80,
    certScore: 75,
    expScore: 80,
    locationScore: 90,
  };
  const reqSkills = opportunity.required_skills || [];
  const prefSkills = opportunity.preferred_skills || [];

  const selectedResume = resumes.find(r => r.id === selectedResumeId) || resumes[0];
  const isInternal = !opportunity.source || opportunity.source === 'INTERNAL' || opportunity.source.includes('Cyclops') || opportunity.source.includes('AYUSHSetu');

  return (
    <PortalLayout role="STUDENT">
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link href="/student/opportunities" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities Feed
        </Link>

        {/* Opportunity Header Card */}
        <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-slate-700 text-slate-300 font-mono text-[10px]">
                  {opportunity.opportunity_type}
                </Badge>
                <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" /> {opportunity.company_name}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                  isInternal ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {isInternal ? 'Posted by Cyclops Industry Partner' : `Source: ${opportunity.source}`}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">{opportunity.title}</h1>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right">
              <div className="text-3xl font-black text-emerald-400 font-mono">{matchScore}%</div>
              <div className="text-[9px] uppercase font-mono text-slate-400">Match Compatibility</div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{opportunity.description}</p>

          {applyMessage && (
            <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
              isError ? 'border-amber-500/40 bg-amber-950/40 text-amber-300' : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
            }`}>
              {isError ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
              <span>{applyMessage}</span>
            </div>
          )}

          {/* Key Facts & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-500" /> {opportunity.location}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-500" /> {opportunity.duration_months || 3} Months</span>
              <span className="font-mono text-emerald-400 font-bold">Stipend: ₹{(opportunity.stipend_amount || 15000).toLocaleString()}/mo</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFetchAiAnalysis}
                className="gap-1 text-xs border-indigo-800 text-indigo-300 hover:bg-indigo-950"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Prepare My Application
              </Button>
              <Button
                variant="emerald"
                size="sm"
                onClick={() => setShowSmartApply(true)}
                className="gap-1.5 font-bold text-xs"
              >
                <Send className="h-3.5 w-3.5" /> Apply Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Detailed Grid: Opportunity Info vs YOUR MATCH Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Role Details */}
          <div className="md:col-span-2 space-y-4">
            <Card className="border-slate-800 bg-slate-900/90 p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Responsibilities & Key Tasks</h3>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                <li>Execute core workflows in alignment with {opportunity.title} protocols.</li>
                <li>Collaborate with cross-functional teams at {opportunity.company_name}.</li>
                <li>Maintain documentation and quality standards across all project deliverables.</li>
              </ul>
            </Card>

            <Card className="border-slate-800 bg-slate-900/90 p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Eligibility & Academic Requirements</h3>
              <p className="text-xs text-slate-300">{opportunity.eligibility || 'Open to all relevant branch candidates.'}</p>
            </Card>

            <Card className="border-slate-800 bg-slate-900/90 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Required Skills &amp; Profile Alignment</h3>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {breakdown.matchedSkills?.length || 0} of {reqSkills.length} Matched
                </span>
              </div>

              {/* Matched in Student Profile */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Matched In Your Profile:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {breakdown.matchedSkills && breakdown.matchedSkills.length > 0 ? (
                    breakdown.matchedSkills.map((s: any, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 rounded text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {s.skillName || s} ({s.studentScore ? `${s.studentScore}%` : 'Verified'})
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No direct skill matches found in your profile.</span>
                  )}
                </div>
              </div>

              {/* Missing / Skill Gaps */}
              {breakdown.missingSkills && breakdown.missingSkills.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                  <div className="text-[11px] font-semibold text-amber-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> Recommended Skills to Add:
                    </span>
                    <Link href="/student/profile" className="text-[10px] text-indigo-400 hover:underline">
                      + Add to Profile
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {breakdown.missingSkills.map((s: any, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-amber-950/40 text-amber-300 border border-amber-800/50 rounded text-xs font-semibold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {s.skillName || s} (Req: {s.requiredScore || 70}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: YOUR MATCH Card */}
          <div className="space-y-4">
            <Card className="border-emerald-500/30 bg-slate-900/90 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">YOUR MATCH</h3>
                <Badge className="bg-emerald-950 text-emerald-300 border-emerald-700">{matchScore}%</Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Skill Compatibility:</span>
                  <span className="font-mono font-bold text-emerald-400">{breakdown.skillScore}%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Education Eligibility:</span>
                  <span className="font-mono font-bold text-emerald-400">{breakdown.educationScore}%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Project Relevance:</span>
                  <span className="font-mono font-bold text-indigo-400">{breakdown.projectScore}%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Resume Compatibility:</span>
                  <span className="font-mono font-bold text-purple-400">{selectedResume ? `${selectedResume.ats_score}/100` : '75/100'}</span>
                </div>
              </div>

              {breakdown.reasons && breakdown.reasons.length > 0 && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-mono text-slate-500 text-[10px] uppercase">Match Rationale:</div>
                  <p className="text-emerald-300/90 leading-tight">
                    • {breakdown.reasons[0]}
                  </p>
                </div>
              )}

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] space-y-1">
                <div className="text-slate-400 font-mono">Selected Resume for Application:</div>
                <div className="font-bold text-white text-xs">{selectedResume?.name || 'Default Resume'}</div>
              </div>

              <Button
                variant="emerald"
                size="sm"
                onClick={() => setShowSmartApply(true)}
                className="w-full font-bold text-xs gap-1"
              >
                <Send className="h-3.5 w-3.5" /> Apply with Selected Resume
              </Button>
            </Card>
          </div>
        </div>

        {/* Smart Apply Modal */}
        {showSmartApply && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="bg-slate-900 border-slate-800 text-white max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <button onClick={() => setShowSmartApply(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>

              <div className="border-b border-slate-800 pb-3">
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-mono text-[10px] mb-1">
                  Smart Apply Preview
                </Badge>
                <h3 className="text-lg font-bold text-white">{opportunity.title}</h3>
                <p className="text-xs text-slate-400">{opportunity.company_name}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-medium">Select Resume Version:</label>
                  {resumes.length > 0 ? (
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} (ATS Score: {r.ats_score}/100)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-amber-400 text-[11px] mt-1">Default Profile Resume will be submitted.</p>
                  )}
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Match Compatibility:</span>
                    <span className="text-emerald-400 font-bold">{matchScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Resume ATS Score:</span>
                    <span className="text-purple-400 font-bold">{selectedResume?.ats_score || 75}/100</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowSmartApply(false)}>
                  Cancel
                </Button>
                <Button variant="emerald" size="sm" onClick={handleSmartApplySubmit} disabled={applying}>
                  {applying ? 'Submitting...' : 'Confirm Application'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* AI Application Assistant Modal */}
        {showAiAssistant && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="bg-slate-900 border-slate-800 text-white max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
              <button onClick={() => setShowAiAssistant(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <div>
                  <h3 className="text-base font-bold text-white">AI Application & Interview Preparation Assistant</h3>
                  <p className="text-xs text-slate-400">Grounded coaching for {opportunity.title}</p>
                </div>
              </div>

              {loadingAi ? (
                <div className="p-8 text-center text-xs text-slate-400 font-mono">
                  Analyzing opportunity keywords against your database profile...
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-4 text-xs">
                  <div className="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-800/50 space-y-1.5">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <Lightbulb className="h-4 w-4 text-amber-400" /> Why You Fit:
                    </span>
                    <p className="text-slate-200 leading-relaxed">{aiAnalysis.applicationAdvice}</p>
                  </div>

                  {/* Real-Time Competencies Found vs Gaps */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {breakdown.matchedSkills && breakdown.matchedSkills.length > 0 && (
                      <div className="p-3 bg-slate-950 rounded-lg border border-emerald-900/40 space-y-1.5">
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Profile Strengths:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {breakdown.matchedSkills.map((s: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-[10px] bg-emerald-950/50 text-emerald-300 border-emerald-800">
                              {s.skillName || s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiAnalysis.skillGaps && aiAnalysis.skillGaps.length > 0 && (
                      <div className="p-3 bg-slate-950 rounded-lg border border-amber-900/40 space-y-1.5">
                        <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Target Gaps to Highlight:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {aiAnalysis.skillGaps.map((gap: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-[10px] bg-amber-950/50 text-amber-300 border-amber-800">
                              {gap}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="font-bold text-slate-300 flex items-center gap-1 mb-2">
                      <FileText className="h-3.5 w-3.5 text-indigo-400" /> Expected Technical &amp; Domain Interview Topics:
                    </span>
                    <ul className="list-disc list-inside text-slate-300 space-y-1.5 pl-1 leading-relaxed">
                      {aiAnalysis.interviewTopics?.map((topic: string, idx: number) => (
                        <li key={idx} className="text-slate-300">
                          <span className="text-slate-200">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <Link href="/student/profile">
                        <Button size="sm" variant="outline" className="text-xs border-indigo-800/60 text-indigo-300 hover:bg-indigo-950 h-8">
                          Update Profile Skills
                        </Button>
                      </Link>
                      <Link href="/student/resume">
                        <Button size="sm" variant="outline" className="text-xs border-purple-800/60 text-purple-300 hover:bg-purple-950 h-8">
                          Sync with AI Resume Studio
                        </Button>
                      </Link>
                    </div>
                    <Button variant="emerald" size="sm" onClick={() => setShowAiAssistant(false)} className="h-8">
                      Done
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>
          </div>
        )}

      </div>
    </PortalLayout>
  );
}
