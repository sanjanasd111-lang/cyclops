"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, Target, Briefcase, GraduationCap, ChevronRight, Bot } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DualLineChart,
  DonutCategoryChart,
  DonutProgressRing,
  VerticalBarChart,
} from '@/components/dashboard/CrmCharts';

export default function FacultyDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/faculty/dashboard')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      });
  }, []);

  const fac = data?.faculty || {};

  return (
    <PortalLayout role="FACULTY" userTitle={fac.full_name || "Faculty Console"} userSubtitle={fac.department || "Dravyaguna Department"}>
      <div className="space-y-6">
        
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1c1236] via-[#141828] to-[#121524] p-6 sm:p-8 text-white shadow-xl border border-purple-500/25">
          <div className="space-y-3 max-w-3xl">
            <Badge variant="outline" className="border-purple-500/40 text-purple-300 font-mono text-xs bg-purple-950/40">
              {fac.title || 'Professor & Department Head'} • {fac.institution_name || 'AIIA'}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {fac.full_name || 'Dr. Rajeshwar Sharma'}
            </h1>
            <p className="text-sm text-slate-300">
              Authorized student mentorship workstation, research project management, and industrial training coordination console.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/faculty/mentorship">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white gap-2 shadow-md">
                  <GraduationCap className="h-4 w-4" /> Manage Student Mentees
                </Button>
              </Link>
              <Link href="/faculty/research">
                <Button variant="outline" size="sm" className="gap-2 border-white/10 text-cyan-300 hover:bg-white/5">
                  <BookOpen className="h-4 w-4" /> Create Research Project
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Photo 2 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 p-5 text-white shadow-xl shadow-purple-950/30 flex flex-col justify-between">
            <span className="text-xs font-semibold text-purple-100 uppercase tracking-wide">Active Mentees</span>
            <div className="text-3xl font-black text-white font-mono my-2">{data?.activeMentorships || 1}</div>
            <p className="text-[11px] text-purple-200 font-medium pt-1 border-t border-white/10">Under Mentorship</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-500 p-5 text-white shadow-xl shadow-cyan-950/30 flex flex-col justify-between">
            <span className="text-xs font-semibold text-cyan-100 uppercase tracking-wide">Research Projects</span>
            <div className="text-3xl font-black text-white font-mono my-2">{data?.researchProjects || 1}</div>
            <p className="text-[11px] text-cyan-200 font-medium pt-1 border-t border-white/10">Active Labs &amp; Papers</p>
          </div>

          <div className="rounded-2xl bg-[#141824] border border-white/5 p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Industrial Trainings</span>
              <Briefcase className="h-4 w-4 text-pink-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono my-2">{data?.industrialTrainings || 1}</div>
            <p className="text-[11px] text-pink-400 font-medium pt-1 border-t border-white/5">Corporate Collaborations</p>
          </div>

          <div className="rounded-2xl bg-[#141824] border border-white/5 p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Workshops Published</span>
              <Target className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono my-2">{data?.activeWorkshops || 1}</div>
            <p className="text-[11px] text-cyan-400 font-medium pt-1 border-t border-white/5">Active Registrations</p>
          </div>
        </div>

        {/* Photo 2 Charts */}
        <DualLineChart
          title="Cohort Mentorship Milestone Completion vs Target"
          metric1Label="Milestones Completed"
          metric2Label="Target Benchmarks"
          peakBadgeText="Max = 94"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DonutCategoryChart
            title="Mentees By Research Domain"
            categories={[
              { label: "Biotech & Pharma", percent: 40, color: "#06b6d4" },
              { label: "Ayurveda R&D", percent: 30, color: "#3b82f6" },
              { label: "Data Science AI", percent: 20, color: "#8b5cf6" },
              { label: "Core Eng", percent: 10, color: "#14b8a6" },
            ]}
          />
          <DonutProgressRing
            title="Skill Verifications Completed"
            centerValue="96%"
            centerLabel="Verified Rate"
            primaryPercent="96.0%"
            primaryLabel="Verified Valid"
            secondaryPercent="4.0%"
            secondaryLabel="Pending Review"
          />
          <VerticalBarChart
            title="Weekly Mentorship Sessions"
            days={[
              { day: "Mon", height: 60 },
              { day: "Tue", height: 40 },
              { day: "Wed", height: 85 },
              { day: "Thu", height: 50 },
              { day: "Fri", height: 90 },
              { day: "Sat", height: 30 },
            ]}
          />
        </div>

        {/* Action Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/faculty/mentorship">
            <Card className="border-white/5 bg-[#141824] hover:border-purple-500/40 cursor-pointer rounded-2xl shadow-xl transition-all">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Student Mentorship</h3>
                  <p className="text-xs text-slate-400">Track skill gaps &amp; milestone reviews.</p>
                </div>
                <ChevronRight className="h-5 w-5 text-purple-400" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/faculty/workshops">
            <Card className="border-white/5 bg-[#141824] hover:border-cyan-500/40 cursor-pointer rounded-2xl shadow-xl transition-all">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Workshops Console</h3>
                  <p className="text-xs text-slate-400">Publish training &amp; track registrations.</p>
                </div>
                <ChevronRight className="h-5 w-5 text-cyan-400" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/faculty/ai">
            <Card className="border-white/5 bg-[#141824] hover:border-pink-500/40 cursor-pointer rounded-2xl shadow-xl transition-all">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Faculty AI Copilot</h3>
                  <p className="text-xs text-slate-400">AI guidance for mentee skill intervention.</p>
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
