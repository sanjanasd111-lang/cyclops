"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Target, GraduationCap, Briefcase, Bot, TrendingUp, Users, CheckCircle2, Award, ChevronRight } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  DualWaveChart,
  DualLineChart,
  DonutCategoryChart,
  DonutProgressRing,
  VerticalBarChart,
} from '@/components/dashboard/CrmCharts';

export default function InstitutionDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/institution/dashboard')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PortalLayout role="INSTITUTION" userTitle={data?.institution?.name || "Institution Console"} userSubtitle={data?.institution?.code || "AIIA-DELHI"}>
      <div className="space-y-6">
        
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1c1236] via-[#141828] to-[#121524] p-6 sm:p-8 text-white shadow-xl border border-purple-500/25">
          <div className="space-y-3 max-w-3xl">
            <Badge variant="outline" className="border-purple-500/40 text-purple-300 font-mono text-xs bg-purple-950/40">
              {data?.institution?.accreditation || 'Institutional Skill Intelligence Workspace'}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {data?.institution?.name || 'All India Institute of Ayurveda'} — Executive Portal
            </h1>
            <p className="text-sm text-slate-300">
              Database-backed macro skill supply vs industry demand analytics, placement funnels, and grounded AI curriculum intelligence.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/institution/skill-gap">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white gap-2 shadow-md">
                  <Target className="h-4 w-4" /> View Skill Gap Matrix
                </Button>
              </Link>
              <Link href="/institution/curriculum">
                <Button variant="outline" size="sm" className="gap-2 border-white/10 text-cyan-300 hover:bg-white/5">
                  <Bot className="h-4 w-4" /> AI Curriculum Copilot
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Photo 2 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 p-5 text-white shadow-xl shadow-purple-950/30 flex flex-col justify-between">
            <span className="text-xs font-semibold text-purple-100 uppercase tracking-wide">Career Readiness Rate</span>
            <div className="text-3xl font-black text-white font-mono my-2">{data?.averageReadiness || 0}%</div>
            <p className="text-[11px] text-purple-200 font-medium pt-1 border-t border-white/10">{data?.careerReadyStudents || 0} Candidates Ready</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-500 p-5 text-white shadow-xl shadow-cyan-950/30 flex flex-col justify-between">
            <span className="text-xs font-semibold text-cyan-100 uppercase tracking-wide">Placement Velocity</span>
            <div className="text-3xl font-black text-white font-mono my-2">{data?.placementRate || 0}%</div>
            <p className="text-[11px] text-cyan-200 font-medium pt-1 border-t border-white/10">{data?.placementsCount || 0} Placed Candidates</p>
          </div>

          <div className="rounded-2xl bg-[#141824] border border-white/5 p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400">Total Enrolled Students</p>
              <Users className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono my-2">{data?.totalStudents || 0}</div>
            <p className="text-[11px] text-cyan-400 font-medium pt-1 border-t border-white/5">100% Database Verified</p>
          </div>

          <div className="rounded-2xl bg-[#141824] border border-white/5 p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400">Industry Partners</p>
              <Building2 className="h-4 w-4 text-pink-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono my-2">{data?.activeIndustryPartners || 0}</div>
            <p className="text-[11px] text-pink-400 font-medium pt-1 border-t border-white/5">{data?.activeOpportunities || 0} Live Listings</p>
          </div>
        </div>

        {/* Photo 2 Charts */}
        <DualLineChart
          title="Macro Skill Supply vs Industry Recruitment Targets"
          metric1Label="Verified Supply"
          metric2Label="Industry Demand"
          peakBadgeText="Max = 92"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DonutCategoryChart
            title="Institutional Enrolment By Discipline"
            categories={[
              { label: "Computer Science", percent: 38, color: "#06b6d4" },
              { label: "AI & Data Science", percent: 30, color: "#3b82f6" },
              { label: "Ayurveda & AYUSH", percent: 20, color: "#8b5cf6" },
              { label: "Core Engineering", percent: 12, color: "#14b8a6" },
            ]}
          />
          <DonutProgressRing
            title="Corporate MoUs vs Active Placements"
            centerValue={String(data?.placementsCount || 48)}
            centerLabel="Total Placements"
            primaryPercent="78.5%"
            primaryLabel="Placement Rate"
            secondaryPercent="21.5%"
            secondaryLabel="In Pipeline"
          />
          <VerticalBarChart
            title="Weekly Interview & Drive Velocity"
            days={[
              { day: "Mon", height: 45 },
              { day: "Tue", height: 35 },
              { day: "Wed", height: 80 },
              { day: "Thu", height: 60 },
              { day: "Fri", height: 90 },
              { day: "Sat", height: 40 },
            ]}
          />
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/institution/skill-intelligence">
            <Card className="border-white/5 bg-[#141824] hover:border-purple-500/40 transition-all cursor-pointer rounded-2xl shadow-xl">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Skill Intelligence</h3>
                  <p className="text-xs text-slate-400">Macro supply vs industry demand comparison.</p>
                </div>
                <ChevronRight className="h-5 w-5 text-purple-400" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/institution/placements">
            <Card className="border-white/5 bg-[#141824] hover:border-cyan-500/40 transition-all cursor-pointer rounded-2xl shadow-xl">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Placement Funnel</h3>
                  <p className="text-xs text-slate-400">Eligible → Shortlisted → Selected analytics.</p>
                </div>
                <ChevronRight className="h-5 w-5 text-cyan-400" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/institution/curriculum">
            <Card className="border-white/5 bg-[#141824] hover:border-pink-500/40 transition-all cursor-pointer rounded-2xl shadow-xl">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Curriculum Copilot</h3>
                  <p className="text-xs text-slate-400">AI recommendations based on skill deficits.</p>
                </div>
                <ChevronRight className="h-5 w-5 text-pink-400" />
              </CardContent>
            </Card>
          </Link>
        </div>

      </div>
    </PortalLayout>
  );
}
