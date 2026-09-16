"use client";

import React, { useState, useEffect } from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StudentProfile, UserSkill } from '@/lib/types';

export default function SkillDigitalTwinPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<UserSkill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.data.profile);
          const userSkills = data.data.skills || [];
          setSkills(userSkills);
          if (userSkills.length > 0) {
            setSelectedSkill(userSkills[0]);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const careerGoal = profile?.career_goal || profile?.target_role || 'Target Specialist';
  const readiness = profile?.overall_readiness_score || 75;
  const deptName = profile?.department || profile?.course || 'Academic Discipline';

  return (
    <PortalLayout role="STUDENT" userSubtitle={`${deptName} Skill Twin`}>
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
              Flagship Capability
            </Badge>
            <h1 className="text-2xl font-extrabold text-white">Skill Digital Twin Network</h1>
            <p className="text-xs text-slate-400">Interactive Skill Graph & Competency Node Inspector for {deptName}</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-lg">
            Readiness: {readiness}%
          </span>
        </div>

        {/* Two Column Layout: Network Graph & Inspector Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Skill Network Visualization Canvas */}
          <div className="lg:col-span-7">
            <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-6 min-h-[420px] relative overflow-hidden flex flex-col justify-between">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center justify-center gap-1">
                  <Target className="h-3 w-3" /> CAREER TARGET NODE
                </span>
                <div className="inline-block px-4 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs shadow-lg">
                  {careerGoal}
                </div>
              </div>

              {/* Skill Nodes Network Grid */}
              {loading ? (
                <div className="text-center text-xs text-slate-400 p-8">Loading skill network graph...</div>
              ) : skills.length === 0 ? (
                <div className="text-center text-xs text-slate-400 p-8 border border-dashed border-slate-800 rounded-xl">
                  No skill nodes mapped yet. Add skills in onboarding or edit profile.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
                  {skills.map((sk) => {
                    const isSelected = selectedSkill?.id === sk.id;
                    const isHigh = sk.proficiency_score >= 75;
                    return (
                      <button
                        key={sk.id}
                        type="button"
                        onClick={() => setSelectedSkill(sk)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-950/60 text-white ring-2 ring-emerald-400/40 shadow-lg'
                            : isHigh
                            ? 'border-slate-800 bg-slate-950 text-slate-200 hover:border-emerald-500/40'
                            : 'border-amber-500/30 bg-slate-950 text-amber-300 hover:border-amber-500'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                          <span className="text-slate-400">{sk.category}</span>
                          <span className="font-bold">{sk.proficiency_score}%</span>
                        </div>
                        <h4 className="text-xs font-bold leading-tight">{sk.skill_name}</h4>
                      </button>
                    );
                  })}
                </div>
              )}

              <p className="text-[10px] text-slate-500 text-center font-mono">
                Click any skill node above to inspect proficiency score, target requirement, evidence audit, and confidence rating.
              </p>
            </Card>
          </div>

          {/* Right: Selected Node Inspector Panel */}
          <div className="lg:col-span-5">
            {selectedSkill ? (
              <Card className="border-emerald-500/30 bg-slate-900/90 p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Node Details</span>
                    <h3 className="text-sm font-bold text-white">{selectedSkill.skill_name}</h3>
                  </div>
                  <Badge variant={selectedSkill.proficiency_score >= 75 ? 'emerald' : 'amber'}>
                    {selectedSkill.proficiency_score}% Score
                  </Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Current Proficiency</span>
                      <span className="font-mono font-bold">{selectedSkill.proficiency_score}%</span>
                    </div>
                    <Progress value={selectedSkill.proficiency_score} indicatorClassName={selectedSkill.proficiency_score >= 75 ? 'bg-emerald-500' : 'bg-amber-500'} />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Target Role Benchmark</span>
                    <div className="flex justify-between font-bold text-white">
                      <span>{careerGoal} Benchmark:</span>
                      <span className="font-mono text-emerald-400">75% Target</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Gap Status:{' '}
                      <span className="font-bold text-amber-400">
                        {Math.max(0, 75 - selectedSkill.proficiency_score)} points deficit
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Verification & Evidence</span>
                    <p className="text-slate-300 font-medium">{selectedSkill.verified_by || 'Self Declared Record'}</p>
                    <p className="text-[10px] text-slate-400">Confidence Rating: {selectedSkill.confidence_score}%</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="emerald" size="sm" className="w-full text-xs gap-1">
                    Improve This Skill <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="border-slate-800 bg-slate-900/90 p-5 text-center text-xs text-slate-400">
                Select a skill node to inspect details.
              </Card>
            )}
          </div>

        </div>
      </div>
    </PortalLayout>
  );
}
