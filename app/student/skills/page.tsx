"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Target, ShieldCheck } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserSkill, StudentProfile } from '@/lib/types';

export default function StudentSkillsPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.data.profile);
          setSkills(data.data.skills || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const deptName = profile?.department || profile?.course || 'Academic Discipline';

  return (
    <PortalLayout role="STUDENT" userSubtitle={`${deptName} Passport`}>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
              Academic & Career Profile
            </Badge>
            <h1 className="text-2xl font-extrabold text-white">Digital Skill Passport</h1>
            <p className="text-xs text-slate-400">{skills.length} Verified & Declared Skill Competencies for {deptName}</p>
          </div>

          <Link href="/student/skills/digital-twin">
            <Button variant="emerald" size="sm" className="gap-1.5 shadow-md text-xs">
              <Target className="h-4 w-4" /> Open Skill Digital Twin
            </Button>
          </Link>
        </div>

        {/* Skill Cards Grid */}
        {loading ? (
          <div className="text-center text-xs text-slate-400 p-8">Loading skill passport...</div>
        ) : skills.length === 0 ? (
          <div className="text-center text-xs text-slate-400 p-8 border border-dashed border-slate-800 rounded-xl">
            No skills added yet. Update your skills in onboarding or dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((sk) => {
              const isVerified = sk.verification_status === 'INSTITUTION_VERIFIED';
              return (
                <Card key={sk.id} className="border-slate-800 bg-slate-900/90 text-white p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{sk.category}</span>
                      <h3 className="text-sm font-bold text-white">{sk.skill_name}</h3>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-black font-mono ${
                        sk.proficiency_score >= 75 ? 'text-emerald-400' : sk.proficiency_score >= 60 ? 'text-teal-400' : 'text-amber-400'
                      }`}>
                        {sk.proficiency_score}%
                      </span>
                    </div>
                  </div>

                  <Progress value={sk.proficiency_score} indicatorClassName={
                    sk.proficiency_score >= 75 ? 'bg-emerald-500' : sk.proficiency_score >= 60 ? 'bg-teal-500' : 'bg-amber-500'
                  } />

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      {isVerified ? sk.verified_by || 'Institution Verified' : 'Self Declared'}
                    </span>
                    <Badge variant={isVerified ? 'verified' : 'secondary'}>
                      {isVerified ? 'Verified' : 'Self Declared'}
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </PortalLayout>
  );
}
