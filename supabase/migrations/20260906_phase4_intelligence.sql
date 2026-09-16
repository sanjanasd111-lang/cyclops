-- Migration: 20260906_phase4_intelligence.sql
-- Description: Phase 4 Intelligence Engine & Persistent Roadmap Caching

-- 1. Persistent User Roadmaps Table
CREATE TABLE IF NOT EXISTS public.user_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL,
    roadmap_data JSONB NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    model TEXT DEFAULT 'gemini-3.6-flash'
);

-- Enable RLS
ALTER TABLE public.user_roadmaps ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own roadmaps" ON public.user_roadmaps;
CREATE POLICY "Users can view own roadmaps" ON public.user_roadmaps FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own roadmaps" ON public.user_roadmaps;
CREATE POLICY "Users can insert own roadmaps" ON public.user_roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own roadmaps" ON public.user_roadmaps;
CREATE POLICY "Users can update own roadmaps" ON public.user_roadmaps FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_roadmaps_user ON public.user_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roadmaps_role ON public.user_roadmaps(user_id, target_role);
