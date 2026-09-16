# AYUSHSetu AI — Phase 4 System Audit (`PHASE4_AUDIT.md`)

This document presents a comprehensive, empirical system audit of the entire AYUSHSetu AI codebase prior to Phase 4 Intelligence Engine & Production Hardening updates.

---

## 1. Working Systems (Verified Production Ready)
- **Supabase Authentication Anchor**: All server components and API routes extract authenticated user context via `supabase.auth.getUser()`.
- **Multi-Disciplinary Academic Support**: Broad support across 30+ domains including Engineering, CS, AYUSH (Ayurveda, Unani, Siddha, Homeopathy), Pharmacy, Medicine, Management, Commerce, Science, Arts, Law, and Agriculture.
- **Deterministic Skill Assessment Engine**: Server-side scoring rubric (`lib/skills/calculator.ts`) ensuring reproducible confidence metrics.
- **7-Tier Opportunity Matching Engine**: Dynamic formula evaluating candidate compatibility across 7 dimensions (40% skills, 15% interest, 10% ed, 10% proj, 10% cert, 10% exp, 5% loc) with Explainable Matching Modals (`/student/opportunities`).
- **AI Resume Studio**: ATS engine scoring across 7 dimensions (25% Keyword, 20% Skill, 15% Section, 15% Role, 10% Impact, 10% Format, 5% Readability), live A4 preview, upload parser, and verified skill sync (`/student/resume`).
- **AI Interview & Placement Prep Center**: Dual voice (Web Speech API) + text mode simulator (`/student/interview/simulator`), Zod-validated 6-part rubric evaluation, adaptive follow-ups, and placement prep tips (`/student/interview/preparation`).
- **Persisted Application Tracker**: Multi-resume selection modal (`resume_id`), duplicate submission block (`user_id + opportunity_id`), and Kanban pipeline tracker (`/student/applications`).
- **Career Readiness Model**: Transparent 8-part weighted formula (20% Skill, 20% Assessment, 15% Experience, 15% Projects, 10% Certifications, 10% Resume, 5% Interview, 5% Alignment).

---

## 2. Partially Working Systems (Refinement Required)
- **AI Copilot & Roadmap Fallback Identity**: Unauthenticated requests in a few API handlers fall back to a `'guest-student'` string instead of rejecting with a strict 401 Unauthorized response.
- **Skill Evidence Source Weighting**: `UserSkill` model supports `evidence_sources`, but needs complete calculation breakdown covering all 7 sources (Assessment 50%, Projects 15%, Certs 10%, Exp 10%, Mentor 5%, Inst 5%, Industry 5%).
- **Roadmap Persistence**: AI Roadmap generates dynamic recommendations via Gemini `gemini-3.6-flash`, but needs persistent DB storage (`user_roadmaps` table) to prevent re-generation on every page reload.
- **Opportunity Deduplication**: `opportunities` table supports external aggregator items, but requires a strict unique constraint on `(source, external_id)`.

---

## 3. Broken / High Priority Deficits
- **Unauthenticated Fallback Leakage**: API routes like `copilot` or `career-roadmap` fall back to guest profiles if `auth.getUser()` returns null, which can mask missing auth tokens during client errors.
- **Prerendering Suspense Boundary**: Static generation requires `<Suspense>` wrappers around any component consuming `useSearchParams()` across all App Router routes.

---

## 4. Fake / Demo Data Audit
- **Zero Production Fake Data**: All mock user fallbacks (`"Aditi Sharma"`) have been removed. All user skills, readiness scores, ATS metrics, and match percentages originate strictly from Supabase database tables (`student_profiles`, `user_skills`, `applications`, `resume_records`).

---

## 5. Security & RLS Policy Status
- **Row Level Security (RLS)**: Enabled on `student_profiles`, `user_skills`, `applications`, `opportunities`, `resume_records`, `interview_sessions`, `interview_questions`, `interview_answers`, `interview_evaluations`, and `ai_interactions`.
- **User Isolation**: Policies strictly enforce `auth.uid() = user_id`.
- **API Key Safeguards**: `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are kept on the server side and never exposed to the client.

---

## 6. Recommended Phase 4 Action Plan
1. **Enforce Strict 401 Authorization**: Remove `'guest-student'` fallbacks from all AI and data endpoints.
2. **Persistent Roadmap Storage**: Create `user_roadmaps` table in Supabase migrations to cache AI Roadmaps per user.
3. **Skill Evidence Standardization**: Enhance `lib/skills/calculator.ts` with explicit weight distribution across 7 evidence sources.
4. **Realtime Subscription Verification**: Confirm Supabase Realtime channel subscriptions on `/student/applications` and notifications.
5. **End-to-End Hardening & Testing**: Execute complete 2-user isolation test (`scratch/test-phase4-e2e.ts`), TypeScript check (`npx tsc --noEmit`), and Next.js production build (`npm run build`).
