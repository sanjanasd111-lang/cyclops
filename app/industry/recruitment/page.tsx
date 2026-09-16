'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Brain,
  Filter,
  Search,
  ArrowUpDown,
  X,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RejectionReasonCategory } from '@/lib/types';

export default function IndustryRecruitmentPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedOppFilter, setSelectedOppFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Structured Rejection Modal State
  const [rejectingApp, setRejectingApp] = useState<any | null>(null);
  const [rejectionCategory, setRejectionCategory] = useState<RejectionReasonCategory>('SKILL_GAP');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [appsRes, oppsRes] = await Promise.all([
          fetch('/api/applications'),
          fetch('/api/opportunities'),
        ]);
        const appsData = await appsRes.json();
        const oppsData = await oppsRes.json();

        if (appsData.data) setApplications(appsData.data);
        if (oppsData.data) setOpportunities(oppsData.data);
      } catch (err) {
        console.error('Failed to load recruitment pipeline:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStatusChange = (app: any, newStatus: string) => {
    if (newStatus === 'REJECTED') {
      setRejectingApp(app);
      setRejectionCategory('SKILL_GAP');
      setRejectionNotes('');
      return;
    }
    executeStatusUpdate(app.id, newStatus);
  };

  const executeStatusUpdate = async (appId: string, newStatus: string, reason?: RejectionReasonCategory, notes?: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );

    try {
      await fetch(`/api/industry/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          rejectionReason: reason,
          feedbackText: notes,
        }),
      });
    } catch (err) {
      console.error('Failed to persist status change:', err);
    }
  };

  const handleConfirmRejection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingApp) return;
    setIsSubmittingRejection(true);
    try {
      await executeStatusUpdate(rejectingApp.id, 'REJECTED', rejectionCategory, rejectionNotes);
      setRejectingApp(null);
    } finally {
      setIsSubmittingRejection(false);
    }
  };

  const columns = [
    { id: 'APPLIED', title: 'Applied', color: 'border-slate-700' },
    { id: 'UNDER_REVIEW', title: 'Under Review', color: 'border-blue-500/40' },
    { id: 'SHORTLISTED', title: 'Shortlisted', color: 'border-purple-500/40' },
    { id: 'INTERVIEW', title: 'Interview', color: 'border-amber-500/40' },
    { id: 'SELECTED', title: 'Selected / Hired', color: 'border-emerald-500/40' },
    { id: 'REJECTED', title: 'Rejected', color: 'border-rose-500/40' },
  ];

  // Filtering & deterministic sorting
  const filteredApps = applications
    .filter((a) => {
      const matchesOpp = selectedOppFilter === 'ALL' || a.opportunity_id === selectedOppFilter;
      const studentName = a.student_name || a.student?.full_name || 'Aditi Sharma';
      const matchesSearch = !searchQuery || studentName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesOpp && matchesSearch;
    })
    .sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  if (loading) {
    return (
      <PortalLayout role="INDUSTRY" userTitle="Talent Acquisition Director">
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-3 text-slate-300">
            <FolderGit2 className="w-8 h-8 text-teal-400 animate-pulse" />
            <span className="text-lg font-medium">Loading Recruiter Pipeline & Kanban Board...</span>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="INDUSTRY" userTitle="Talent Acquisition Director">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
        
        {/* Top Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 shadow-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Recruiter Shortlist Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Recruitment Kanban & Pipeline
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            Review candidate applications ranked deterministically across 7 weighted criteria. Human recruiter holds final hiring and interview authority.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search candidate name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={selectedOppFilter}
            onChange={(e) => setSelectedOppFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Active Opportunities</option>
            {opportunities.map((opp) => (
              <option key={opp.id} value={opp.id}>
                {opp.title} ({opp.company_name})
              </option>
            ))}
          </select>

          <Link
            href="/industry/candidates/compare"
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Candidate Comparison</span>
          </Link>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 overflow-x-auto">
          {columns.map((col) => {
            const colApps = filteredApps.filter((a) => a.status === col.id);

            return (
              <div
                key={col.id}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 min-h-[520px] flex flex-col"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[11px] font-bold uppercase text-white truncate">{col.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-teal-400 font-bold border border-slate-700">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {colApps.map((app) => {
                    const studentId = app.student_id || app.student?.id || 'sp-aditi-001';
                    const studentName = app.student_name || app.student?.full_name || 'Aditi Sharma';
                    const oppTitle = app.opportunity_title || app.opportunity?.title || 'Target Opportunity';

                    return (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 hover:border-teal-500/40 transition-all space-y-2 shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/industry/candidates/${studentId}`}
                            className="text-xs font-bold text-white hover:text-teal-300 transition-colors line-clamp-1"
                          >
                            {studentName}
                          </Link>
                          <Link
                            href={`/industry/candidates/${studentId}`}
                            className="text-slate-500 hover:text-slate-300"
                            title="View Full Candidate Profile"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>

                        <div className="text-[10px] text-slate-400 truncate">{oppTitle}</div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                            {app.match_score || 88}% Match
                          </span>
                          <span className="text-[9px] text-slate-500">7-Weighted Engine</span>
                        </div>

                        {/* Status Transition Selector */}
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app, e.target.value)}
                            className="w-full px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none text-[10px]"
                          >
                            {columns.map((c) => (
                              <option key={c.id} value={c.id}>
                                Move: {c.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* MODAL: STRUCTURED REJECTION REASON (6.19) */}
      {rejectingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleConfirmRejection}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <span>Structured Rejection Reason</span>
              </h3>
              <button
                type="button"
                onClick={() => setRejectingApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Provide a structured rejection reason for <strong className="text-white">{rejectingApp.student_name || 'candidate'}</strong>. This anonymized telemetry powers curriculum skill-gap intervention.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Primary Reason Category</label>
                <select
                  value={rejectionCategory}
                  onChange={(e) => setRejectionCategory(e.target.value as RejectionReasonCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="SKILL_GAP">Missing Skill / Competency Gap</option>
                  <option value="ELIGIBILITY">Eligibility Criteria (CGPA / Stream)</option>
                  <option value="EXPERIENCE">Experience / Project Depth Insufficient</option>
                  <option value="ROLE_CLOSED">Opportunity Filled / Role Closed</option>
                  <option value="CANDIDATE_WITHDREW">Candidate Withdrew</option>
                  <option value="OTHER">Other Professional Reason</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Optional Constructive Feedback</label>
                <textarea
                  rows={3}
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  placeholder="e.g. Recommended deepening Docker and SQL query optimization knowledge."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectingApp(null)}
                className="border-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingRejection}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs"
              >
                {isSubmittingRejection ? 'Recording...' : 'Confirm Rejection'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </PortalLayout>
  );
}
