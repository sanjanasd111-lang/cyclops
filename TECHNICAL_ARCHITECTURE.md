# AYUSHSetu AI — Technical Architecture & Systems Engineering
**System Version**: 1.0.0-PROD | **Framework**: Next.js 14 App Router | **Database**: Supabase PostgreSQL

AYUSHSetu AI is engineered as a high-performance, modular, multi-tenant talent intelligence platform connecting students, academic institutions, faculty mentors, and corporate recruiters.

---

## 1. System Architecture Diagram

```mermaid
graph TB
    subgraph ClientLayer ["Client Presentation Layer (Responsive Next.js 14)"]
        UI_Student["Student Workspace<br/>• Career Dashboard<br/>• Skill Digital Twin<br/>• AI Mock Interview<br/>• AI Resume Studio<br/>• Digital Passport"]
        UI_Industry["Industry Workspace<br/>• Recruiter Console<br/>• 6-Stage Kanban Pipeline<br/>• Candidate Dossier<br/>• Job Creation Wizard"]
        UI_Inst["Institution Workspace<br/>• Placement Command Center<br/>• 9-Stage Progression Funnel<br/>• Supply vs Demand Matrix<br/>• Training Batch Engine"]
        UI_Admin["Admin Governance<br/>• Verification Hub<br/>• Opportunity Moderation<br/>• Health Diagnostics<br/>• Audit Trail"]
    end

    subgraph EdgeLayer ["Edge Middleware & Security (Next.js Edge)"]
        Middleware["Edge Auth & RBAC Middleware<br/>• Session & Cookie Validation<br/>• Dynamic Role Redirect<br/>• Route Protection (/student, /industry, etc.)"]
        CommandPalette["Global Command Palette (Ctrl+K)"]
        ToastSystem["Unified Toast Alert System"]
    end

    subgraph ServiceLayer ["API & Core Business Logic Layer"]
        MatchEngine["Deterministic Matching Engine<br/>(40% Skills, 15% Goals, 10% Edu,<br/>10% Projects, 10% Certs, 10% Exp, 5% Loc)"]
        ReadinessEngine["Career Readiness Calculator<br/>(Transparent 8-Part Formula)"]
        NextBestAction["Next Best Action Engine<br/>(Deterministic State Evaluator)"]
        SkillEngine["Skill Supply vs Demand Analyzer<br/>& Deficit Heatmap Generator"]
        ModerationEngine["Opportunity Quality Signal Engine<br/>(Duplicate & Missing Skill Detector)"]
    end

    subgraph IntelligenceLayer ["Assistive AI Layer (Human-in-the-Loop)"]
        GeminiAPI["Google Gemini 1.5 Pro / Flash<br/>• Contextual Career Copilot<br/>• Grounded Interview Coach<br/>• Resume ATS Analysis<br/>• Placement Strategy Briefs"]
        FallbackEngine["Deterministic Fallback Engine<br/>(Zero Single Point of Failure)"]
    end

    subgraph DataLayer ["Data & Persistence Layer (Supabase PostgreSQL)"]
        PG_DB[("PostgreSQL Database<br/>• RLS Security Policies<br/>• Composite B-Tree Indexes<br/>• Profiles, Skills, Opps, Apps")]
        PG_Auth["Supabase Auth Service<br/>• Multi-Role JWT Session Engine"]
        PG_Storage["Encrypted Object Storage<br/>• Resumes, Audio Transcripts, Certs"]
        AuditLog["Immutable Security Audit Store<br/>• Actor, Action, Entity, Timestamp"]
    end

    ClientLayer --> EdgeLayer
    EdgeLayer --> ServiceLayer
    ServiceLayer --> IntelligenceLayer
    IntelligenceLayer -.-> FallbackEngine
    ServiceLayer --> DataLayer
    IntelligenceLayer --> PG_DB
```

---

## 2. Technology Stack & Specifications

| Layer | Component | Version / Specification | Rationale & Responsibility |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js App Router | 14.2.15 | Server Components, fast SSR, zero-layout-shift routing |
| **Language** | TypeScript | 5.6.3 | Strict static typing, zero runtime type exceptions |
| **Styling** | Tailwind CSS | 3.4.14 | Centralized dark design system (`#020617`, `#0F172A`, `#10B981`) |
| **Animations** | Framer Motion | 11.11.9 | Subtle micro-interactions and accessible modal dialogs |
| **Database** | PostgreSQL | 15.x (Supabase) | ACID relational transactions, schema integrity, JSONB |
| **Auth** | Supabase SSR | 0.5.1 | Cookie-based session validation, PKCE flow, RLS context |
| **Security** | Row-Level Security | PostgreSQL RLS | Multi-tenant tenant isolation; Student A cannot see Student B |
| **AI Models** | Google Gemini API | 1.5 Pro / Flash | Natural language career advisory, interview evaluation |
| **Schema Validation**| Zod | 3.23.8 | Structured output validation for all external API payloads |
| **Charts & Radar** | Recharts | 2.13.0 | Skill Digital Twin radar graphs and placement funnel charts |
| **QR Engine** | QRCodeSVG | 4.0.1 | Client-side QR generation for instant passport sharing |

---

## 3. Core Architectural Modules

### 3.1 Deterministic 7-Dimension Matching Engine
Located in `lib/matching/engine.ts` and `app/api/industry/candidates/[id]/route.ts`.
Calculates match score $M \in [0, 100]$:
$$M = 0.40 \cdot S_{\text{skills}} + 0.15 \cdot S_{\text{interest}} + 0.10 \cdot S_{\text{edu}} + 0.10 \cdot S_{\text{proj}} + 0.10 \cdot S_{\text{cert}} + 0.10 \cdot S_{\text{exp}} + 0.05 \cdot S_{\text{loc}}$$
Where:
- $S_{\text{skills}}$: Jaccard similarity weighted by verification status (1.15 multiplier for verified credentials).
- Output is completely explainable with sub-dimension percentages.

### 3.2 Deterministic Next Best Action Engine
Located in `lib/matching/actions.ts`.
Evaluates student database records sequentially:
1. Profile Incomplete $\to$ "Complete Your Academic Profile"
2. Career Goal Missing $\to$ "Declare Your Target Career Goal"
3. No Skill Assessment Taken $\to$ "Take Your Core Skill Assessment"
4. Critical Skill Gap Exists $\to$ "Bridge Skill Gap: {skill_name}"
5. Resume Missing $\to$ "Build Your Verified Resume"
6. Strong Profile / Zero Applications $\to$ "Explore Matching Opportunities"
7. Completed Applications / Pending Interview $\to$ "Practice with AI Mock Interview"

### 3.3 Security, Row-Level Security (RLS) & IDOR Protection
PostgreSQL tables enforce policies ensuring that:
- Students can only view and mutate their own profile, skills, and application records.
- Recruiters can only mutate opportunities belonging to their own organization.
- Institution directors can view aggregated cohort statistics for their affiliated students.
- System administrators have global read/audit permissions with immutable logging.

---

## 4. Database Schema Structure

```
profiles
├── id (UUID, PK)
├── full_name (TEXT)
├── role (TEXT: STUDENT, INDUSTRY, INSTITUTION, FACULTY, ADMIN)
├── academic_stream (TEXT)
├── department (TEXT)
├── course (TEXT)
├── career_goal (TEXT)
└── verification_status (TEXT)

user_skills
├── id (UUID, PK)
├── user_id (UUID, FK -> profiles.id)
├── skill_name (TEXT)
├── category (TEXT)
├── proficiency_score (INTEGER, 0-100)
├── confidence_score (INTEGER, 0-100)
└── verification_status (SELF_DECLARED, INSTITUTION_VERIFIED, INDUSTRY_VERIFIED)

opportunities
├── id (UUID, PK)
├── organization_id (UUID, FK -> organizations.id)
├── title (TEXT)
├── type (INTERNSHIP, FULL_TIME, RESEARCH_PROJECT)
├── academic_branch (TEXT)
├── required_skills (TEXT[])
├── stipend_amount (NUMERIC)
├── moderation_status (PUBLISHED, PENDING_REVIEW, REJECTED, SUSPENDED)
└── deadline (TIMESTAMPTZ)

applications
├── id (UUID, PK)
├── user_id (UUID, FK -> profiles.id)
├── opportunity_id (UUID, FK -> opportunities.id)
├── status (APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW, SELECTED, REJECTED)
└── match_score (INTEGER)

rejection_reasons
├── id (UUID, PK)
├── application_id (UUID, FK -> applications.id)
├── reason_category (SKILL_GAP, ELIGIBILITY, EXPERIENCE, ROLE_CLOSED, OTHER)
├── feedback_notes (TEXT)
└── logged_at (TIMESTAMPTZ)
```

---

## 5. Deployment & Production Operations

- **Deployment Target**: Vercel Serverless Edge Platform
- **Database Target**: Supabase Managed PostgreSQL Instance (AWS ap-south-1 Mumbai)
- **CI/CD Pipeline**: Automated static analysis (`npx tsc --noEmit`), linting (`npm run lint`), and unit verification (`npx tsx scratch/test-phase8-master.ts`) prior to production deployment.
