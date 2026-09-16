'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Brain,
  Mic,
  MicOff,
  Send,
  SkipForward,
  LogOut,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function InterviewSimulatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Evaluation & Processing States
  const [evaluating, setEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<any>(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const recognitionRef = useRef<any>(null);

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setDurationSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Speech API Initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          setAnswerText((prev) => (prev ? `${prev} ${currentTranscript}` : currentTranscript));
        };

        rec.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Load Session Data
  useEffect(() => {
    async function loadSession() {
      if (!sessionId) {
        alert('Invalid session parameter.');
        router.push('/student/interview');
        return;
      }

      try {
        const res = await fetch(`/api/student/interview/session?sessionId=${sessionId}`);
        const data = await res.json();
        if (data.session) {
          setSession(data.session);
          setQuestions(data.session.questions || []);
        } else {
          alert('Interview session not found.');
          router.push('/student/interview');
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [sessionId, router]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) {
      alert('Please enter or speak your answer before submitting.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setEvaluating(true);
    setCurrentEvaluation(null);

    const isLast = currentIndex === questions.length - 1;

    try {
      const res = await fetch(`/api/interview/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answerText,
          transcript: transcript || undefined,
          inputMode: transcript ? 'VOICE' : 'TEXT',
          isLastQuestion: isLast,
          durationSeconds,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentEvaluation(data.evaluation);

        // Append adaptive next question if returned
        if (data.adaptiveNextQuestion) {
          setQuestions((prev) => {
            const nextArr = [...prev];
            nextArr.splice(currentIndex + 1, 0, data.adaptiveNextQuestion);
            return nextArr;
          });
        }
      } else {
        alert(data.error || 'Evaluation error.');
      }
    } catch {
      alert('Failed to evaluate answer.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentEvaluation(null);
    setAnswerText('');
    setTranscript('');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push(`/student/interview/${sessionId}/results`);
    }
  };

  const handleSkipQuestion = () => {
    setCurrentEvaluation(null);
    setAnswerText('');
    setTranscript('');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push(`/student/interview/${sessionId}/results`);
    }
  };

  const handleEndInterview = async () => {
    if (confirm('Are you sure you want to end this interview session?')) {
      router.push(`/student/interview/report/${sessionId}`);
    }
  };

  if (loading || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
          <span className="text-lg font-medium text-slate-300">Initializing Live AI Interview Environment...</span>
        </div>
      </div>
    );
  }

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
            {currentIndex + 1} / {questions.length}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target: {session?.target_role}</div>
            <div className="text-sm font-bold text-white">Question {currentIndex + 1} of {questions.length}</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold font-mono">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{formatTimer(durationSeconds)}</span>
          </div>

          <button
            onClick={handleEndInterview}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center space-x-1 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider">
            Category: {currentQuestion.category}
          </span>

          {currentQuestion.is_adaptive_followup && (
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Adaptive Follow-up</span>
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
          {currentQuestion.question}
        </h2>

        {currentQuestion.expected_topics && currentQuestion.expected_topics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-medium text-slate-400">Key Focus Areas:</span>
            {currentQuestion.expected_topics.map((topic: string, i: number) => (
              <span key={i} className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Answer Area */}
      {!currentEvaluation ? (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-400">Your Response</label>

            {speechSupported ? (
              <button
                type="button"
                onClick={toggleListening}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Listening... (Click to Stop)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Start Voice Input</span>
                  </>
                )}
              </button>
            ) : (
              <span className="text-xs text-slate-500">Text Mode Active</span>
            )}
          </div>

          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={6}
            placeholder="Type your response here, or click 'Start Voice Input' to speak naturally..."
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleSkipQuestion}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all flex items-center space-x-1.5"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip Question</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={evaluating || !answerText.trim()}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {evaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Evaluation Card View */
        <div className="p-6 rounded-2xl bg-slate-900/95 border border-blue-500/40 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-extrabold text-lg">
                {currentEvaluation.overall_score || currentEvaluation.score || 75}%
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Answer Evaluation & Feedback</h3>
                <p className="text-xs text-slate-400">Grounded analysis across 6 rubric dimensions</p>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Complete Report'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scores breakdown grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Technical Accuracy', score: currentEvaluation.technical_score ?? currentEvaluation.technicalAccuracy },
              { label: 'Relevance', score: currentEvaluation.relevance_score ?? currentEvaluation.relevance },
              { label: 'Clarity & Tone', score: currentEvaluation.clarity_score ?? currentEvaluation.clarity },
              { label: 'Structure (STAR)', score: currentEvaluation.structure_score ?? currentEvaluation.structure },
              { label: 'Completeness', score: currentEvaluation.completeness_score ?? currentEvaluation.completeness },
              { label: 'Role Alignment', score: currentEvaluation.role_alignment_score ?? currentEvaluation.roleAlignment },
            ].map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">{m.label}</div>
                <div className="text-lg font-bold text-white mt-0.5">{m.score ?? 0}%</div>
              </div>
            ))}
          </div>

          {/* Evaluator Feedback */}
          {currentEvaluation.feedback && (
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-1">
              <div className="text-xs font-bold text-blue-400">Interviewer Assessment</div>
              <p className="text-xs text-slate-300 leading-relaxed">{currentEvaluation.feedback}</p>
            </div>
          )}

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>What You Did Well</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {(currentEvaluation.strengths || ['Clear articulation', 'Direct answer']).map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Areas to Improve</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {(currentEvaluation.improvements || ['Include practical metrics', 'Elaborate on edge cases']).map((imp: string, i: number) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Corrected Model Answer */}
          {(currentEvaluation.better_approach || currentEvaluation.betterApproach) && (
            <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Corrected Model Answer &amp; Ideal Approach
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {currentEvaluation.better_approach || currentEvaluation.betterApproach}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InterviewSimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
            <span className="text-lg font-medium text-slate-300">Loading AI Interview Simulator...</span>
          </div>
        </div>
      }
    >
      <InterviewSimulatorContent />
    </Suspense>
  );
}

