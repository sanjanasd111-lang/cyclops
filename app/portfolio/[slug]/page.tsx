'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  GraduationCap,
  Award,
  Briefcase,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Brain,
  FileText,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function CandidatePortfolioPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetch('/api/student/profile');
        const json = await res.json();
        if (json.data?.profile) {
          setProfile(json.data.profile);
          setSkills(json.data.skills || []);
        }
      } catch (err) {
        console.error('Failed to load portfolio:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [slug]);

  if (loading || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3 text-slate-300">
          <Brain className="w-8 h-8 text-teal-400 animate-pulse" />
          <span className="text-lg font-medium">Loading Verified Digital Passport Portfolio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-16">
      {/* Top Banner & Identity Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center font-black text-white text-2xl shadow-lg">
              {profile.full_name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-white">{profile.full_name || 'Aditi Sharma'}</h1>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Candidate</span>
                </span>
              </div>
              <p className="text-xs text-teal-300 font-semibold mt-0.5">{profile.target_role || 'Software Engineer'}</p>
              <div className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{profile.institution_name || 'RUAS Institute of Technology'}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>{profile.academic_stream || 'Computer Science'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-center">
            <div className="text-[10px] font-bold uppercase text-slate-400">Career Readiness Score</div>
            <div className="text-2xl font-black text-white mt-0.5">{profile.overall_readiness_score || 82}%</div>
            <div className="text-[10px] text-emerald-400 font-semibold">Grounded Score</div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
          {profile.bio || 'Final year Computer Science student specializing in scalable software design, web technologies, and database optimization.'}
        </p>
      </div>

      {/* Verified Skills Grid */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Award className="w-5 h-5 text-teal-400" />
          <span>Verified Skill Competencies ({skills.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {skills.map((s) => (
            <div key={s.id || s.skill_name} className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{s.skill_name}</div>
                <div className="text-[10px] text-slate-400">{s.category || 'Core Competency'}</div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold">
                {s.proficiency_score}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Projects */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Briefcase className="w-5 h-5 text-blue-400" />
          <span>Featured Technical Projects</span>
        </h2>

        <div className="space-y-4">
          {(profile.projects || [
            {
              title: 'Distributed Microservices & API Gateway',
              description: 'Engineered a high-performance RESTful API gateway with automated request caching and OAuth2 authentication.',
              skills_used: ['JavaScript', 'Node.js', 'React', 'SQL'],
            },
          ]).map((p: any) => (
            <div key={p.title} className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
              <div className="text-sm font-bold text-white">{p.title}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.skills_used?.map((sk: string) => (
                  <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
