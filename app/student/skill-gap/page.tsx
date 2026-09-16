"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Target, AlertCircle, Compass } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function SkillGapPage() {
  const [targetRole, setTargetRole] = useState('Clinical Research Associate');
  const [gaps, setGaps] = useState<any[]>([]);
  const [topDeficit, setTopDeficit] = useState<any>(null);
  const [studentName, setStudentName] = useState<string>('Student');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills/gaps')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setTargetRole(data.data.target_role || 'Clinical Research Associate');
          setGaps(data.data.gaps || []);
          setTopDeficit(data.data.top_deficit || null);
          if (data.data.student_name) setStudentName(data.data.student_name);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PortalLayout role="STUDENT">
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400 font-mono text-[11px]">
              Dynamic Gap Intelligence Engine
            </Badge>
            <h1 className="text-2xl font-extrabold text-white">Skill Gap Analysis</h1>
            <p className="text-xs text-slate-400">Target Role: <strong className="text-white">{targetRole}</strong> for Candidate <strong className="text-emerald-400">{studentName}</strong></p>
          </div>

          <Link href="/student/roadmap">
            <Button variant="emerald" size="sm" className="gap-1.5 shadow-md">
              <Compass className="h-4 w-4" /> View AI Career Roadmap
            </Button>
          </Link>
        </div>

        {/* Priority Deficit Highlight */}
        {topDeficit && topDeficit.gap > 0 && (
          <Card className="border-amber-500/30 bg-slate-900/90 p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <AlertCircle className="h-4 w-4" /> Priority Deficit Alert
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your target role (<strong className="text-white">{targetRole}</strong>) requires minimum {topDeficit.required}% in <strong className="text-amber-400">{topDeficit.skill_name || topDeficit.skill}</strong>. Your current proficiency score indicates a <strong className="text-amber-400">-{topDeficit.gap}-point development gap</strong>.
            </p>
          </Card>
        )}

        {/* Gap Comparison Matrix */}
        <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono uppercase text-slate-400">
            <span>Skill Competency</span>
            <span>Required vs Current</span>
            <span>Gap Status</span>
          </div>

          {loading ? (
            <div className="text-center text-xs text-slate-400 p-8">Calculating dynamic skill gap matrix...</div>
          ) : (
            <div className="space-y-3 text-xs">
              {gaps.map((item) => (
                <div key={item.skill_name || item.skill} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 gap-3">
                  <div className="space-y-0.5 sm:w-1/3">
                    <h4 className="font-bold text-white">{item.skill_name || item.skill}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">{item.status}</p>
                  </div>

                  <div className="sm:w-1/3 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Req: {item.required}%</span>
                      <span className={item.gap > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                        Current: {item.current}%
                      </span>
                    </div>
                    <Progress value={item.current} indicatorClassName={item.gap > 0 ? 'bg-amber-500' : 'bg-emerald-500'} />
                  </div>

                  <div className="sm:w-1/4 text-right">
                    <Badge variant={item.gap > 0 ? 'amber' : 'emerald'}>
                      {item.gap > 0 ? `Gap: -${item.gap} pts` : 'Competency Met'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </PortalLayout>
  );
}
