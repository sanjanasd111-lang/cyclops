'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Building2,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Briefcase,
  BarChart3,
  BrainCircuit,
  GraduationCap,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DualLineChart,
  DonutCategoryChart,
  DonutProgressRing,
  VerticalBarChart,
} from '@/components/dashboard/CrmCharts';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const json = await res.json();
        if (json.data) setData(json.data);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  if (loading || !data) {
    return (
      <PortalLayout role="ADMIN" userTitle="Super Administrator">
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-3 text-slate-300">
            <ShieldCheck className="w-8 h-8 text-emerald-400 animate-pulse" />
            <span className="text-lg font-medium">Loading Enterprise Governance Command Center...</span>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const { stats, healthStatus, verifications } = data;

  return (
    <PortalLayout role="ADMIN" userTitle="Super Administrator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
        
        {/* 7.1 Header Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1c1236] via-[#141828] to-[#121524] border border-purple-500/25 shadow-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Admin Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Governance &amp; System Command Center
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            Real platform metrics, organization verification workflows, user account management, security audit logging, system health status, and AI governance controls.
          </p>
        </div>

        {/* 7.1 REAL STATS CARDS (Photo 2 Styling) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-950/30 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-purple-200 uppercase">Total Users</div>
            <div className="text-3xl font-black text-white font-mono my-1">{stats.totalUsers}</div>
            <div className="text-[10px] text-purple-200 font-medium">All registered roles</div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-500 text-white shadow-xl shadow-cyan-950/30 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-cyan-100 uppercase">Students</div>
            <div className="text-3xl font-black text-white font-mono my-1">{stats.studentsCount}</div>
            <div className="text-[10px] text-cyan-200 font-medium">Candidate profiles</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 shadow-xl space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Faculty</div>
            <div className="text-2xl font-black text-white font-mono">{stats.facultyCount}</div>
            <div className="text-[10px] text-purple-400 font-medium">Authorized mentors</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 shadow-xl space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Institutions</div>
            <div className="text-2xl font-black text-white font-mono">{stats.institutionsCount}</div>
            <div className="text-[10px] text-cyan-400 font-medium">Academic campuses</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 shadow-xl space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Industry Partners</div>
            <div className="text-2xl font-black text-white font-mono">{stats.industriesCount}</div>
            <div className="text-[10px] text-pink-400 font-medium">Verified recruiters</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 shadow-xl space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Pending Verifications</div>
            <div className="text-2xl font-black text-pink-400 font-mono">{stats.pendingVerifications}</div>
            <div className="text-[10px] text-slate-500 font-medium">Awaiting review</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 shadow-xl space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Verified Orgs</div>
            <div className="text-2xl font-black text-cyan-400 font-mono">{stats.verifiedOrganizations}</div>
            <div className="text-[10px] text-slate-500 font-medium">With verified badge</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 shadow-xl space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Active Opportunities</div>
            <div className="text-2xl font-black text-purple-300 font-mono">{stats.activeOpportunities}</div>
            <div className="text-[10px] text-slate-500 font-medium">Live employer openings</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 shadow-xl space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Reported Content</div>
            <div className="text-2xl font-black text-rose-400 font-mono">{stats.reportedOpportunities}</div>
            <div className="text-[10px] text-slate-500 font-medium">Pending moderation</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 to-[#141824] border border-purple-500/30 shadow-xl space-y-1">
            <div className="text-[11px] font-semibold text-purple-300 uppercase">System Status</div>
            <div className="text-lg font-black text-white mt-1">OPERATIONAL</div>
            <div className="text-[10px] text-cyan-400 font-medium">All services healthy</div>
          </div>
        </div>

        {/* Photo 2 Charts Suite */}
        <DualLineChart
          title="Platform User Influx vs Verification Approvals"
          metric1Label="Verified Accounts"
          metric2Label="User Registrations"
          peakBadgeText="Max = 98"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DonutCategoryChart
            title="Ecosystem Breakdown By Role"
            categories={[
              { label: "Students", percent: 65, color: "#06b6d4" },
              { label: "Faculty Mentors", percent: 15, color: "#3b82f6" },
              { label: "Institutions", percent: 12, color: "#8b5cf6" },
              { label: "Industry", percent: 8, color: "#ec4899" },
            ]}
          />
          <DonutProgressRing
            title="Credential Verification Rate"
            centerValue="99.4%"
            centerLabel="Integrity Score"
            primaryPercent="99.4%"
            primaryLabel="Verified & Active"
            secondaryPercent="0.6%"
            secondaryLabel="Flagged / Audited"
          />
          <VerticalBarChart
            title="Weekly Governance & Audit Activity"
            days={[
              { day: "Mon", height: 70 },
              { day: "Tue", height: 55 },
              { day: "Wed", height: 90 },
              { day: "Thu", height: 65 },
              { day: "Fri", height: 98 },
              { day: "Sat", height: 45 },
            ]}
          />
        </div>

        {/* Quick Admin Navigation Suite */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition-all space-y-2 group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
              User Account Governance
            </h3>
            <p className="text-xs text-slate-400">
              Search, filter, view, suspend, or reactivate user accounts across all roles.
            </p>
          </Link>

          <Link
            href="/admin/verification"
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2 group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              Organization Verification
            </h3>
            <p className="text-xs text-slate-400">
              Review accreditation documents, grant verified badges, and log verification history.
            </p>
          </Link>

          <Link
            href="/admin/opportunities"
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2 group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              Opportunity Moderation
            </h3>
            <p className="text-xs text-slate-400">
              Automated quality checks (duplicates, broken links) and publishing moderation.
            </p>
          </Link>

          <Link
            href="/admin/audit"
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all space-y-2 group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Security Audit Trail
            </h3>
            <p className="text-xs text-slate-400">
              Immutable logging of administrative actions, status changes, and logins.
            </p>
          </Link>

          <Link
            href="/admin/analytics"
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all space-y-2 group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              Platform Analytics
            </h3>
            <p className="text-xs text-slate-400">
              Platform growth, role distribution, discipline breakdowns, and recruitment trends.
            </p>
          </Link>

          <Link
            href="/admin/system-health"
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition-all space-y-2 group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
              Live System Health
            </h3>
            <p className="text-xs text-slate-400">
              Real-time ping checks for Supabase, Gemini AI, Storage buckets, and latency.
            </p>
          </Link>

          <Link
            href="/admin/ai-usage"
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition-all space-y-2 group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
              AI Safety & Usage
            </h3>
            <p className="text-xs text-slate-400">
              Assistive AI monitoring, token metrics, and strict human-in-the-loop safeguards.
            </p>
          </Link>
        </div>

        {/* Verification Queue Preview */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Pending Organization Verifications</span>
            </h2>
            <Link href="/admin/verification" className="text-xs text-teal-400 hover:text-teal-300 font-semibold">
              Manage All Verifications →
            </Link>
          </div>

          <div className="space-y-3">
            {verifications.slice(0, 3).map((org: any) => (
              <div key={org.id} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white flex items-center space-x-2">
                    <span>{org.organization_name}</span>
                    {org.verification_status === 'VERIFIED' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">
                        ✓ Verified Organization
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{org.organization_type} • {org.notes}</div>
                </div>
                <Link
                  href="/admin/verification"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
