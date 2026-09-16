"use client";

import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Target, ShieldCheck } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function IndustryAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/industry/analytics')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setAnalytics(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ['#10B981', '#0F766E', '#F59E0B', '#3B82F6', '#6366F1'];

  return (
    <PortalLayout role="INDUSTRY">
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
              Skill Demand Intelligence
            </Badge>
            <h1 className="text-2xl font-extrabold text-white mt-1">Recruitment & Skill Supply Analytics</h1>
            <p className="text-xs text-slate-400">Macro analytics comparing industry skill demand against candidate supply.</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chart 1: Skill Supply vs Demand */}
          <Card className="lg:col-span-7 border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" /> Industry Skill Demand vs Candidate Supply
            </h3>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.skillSupplyDemandData || []}>
                  <XAxis dataKey="skill" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ background: '#090D0B', borderColor: '#1e293b', fontSize: '11px' }} />
                  <Bar dataKey="demandScore" fill="#10B981" name="Industry Requirement" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="candidateAvgScore" fill="#334155" name="Candidate Avg Proficiency" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 2: Recruitment Application Funnel */}
          <Card className="lg:col-span-5 border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-400" /> Recruitment Funnel Distribution
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.applicationFunnel || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    nameKey="stage"
                    label={({ stage, count }) => `${stage}: ${count}`}
                  >
                    {(analytics?.applicationFunnel || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#090D0B', borderColor: '#1e293b', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* Skill Deficit Warning Card */}
        <Card className="border-amber-500/30 bg-amber-950/10 p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">AI Skill Supply Insight</span>
          <h4 className="text-xs font-bold text-white">Biostatistics & Regulatory Knowledge Deficit Detected</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Candidate proficiency in Biostatistics averages 45% against an 82% industry requirement score (37-point shortage). Recommended action: Offer 10-hour micro-course bridges or partner with academic institutions via the Collaboration Hub.
          </p>
        </Card>

      </div>
    </PortalLayout>
  );
}
