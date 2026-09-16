'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  History,
  TrendingUp,
  Brain,
  Award,
  Clock,
  ChevronRight,
  BarChart3,
  Calendar,
  Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

export default function InterviewHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const [sessRes, analRes] = await Promise.all([
          fetch('/api/student/interview/sessions').then((r) => r.json()).catch(() => ({ sessions: [] })),
          fetch('/api/student/interview/analytics').then((r) => r.json()).catch(() => ({ data: null })),
        ]);

        if (sessRes?.sessions) setSessions(sessRes.sessions);
        if (analRes?.data) setAnalytics(analRes.data);
      } catch (err) {
        console.error('Failed to load interview history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
          <span className="text-lg font-medium text-slate-300">Loading Interview History & Performance Analytics...</span>
        </div>
      </div>
    );
  }

  const completedSessions = sessions.filter((s) => s.status === 'COMPLETED');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase">
            <History className="w-3.5 h-3.5" />
            <span>Persisted Attempt History</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Interview History & Analytics</h1>
          <p className="text-slate-300 text-sm">
            Review past mock interview sessions, Zod evaluations, score trends over time, and dimensional analytics.
          </p>
        </div>

        <Link
          href="/student/interview"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2 whitespace-nowrap"
        >
          <Zap className="w-4 h-4" />
          <span>New Mock Interview</span>
        </Link>
      </div>

      {/* Analytics Charts Row */}
      {completedSessions.length > 0 && analytics ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score Over Time Line Chart */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span>Interview Score Over Time</span>
              </h3>
              <span className="text-xs text-emerald-400 font-semibold">
                {analytics.improvementDelta > 0 ? `+${analytics.improvementDelta}% overall improvement` : 'Baseline score established'}
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.scoreOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Performance Bar Chart */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span>Rubric Category Performance</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Avg Across {analytics.totalAttempts} Attempts</span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  />
                  <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
          <Brain className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Completed Interviews Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Complete your first AI mock interview session to unlock historical progress charts, Zod evaluation analytics, and score trends.
          </p>
          <Link
            href="/student/interview"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
          >
            <span>Start First Interview Session</span>
          </Link>
        </div>
      )}

      {/* History Session List */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <span>Past Interview Sessions</span>
        </h3>

        {sessions.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">Zero interview records found in your database profile.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((sess) => {
              const durationMin = Math.max(1, Math.round((sess.duration_seconds || 60) / 60));
              const dateStr = new Date(sess.started_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={sess.id}
                  className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-600 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">{sess.target_role}</span>
                      <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase">
                        {sess.interview_type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center space-x-3">
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{durationMin} mins</span>
                      </span>
                      <span>•</span>
                      <span>{sess.question_count} questions</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-white">{sess.overall_score || 0}%</div>
                      <div className="text-[11px] text-slate-400">Overall Score</div>
                    </div>

                    <Link
                      href={`/student/interview/report/${sess.id}`}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1 transition-all"
                    >
                      <span>View Report</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
