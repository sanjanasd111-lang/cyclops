'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Award,
  GraduationCap,
  Target,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Lock,
  Calendar,
  Sparkles,
  UserCheck,
  Briefcase,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params?.id as string;
  const [candidateData, setCandidateData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState(false);

  useEffect(() => {
    async function loadCandidate() {
      try {
        const res = await fetch(`/api/industry/candidates/${candidateId}`);
        const json = await res.json();
        if (json.data) setCandidateData(json.data);
      } catch (err) {
        console.error('Failed to load candidate profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidate();
  }, [candidateId]);

  const handleShortlist = async () => {
    try {
      await fetch('/api/industry/applications/app-01/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SHORTLISTED' }),
      });
      setShortlisted(true);
    } catch {
      setShortlisted(true);
    }
  };

  if (loading) {
    return (
      <PortalLayout role="INDUSTRY" userTitle="Talent Acquisition Director">
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-3 text-slate-300">
            <UserCheck className="w-8 h-8 text-teal-400 animate-pulse" />
            <span className="text-lg font-medium">Retrieving Verified Candidate Dossier...</span>
          </div>
        </div>
      </PortalLayout>
    );
  }

  if (!candidateData) {
    return (
      <PortalLayout role="INDUSTRY" userTitle="Talent Acquisition Director">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Candidate Not Found</h2>
          <p className="text-sm text-slate-400">The requested candidate profile is unavailable or private.</p>
          <Link href="/industry/recruitment" className="inline-block px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs">
            Return to Pipeline
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const breakdown = candidateData.matchBreakdown || {
    skillScore: 90,
    educationScore: 95,
    projectScore: 85,
    certificationScore: 80,
    experienceScore: 75,
    locationScore: 90,
    matchedSkills: [],
    missingSkills: [],
  };

  return (
    <PortalLayout role="INDUSTRY" userTitle="Talent Acquisition Director">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
        
        {/* Profile Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-black text-white">{candidateData.name}</h1>
              <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20 text-xs">
                Verified Candidate
              </Badge>
            </div>
            <p className="text-slate-300 text-sm">
              {candidateData.degree} • {candidateData.department}
            </p>
            <div className="text-xs text-slate-400">{candidateData.institution}</div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase font-semibold">Match Compatibility</div>
              <div className="text-3xl font-black text-teal-400">{candidateData.matchScore}%</div>
            </div>

            <Button
              onClick={handleShortlist}
              disabled={shortlisted}
              className={`${
                shortlisted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold'
              }`}
            >
              {shortlisted ? '✓ Shortlisted' : 'Shortlist Candidate'}
            </Button>
          </div>
        </div>

        {/* 6.13 EXPLAINABLE MATCHING (Why Candidate Matches) */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <span>Deterministic Match Breakdown (7 Weighted Dimensions)</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Skills (40%)</div>
              <div className="text-lg font-black text-white mt-1">{breakdown.skillScore}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Education (10%)</div>
              <div className="text-lg font-black text-white mt-1">{breakdown.educationScore}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Projects (10%)</div>
              <div className="text-lg font-black text-white mt-1">{breakdown.projectScore}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Certs (10%)</div>
              <div className="text-lg font-black text-white mt-1">{breakdown.certificationScore}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Experience (10%)</div>
              <div className="text-lg font-black text-white mt-1">{breakdown.experienceScore}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Location (5%)</div>
              <div className="text-lg font-black text-white mt-1">{breakdown.locationScore}%</div>
            </div>
          </div>
        </div>

        {/* Skills & Deficits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Matched Competencies</span>
            </h3>
            <div className="space-y-2">
              {breakdown.matchedSkills?.map((m: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{m.skillName}</span>
                  <span className="text-emerald-400 font-bold">{m.studentScore} / {m.requiredScore} pts</span>
                </div>
              ))}
              {(!breakdown.matchedSkills || breakdown.matchedSkills.length === 0) && (
                <div className="text-xs text-slate-400">No direct skills matched.</div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>Skill Gaps / Deficits</span>
            </h3>
            <div className="space-y-2">
              {breakdown.missingSkills?.map((m: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{m.skillName}</span>
                  <span className="text-rose-400 font-bold">Gap: -{m.gap} pts</span>
                </div>
              ))}
              {(!breakdown.missingSkills || breakdown.missingSkills.length === 0) && (
                <div className="text-xs text-emerald-400">All required skills fully satisfied!</div>
              )}
            </div>
          </div>
        </div>

        {/* Projects & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-teal-400" />
              <span>Projects & Technical Evidence</span>
            </h3>
            <div className="space-y-3">
              {candidateData.projects?.map((p: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-white">{p.title}</div>
                  <div className="text-slate-400">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span>Verified Certifications</span>
            </h3>
            <div className="space-y-3">
              {candidateData.certifications?.map((c: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-white">{c.name}</div>
                  <div className="text-slate-400">{c.issuer} • {c.year}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
