"use client";

import React, { useState, useEffect } from 'react';
import { Grid, BarChart3 } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function BranchSkillHeatmapPage() {
  const [heatmap, setHeatmap] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/institution/skills')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data?.heatmap) {
          setHeatmap(resData.data.heatmap);
        }
      });
  }, []);

  const branches = Array.from(new Set(heatmap.map((h) => h.branch)));
  const skills = Array.from(new Set(heatmap.map((h) => h.skill_name)));

  return (
    <PortalLayout role="INSTITUTION" userTitle="Branch Skill Heatmap">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Grid className="h-6 w-6 text-emerald-400" /> Academic Branch x Skill Heatmap Matrix
          </h1>
          <p className="text-xs text-slate-400">Real calculated average proficiency across academic departments and core competencies.</p>
        </div>

        <Card className="border-slate-800 bg-slate-900/60 overflow-x-auto">
          <CardContent className="p-6">
            <table className="w-full text-left text-xs text-slate-200">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-3">Skill / Competency</th>
                  {branches.map((b) => (
                    <th key={b} className="p-3 text-center">{b}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill} className="border-b border-slate-800/50">
                    <td className="p-3 font-bold text-white">{skill}</td>
                    {branches.map((branch) => {
                      const cell = heatmap.find((h) => h.skill_name === skill && h.branch === branch);
                      const score = cell ? cell.avg_proficiency : 0;
                      return (
                        <td key={branch} className="p-3 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded font-mono font-bold text-xs ${
                              score >= 75
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : score >= 50
                                ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                                : 'bg-red-950 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {score}%
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
