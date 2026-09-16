"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Trophy,
  Brain,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Bot,
  MessageSquare,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InterviewResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  // AI Coach state
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachAsking, setCoachAsking] = useState(false);
  const [coachHistory, setCoachHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);

  useEffect(() => {
    async function loadResults() {
      if (!sessionId) return;
      try {
        const res = await fetch(`/api/interview/${sessionId}/results`);
        const json = await res.json();
        if (json.success && json.data) {
          setSessionData(json.data.session);
          setReport(json.data.report);
          setQuestions(json.data.questions || []);
        }
      } catch (err) {
        console.error('Failed to load interview results:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [sessionId]);

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
        body: JSON.stringify({ sessionId, userQuestion: query }),
      });
      const data = await res.json();

      setCoachHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer || 'Focus on providing structured answers with quantifiable results.',
        },
      ]);
    } catch {
      setCoachHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'To improve your score, structure responses clearly using the STAR framework and cite measurable outcomes.',
        },
      ]);
    } finally {
      setCoachAsking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-950 text-white">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-emerald-400 animate-pulse" />
          <span className="text-lg font-medium text-slate-300">Retrieving Persisted Interview Report...</span>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 text-slate-100">
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Interview Report Not Found</h2>
          <p className="text-sm text-slate-400">
            We could not retrieve the completed interview evaluation for session &quot;{sessionId}&quot;.
          </p>
          <div className="pt-4 flex justify-center space-x-4">
            <Button onClick={() => window.location.reload()} className="bg-slate-800 hover:bg-slate-700">
              <RefreshCw className="w-4 h-4 mr-2" /> Retry Loading
            </Button>
            <Button onClick={() => router.push('/student/interview')} className="bg-emerald-600 hover:bg-emerald-500">
              Back to Interview Hub
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const overallScore = report.overall_score || 75;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 text-slate-100 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              PERSISTED EVALUATION REPORT
            </span>
            <span className="text-xs text-slate-400">Target Role: {report.target_role}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Interview Performance Report</h1>
          <p className="text-xs text-slate-400">
            Branch: <span className="text-slate-200 font-medium">{report.academic_branch}</span> | Session: {sessionId}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/student/interview">
            <Button variant="outline" className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Start New Interview
            </Button>
          </Link>
          <Link href="/student/interview/history">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md">
              View History <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Score & Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Score Circle Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={overallScore >= 80 ? 'text-emerald-500' : overallScore >= 60 ? 'text-amber-500' : 'text-rose-500'}
                strokeDasharray={`${overallScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white">{overallScore}</span>
              <span className="text-[10px] text-slate-400 font-mono">OUT OF 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-base">
                {overallScore >= 80 ? 'Excellent Performance' : overallScore >= 60 ? 'Good Progress' : 'Needs Reinforcement'}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Evaluated across {report.total_questions || questions.length} branch-specific competency prompts.
            </p>
          </div>
        </div>

        {/* Competency Breakdown Bars */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Competency Score Breakdown</h3>
            <span className="text-xs text-slate-400">Weighted Evaluation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Technical Accuracy (30%)', score: report.technical_score },
              { label: 'Communication & Tone (20%)', score: report.communication_score },
              { label: 'Relevance to Prompt (15%)', score: report.relevance_score },
              { label: 'Clarity & Delivery (10%)', score: report.clarity_score },
              { label: 'Problem Solving (10%)', score: report.problem_solving_score },
              { label: 'Role Alignment (5%)', score: report.role_alignment_score },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="font-mono font-bold text-white">{item.score || 0}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      (item.score || 0) >= 80 ? 'bg-emerald-500' : (item.score || 0) >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.score || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths, Weaknesses & Skill Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Key Strengths */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Demonstrated Strengths</h3>
          </div>
          <ul className="space-y-2">
            {(report.strengths || []).map((s: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Priority Areas to Improve */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Priority Growth Areas</h3>
          </div>
          <ul className="space-y-2">
            {(report.weaknesses || []).map((w: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="text-amber-400 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Action Plan */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Recommended Action Plan</h3>
          </div>
          <ul className="space-y-2">
            {(report.recommendations || []).map((r: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="text-blue-400 font-bold">{idx + 1}.</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question-by-Question Review Accordion */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Detailed Question & Response Review</h3>
          </div>
          <span className="text-xs text-slate-400">{questions.length} Evaluated Questions</span>
        </div>

        <div className="space-y-3">
          {questions.map((q: any, idx: number) => {
            const isExpanded = expandedQuestion === idx;
            const evalObj = q.evaluation || {};
            const ansObj = q.answer || {};
            const qScore = evalObj.overall_score ?? evalObj.score ?? 0;

            return (
              <div key={q.id || idx} className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition-all"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-mono font-bold text-slate-300">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white line-clamp-1">{q.question}</p>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{q.category || 'TECHNICAL'}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{q.difficulty || 'MEDIUM'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                        qScore >= 80
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : qScore >= 60
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {qScore}%
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-3 text-xs">
                    <div>
                      <h4 className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider mb-1 font-mono">Your Answer:</h4>
                      <p className="p-3 rounded-lg bg-slate-950 border border-slate-800/60 text-slate-200 italic">
                        &quot;{ansObj.answer_text || ansObj.answerText || 'No answer recorded.'}&quot;
                      </p>
                    </div>

                    {evalObj.feedback && (
                      <div>
                        <h4 className="font-semibold text-emerald-400 text-[11px] uppercase tracking-wider mb-1 font-mono">AI Evaluation Feedback:</h4>
                        <p className="text-slate-300 leading-relaxed">{evalObj.feedback}</p>
                      </div>
                    )}

                    {evalObj.better_approach || evalObj.betterApproach ? (
                      <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-indigo-200">
                        <span className="font-bold text-indigo-300">Recommended Model Answer Approach: </span>
                        {evalObj.better_approach || evalObj.betterApproach}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive AI Interview Coach Drawer */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-xl space-y-4">
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
            `Why did I get ${overallScore}%?`,
            'How can I improve my communication?',
            'Give me a STAR model answer structure',
            'What should I practice next?',
          ].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleAskCoach(q)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Coach Chat History */}
        {coachHistory.length > 0 && (
          <div className="space-y-3 max-h-60 overflow-y-auto p-3 rounded-xl bg-slate-950 border border-slate-800">
            {coachHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-800 text-slate-200 ml-6 text-right'
                    : 'bg-indigo-950/40 text-indigo-200 border border-indigo-500/20 mr-6'
                }`}
              >
                <div className="font-bold text-[10px] text-slate-400 mb-1">
                  {msg.role === 'user' ? 'You' : 'AI Coach'}
                </div>
                {msg.text}
              </div>
            ))}
          </div>
        )}

        {/* Coach Input Box */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={coachQuestion}
            onChange={(e) => setCoachQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskCoach()}
            placeholder="Ask your AI Coach how to improve your score..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <Button
            onClick={() => handleAskCoach()}
            disabled={coachAsking}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2.5 rounded-xl font-semibold"
          >
            {coachAsking ? 'Asking...' : 'Ask Coach'}
          </Button>
        </div>
      </div>
    </div>
  );
}
