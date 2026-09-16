"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Award, Target, Compass, ArrowRight, BrainCircuit, CheckCircle2, AlertCircle } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function AssessmentResultsPage() {
  const categoryResults = [
    { skill: 'Ayurvedic Pharmacology', score: 92, status: 'Strong' },
    { skill: 'Clinical Research', score: 86, status: 'Strong' },
    { skill: 'Research Methodology', score: 78, status: 'Strong' },
    { skill: 'Scientific Writing', score: 71, status: 'Developing' },
    { skill: 'Data Analysis', score: 48, status: 'Needs Development' },
    { skill: 'Biostatistics', score: 45, status: 'Needs Development' },
    { skill: 'Regulatory Knowledge', score: 42, status: 'Needs Development' },
  ];

  return (
    <PortalLayout role="STUDENT">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="emerald" className="font-mono text-[11px]">Assessment Complete</Badge>
            <h1 className="text-2xl font-extrabold">Skill Competency Results</h1>
            <p className="text-xs text-slate-300 max-w-lg">
              Your assessment answers have been scored deterministically. Your skill competencies have been updated in your Skill Digital Twin.
            </p>
          </div>

          <div className="text-center p-4 rounded-xl bg-slate-950 border border-slate-800 min-w-[140px]">
            <div className="text-3xl font-black text-emerald-400 font-mono">78%</div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Overall Skill DNA Score</div>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div className="md:col-span-7 space-y-4">
            <Card className="border-slate-800 bg-slate-900/90 text-white p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Category Score Breakdown</h3>

              <div className="space-y-3">
                {categoryResults.map((item) => (
                  <div key={item.skill} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-200">{item.skill}</span>
                      <span className={`font-mono font-bold ${
                        item.score >= 75 ? 'text-emerald-400' : item.score >= 60 ? 'text-teal-400' : 'text-amber-400'
                      }`}>{item.score}%</span>
                    </div>
                    <Progress value={item.score} indicatorClassName={
                      item.score >= 75 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-teal-500' : 'bg-amber-500'
                    } />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="md:col-span-5 space-y-4">
            <Card className="border-slate-800 bg-slate-900/90 text-white p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">What This Means</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You demonstrate strong communication and clinical research fundamentals. Your highest-priority development areas are regulatory knowledge and quantitative biostatistics.
              </p>

              <div className="pt-2 space-y-2">
                <Link href="/student/skills/digital-twin" className="block w-full">
                  <Button variant="emerald" size="sm" className="w-full gap-1 text-xs">
                    View Skill Digital Twin <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>

                <Link href="/student/skill-gap" className="block w-full">
                  <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                    View Skill Gap Analysis
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </PortalLayout>
  );
}
