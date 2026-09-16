"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ASSESSMENT_QUESTIONS } from '@/lib/db/seed-data';

export default function AssessmentPage() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('Skill Competency Diagnostic Assessment');

  useEffect(() => {
    fetch('/api/student/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.profile) {
          const dept = data.data.profile.department || data.data.profile.course || 'Academic Discipline';
          setTitle(`${dept} Skill Competency Assessment`);
        }
      })
      .catch(() => {});
  }, []);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const currentQuestion = ASSESSMENT_QUESTIONS[currentIdx];

  const handleSelectOption = (optIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optIndex,
    });
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: selectedAnswers }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/student/assessment/results');
      }
    } catch {
      router.push('/student/assessment/results');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = Math.round(((currentIdx + 1) / totalQuestions) * 100);

  return (
    <PortalLayout role="STUDENT">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
              Diagnostic Assessment
            </Badge>
            <h1 className="text-xl font-extrabold text-white">{title}</h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>Time Remaining: 18:45</span>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Question {currentIdx + 1} of {totalQuestions}</span>
            <span>{progressPercent}% Completed</span>
          </div>
          <Progress value={progressPercent} indicatorClassName="bg-emerald-500" />
        </div>

        {/* Question Card */}
        <Card className="border-slate-800 bg-slate-900/90 text-white p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <Badge variant="emerald">{currentQuestion.skill_name}</Badge>
            <span className="text-[10px] font-mono text-slate-500 uppercase">{currentQuestion.difficulty_level} • {currentQuestion.weight} Points</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
            {currentQuestion.question_text}
          </h3>

          <div className="space-y-2.5 pt-2">
            {currentQuestion.options.map((optionText, optIdx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold shadow-md'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <span>{optionText}</span>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Previous
            </Button>

            {currentIdx < totalQuestions - 1 ? (
              <Button
                size="sm"
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion.id] === undefined}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Next <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                {isSubmitting ? 'Submitting...' : 'Submit & Score Assessment'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
