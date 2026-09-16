"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SkillGapPage() {
  const [gaps, setGaps] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/institution/skill-gap')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setGaps(resData.data);
        }
      });
  }, []);

  return (
    <PortalLayout role="INSTITUTION" userTitle="Skill Gap Matrix">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-400" /> Institutional Skill Gap Engine
          </h1>
          <p className="text-xs text-slate-400">Critical and high priority skill deficits calculated between industry requirements and student competencies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gaps.map((gap, idx) => (
            <Card key={idx} className="border-slate-800 bg-slate-900/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-white">{gap.skill_name}</CardTitle>
                  <Badge variant="destructive" className="text-[10px]">{gap.priority}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Student Average</span>
                    <span className="text-sm font-bold text-amber-400">{gap.avg_proficiency}%</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Industry Requirement</span>
                    <span className="text-sm font-bold text-emerald-400">75%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Deficit Gap Points</span>
                    <span className="font-mono text-red-400 font-bold">-{gap.gap_points} Points</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(100, gap.gap_points * 2.5)}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
