"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Target, Activity, Award, BookOpen, Briefcase, FileText, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calculateCareerReadiness } from '@/lib/matching/readiness';
import { StudentProfile, UserSkill } from '@/lib/types';

export default function CareerReadinessPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileAndSkills();
  }, []);

  const fetchProfileAndSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/student/profile');
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data.profile);
        setSkills(data.data.skills || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <PortalLayout role="STUDENT">
        <div className="p-8 text-center text-xs text-slate-400 font-mono">Calculating Career Readiness Scorecard...</div>
      </PortalLayout>
    );
  }

  const breakdown = calculateCareerReadiness(profile, skills, profile.projects?.length, profile.certifications?.length, (profile.experience?.length || 0) > 0);

  const dimensionCards = [
    { title: 'Skill Readiness (25%)', score: breakdown.skillScore, icon: Award, color: 'text-emerald-400', desc: 'Average proficiency across verified & declared skills.' },
    { title: 'Assessment Performance (20%)', score: breakdown.assessmentScore, icon: Activity, color: 'text-blue-400', desc: 'Performance score in platform assessments.' },
    { title: 'Practical Experience (15%)', score: breakdown.experienceScore, icon: Briefcase, color: 'text-indigo-400', desc: 'Internships and industry training experience.' },
    { title: 'Verified Projects (15%)', score: breakdown.projectScore, icon: BookOpen, color: 'text-purple-400', desc: 'Hands-on academic and independent capstone projects.' },
    { title: 'Certifications (10%)', score: breakdown.certificationScore, icon: CheckCircle2, color: 'text-amber-400', desc: 'Accredited certificates and badges.' },
    { title: 'Resume Strength (10%)', score: breakdown.resumeScore, icon: FileText, color: 'text-cyan-400', desc: 'ATS compatibility and bullet action verb impact.' },
    { title: 'Career Alignment (5%)', score: breakdown.careerAlignmentScore, icon: Target, color: 'text-rose-400', desc: 'Target role and academic stream alignment.' },
  ];

  // Identify weak areas (score < 75)
  const weakAreas = dimensionCards.filter((d) => d.score < 75);

  return (
    <PortalLayout role="STUDENT">
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[11px] font-mono text-emerald-400">
              <Activity className="h-3.5 w-3.5" /> 7-Part Weighted Career Readiness Engine
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">Career Readiness Index</h1>
            <p className="text-xs text-slate-400">Transparent, weighted readiness score calculated dynamically from your database profile.</p>
          </div>

          <Link href="/student/copilot">
            <Button variant="emerald" size="sm" className="gap-1.5 font-bold text-xs">
              <Sparkles className="h-3.5 w-3.5" /> Ask AI Copilot to Improve Score
            </Button>
          </Link>
        </div>

        {/* Top Overall Score Card */}
        <Card className="border-emerald-500/40 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <Badge className="bg-emerald-950 text-emerald-300 border-emerald-700">Calculated Scorecard</Badge>
            <h2 className="text-xl font-bold text-white">Target Role: {profile.target_role || profile.career_goal || 'Software Engineer'}</h2>
            <p className="text-xs text-slate-300 max-w-md">
              Your overall readiness score is computed from 7 weighted parameters. Changing your actual profile skills, projects, or assessments dynamically updates this score.
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/30 text-center shrink-0 shadow-inner min-w-[180px]">
            <div className="text-5xl font-black text-emerald-400 font-mono tracking-tight">{breakdown.overallScore}%</div>
            <div className="text-[10px] font-mono uppercase text-slate-400 mt-1">Overall Career Readiness</div>
          </div>
        </Card>

        {/* 7-Part Dimension Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dimensionCards.map((dim) => {
            const IconComp = dim.icon;
            return (
              <Card key={dim.title} className="bg-slate-900 border-slate-800 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <IconComp className={`h-4 w-4 ${dim.color}`} />
                    {dim.title}
                  </span>
                  <span className={`text-sm font-black font-mono ${dim.score >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {dim.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${dim.score >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{dim.desc}</p>
              </Card>
            );
          })}
        </div>

        {/* Recommended Actions for Weak Areas */}
        <Card className="bg-slate-900 border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Targeted Improvement Recommendations ({weakAreas.length} Weak Areas Detected)</span>
            </h3>
          </div>

          {weakAreas.length === 0 ? (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Excellent readiness! All 7 dimensions meet the 75%+ career benchmark.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {weakAreas.map((area) => (
                <div key={area.title} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{area.title}</span>
                      <span className="text-[11px] font-mono text-amber-400">Current: {area.score}% (Target: 80%)</span>
                    </div>
                    <p className="text-xs text-slate-400">Gap: -{80 - area.score} pts. {area.desc}</p>
                  </div>

                  <Link href="/student/skills">
                    <Button variant="outline" size="sm" className="text-xs gap-1 border-slate-800 text-slate-200">
                      <span>Take Action</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </PortalLayout>
  );
}
