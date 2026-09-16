'use client';

import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Lock,
  Cpu,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminAiUsagePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAiUsage() {
      try {
        const res = await fetch('/api/admin/ai-usage');
        const json = await res.json();
        if (json.data) setData(json.data);
      } catch (err) {
        console.error('Failed to load AI usage stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAiUsage();
  }, []);

  if (loading || !data) {
    return (
      <PortalLayout role="ADMIN" userTitle="Super Administrator">
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-3 text-slate-300">
            <BrainCircuit className="w-8 h-8 text-rose-400 animate-pulse" />
            <span className="text-lg font-medium">Loading AI Safety & Usage Telemetry...</span>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const { totalRequests, successfulRequests, failedRequests, avgLatencyMs, totalTokens, logs } = data;

  return (
    <PortalLayout role="ADMIN" userTitle="Super Administrator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
        
        {/* Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 shadow-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assistive AI Governance & Safety</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            AI Usage Monitoring & Safety Policy
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            Track token volume, latency benchmarks, feature utilization, and strictly enforced human-in-the-loop decision boundaries.
          </p>
        </div>

        {/* 7.13 AI SAFETY GOVERNANCE MANIFESTO */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-teal-500/30 shadow-2xl space-y-3">
          <div className="flex items-center space-x-2 text-teal-300 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>AI Safety Governance Principles (Assistive Boundaries)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Cyclops AI models operate strictly as <strong>assistive intelligence</strong>. Human decision makers (Recruiters, Placement Officers, Faculty Mentors, and Platform Administrators) remain solely responsible for Hiring, Rejections, Verifications, Moderation, and Placement actions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero Autonomous Rejections</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Human Recruiter Final Choice</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Strict RLS & Data Isolation</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>No Secret / Key Leakage</span>
            </div>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase">Total AI Requests</div>
            <div className="text-3xl font-black text-white">{totalRequests}</div>
            <div className="text-[11px] text-teal-400 font-medium">{successfulRequests} Successful</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase">Avg Response Latency</div>
            <div className="text-3xl font-black text-emerald-400">{avgLatencyMs}ms</div>
            <div className="text-[11px] text-emerald-400 font-medium">Fast inference pipeline</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase">Total Tokens Processed</div>
            <div className="text-3xl font-black text-purple-300">{totalTokens.toLocaleString()}</div>
            <div className="text-[11px] text-purple-400 font-medium">Prompts & Completions</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase">Active Models</div>
            <div className="text-xl font-black text-rose-300 mt-1">Gemini-1.5-Flash</div>
            <div className="text-[11px] text-rose-400 font-medium">Assistive Copilot & ATS</div>
          </div>
        </div>

        {/* AI Usage Logs (7.12) */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <BrainCircuit className="w-5 h-5 text-rose-400" />
            <span>Recent AI Invocation Telemetry</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold">
                  <th className="pb-3 px-3">Feature Name</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Prompt Tokens</th>
                  <th className="pb-3 px-3">Output Tokens</th>
                  <th className="pb-3 px-3">Latency</th>
                  <th className="pb-3 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{log.feature_name}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{log.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{log.prompt_tokens}</td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{log.completion_tokens}</td>
                    <td className="py-3 px-3 text-teal-300 font-mono">{log.latency_ms}ms</td>
                    <td className="py-3 px-3 text-right text-slate-500">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
