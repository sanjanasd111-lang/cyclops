'use client';

import React from 'react';
import { ATSScoreBreakdown } from '@/lib/types/resume-types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, Sparkles, Plus } from 'lucide-react';

interface ATSAnalysisPanelProps {
  analysis: ATSScoreBreakdown | null;
  onSyncSkillToResume?: (skillName: string) => void;
}

export function ATSAnalysisPanel({ analysis, onSyncSkillToResume }: ATSAnalysisPanelProps) {
  if (!analysis) {
    return (
      <Card className="bg-slate-900 border-slate-800 text-white p-6 text-center">
        <p className="text-sm text-slate-400">Click [Analyze ATS] to evaluate your resume against your target role requirements.</p>
      </Card>
    );
  }

  const getTierColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/30 bg-rose-950/40';
  };

  return (
    <div className="space-y-4">
      {/* Explicit ATS Disclaimer Banner */}
      <div className="bg-indigo-950/50 border border-indigo-800/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-200">
        <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">ATS Compatibility Estimate:</span> {analysis.disclaimer}
        </div>
      </div>

      {/* Main Score Header */}
      <Card className="bg-slate-900 border-slate-800 text-white shadow-xl">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-indigo-500/30 bg-slate-950 shadow-inner shrink-0">
              <span className="text-3xl font-black text-white">{analysis.atsScore}</span>
              <span className="text-[10px] text-slate-400 absolute bottom-3 font-semibold">/100</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Overall ATS Score</h3>
                <Badge className={`text-xs px-2.5 py-0.5 border ${getTierColor(analysis.atsScore)}`}>
                  {analysis.scoreTier}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Calculated deterministically across 7 ATS compatibility dimensions.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-300 mt-2 font-mono">
                <span>Keywords: {analysis.keywordScore}%</span>
                <span>Skills: {analysis.skillAlignment}%</span>
                <span>Format: {analysis.formatScore}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown Metrics */}
      <Card className="bg-slate-900 border-slate-800 text-white">
        <CardHeader className="py-3 px-4 border-b border-slate-800">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Compatibility Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Keyword Match (25%)</span>
              <span className="font-mono">{analysis.keywordScore}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${analysis.keywordScore}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Skill Alignment (20%)</span>
              <span className="font-mono">{analysis.skillAlignment}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.skillAlignment}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Section Completeness (15%)</span>
              <span className="font-mono">{analysis.sectionCompleteness}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${analysis.sectionCompleteness}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Action Bullet Impact (10%)</span>
              <span className="font-mono">{analysis.impactScore}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${analysis.impactScore}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Keyword Matrix */}
      <Card className="bg-slate-900 border-slate-800 text-white">
        <CardHeader className="py-3 px-4 border-b border-slate-800">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Target Keyword Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mb-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Matched Keywords ({analysis.matchedKeywords.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {analysis.matchedKeywords.map((kw) => (
                <span key={kw} className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded text-xs">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {analysis.missingKeywords.length > 0 && (
            <div>
              <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 mb-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Missing Target Keywords ({analysis.missingKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missingKeywords.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 bg-amber-950/60 text-amber-300 border border-amber-800/60 rounded text-xs">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resume ↔ Verified Skill Connection */}
      {analysis.verifiedSkillsMissingFromResume.length > 0 && (
        <Card className="bg-indigo-950/40 border-indigo-800/60 text-white">
          <CardHeader className="py-3 px-4 border-b border-indigo-800/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Resume ↔ Verified Skill Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <p className="text-xs text-slate-300">
              The following skills are verified on your Cyclops profile but currently missing from your resume:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {analysis.verifiedSkillsMissingFromResume.map((sk) => (
                <div key={sk} className="bg-slate-900 border border-indigo-700/60 p-2 rounded-md flex items-center justify-between gap-3 text-xs w-full sm:w-auto">
                  <span className="font-semibold text-white">{sk}</span>
                  {onSyncSkillToResume && (
                    <Button
                      onClick={() => onSyncSkillToResume(sk)}
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] h-6 px-2 gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add to Resume
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actionable AI Recommendations */}
      <Card className="bg-slate-900 border-slate-800 text-white">
        <CardHeader className="py-3 px-4 border-b border-slate-800">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
            AI Resume Coach Advice
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {analysis.recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                rec.type === 'CRITICAL'
                  ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                  : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-white">
                {rec.type === 'CRITICAL' ? (
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                )}
                <span>{rec.title}</span>
              </div>
              <p className="text-slate-300">{rec.description}</p>
              <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                <div><span className="text-indigo-400 font-semibold">Why:</span> {rec.why}</div>
                <div className="mt-1"><span className="text-emerald-400 font-semibold">How to Improve:</span> {rec.howToImprove}</div>
                {rec.suggestedWording && (
                  <div className="mt-1 text-slate-400 font-mono italic">
                    Suggested: &quot;{rec.suggestedWording}&quot;
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
