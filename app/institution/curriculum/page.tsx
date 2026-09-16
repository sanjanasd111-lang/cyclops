"use client";

import React, { useState, useEffect } from 'react';
import { Lightbulb, Bot, Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CurriculumIntelligencePage() {
  const [recs, setRecs] = useState<any[]>([]);
  const [aiOutput, setAiOutput] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetch('/api/institution/curriculum')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setRecs(resData.data);
        }
      });
  }, []);

  const handleAskAi = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Recommend institutional curriculum adjustments' }),
      });
      const data = await res.json();
      if (data.text) setAiOutput(data.text);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <PortalLayout role="INSTITUTION" userTitle="Curriculum Intelligence">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-amber-400" /> Industry-Driven Curriculum Intelligence Engine
            </h1>
            <p className="text-xs text-slate-400">Automated curriculum recommendations derived from real industry skill deficits.</p>
          </div>
          <Button variant="emerald" size="sm" onClick={handleAskAi} disabled={loadingAi} className="gap-2">
            <Sparkles className="h-4 w-4" /> {loadingAi ? 'Analyzing Data...' : 'Generate AI Curriculum Report'}
          </Button>
        </div>

        {aiOutput && (
          <Card className="border-emerald-500/30 bg-emerald-950/30">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Bot className="h-4 w-4" /> AI Curriculum Copilot Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {aiOutput}
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {recs.map((rec) => (
            <Card key={rec.id} className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{rec.action_title}</h3>
                    <p className="text-xs text-slate-400">Skill Focus: <span className="text-emerald-400 font-semibold">{rec.skill_name}</span></p>
                  </div>
                  <Badge variant={rec.priority === 'CRITICAL' ? 'destructive' : 'saffron'} className="text-xs">
                    {rec.recommended_action}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded border border-slate-800">
                  {rec.reasoning}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
