-- Migration: 20260906_ai_interview_center.sql
-- Description: Create tables for AI Interview Simulator, Answer Evaluations, and Placement Prep

-- 1. Interview Sessions Table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    resume_id UUID REFERENCES public.resume_records(id) ON DELETE SET NULL,
    interview_type TEXT NOT NULL DEFAULT 'MIXED', -- TECHNICAL, HR, BEHAVIORAL, ROLE_SPECIFIC, RESUME_BASED, MIXED
    question_count INT NOT NULL DEFAULT 10,
    status TEXT NOT NULL DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, COMPLETED, ABANDONED
    overall_score INT DEFAULT 0,
    technical_score INT DEFAULT 0,
    relevance_score INT DEFAULT 0,
    clarity_score INT DEFAULT 0,
    structure_score INT DEFAULT 0,
    completeness_score INT DEFAULT 0,
    role_alignment_score INT DEFAULT 0,
    duration_seconds INT DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 2. Interview Questions Table
CREATE TABLE IF NOT EXISTS public.interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
    question_number INT NOT NULL,
    category TEXT NOT NULL, -- TECHNICAL, BEHAVIORAL, HR, ROLE_SPECIFIC, RESUME, COMMUNICATION, PROBLEM_SOLVING
    difficulty TEXT NOT NULL DEFAULT 'MEDIUM', -- EASY, MEDIUM, HARD
    question TEXT NOT NULL,
    expected_topics TEXT[] DEFAULT '{}',
    is_adaptive_followup BOOLEAN DEFAULT FALSE,
    parent_question_id UUID REFERENCES public.interview_questions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Interview Answers Table
CREATE TABLE IF NOT EXISTS public.interview_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    transcript TEXT,
    input_mode TEXT DEFAULT 'TEXT', -- TEXT, VOICE
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Interview Evaluations Table
CREATE TABLE IF NOT EXISTS public.interview_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_id UUID NOT NULL REFERENCES public.interview_answers(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    technical_score INT DEFAULT 0,
    relevance_score INT DEFAULT 0,
    clarity_score INT DEFAULT 0,
    structure_score INT DEFAULT 0,
    completeness_score INT DEFAULT 0,
    role_alignment_score INT DEFAULT 0,
    overall_score INT DEFAULT 0,
    feedback TEXT,
    strengths TEXT[] DEFAULT '{}',
    improvements TEXT[] DEFAULT '{}',
    better_approach TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Interview Question Bank Table (Curated & AI-Sourced Base Questions)
CREATE TABLE IF NOT EXISTS public.interview_question_bank (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    academic_branch TEXT,
    target_role TEXT,
    skill_keyword TEXT,
    difficulty TEXT DEFAULT 'MEDIUM',
    question TEXT NOT NULL,
    sample_answer TEXT,
    key_topics TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_question_bank ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own interview sessions" ON public.interview_sessions;
CREATE POLICY "Users can view own interview sessions" ON public.interview_sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own interview sessions" ON public.interview_sessions;
CREATE POLICY "Users can insert own interview sessions" ON public.interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own interview sessions" ON public.interview_sessions;
CREATE POLICY "Users can update own interview sessions" ON public.interview_sessions FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view questions of own sessions" ON public.interview_questions;
CREATE POLICY "Users can view questions of own sessions" ON public.interview_questions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.interview_sessions s WHERE s.id = interview_questions.session_id AND s.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can insert questions to own sessions" ON public.interview_questions;
CREATE POLICY "Users can insert questions to own sessions" ON public.interview_questions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.interview_sessions s WHERE s.id = interview_questions.session_id AND s.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can view own answers" ON public.interview_answers;
CREATE POLICY "Users can view own answers" ON public.interview_answers FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own answers" ON public.interview_answers;
CREATE POLICY "Users can insert own answers" ON public.interview_answers FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own evaluations" ON public.interview_evaluations;
CREATE POLICY "Users can view own evaluations" ON public.interview_evaluations FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own evaluations" ON public.interview_evaluations;
CREATE POLICY "Users can insert own evaluations" ON public.interview_evaluations FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can read question bank" ON public.interview_question_bank;
CREATE POLICY "Authenticated users can read question bank" ON public.interview_question_bank FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user ON public.interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_session ON public.interview_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_answers_session ON public.interview_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_evaluations_session ON public.interview_evaluations(session_id);
