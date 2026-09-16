'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Video,
  BookOpen,
  History,
  TrendingUp,
  Target,
  Sparkles,
  PlayCircle,
  FileText,
  Award,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
  Mic,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function InterviewHubPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  // Form State
  const [targetRole, setTargetRole] = useState('');
  const [selectedOppId, setSelectedOppId] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [interviewType, setInterviewType] = useState('MIXED');
  const [questionCount, setQuestionCount] = useState(10);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, oppsRes, resRes, analyticsRes, sessRes] = await Promise.all([
          fetch('/api/student/profile').then((r) => r.json()).catch(() => ({ data: null })),
          fetch('/api/opportunities').then((r) => r.json()).catch(() => ({ data: [] })),
          fetch('/api/student/resumes').then((r) => r.json()).catch(() => ({ data: [] })),
          fetch('/api/student/interview/analytics').then((r) => r.json()).catch(() => ({ data: null })),
          fetch('/api/student/interview/sessions').then((r) => r.json()).catch(() => ({ sessions: [] })),
        ]);

        if (profRes?.data?.profile) {
          setProfile(profRes.data.profile);
          setUserSkills(profRes.data.skills || []);
          setTargetRole(profRes.data.profile.target_role || profRes.data.profile.career_goal || 'Software Engineer');
        } else if (profRes.profile) {
          setProfile(profRes.profile);
          setTargetRole(profRes.profile.target_role || profRes.profile.career_goal || 'Software Engineer');
        } else {
          setTargetRole('Software Engineer');
        }
        if (oppsRes.data) setOpportunities(oppsRes.data);
        if (resRes.data) setResumes(resRes.data);
        if (analyticsRes.data) setAnalytics(analyticsRes.data);
        if (sessRes?.sessions) setRecentSessions(sessRes.sessions);
      } catch (err) {
        console.error('Failed to load interview hub data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStartInterview = async () => {
    setStarting(true);
    try {
      const res = await fetch('/api/ai/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          opportunityId: selectedOppId || undefined,
          resumeId: selectedResumeId || undefined,
          interviewType,
          questionCount,
        }),
      });

      const data = await res.json();
      if (data.success && data.session) {
        router.push(`/student/interview/simulator?sessionId=${data.session.id}`);
      } else {
        alert(data.error || 'Failed to initialize interview simulator.');
      }
    } catch {
      alert('Error starting interview session.');
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-primary animate-pulse" />
          <span className="text-lg font-medium text-slate-300">Loading AI Interview Preparation Center...</span>
        </div>
      </div>
    );
  }

  const selectedOpp = opportunities.find((o) => o.id === selectedOppId);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 p-8 border border-blue-800/40 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded AI Placement Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              AI Interview & Placement Preparation Center
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Practice role-specific, resume-grounded, and opportunity-tailored mock interviews. Receive Zod-validated rubric feedback across 6 technical dimensions with dual text and voice speech input.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/student/interview/preparation"
              className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-medium text-sm transition-all flex items-center justify-center space-x-2 border border-slate-700"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Prep Topics</span>
            </Link>
            <Link
              href="/student/interview/history"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30"
            >
              <History className="w-4 h-4" />
              <span>Interview History</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Interview Readiness</div>
            <div className="text-2xl font-bold text-white mt-0.5">{analytics?.averageScore || 75}%</div>
            <div className="text-xs text-emerald-400 flex items-center mt-0.5">
              <ShieldCheck className="w-3 h-3 mr-1" /> Grounded Rubric
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Attempts Completed</div>
            <div className="text-2xl font-bold text-white mt-0.5">{analytics?.totalAttempts || 0}</div>
            <div className="text-xs text-slate-400 mt-0.5">Persisted Sessions</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Improvement Score</div>
            <div className="text-2xl font-bold text-white mt-0.5">
              {analytics?.improvementDelta ? `${analytics.improvementDelta > 0 ? '+' : ''}${analytics.improvementDelta}%` : '0%'}
            </div>
            <div className="text-xs text-indigo-400 mt-0.5">Delta Over Time</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Target Role</div>
            <div className="text-sm font-semibold text-white mt-1 truncate max-w-[140px]">
              {targetRole || 'Specialist'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Academic Stream</div>
          </div>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Simulator Launcher Setup */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <PlayCircle className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Configure AI Interview Simulator</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 font-medium">Dual Voice + Text</span>
            </div>

            {/* Profile Grounding Badge */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-blue-400 tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Profile Grounded Context</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  {profile?.academic_stream || 'Computer Science & Software Engineering'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 font-medium">Academic Stream: </span>
                  <span className="font-semibold text-white">{profile?.academic_stream || 'Computer Science / Engineering'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Degree / Specialization: </span>
                  <span className="font-semibold text-white">{profile?.degree || 'B.Tech'} - {profile?.specialization || 'Software Engineering'}</span>
                </div>
              </div>

              {userSkills.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center flex-wrap gap-1.5">
                  <span className="text-[11px] text-slate-400 mr-1 font-medium">Verified Skills & Gaps:</span>
                  {userSkills.map((s: any) => (
                    <span
                      key={s.id || s.skill_name}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        s.proficiency_score >= 70
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      {s.skill_name} ({s.proficiency_score}%)
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Target Role / Opportunity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full-Stack Software Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Specific Opportunity (Optional)</label>
                <select
                  value={selectedOppId}
                  onChange={(e) => setSelectedOppId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">General Target Role Prep</option>
                  {opportunities.map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title} ({opp.company_name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedOpp && (
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200 space-y-2">
                <div className="font-semibold flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>Selected Listing Requirements ({selectedOpp.company_name})</span>
                </div>
                <p>Required Skills: {selectedOpp.required_skills?.map((s: any) => s.skill_name).join(', ') || 'Domain Fundamentals'}</p>
              </div>
            )}

            {/* Interview Mode Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-3">Interview Mode</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'MIXED', label: 'Mixed Comprehensive', desc: 'Tech, HR, Resume & Behavioral' },
                  { id: 'TECHNICAL', label: 'Technical Core', desc: 'Algorithms & Domain Concepts' },
                  { id: 'RESUME_BASED', label: 'Resume Defense', desc: 'Projects & Experience' },
                  { id: 'BEHAVIORAL', label: 'Behavioral STAR', desc: 'Situation & Impact' },
                  { id: 'ROLE_SPECIFIC', label: 'Role-Specific', desc: 'Industry Scenarios' },
                  { id: 'HR', label: 'HR & Culture', desc: 'Communication & Goals' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setInterviewType(mode.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      interviewType === mode.id
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-slate-800/50 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-bold text-xs">{mode.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Question Count</label>
                <div className="flex space-x-3">
                  {[10, 20, 30].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        questionCount === num
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Select Grounded Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Latest Authenticated Resume</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} (ATS: {r.ats_score}/100)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleStartInterview}
                disabled={starting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {starting ? (
                  <>
                    <Brain className="w-5 h-5 animate-pulse" />
                    <span>Generating Grounded Questions...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Launch AI Interview Simulator Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Navigation & Quick Prep Cards */}
        <div className="space-y-6">
          {/* Quick Links Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Placement Prep Center</span>
            </h3>

            <div className="space-y-3">
              <Link
                href="/student/interview/preparation"
                className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-between text-slate-200 hover:text-white transition-all group"
              >
                <div>
                  <div className="text-xs font-bold">Preparation & Weak Areas</div>
                  <div className="text-[11px] text-slate-400">Targeted topic reviews & defense tips</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/student/interview/history"
                className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-between text-slate-200 hover:text-white transition-all group"
              >
                <div>
                  <div className="text-xs font-bold">Interview History & Analytics</div>
                  <div className="text-[11px] text-slate-400">Track scores over time & feedback</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Voice Input Capabilities Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Mic className="w-5 h-5" />
              <h4 className="font-bold text-sm text-white">Browser Speech Recognition</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Supports browser Web Speech API for hands-free voice interviews. Speak naturally, review speech-to-text transcripts, or switch seamlessly to text input.
            </p>
          </div>
        </div>
      </div>

      {/* Past Attended Sessions Section */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Past Attended Interview Sessions</h3>
          </div>
          <Link
            href="/student/interview/history"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View Full Dimensional Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No interview sessions recorded yet. Launch your first mock drill above!
          </div>
        ) : (
          <div className="space-y-3">
            {recentSessions.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-600 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">{s.target_role}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60 font-mono">
                      {s.interview_type || 'MIXED'}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
                      s.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center space-x-4">
                    <span>{new Date(s.started_at).toLocaleDateString()} at {new Date(s.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span>{s.questions?.length || s.question_count || 5} Questions</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Score</div>
                    <div className="text-lg font-black text-emerald-400 font-mono">
                      {s.overall_score || s.score || 0}/100
                    </div>
                  </div>
                  <Link
                    href={`/student/interview/${s.id}/results`}
                    className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1"
                  >
                    <span>View Evaluation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
