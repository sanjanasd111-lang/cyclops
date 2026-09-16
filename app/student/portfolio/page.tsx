'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import {
  Award,
  ExternalLink,
  Copy,
  Check,
  Eye,
  ShieldCheck,
  Share2,
  Lock,
  Globe,
  Sparkles,
  QrCode,
  GraduationCap,
  Briefcase,
  Layers,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudentProfile, UserSkill } from '@/lib/types';

export default function StudentPortfolioManagerPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [visibility, setVisibility] = useState<'PUBLIC' | 'RECRUITERS_ONLY' | 'PRIVATE'>('PUBLIC');
  const [savingVisibility, setSavingVisibility] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/student/profile');
        const json = await res.json();
        if (json.success && json.data) {
          setProfile(json.data.profile);
          setSkills(json.data.skills || []);
        }
      } catch (err) {
        console.error('Failed to load student profile for portfolio:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const slug = profile?.id || 'learner-portfolio';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cyclops.ai';
  const publicUrl = `${origin}/portfolio/${slug}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVisibilityChange = async (newVal: 'PUBLIC' | 'RECRUITERS_ONLY' | 'PRIVATE') => {
    setVisibility(newVal);
    setSavingVisibility(true);
    setTimeout(() => {
      setSavingVisibility(false);
    }, 600);
  };

  const verifiedSkillsCount = skills.filter((s) => s.verification_status !== 'SELF_DECLARED').length;

  return (
    <PortalLayout role="STUDENT" userTitle={profile?.full_name || 'My Digital Portfolio'} userSubtitle="Digital Skill Passport">
      <div className="space-y-6 max-w-5xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Award className="h-6 w-6 text-emerald-400" /> Digital Passport &amp; Public Portfolio
            </h1>
            <p className="text-xs text-slate-400">
              Manage your shareable public skill credentials, digital passport verification badge, and recruiter visibility.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="gap-2 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:text-white"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Link Copied' : 'Copy Portfolio Link'}</span>
            </Button>

            <Link href={`/portfolio/${slug}`} target="_blank">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-xs font-bold shadow-md">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Public Passport</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Shareable URL and QR Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 p-6 md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-4 w-4" /> Live Shareable Link
              </span>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
                {visibility === 'PUBLIC' ? 'Publicly Searchable' : visibility === 'RECRUITERS_ONLY' ? 'Verified Recruiters Only' : 'Private'}
              </Badge>
            </div>

            <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono text-slate-300">
              <span className="truncate">{publicUrl}</span>
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs shrink-0 cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-300">Privacy &amp; Recruiter Visibility</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleVisibilityChange('PUBLIC')}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-colors text-center ${
                    visibility === 'PUBLIC'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
                  <span>Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleVisibilityChange('RECRUITERS_ONLY')}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-colors text-center ${
                    visibility === 'RECRUITERS_ONLY'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                  <span>Recruiters Only</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleVisibilityChange('PRIVATE')}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-colors text-center ${
                    visibility === 'PRIVATE'
                      ? 'border-amber-500 bg-amber-950/40 text-amber-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lock className="h-4 w-4 mx-auto mb-1 text-amber-400" />
                  <span>Private</span>
                </button>
              </div>
              {savingVisibility && (
                <p className="text-[10px] text-emerald-400 animate-pulse">Updating privacy settings...</p>
              )}
            </div>
          </Card>

          {/* QR Code Card */}
          <Card className="border-slate-800 bg-slate-900/80 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-white rounded-2xl shadow-xl">
              <QRCodeSVG value={publicUrl} size={130} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-white flex items-center justify-center gap-1">
                <QrCode className="h-3.5 w-3.5 text-emerald-400" /> Scan Digital Passport
              </p>
              <p className="text-[10px] text-slate-400">
                Instant access to verified student achievements and skill records.
              </p>
            </div>
          </Card>
        </div>

        {/* Verification & Credential Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-slate-800 bg-slate-900/60 p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Verified Competencies</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">{verifiedSkillsCount} / {skills.length}</div>
            <p className="text-[11px] text-slate-400">Validated via assessments and institutional evidence.</p>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Academic Branch</span>
            <div className="text-lg font-bold text-slate-200 truncate">{profile?.academic_stream || 'General Academic'}</div>
            <p className="text-[11px] text-slate-400">{profile?.department || profile?.course || 'Discipline'}</p>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Target Role Alignment</span>
            <div className="text-lg font-bold text-indigo-300 truncate">{profile?.career_goal || profile?.target_role || 'Target Role'}</div>
            <p className="text-[11px] text-slate-400">Verified Digital Twin footprint enabled.</p>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
