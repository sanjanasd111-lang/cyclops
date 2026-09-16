'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OpportunityModerationStatus } from '@/lib/types';

export default function AdminOpportunitiesModerationPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Moderation Action Modal State
  const [activeOpp, setActiveOpp] = useState<any | null>(null);
  const [actionStatus, setActionStatus] = useState<OpportunityModerationStatus>('PUBLISHED');
  const [actionNotes, setActionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadOpportunities() {
      try {
        const res = await fetch('/api/admin/opportunities');
        const json = await res.json();
        if (json.data) setOpportunities(json.data);
      } catch (err) {
        console.error('Failed to load opportunities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOpportunities();
  }, []);

  const openModerationModal = (opp: any, status: OpportunityModerationStatus) => {
    setActiveOpp(opp);
    setActionStatus(status);
    setActionNotes(
      status === 'PUBLISHED'
        ? 'Reviewed and approved for student application feed.'
        : status === 'REJECTED'
        ? 'Quality signals flagged incomplete criteria or invalid links.'
        : 'Opportunity suspended pending employer verification.'
    );
  };

  const handleExecuteModeration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOpp) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/opportunities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oppId: activeOpp.id,
          status: actionStatus,
          notes: actionNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOpportunities((prev) =>
          prev.map((o) =>
            o.id === activeOpp.id ? { ...o, moderationStatus: actionStatus, moderationNotes: actionNotes } : o
          )
        );
        setActiveOpp(null);
      }
    } catch (err) {
      console.error('Failed to update opportunity moderation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOpps = opportunities.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.moderationStatus === statusFilter;
    const matchesSearch =
      !search ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.company_name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <PortalLayout role="ADMIN" userTitle="Super Administrator">
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-3 text-slate-300">
            <Briefcase className="w-8 h-8 text-teal-400 animate-pulse" />
            <span className="text-lg font-medium">Scanning Opportunity Feeds & Quality Signals...</span>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="ADMIN" userTitle="Super Administrator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
        
        {/* Header */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
          <h1 className="text-3xl font-black text-white flex items-center space-x-3">
            <Briefcase className="w-7 h-7 text-indigo-400" />
            <span>Opportunity Moderation & Quality Control ({opportunities.length})</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Automated quality check signals (duplicate detection, link verification, missing skills) and governance publishing controls.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunity title or employer..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Moderation Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        {/* Opportunities List with 7.7 Quality Signals */}
        <div className="space-y-4">
          {filteredOpps.map((opp) => {
            const signals = opp.qualitySignals || {};
            const isHealthy = signals.overallHealth === 'HEALTHY';

            return (
              <div
                key={opp.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-base font-bold text-white">{opp.title}</h3>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          opp.moderationStatus === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : opp.moderationStatus === 'PENDING_REVIEW'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {opp.moderationStatus}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {opp.company_name} • {opp.location} • {opp.opportunity_type}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {opp.moderationStatus !== 'PUBLISHED' && (
                      <button
                        onClick={() => openModerationModal(opp, 'PUBLISHED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                      >
                        Publish
                      </button>
                    )}
                    {opp.moderationStatus !== 'REJECTED' && (
                      <button
                        onClick={() => openModerationModal(opp, 'REJECTED')}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold text-xs hover:bg-rose-500/20"
                      >
                        Reject
                      </button>
                    )}
                    {opp.moderationStatus !== 'SUSPENDED' && (
                      <button
                        onClick={() => openModerationModal(opp, 'SUSPENDED')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold text-xs hover:bg-amber-500/20"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {opp.description}
                </p>

                {/* 7.7 Automated Quality Signals */}
                <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-semibold text-slate-400">Quality Signals:</span>
                  
                  {isHealthy ? (
                    <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Clean Quality Baseline</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-amber-400 font-bold text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Needs Review</span>
                    </span>
                  )}

                  {signals.isDuplicate && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px] font-semibold border border-rose-500/20">
                      Potential Duplicate
                    </span>
                  )}
                  {signals.missingSkills && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-semibold border border-amber-500/20">
                      Missing Skills Spec
                    </span>
                  )}
                  {signals.missingDescription && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-semibold border border-amber-500/20">
                      Brief Description
                    </span>
                  )}
                  {signals.isExpired && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px] font-semibold border border-rose-500/20">
                      Expired Deadline
                    </span>
                  )}
                  {!signals.isDuplicate && !signals.missingSkills && !signals.missingDescription && (
                    <span className="text-[11px] text-slate-400">
                      Required skills: {opp.required_skills?.map((s: any) => s.skill_name).join(', ') || 'N/A'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* MODERATION ACTION MODAL */}
      {activeOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleExecuteModeration}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <span>Opportunity Moderation Decision</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveOpp(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Set status <strong className="text-white">{actionStatus}</strong> for{' '}
              <strong className="text-white">{activeOpp.title}</strong> ({activeOpp.company_name}).
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-400 font-semibold">Moderation Notes / Reasoning</label>
              <textarea
                rows={3}
                required
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 text-xs"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveOpp(null)}
                className="border-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`text-xs font-bold ${
                  actionStatus === 'PUBLISHED'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                    : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
              >
                {isSubmitting ? 'Saving...' : `Confirm ${actionStatus}`}
              </Button>
            </div>
          </form>
        </div>
      )}
    </PortalLayout>
  );
}
