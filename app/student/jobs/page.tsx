'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Bookmark,
  BookmarkCheck,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function JobSearchPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedWorkType, setSelectedWorkType] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        const [oppsRes, savedRes] = await Promise.all([
          fetch('/api/opportunities').then((r) => r.json()).catch(() => ({ data: [] })),
          fetch('/api/jobs/saved').then((r) => r.json()).catch(() => ({ data: [] })),
        ]);

        if (oppsRes.data) setOpportunities(oppsRes.data);
        if (savedRes.data) setSavedIds(savedRes.data.map((s: any) => s.id));
      } catch (err) {
        console.error('Failed to load jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleSave = async (oppId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isSaved = savedIds.includes(oppId);
    const action = isSaved ? 'UNSAVE' : 'SAVE';

    if (isSaved) {
      setSavedIds((prev) => prev.filter((id) => id !== oppId));
    } else {
      setSavedIds((prev) => [...prev, oppId]);
    }

    try {
      await fetch('/api/jobs/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: oppId, action }),
      });
    } catch {}
  };

  // Filter & Search Logic
  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch =
      !searchQuery ||
      opp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.required_skills?.some((s: any) => s.skill_name?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedType === 'ALL' ||
      (selectedType === 'JOB' && (opp.type === 'FULL_TIME' || opp.type === 'JOB')) ||
      (selectedType === 'INTERNSHIP' && opp.type === 'INTERNSHIP');

    const matchesWorkType =
      selectedWorkType === 'ALL' ||
      opp.work_type?.toLowerCase() === selectedWorkType.toLowerCase();

    return matchesSearch && matchesType && matchesWorkType;
  });

  return (
    <PortalLayout role="STUDENT" userTitle="Job Opportunities" userSubtitle="Campus Placement Drives & Open Roles">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#17112c] via-[#121524] to-[#0e111c] border border-purple-500/20 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded Career Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Discover Verified Jobs &amp; Corporate Openings
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Algorithmic skill-matched positions across Computer Science, Artificial Intelligence, Core Engineering, and Pharma.
            </p>
          </div>
        </div>

        {/* Main Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#0d101d]/90 border border-white/10 shadow-xl space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies or skills (e.g. Next.js, Cloud, Python, System Design)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141828] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#141828] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Opportunity Types</option>
              <option value="JOB">Full-Time Jobs</option>
              <option value="INTERNSHIP">Internships</option>
            </select>

            {/* Work Type Filter */}
            <select
              value={selectedWorkType}
              onChange={(e) => setSelectedWorkType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#141828] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Work Modes</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">
            Showing <span className="text-white font-bold">{filteredOpps.length}</span> Verified Opportunities
          </span>
          <Link href="/student/saved-jobs" className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
            <Bookmark className="h-3.5 w-3.5" /> Saved Roles ({savedIds.length})
          </Link>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            Loading opportunities...
          </div>
        ) : filteredOpps.length === 0 ? (
          <div className="p-12 rounded-2xl border border-white/10 bg-[#0d101d]/60 text-center space-y-2">
            <Briefcase className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-white">No matching opportunities found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOpps.map((opp) => {
              const isSaved = savedIds.includes(opp.id);
              const matchScore = opp.match_score || 88;

              return (
                <Link
                  key={opp.id}
                  href={`/student/jobs/${opp.id}`}
                  className="p-5 rounded-2xl bg-[#0d101d]/90 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 group shadow-xl relative"
                >
                  <div className="space-y-3">
                    {/* Card Top Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-[#181d33] border border-white/10 flex items-center justify-center font-bold text-purple-400 text-base">
                          {opp.company_name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-slate-400">{opp.company_name}</div>
                          <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                            {opp.title}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleToggleSave(opp.id, e)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isSaved
                            ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                        title={isSaved ? 'Unsave Opportunity' : 'Save Opportunity'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-cyan-400" />
                        <span>{matchScore}% Match</span>
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-semibold border border-white/10">
                        {opp.work_type || 'Hybrid'}
                      </span>
                    </div>

                    {/* Details Pills */}
                    <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{opp.location || 'Bengaluru'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{opp.stipend_salary || '₹12 - 18 LPA'}</span>
                      </div>
                    </div>

                    {/* Required Skills Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opp.required_skills?.slice(0, 4).map((s: any) => (
                        <span
                          key={s.skill_name || s}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-medium"
                        >
                          {s.skill_name || s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button Footer */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-purple-300">
                    <span>View Role &amp; Fit Analysis</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
