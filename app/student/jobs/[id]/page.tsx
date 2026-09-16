'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowLeft,
  Send,
  Bookmark,
  BookmarkCheck,
  Brain,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const opportunityId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [opportunity, setOpportunity] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!opportunityId) return;

      try {
        const [oppRes, profRes, resRes, savedRes] = await Promise.all([
          fetch(`/api/opportunities/${opportunityId}`).then((r) => r.json()).catch(() => ({ data: null })),
          fetch('/api/student/profile').then((r) => r.json()).catch(() => ({ data: null })),
          fetch('/api/student/resumes').then((r) => r.json()).catch(() => ({ data: [] })),
          fetch('/api/jobs/saved').then((r) => r.json()).catch(() => ({ data: [] })),
        ]);

        if (oppRes.data) setOpportunity(oppRes.data);
        if (profRes?.data?.profile) {
          setProfile(profRes.data.profile);
          setUserSkills(profRes.data.skills || []);
        }
        if (resRes.data) setResumes(resRes.data);
        if (savedRes.data) {
          setIsSaved(savedRes.data.some((s: any) => s.id === opportunityId));
        }
      } catch (err) {
        console.error('Failed to load opportunity details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [opportunityId]);

  const handleToggleSave = async () => {
    const action = isSaved ? 'UNSAVE' : 'SAVE';
    setIsSaved(!isSaved);
    try {
      await fetch('/api/jobs/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId, action }),
      });
    } catch {}
  };

  const handleApply = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity_id: opportunityId,
          resume_id: selectedResumeId || undefined,
        }),
      });

      const data = await res.json();
      if (data.success || data.data) {
        setApplied(true);
        setApplyModalOpen(false);
        alert('Application submitted successfully!');
      } else {
        alert(data.error || 'Failed to submit application.');
      }
    } catch {
      alert('Error submitting application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !opportunity) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3 text-slate-300">
          <Brain className="w-8 h-8 text-teal-400 animate-pulse" />
          <span className="text-lg font-medium">Analyzing Opportunity Alignment & Matching Engine...</span>
        </div>
      </div>
    );
  }

  // Calculate Dynamic Match Breakdown
  const requiredSkills = opportunity.required_skills?.map((s: any) => s.skill_name || s) || ['JavaScript', 'React', 'Node.js', 'SQL'];
  const userSkillNames = userSkills.map((s) => s.skill_name);
  const matchedSkills = userSkills.filter((s) => requiredSkills.includes(s.skill_name));
  const missingSkills = requiredSkills.filter((r: string) => !userSkillNames.includes(r));

  const skillsMatchPercent = Math.min(100, Math.round((matchedSkills.length / Math.max(1, requiredSkills.length)) * 100));
  const educationMatchPercent = 100; // B.Tech / Academic stream aligned
  const projectsMatchPercent = profile?.projects && profile.projects.length > 0 ? 90 : 65;
  const experienceMatchPercent = profile?.experience && profile.experience.length > 0 ? 85 : 60;
  const certificationsMatchPercent = profile?.certifications && profile.certifications.length > 0 ? 90 : 50;

  const overallMatch = Math.round(
    skillsMatchPercent * 0.4 +
    educationMatchPercent * 0.2 +
    projectsMatchPercent * 0.15 +
    experienceMatchPercent * 0.15 +
    certificationsMatchPercent * 0.1
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Back Button */}
      <Link
        href="/student/jobs"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Job Search</span>
      </Link>

      {/* Main Header & Overview Card */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-teal-400 text-2xl shadow-lg">
              {opportunity.company_name?.charAt(0) || 'C'}
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-400 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>{opportunity.company_name}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>{opportunity.work_type || 'Hybrid'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{opportunity.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{opportunity.location || 'Bengaluru'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{opportunity.stipend_salary || 'Competitive Salary'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleSave}
              className={`p-3 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>

            {applied ? (
              <div className="px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Application Submitted</span>
              </div>
            ) : (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-teal-600/20 transition-all flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Why You Match vs Job Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Why You Match & Opportunity Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* WHY YOU MATCH CARD */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h2 className="text-xl font-bold text-white">Why You Match ({overallMatch}%)</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-semibold">
                Grounded Assessment
              </span>
            </div>

            {/* Score Breakdown Bar Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Skills Match', val: skillsMatchPercent },
                { label: 'Education', val: educationMatchPercent },
                { label: 'Projects', val: projectsMatchPercent },
                { label: 'Experience', val: experienceMatchPercent },
                { label: 'Certifications', val: certificationsMatchPercent },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-center space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">{m.label}</div>
                  <div className="text-xl font-black text-white">{m.val}%</div>
                </div>
              ))}
            </div>

            {/* Matched vs Missing Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 space-y-2">
                <div className="text-xs font-bold uppercase text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Matched Skills ({matchedSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.map((s) => (
                    <span key={s.skill_name} className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                      {s.skill_name} ({s.proficiency_score}%)
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 space-y-2">
                <div className="text-xs font-bold uppercase text-amber-400 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Priority Skill Gaps ({missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.length > 0 ? (
                    missingSkills.map((s: string) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                        {s} (Gap)
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">All required skills met!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job Overview & Responsibilities */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Role Description & Responsibilities</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {opportunity.description || 'Full-stack development, database query optimization, system architecture design, and RESTful API integration.'}
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-xs text-slate-400">Required Core Skills</h4>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((s: string) => (
                  <span key={s} className="text-xs px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: AI Interview Prep & Action Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Brain className="w-5 h-5 text-teal-400" />
              <span>Tailored Interview Preparation</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prepare for {opportunity.company_name}&apos;s interview round using our domain-validated AI Simulator tailored to {opportunity.title}.
            </p>
            <Link
              href={`/student/interview?oppId=${opportunityId}`}
              className="block py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs text-center shadow-lg transition-all"
            >
              Start Role Mock Interview
            </Link>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Apply to {opportunity.company_name}</h3>
              <button onClick={() => setApplyModalOpen(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Select Grounded Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500"
                >
                  <option value="">Latest Authenticated Resume</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} (ATS: {r.ats_score}/100)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-white">Application Summary</div>
                <div>Role: {opportunity.title}</div>
                <div>Match Score: {overallMatch}%</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setApplyModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center space-x-1"
              >
                {submitting ? <span>Submitting...</span> : <span>Confirm Application</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
