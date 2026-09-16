"use client";

import React, { useState } from 'react';
import { Bot, Sparkles, Send } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function InstitutionAiPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/institution-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.text) setResponse(data.text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout role="INSTITUTION" userTitle="Institution AI Assistant">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Bot className="h-6 w-6 text-emerald-400" /> Institution Executive AI Copilot
          </h1>
          <p className="text-xs text-slate-400">Ask macro analytics questions grounded strictly in institutional student and industry data.</p>
        </div>

        {response && (
          <Card className="border-emerald-500/30 bg-emerald-950/30">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Executive AI Insight
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {response}
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-800 bg-slate-900/60">
          <CardContent className="p-4">
            <form onSubmit={handleAsk} className="flex gap-2">
              <Input
                placeholder="Ask e.g. What are our key institutional priorities for next quarter?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs text-slate-200"
              />
              <Button type="submit" variant="emerald" disabled={loading} className="gap-2">
                <Send className="h-4 w-4" /> {loading ? 'Analyzing...' : 'Ask Copilot'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
