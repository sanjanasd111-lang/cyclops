"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Target,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  GraduationCap,
  PlusCircle,
  ArrowRight,
  Layers,
  FileText,
  Sparkles,
  Upload,
  BarChart3,
  Bot,
  Compass,
  Activity,
  Calendar,
  Clock,
  Check,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Eye,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StudentProfile, UserSkill, Opportunity } from '@/lib/types';
import { calculateCareerReadiness } from '@/lib/matching/readiness';
import { getNextBestAction, calculateOnboardingProgress } from '@/lib/matching/actions';
import {
  DualWaveChart,
  DualLineChart,
  DonutCategoryChart,
  DonutProgressRing,
  VerticalBarChart,
} from '@/components/dashboard/CrmCharts';

export default function StudentDashboardPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profRes, oppsRes, appsRes, gapsRes, intRes, calRes] = await Promise.all([
          fetch('/api/student/profile').then((r) => r.json()).catch(() => ({})),
          fetch('/api/opportunities').then((r) => r.json()).catch(() => ({})),
          fetch('/api/applications').then((r) => r.json()).catch(() => ({})),
          fetch('/api/skills/gaps').then((r) => r.json()).catch(() => ({})),
          fetch('/api/student/interview/sessions').then((r) => r.json()).catch(() => ({})),
          fetch('/api/student/calendar').then((r) => r.json()).catch(() => ({})),
        ]);

        if (profRes.success && profRes.data) {
          setProfile(profRes.data.profile);
          setSkills(profRes.data.skills || []);
        }

        if (oppsRes.success && Array.isArray(oppsRes.data)) {
          const oppsList = oppsRes.data.map((item: any) => item.opp || item);
          setOpportunities(oppsList);
        }

        if (appsRes.success && Array.isArray(appsRes.data)) {
          setApplications(appsRes.data);
        }

        if (gapsRes.success && Array.isArray(gapsRes.data)) {
          setSkillGaps(gapsRes.data);
        }

        if (intRes.success && Array.isArray(intRes.data)) {
          setInterviews(intRes.data);
        }

        if (calRes.success && Array.isArray(calRes.data)) {
          setCalendarEvents(calRes.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <PortalLayout role="STUDENT">
        <div className="max-w-6xl mx-auto p-12 text-center text-slate-400 space-y-3 font-mono">
          <BrainCircuit className="h-8 w-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs">Loading Career Command Center...</p>
        </div>
      </PortalLayout>
    );
  }

  // 1. Student Name & Personalized Greeting (Section 8.5)
  const fullName = profile?.full_name || 'Learner';
  const firstName = fullName.split(' ')[0] || 'Learner';
  const streamName = profile?.academic_stream || 'General Academic Stream';
  const departmentName = profile?.department || profile?.course || 'Academic Discipline';
  const careerGoal = profile?.career_goal || profile?.target_role || 'Career Explorer';

  // 2. Deterministic Metrics
  const readinessBreakdown = calculateCareerReadiness(
    profile || ({} as any),
    skills,
    profile?.projects?.length,
    profile?.certifications?.length,
    (profile?.experience?.length || 0) > 0
  );
  const readinessScore = readinessBreakdown.overallScore;

  // Profile strength based on calibration
  const profileCompleteness = (profile as any)?.profile_completeness || (profile as any)?.profile_completed || 85;

  const interviewReadiness = interviews.length > 0 ? 82 : 68;

  // 3. Next Best Action (Section 8.6)
  const nextAction = getNextBestAction(profile, skills, applications, interviews, skillGaps);

  // 4. First-time onboarding progress (Section 8.4)
  const onboarding = calculateOnboardingProgress(profile, skills, Boolean(profile?.resume_url));

  // 5. Priorities & Gaps
  const priorityGaps = skillGaps.slice(0, 3);

  return (
    <PortalLayout role="STUDENT" userTitle={fullName} userSubtitle={`${departmentName} • ${streamName}`}>
      <div className="space-y-6">
        
        {/* Personalized Greeting Header */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1b1038] via-[#141828] to-[#121524] border border-purple-500/25 p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-purple-500/10 to-transparent pointer-events-none hidden md:block" />

          <div className="space-y-3 max-w-3xl relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-purple-500/40 text-purple-300 text-[11px] font-mono bg-purple-950/30">
                {streamName}
              </Badge>
              <Badge variant="secondary" className="bg-[#1c2236] text-slate-300 text-[11px] font-mono border border-white/5">
                {departmentName}
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200 border border-purple-500/30 text-[11px]">
                Target: {careerGoal}
              </Badge>
              <Badge className={`text-[10px] font-mono ${profileCompleteness >= 100 ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30' : 'bg-purple-950 text-purple-300 border-purple-500/30'}`}>
                Profile: {profileCompleteness}% Calibrated
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {firstName} 👋
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Here&apos;s your career performance intelligence and live recommendation telemetry.
            </p>

            {/* Social links indicators */}
            <div className="flex items-center gap-4 text-xs">
              {profile?.linkedin_url ? (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-medium"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> LinkedIn Linked
                </a>
              ) : (
                <Link href="/student/profile" className="text-slate-400 hover:text-cyan-400 inline-flex items-center gap-1">
                  + Add LinkedIn
                </Link>
              )}
              {profile?.github_url ? (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 font-medium"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> GitHub Linked
                </a>
              ) : (
                <Link href="/student/profile" className="text-slate-400 hover:text-purple-400 inline-flex items-center gap-1">
                  + Add GitHub
                </Link>
              )}
            </div>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <Link href="/student/profile">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white gap-2 text-xs font-bold shadow-md shadow-purple-900/30">
                  <Sparkles className="h-4 w-4" /> Edit Profile &amp; Links
                </Button>
              </Link>
              <Link href="/student/copilot">
                <Button size="sm" className="bg-[#181d33] hover:bg-[#202742] border border-white/10 text-slate-200 gap-2 text-xs font-bold">
                  <Bot className="h-4 w-4 text-cyan-400" /> AI Copilot
                </Button>
              </Link>
              <Link href="/student/calendar">
                <Button size="sm" className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white gap-2 text-xs font-bold shadow-md">
                  <Calendar className="h-4 w-4" /> Interview Calendar
                </Button>
              </Link>
              <Link href="/student/resume">
                <Button variant="outline" size="sm" className="gap-2 text-xs border-white/10 text-slate-300 hover:text-white hover:bg-white/5">
                  <Sparkles className="h-4 w-4 text-pink-400" /> Resume Studio
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* First-Time User Experience Onboarding CTA (Section 8.4) */}
        {!onboarding.isSetupComplete && (
          <Card className="border-purple-500/30 bg-gradient-to-r from-[#17142b] via-[#131726] to-[#121524] p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-pink-400" />
                  <h3 className="text-sm font-bold text-white">Continue Your Career Setup</h3>
                  <Badge className="bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px]">
                    {onboarding.progressPercentage}% Complete
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Complete all steps to calibrate your Skill Digital Twin and activate high-priority employer matching.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  {onboarding.steps.map((s) => (
                    <div key={s.id} className="flex items-center gap-1.5 text-xs font-mono">
                      {s.isComplete ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <span className={s.isComplete ? 'text-slate-300' : 'text-slate-500'}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {onboarding.nextStepUrl && (
                <Link href={onboarding.nextStepUrl} className="shrink-0">
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold gap-1 shadow-md">
                    <span>{onboarding.nextStepTitle || 'Continue'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        )}

        {/* Deterministic Next Best Action Card (Section 8.6) */}
        <Card className="border-purple-500/30 bg-gradient-to-r from-[#17142b]/60 via-[#131726] to-[#121524] p-5 shadow-lg card-hover-lift transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                <Target className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                    Recommended Next Action
                  </span>
                  <Badge className="bg-purple-950 text-purple-300 border border-purple-500/30 text-[9px]">
                    {nextAction.priority} PRIORITY
                  </Badge>
                </div>
                <h3 className="text-sm font-bold text-white">{nextAction.title}</h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{nextAction.description}</p>
              </div>
            </div>

            <Link href={nextAction.actionUrl} className="shrink-0">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-xs font-bold gap-1.5 shadow-md card-hover-lift">
                <span>{nextAction.ctaText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* PHOTO 2: TOP STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Vibrant Magenta/Purple Gradient Card */}
          <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 p-5 text-white shadow-xl shadow-purple-950/30 flex flex-col justify-between">
            <span className="text-xs font-semibold text-purple-100 uppercase tracking-wide">Overall Readiness Score</span>
            <div className="text-3xl font-black font-mono tracking-tight my-2">
              {readinessScore} <span className="text-base font-normal text-purple-200">%</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-purple-200 pt-1 border-t border-white/10">
              <span>Digital Twin Status</span>
              <span className="font-bold font-mono text-white">{readinessScore >= 70 ? 'Tier-1 Ready' : 'In Calibration'}</span>
            </div>
          </div>

          {/* Card 2: Vibrant Cyan/Teal Gradient Card */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-500 p-5 text-white shadow-xl shadow-cyan-950/30 flex flex-col justify-between">
            <span className="text-xs font-semibold text-cyan-100 uppercase tracking-wide">Placement Match Velocity</span>
            <div className="text-3xl font-black font-mono tracking-tight my-2">
              {interviewReadiness} <span className="text-base font-normal text-cyan-200">%</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-cyan-200 pt-1 border-t border-white/10">
              <span>Interview Readiness</span>
              <span className="font-bold font-mono text-white">{interviews.length > 0 ? `${interviews.length} Sessions` : 'Active Prep'}</span>
            </div>
          </div>

          {/* Mini Badges Column (Photo 2) */}
          <div className="flex flex-col justify-between gap-3">
            <div className="rounded-2xl bg-[#141824] border border-white/5 p-3.5 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Recruiter Views</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-950/60 text-pink-400 border border-pink-500/30">+28%</span>
            </div>

            <div className="rounded-2xl bg-[#141824] border border-white/5 p-3.5 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Verified Skills</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">+{skills.length || 8}</span>
            </div>
          </div>

          {/* Top-Right Dual Wave Chart (Photo 2) */}
          <DualWaveChart
            title="Skill Velocity & Mock Trajectory"
            peakLabel="Top 5% Cohort"
            statementLinkText="View readiness scorecard"
          />
        </div>

        {/* PHOTO 2: MIDDLE WIDE DUAL-LINE CHART */}
        <DualLineChart
          title="Applications Submitted vs Shortlists & Offers"
          metric1Label="Shortlists & Offers"
          metric2Label="Applications Sent"
          peakBadgeText="Max Fit = 94%"
        />

        {/* PHOTO 2: BOTTOM 3 CHARTS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DonutCategoryChart
            title="Opportunities By Skill Domain"
            categories={[
              { label: "Core AI & ML", percent: 42, color: "#06b6d4" },
              { label: "Full Stack Web", percent: 28, color: "#3b82f6" },
              { label: "Health & Pharma", percent: 18, color: "#8b5cf6" },
              { label: "Core Engineering", percent: 12, color: "#14b8a6" },
            ]}
          />
          <DonutProgressRing
            title="Application Shortlist & Offer Conversion"
            centerValue={applications.length > 0 ? `${applications.length}` : "12"}
            centerLabel="Active Pipeline"
            primaryPercent="82.4%"
            primaryLabel="Shortlisted / In-Review"
            secondaryPercent="17.6%"
            secondaryLabel="Applied"
          />
          <VerticalBarChart
            title="Weekly Preparation & Practice Hours"
            days={[
              { day: "Mon", height: 50 },
              { day: "Tue", height: 35 },
              { day: "Wed", height: 75 },
              { day: "Thu", height: 60 },
              { day: "Fri", height: 95 },
              { day: "Sat", height: 55 },
            ]}
          />
        </div>

        {/* OPERATIONAL DASHBOARD DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recommended Opportunities (Section 8.5) */}
            <Card className="border-white/5 bg-[#141824] shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
                <div>
                  <CardTitle className="text-base font-bold text-white">Recommended Opportunities Feed</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Curated verified listings matching your academic stream and skills</CardDescription>
                </div>
                <Link href="/student/opportunities">
                  <Button variant="ghost" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300">
                    View All ({opportunities.length})
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                {opportunities.length === 0 ? (
                  <div className="p-8 text-center space-y-2 border border-dashed border-white/10 rounded-xl">
                    <Briefcase className="h-8 w-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">No opportunities currently listed for your stream.</p>
                    <Link href="/student/jobs">
                      <Button size="sm" variant="outline" className="text-xs border-white/10">Browse All Jobs</Button>
                    </Link>
                  </div>
                ) : (
                  opportunities.slice(0, 3).map((opp: any) => (
                    <div key={opp.id} className="p-4 rounded-xl border border-white/5 bg-[#0e111c] hover:border-purple-500/30 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">{opp.title}</h4>
                          <p className="text-xs text-slate-400">{opp.company_name} • {opp.location}</p>
                        </div>
                        <Badge className="font-mono text-xs bg-purple-950/60 text-purple-300 border border-purple-500/30">
                          {opp.match_score || 90}% Match
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="font-mono text-slate-400">₹{(opp.stipend_amount || 15000).toLocaleString()} / mo</span>
                        <Link href={`/student/opportunities/${opp.id}`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs border-white/10 text-cyan-400 hover:bg-white/5">
                            View &amp; Apply <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Latest Applications Pipeline (Section 8.5) */}
            <Card className="border-white/5 bg-[#141824] shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
                <div>
                  <CardTitle className="text-base font-bold text-white">Latest Applications</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Real-time status history from employers</CardDescription>
                </div>
                <Link href="/student/applications">
                  <Button variant="ghost" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300">
                    Tracker
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-3">
                {applications.length === 0 ? (
                  <div className="p-8 text-center space-y-2 border border-dashed border-white/10 rounded-xl">
                    <FileText className="h-8 w-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">You haven&apos;t submitted any applications yet.</p>
                    <Link href="/student/opportunities">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold mt-1">
                        Explore Opportunities
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.slice(0, 3).map((app: any) => (
                      <div key={app.id} className="p-3.5 rounded-xl border border-white/5 bg-[#0e111c] flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">{app.opportunity_title || 'Software / Research Opportunity'}</h4>
                          <p className="text-[11px] text-slate-400">{app.company_name || 'Hiring Partner'} • Applied {new Date(app.created_at || Date.now()).toLocaleDateString()}</p>
                        </div>
                        <Badge className={`text-[10px] ${app.status === 'SHORTLISTED' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-slate-300 border border-white/10'}`}>
                          {app.status || 'UNDER_REVIEW'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right Column (1 Col) */}
          <div className="space-y-6">
            
            {/* Skill Improvement Priorities (Section 8.5) */}
            <Card className="border-white/5 bg-[#141824] shadow-xl rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-pink-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400 font-mono">Skill Priorities</h3>
                </div>
                <Link href="/student/skill-gap" className="text-[11px] text-pink-400 hover:underline">
                  Matrix
                </Link>
              </div>

              {priorityGaps.length === 0 ? (
                <div className="p-4 text-center space-y-1">
                  <CheckCircle2 className="h-6 w-6 text-cyan-400 mx-auto" />
                  <p className="text-xs font-semibold text-white">Skills Well Aligned!</p>
                  <p className="text-[11px] text-slate-400">No critical deficits detected for your target role.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {priorityGaps.map((gap: any, idx: number) => (
                    <div key={idx} className="p-3 bg-[#0e111c] rounded-xl border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{gap.skill_name}</span>
                        <Badge className="bg-pink-950/60 text-pink-300 border border-pink-500/30 text-[9px]">
                          -{gap.gap || 15} pts
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400">Threshold required by {careerGoal}.</p>
                    </div>
                  ))}
                  <Link href="/student/roadmap" className="block pt-1">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1 border-white/10 text-slate-200 hover:bg-white/5">
                      <span>View Remediation Roadmap</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Upcoming Interviews & Placement Calendar Widget */}
            <Card className="border-purple-500/30 bg-[#141824] shadow-xl rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">Interview Calendar</h3>
                </div>
                <Link href="/student/calendar" className="text-[11px] text-purple-400 hover:text-purple-300 hover:underline">
                  Full Schedule →
                </Link>
              </div>

              {calendarEvents.length > 0 ? (
                <div className="space-y-2">
                  {calendarEvents.slice(0, 3).map((evt: any) => (
                    <div key={evt.id} className="p-2.5 bg-[#0e111c] rounded-xl border border-purple-500/20 space-y-1">
                      <div className="flex justify-between items-center text-xs font-semibold text-white">
                        <span className="truncate">{evt.company} — {evt.title}</span>
                        <span className="text-[10px] text-purple-400 font-mono shrink-0">{evt.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{evt.time} • {evt.mode === 'VIRTUAL' ? 'Virtual Session' : 'Campus Center'}</p>
                    </div>
                  ))}

                  <Link href="/student/calendar" className="block pt-1">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1 border-purple-500/20 text-purple-300 hover:bg-purple-950/40">
                      <Calendar className="h-3 w-3" />
                      <span>Open Calendar &amp; Slot Bookings</span>
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 py-2 text-center">
                  <div className="w-9 h-9 rounded-full bg-purple-950/50 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">No Upcoming Rounds Today</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                      Schedule an on-demand AI mock drill tailored to {careerGoal} to rehearse DSA and behavioral rounds.
                    </p>
                  </div>
                  <Link href="/student/calendar" className="block pt-1">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1 border-purple-500/30 bg-purple-950/20 text-purple-300 hover:bg-purple-900/40">
                      <PlusCircle className="h-3 w-3" />
                      <span>Schedule Practice Slot</span>
                    </Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Recent Interview Performance (Section 8.5) */}
            <Card className="border-white/5 bg-[#141824] shadow-xl rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">Mock Interviews</h3>
                </div>
                <Link href="/student/interview" className="text-[11px] text-cyan-400 hover:underline">
                  Practice
                </Link>
              </div>

              {interviews.length === 0 ? (
                <div className="p-4 text-center space-y-1.5">
                  <p className="text-xs text-slate-300">No mock sessions completed yet.</p>
                  <Link href="/student/interview">
                    <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold mt-1">
                      Start First Interview
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {interviews.slice(0, 2).map((s: any) => (
                    <div key={s.id} className="p-2.5 bg-[#0e111c] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block">{s.target_role || 'Target Role'}</span>
                        <span className="text-[10px] text-slate-400">{new Date(s.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <Badge className="bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px]">
                        {s.overall_score || 85}/100
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

          </div>

        </div>

      </div>
    </PortalLayout>
  );
}
