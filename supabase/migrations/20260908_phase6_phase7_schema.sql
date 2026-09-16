-- ============================================================
-- AYUSHSETU AI — PHASE 6 + PHASE 7 DATABASE SCHEMA MIGRATION
-- SAVED JOBS, ALERTS, PLACEMENT CYCLES, SHORTLISTS, REJECTIONS,
-- VERIFICATIONS, AUDIT LOGS, AI USAGE & PROFILE VISIBILITY
-- ============================================================

-- 1. SAVED OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    opportunity_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_saved_opportunity UNIQUE (user_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_opps_user_id ON public.saved_opportunities(user_id);

-- 2. JOB ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.job_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    target_role TEXT,
    academic_branch TEXT,
    location TEXT,
    work_type TEXT,
    skills TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id ON public.job_alerts(user_id);

-- 3. PLACEMENT CYCLES TABLE (INSTITUTION)
CREATE TABLE IF NOT EXISTS public.placement_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    cycle_name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    target_placement_rate NUMERIC(5,2) DEFAULT 85.00,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_placement_cycles_inst ON public.placement_cycles(institution_id);

-- 4. CANDIDATE SHORTLISTS TABLE (RECRUITER)
CREATE TABLE IF NOT EXISTS public.candidate_shortlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_id TEXT NOT NULL,
    opportunity_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    match_score NUMERIC(5,2) NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'SHORTLISTED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_opportunity_student_shortlist UNIQUE (opportunity_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_shortlists_opp_id ON public.candidate_shortlists(opportunity_id);

-- 5. REJECTION REASONS TABLE (RECRUITER)
CREATE TABLE IF NOT EXISTS public.rejection_reasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT NOT NULL,
    recruiter_id TEXT NOT NULL,
    reason_category TEXT NOT NULL, -- 'SKILL_GAP', 'EXPERIENCE', 'EDUCATION', 'RESUME', 'INTERVIEW', 'ROLE_CLOSED', 'OTHER'
    feedback_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rejection_app_id ON public.rejection_reasons(application_id);

-- 6. ORGANIZATION VERIFICATIONS TABLE (ADMIN)
CREATE TABLE IF NOT EXISTS public.organization_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id TEXT NOT NULL,
    organization_name TEXT NOT NULL,
    organization_type TEXT NOT NULL, -- 'INDUSTRY', 'INSTITUTION', 'RECRUITER', 'FACULTY'
    verification_status TEXT DEFAULT 'PENDING', -- 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'
    document_urls TEXT[],
    notes TEXT,
    verified_by TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_verifications_status ON public.organization_verifications(verification_status);

-- 7. OPPORTUNITY REPORTS TABLE (STUDENT REPORTING)
CREATE TABLE IF NOT EXISTS public.opportunity_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    reason TEXT NOT NULL, -- 'SUSPICIOUS', 'EXPIRED', 'INCORRECT_INFO', 'BROKEN_LINK', 'SPAM', 'OTHER'
    details TEXT,
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'REVIEWED', 'DISMISSED', 'ACTIONED'
    resolved_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opp_reports_status ON public.opportunity_reports(status);

-- 8. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    user_role TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- 9. AI USAGE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    feature_name TEXT NOT NULL, -- 'CAREER_COPILOT', 'RESUME_ANALYSIS', 'INTERVIEW_GENERATE', 'PLACEMENT_STRATEGIST'
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    latency_ms INT DEFAULT 0,
    status TEXT DEFAULT 'SUCCESS',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_feature ON public.ai_usage_logs(feature_name);

-- 10. PROFILE VISIBILITY SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.profile_visibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
    public_profile BOOLEAN DEFAULT TRUE,
    recruiter_profile BOOLEAN DEFAULT TRUE,
    resume_visible BOOLEAN DEFAULT TRUE,
    projects_visible BOOLEAN DEFAULT TRUE,
    skills_visible BOOLEAN DEFAULT TRUE,
    interview_visible BOOLEAN DEFAULT FALSE,
    contact_visible BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_visibility_user ON public.profile_visibility(user_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_visibility ENABLE ROW LEVEL SECURITY;

-- POLICIES (AUTHENTICATED & UNRESTRICTED DEV FALLBACK ACCESS)
CREATE POLICY "Users access own saved opportunities" ON public.saved_opportunities FOR ALL USING (true);
CREATE POLICY "Users access own job alerts" ON public.job_alerts FOR ALL USING (true);
CREATE POLICY "Recruiters access candidate shortlists" ON public.candidate_shortlists FOR ALL USING (true);
CREATE POLICY "Admins manage organization verifications" ON public.organization_verifications FOR ALL USING (true);
CREATE POLICY "Students submit opportunity reports" ON public.opportunity_reports FOR ALL USING (true);
CREATE POLICY "System audit logs read write" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "AI usage logs read write" ON public.ai_usage_logs FOR ALL USING (true);
CREATE POLICY "Profile visibility read write" ON public.profile_visibility FOR ALL USING (true);
