# AYUSHSetu AI — Final Production Feature Matrix
**Date**: September 2026 | **Build Target**: SIH Production Release | **Status**: 100% Implemented & Verified

This document provides a comprehensive feature-by-feature matrix across all 5 operational platform workspaces.

---

## 1. Student Workspace (`/student/*`)

| Module / Feature | Route | Key Capabilities | Technical Mechanism |
| :--- | :--- | :--- | :--- |
| **Career Command Center** | `/student/dashboard` | Real-time metrics, Next Best Action recommendation, onboarding tracker, recent application timeline | Server component + profile readiness calculator |
| **Profile Onboarding** | `/student/onboarding` | 4-step wizard: academic stream, degree, department, target role, and preferred work mode | Supabase `profiles` / `student_profiles` update |
| **Diagnostic Assessment** | `/student/assessment` | Timed 10-question multi-domain adaptive skill evaluation with instant proficiency recalculation | `/api/assessment/submit` scoring engine |
| **Digital Skill Passport** | `/student/skills` | Verified skill badges, multi-source evidence indicators (Institution, Industry, Self-declared) | Dynamic skill graph + confidence weights |
| **Competency Digital Twin** | `/student/skills/digital-twin` | Interactive 8-axis multidimensional radar visualization of student competencies | HTML5 Canvas / SVG radar render |
| **Skill Deficit Analyzer** | `/student/skill-gap` | Role deficit analysis vs live employer job descriptions with benchmark deltas | Deterministic gap calculation (`/api/skills/gaps`) |
| **Career Roadmap Studio** | `/student/roadmap` | Personalized 30-60-90 day milestone progression grounded in student skill deficits | AI Roadmap with deterministic fallback |
| **Verified Opportunity Hub** | `/student/jobs` | Multi-filter search (branch, work mode, stipend, match score) for verified positions | `/api/opportunities` with 7D sorting |
| **Internship Portal** | `/student/internships` | Research, clinical, and industrial internships across all academic branches | Opportunity provider registry (`type=INTERNSHIP`) |
| **Opportunity Dossier** | `/student/opportunities/[id]` | Detailed job view with 7-part match breakdown, missing skills, and one-click apply | Sticky apply action + confetti feedback |
| **Application Tracker** | `/student/applications` | Full status history (Applied $\rightarrow$ Under Review $\rightarrow$ Shortlisted $\rightarrow$ Selected) | `/api/applications` audit trail |
| **AI Resume Studio** | `/student/resume` | Deterministic ATS score (0-100), section audit, action-verb optimizer, and PDF export | `ats-engine.ts` + Gemini coaching |
| **Interview Hub** | `/student/interview` | Role-specific practice, question history, and performance analytics | `/api/student/interview/*` |
| **AI Interview Simulator** | `/student/interview/simulator` | Real-time audio/text mock interview with adaptive follow-ups and STAR rubric scoring | Multi-branch questions, Zod schema validation |
| **Career Copilot** | `/student/copilot` | Context-aware generative advisory chat grounded in student profile and market demand | `/api/ai/copilot` with grounded fallback |
| **Passport Portfolio** | `/student/portfolio` | Public portfolio slug, privacy visibility toggles, and dynamic QR code generation | `qrcode.react` + privacy settings |
| **Notification Center** | `/student/notifications` | Application status alerts, drive invitations, and mentor feedback notices | `/api/notifications` with unread counts |

---

## 2. Faculty Workspace (`/faculty/*`)

| Module / Feature | Route | Key Capabilities | Technical Mechanism |
| :--- | :--- | :--- | :--- |
| **Faculty Workstation** | `/faculty/dashboard` | Active mentee metrics, research publications, pending reviews, and department overview | `/api/faculty/dashboard` |
| **Faculty Credentials** | `/faculty/profile` | Academic bio, department verification, publications, and mentoring specializations | `/api/faculty/profile` |
| **Mentee Directory** | `/faculty/students` | Full mentee roster with 8-dimension career readiness scores and branch filters | Filterable student cohort table |
| **Mentorship Logger** | `/faculty/mentorship` | Milestone tracker, qualitative guidance notes, and student progress flags | `/api/faculty/mentorship` |
| **Research Project Registry**| `/faculty/research` | Faculty research programs, student research assistant allocations, and paper drafts | Research project database store |
| **Industrial Training** | `/faculty/industrial-training`| Student internship and clinical attachment monitoring and attendance sign-offs | Industrial training tracker |
| **Joint Collaborations** | `/faculty/collaborations` | Academia-industry joint R&D projects and corporate sponsored programs | Collaboration program store |
| **Workshops Manager** | `/faculty/workshops` | Schedule, promote, and track student attendance for technical upskilling workshops | Workshop registry |
| **Faculty AI Assistant** | `/faculty/ai` | Syllabus modernization assistant, assignment generator, and research advisory | `/api/ai/faculty-assistant` |

---

## 3. Institution Placement Command Center (`/institution/*`)

| Module / Feature | Route | Key Capabilities | Technical Mechanism |
| :--- | :--- | :--- | :--- |
| **Executive Placement Dashboard** | `/institution/dashboard` | Placement rate, average package, active campus drives, and branch distribution | Aggregate cohort analytics |
| **Student Directory** | `/institution/students` | Cross-branch student search, CGPA filtering, readiness sort, and profile inspection | Multi-stream student directory |
| **Central Placement Center**| `/institution/placements` | 9 real-time metrics, 9-stage placement funnel, drive creator, and batch launcher | `/api/placements/metrics` |
| **Skill Supply vs Demand Heatmap**| `/institution/skill-intelligence`| Real-time comparative matrix of student skills vs. live corporate demand | Rolling 90-day demand window |
| **AI Placement Strategist**| `/institution/ai-placement` | Generates evidence-grounded drive strategies and intervention recommendations | `/api/ai/institution-insights` |
| **Curriculum Alignment** | `/institution/curriculum` | Identifies outdated curriculum topics based on employer skill gap reports | `/api/institution/curriculum` |
| **Accreditation Export** | `/institution/reports` | Automated pre-formatted report generation for NAAC Criteria 5 and NIRF Parameter 3 | CSV / JSON institutional exporter |
| **Corporate Partnerships**| `/institution/industry` | Directory of verified corporate partners, past hiring statistics, and active MOUs | Industry partner registry |

---

## 4. Industry Recruiter Console (`/industry/*`)

| Module / Feature | Route | Key Capabilities | Technical Mechanism |
| :--- | :--- | :--- | :--- |
| **Recruiter Workstation** | `/industry/dashboard` | Active job postings, candidate pipeline stats, recent applicants, and fast review | Pipeline analytics |
| **Opportunity Management** | `/industry/opportunities` | Listing management, applicant counts, status toggles (Active / Closed / Paused) | Opportunity CRUD API |
| **Opportunity Creator** | `/industry/opportunities/create`| Multi-step posting wizard with required skill proficiency and eligibility criteria | Input validation + quality signals |
| **Candidate Discovery** | `/industry/candidates` | Multi-branch talent search ranked by explainable 7-dimension match scores | Deterministic candidate ranking |
| **Candidate Dossier** | `/industry/candidates/[id]` | Detailed candidate view with skill evidence, portfolio projects, and privacy masking | Masked candidate view |
| **Side-by-Side Comparison**| `/industry/candidates/compare` | Compares up to 3 candidates simultaneously across competencies, education, and match | Multi-candidate comparison engine |
| **Recruitment Kanban** | `/industry/recruitment` | 6-stage recruiter Kanban pipeline with structured, objective rejection reason logging | Drag/click status progression |
| **Interview Scheduler** | `/industry/interviews` | Schedule and track technical and HR interview rounds with candidate calendar sync | Interview scheduling store |
| **Talent Availability Trends**| `/industry/analytics` | Regional and branch-wise candidate supply analytics to inform hiring drives | Talent supply heatmaps |
| **AI Recruiter Assistant**| `/industry/ai` | Assisted job description drafting and role-specific interview question generator | `/api/industry/ai` |

---

## 5. Admin Governance & Platform Reliability (`/admin/*`)

| Module / Feature | Route | Key Capabilities | Technical Mechanism |
| :--- | :--- | :--- | :--- |
| **Governance Dashboard** | `/admin/dashboard` | Real platform counts (users, institutions, opportunities, verifications, health) | Platform-wide aggregate stats |
| **User Governance** | `/admin/users` | Platform-wide user directory with role filters and account status toggles | User status controller (`ACTIVE`/`SUSPENDED`) |
| **Employer Verification Hub** | `/admin/verification` | Review organization GSTIN/CIN, approve/reject verified employer badge with audit notes | Verification workflow engine |
| **Opportunity Moderation** | `/admin/opportunities` | Automated quality signals: duplicate flags, missing skills, expired deadlines | Quality signal inspector |
| **System Diagnostics** | `/admin/system-health` | Real-time diagnostic latency pings across Database, AI, Storage, API, and Realtime | Live component latency checker |
| **Assistive AI Telemetry** | `/admin/ai-usage` | Token usage logs, latency metrics, and enforcement of Assistive-Only Policy | AI governance store |
| **Demo Environment Reset** | `/api/admin/demo-reset` | Admin-authorized single-click reset of demo dataset to predictable competition state | Targeted `is_demo=true` reset |
