-- ============================================================
-- AYUSHSETU AI — PHASE 6 & PHASE 7 SCHEMA EXTENSIONS
-- TRAINING BATCHES, VERIFICATION AUDIT HISTORY, SYSTEM HEALTH
-- ============================================================

-- 1. TRAINING BATCHES TABLE (INSTITUTION CURRICULUM INTERVENTION)
CREATE TABLE IF NOT EXISTS public.training_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id TEXT NOT NULL,
    batch_name TEXT NOT NULL,
    skill_focus TEXT NOT NULL,
    target_branch TEXT NOT NULL,
    target_score INT DEFAULT 70,
    current_score INT DEFAULT 45,
    student_count INT DEFAULT 0,
    potential_opportunities INT DEFAULT 0,
    priority TEXT DEFAULT 'HIGH', -- 'HIGH', 'MEDIUM', 'LOW'
    status TEXT DEFAULT 'UPCOMING', -- 'UPCOMING', 'ACTIVE', 'COMPLETED'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_training_batches_inst ON public.training_batches(institution_id);

-- 2. TRAINING BATCH STUDENTS
CREATE TABLE IF NOT EXISTS public.training_batch_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES public.training_batches(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_batch_student UNIQUE (batch_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_batch_students_batch ON public.training_batch_students(batch_id);

-- 3. VERIFICATION HISTORY (ORGANIZATION GOVERNANCE AUDIT)
CREATE TABLE IF NOT EXISTS public.verification_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id TEXT NOT NULL,
    action TEXT NOT NULL, -- 'SUBMITTED', 'APPROVED', 'REJECTED', 'SUSPENDED', 'UNDER_REVIEW'
    previous_status TEXT,
    new_status TEXT NOT NULL,
    admin_id TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_history_org ON public.verification_history(organization_id);
CREATE INDEX IF NOT EXISTS idx_verification_history_time ON public.verification_history(created_at DESC);

-- 4. ADMIN ACTIONS AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    entity_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_actions_admin ON public.admin_actions(admin_id);

-- 5. SYSTEM HEALTH CHECKS LOG
CREATE TABLE IF NOT EXISTS public.system_health_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    status TEXT NOT NULL, -- 'OPERATIONAL', 'DEGRADED', 'UNAVAILABLE'
    latency_ms INT,
    details JSONB,
    checked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_health_checked ON public.system_health_checks(checked_at DESC);

-- RLS POLICIES
ALTER TABLE public.training_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_batch_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Institution manages training batches" ON public.training_batches FOR ALL USING (true);
CREATE POLICY "Institution manages batch students" ON public.training_batch_students FOR ALL USING (true);
CREATE POLICY "Admins manage verification history" ON public.verification_history FOR ALL USING (true);
CREATE POLICY "Admins manage admin actions" ON public.admin_actions FOR ALL USING (true);
CREATE POLICY "System health checks read write" ON public.system_health_checks FOR ALL USING (true);
