"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  UserCheck,
  Target,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Calendar,
  CheckCircle2,
  Users,
  Building2,
  Bot
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DualLineChart,
  DonutCategoryChart,
  DonutProgressRing,
  VerticalBarChart,
} from '@/components/dashboard/CrmCharts';

export default function IndustryDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    activeOpportunities: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
    scheduledInterviews: 0,
    selections: 0,
    averageMatchScore: 0,
  });
  const [opportunities, setOpportunities] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profRes, analyticsRes, oppsRes] = await Promise.all([
        fetch('/api/industry/profile').then((r) => r.json()),
        fetch('/api/industry/analytics').then((r) => r.json()),
        fetch('/api/industry/opportunities').then((r) => r.json()),
      ]);

      if (profRes.success) setProfile(profRes.data);
      if (analyticsRes.success) setMetrics(analyticsRes.data.metrics);
      if (oppsRes.success) setOpportunities(oppsRes.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout role="INDUSTRY" userTitle={profile?.company_name || 'Dabur Ayurvet R&D Division'} userSubtitle="Enterprise Recruiter Console">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{profile?.company_name || 'Dabur Ayurvet R&D Division'}</h1>
              <Badge variant="emerald" className="gap-1 font-mono text-[10px]">
                <ShieldCheck className="h-3.5 w-3.5" /> VERIFIED RECRUITER
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Industry Intelligence & Candidate Discovery Hub • {profile?.industry_domain || 'Healthcare & Life Sciences'}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/industry/opportunities/create">
              <Button variant="emerald" size="sm" className="gap-1.5 font-bold shadow-md">
                <Briefcase className="h-4 w-4" /> Create Opportunity
              </Button>
            </Link>
            <Link href="/industry/ai">
              <Button variant="outline" size="sm" className="gap-1.5 border-slate-800 text-slate-300">
                <Bot className="h-4 w-4 text-emerald-400" /> AI Assistant
              </Button>
            </Link>
          </div>
        </div>

        {/* Photo 2 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 p-4 text-white shadow-xl shadow-purple-950/30 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-mono text-purple-200">Avg Match</span>
            <div className="text-2xl font-black text-white font-mono my-1">{metrics.averageMatchScore}%</div>
            <p className="text-[10px] text-purple-200">Candidate Fit</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-500 p-4 text-white shadow-xl shadow-cyan-950/30 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-mono text-cyan-200">Shortlisted</span>
            <div className="text-2xl font-black text-white font-mono my-1">{metrics.shortlistedCandidates}</div>
            <p className="text-[10px] text-cyan-200">In Pipeline</p>
          </div>

          <div className="rounded-2xl bg-[#141824] border border-white/5 p-4 space-y-1 shadow-lg">
            <span className="text-[10px] uppercase font-mono text-slate-400">Active Opps</span>
            <div className="text-2xl font-black text-white font-mono">{metrics.activeOpportunities}</div>
            <p className="text-[10px] text-slate-500">Live Postings</p>
          </div>

          <div className="rounded-2xl bg-[#141824] border border-white/5 p-4 space-y-1 shadow-lg">
            <span className="text-[10px] uppercase font-mono text-slate-400">Applications</span>
            <div className="text-2xl font-black text-white font-mono">{metrics.totalApplications}</div>
            <p className="text-[10px] text-slate-500">Total Received</p>
          </div>

          <div className="rounded-2xl bg-[#141824] border border-white/5 p-4 space-y-1 shadow-lg">
            <span className="text-[10px] uppercase font-mono text-slate-400">Interviews</span>
            <div className="text-2xl font-black text-pink-400 font-mono">{metrics.scheduledInterviews}</div>
            <p className="text-[10px] text-slate-500">Scheduled Sessions</p>
          </div>

          <div className="rounded-2xl bg-[#141824] border border-white/5 p-4 space-y-1 shadow-lg">
            <span className="text-[10px] uppercase font-mono text-slate-400">Selections</span>
            <div className="text-2xl font-black text-cyan-400 font-mono">{metrics.selections}</div>
            <p className="text-[10px] text-slate-500">Offers Issued</p>
          </div>
        </div>

        {/* Photo 2 Charts Suite */}
        <DualLineChart
          title="Recruiter Pipeline Velocity vs Applications Processed"
          metric1Label="Shortlisted Candidates"
          metric2Label="Inbound Applications"
          peakBadgeText="Max = 88"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DonutCategoryChart
            title="Applicants By Domain"
            categories={[
              { label: "Computer Science", percent: 45, color: "#06b6d4" },
              { label: "AI & Data Science", percent: 25, color: "#3b82f6" },
              { label: "AYUSH / Healthcare", percent: 18, color: "#8b5cf6" },
              { label: "Core Engineering", percent: 12, color: "#14b8a6" },
            ]}
          />
          <DonutProgressRing
            title="Interviews vs Offers Issued"
            centerValue={String(metrics.selections || 12)}
            centerLabel="Total Selected"
            primaryPercent="82.4%"
            primaryLabel="Selected / Offered"
            secondaryPercent="17.6%"
            secondaryLabel="In Interview Stage"
          />
          <VerticalBarChart
            title="Weekly Recruiter Evaluation Activity"
            days={[
              { day: "Mon", height: 50 },
              { day: "Tue", height: 30 },
              { day: "Wed", height: 70 },
              { day: "Thu", height: 45 },
              { day: "Fri", height: 95 },
              { day: "Sat", height: 60 },
            ]}
          />
        </div>

        {/* Quick Action Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/industry/candidates">
            <Card className="border-white/5 bg-[#141824] p-5 hover:border-purple-500/40 transition-all group rounded-2xl shadow-xl">
              <div className="flex items-center justify-between">
                <UserCheck className="h-6 w-6 text-purple-400" />
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-white mt-2">Candidate Discovery</h3>
              <p className="text-xs text-slate-400 mt-0.5">Rank candidates deterministically based on skill match scores.</p>
            </Card>
          </Link>

          <Link href="/industry/recruitment">
            <Card className="border-slate-800 bg-slate-900/60 p-4 hover:border-emerald-500/40 transition-all group">
              <div className="flex items-center justify-between">
                <Target className="h-6 w-6 text-teal-400" />
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-white mt-2">Recruitment Pipeline</h3>
              <p className="text-xs text-slate-400 mt-0.5">Kanban board tracking applicants from review to final selection.</p>
            </Card>
          </Link>

          <Link href="/industry/interviews">
            <Card className="border-slate-800 bg-slate-900/60 p-4 hover:border-emerald-500/40 transition-all group">
              <div className="flex items-center justify-between">
                <Calendar className="h-6 w-6 text-amber-400" />
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-white mt-2">Interview Scheduler</h3>
              <p className="text-xs text-slate-400 mt-0.5">Manage virtual or in-person interview dates & meeting URLs.</p>
            </Card>
          </Link>

          <Link href="/industry/analytics">
            <Card className="border-slate-800 bg-slate-900/60 p-4 hover:border-emerald-500/40 transition-all group">
              <div className="flex items-center justify-between">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-white mt-2">Skill Demand Analytics</h3>
              <p className="text-xs text-slate-400 mt-0.5">Analyze candidate skill supply vs. industry skill shortages.</p>
            </Card>
          </Link>
        </div>

        {/* Active Opportunities Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-400" /> Active Organization Opportunities
            </h2>
            <Link href="/industry/opportunities" className="text-xs font-semibold text-emerald-400 hover:underline">
              View All ({opportunities.length})
            </Link>
          </div>

          {opportunities.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/60 p-8 text-center space-y-3">
              <Building2 className="h-10 w-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No active opportunities yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Create your first taxonomy-validated opportunity to start discovering and matching qualified candidates.</p>
              <Link href="/industry/opportunities/create">
                <Button variant="emerald" size="sm" className="gap-1.5 mt-2">
                  <Briefcase className="h-4 w-4" /> Create First Opportunity
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map((opp) => (
                <Card key={opp.id} className="border-slate-800 bg-slate-900/90 p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">{opp.title}</h3>
                      <p className="text-xs text-slate-400">{opp.location} • {opp.duration_months} Months</p>
                    </div>
                    <Badge variant="emerald" className="text-[10px]">{opp.opportunity_type}</Badge>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">{opp.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">Stipend: <strong className="text-emerald-400">₹{opp.stipend_amount}/mo</strong></span>
                    <Link href={`/industry/candidates?opportunity_id=${opp.id}`}>
                      <Button variant="outline" size="sm" className="gap-1 text-xs border-slate-800">
                        <span>Discover Candidates</span> <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </PortalLayout>
  );
}
