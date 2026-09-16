'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Brain,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Zap,
  Bot,
  Send,
  MessageSquare,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function InterviewReportPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // AI Coach state
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachAsking, setCoachAsking] = useState(false);
  const [coachHistory, setCoachHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);

  useEffect(() => {
    async function loadReport() {
      if (!sessionId) return;
      try {
        const res = await fetch(`/api/interview/${sessionId}/results`);
        const data = await res.json();
        if (data.success && data.data?.session) {
          setSession(data.data.session);
        } else {
          alert('Interview report not found.');
          router.push('/student/interview/history');
        }
      } catch (err) {
        console.error('Failed to load interview report:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [sessionId, router]);

  const handleAskCoach = async (prompt?: string) => {
    const query = prompt || coachQuestion;
    if (!query.trim()) return;

    setCoachAsking(true);
    setCoachHistory((prev) => [...prev, { role: 'user', text: query }]);
    if (!prompt) setCoachQuestion('');

    try {
      const res = await fetch('/api/ai/interview/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userQuestion: query,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setCoachHistory((prev) => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        setCoachHistory((prev) => [...prev, { role: 'assistant', text: 'I am currently analyzing your session metrics. Focus on adding quantifiable STAR metrics to your answers.' }]);
      }
    } catch {
      setCoachHistory((prev) => [...prev, { role: 'assistant', text: 'Error connecting to AI Coach.' }]);
    } finally {
      setCoachAsking(false);
    }
  };

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
          <span className="text-lg font-medium text-slate-300">Generating Grounded Interview Report...</span>
        </div>
      </div>
    );
  }

  const questions = session.questions || [];
  const durationMin = Math.max(1, Math.round((session.duration_seconds || 60) / 60));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/interview/history"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Interview History</span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link
            href="/student/interview"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            Practice Another Interview
          </Link>
        </div>
      </div>

      {/* Report Hero Card */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase">
                {session.interview_type} Mode
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{durationMin} Mins Duration</span>
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Interview Performance Report</h1>
            <p className="text-slate-300 text-sm">Target Role: <strong className="text-white">{session.target_role}</strong></p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[140px]">
            <div className="text-4xl font-black text-blue-400">{session.overall_score || 0}%</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Overall Score</div>
          </div>
        </div>

        {/* 6 Rubric Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-4 border-t border-slate-800">
          {[
            { label: 'Technical', score: session.technical_score },
            { label: 'Relevance', score: session.relevance_score },
            { label: 'Clarity', score: session.clarity_score },
            { label: 'Structure', score: session.structure_score },
            { label: 'Completeness', score: session.completeness_score },
            { label: 'Role Fit', score: session.role_alignment_score },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-center">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">{item.label}</div>
              <div className="text-lg font-bold text-white mt-0.5">{item.score || 75}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Interview Coach Interactive Section */}
      <div className="p-6 rounded-2xl bg-slate-900/95 border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <Bot className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">AI Interview Coach (&quot;Improve My Score&quot;)</h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-medium">Grounded Session Coach</span>
        </div>

        <p className="text-xs text-slate-400">
          Ask your personal AI Coach questions grounded strictly in your answer evaluations for this session:
        </p>

        {/* Quick Question Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            `Why did I get ${session.overall_score || 75}%?`,
            'How can I improve my communication?',
            'Give me a STAR model answer structure',
            'What should I practice next?',
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAskCoach(prompt)}
              disabled={coachAsking}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Conversation History */}
        {coachHistory.length > 0 && (
          <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 max-h-60 overflow-y-auto">
            {coachHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-200 ml-8'
                    : 'bg-slate-800/80 border border-slate-700 text-slate-200 mr-8'
                }`}
              >
                <div className="font-bold text-[10px] uppercase text-slate-400 mb-1">
                  {msg.role === 'user' ? 'You' : 'AI Coach'}
                </div>
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Input Box */}
        <div className="flex space-x-2 pt-2">
          <input
            type="text"
            value={coachQuestion}
            onChange={(e) => setCoachQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskCoach()}
            placeholder="Ask your coach anything about this interview..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={() => handleAskCoach()}
            disabled={coachAsking || !coachQuestion.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center space-x-1 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </div>
      </div>

      {/* Question-by-Question Review */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>Question & Answer Evaluation Breakdown</span>
        </h2>

        {questions.map((q: any, idx: number) => {
          const evalObj = q.evaluation;
          const ansObj = q.answer;

          return (
            <div key={q.id || idx} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 font-bold flex items-center justify-center text-xs">
                    Q{idx + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono uppercase">
                    {q.category}
                  </span>
                </div>

                {evalObj && (
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                    Score: {evalObj.overall_score}%
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white leading-relaxed">{q.question}</h3>

              {/* Candidate Response */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase">Your Answer ({ansObj?.input_mode || 'TEXT'} Input)</div>
                <p className="text-xs text-slate-200 leading-relaxed font-mono">
                  {ansObj?.answer_text || 'No answer submitted.'}
                </p>
              </div>

              {evalObj && (
                <div className="space-y-4 pt-2">
                  {/* STAR Method Breakdown Card */}
                  {(q.category === 'BEHAVIORAL' || q.category === 'RESUME' || q.category === 'MIXED') && (
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-indigo-400 flex items-center justify-between">
                        <span>STAR Method Performance Analysis</span>
                        <span className="text-[11px] text-slate-400">Behavioral Rubric</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
                          <div className="text-[10px] font-semibold text-slate-400 uppercase">Situation (S)</div>
                          <div className="text-base font-bold text-white mt-0.5">{evalObj.star_situation_score || 80}%</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
                          <div className="text-[10px] font-semibold text-slate-400 uppercase">Task (T)</div>
                          <div className="text-base font-bold text-white mt-0.5">{evalObj.star_task_score || 75}%</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
                          <div className="text-[10px] font-semibold text-slate-400 uppercase">Action (A)</div>
                          <div className="text-base font-bold text-white mt-0.5">{evalObj.star_action_score || 85}%</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
                          <div className="text-[10px] font-semibold text-slate-400 uppercase">Result (R)</div>
                          <div className="text-base font-bold text-white mt-0.5">{evalObj.star_result_score || 70}%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-blue-400">Feedback:</strong> {evalObj.feedback}
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-200">
                      <div className="font-bold text-emerald-400 mb-1">Key Strengths:</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {(evalObj.strengths || []).map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200">
                      <div className="font-bold text-amber-400 mb-1">Key Improvements:</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {(evalObj.improvements || []).map((imp: string, i: number) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Better Approach */}
                  {evalObj.better_approach && (
                    <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200">
                      <strong className="text-blue-400 block mb-1">Model Answer Approach:</strong>
                      {evalObj.better_approach}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
