# AYUSHSetu AI — 7-Minute Live SIH Demo Script
**Competition Track**: Smart India Hackathon (SIH) | **Evaluation Format**: 7-Minute Live Demonstration + 3-Minute Q&A

This document provides a precise, minute-by-minute demonstration walkthrough across all 4 primary user roles, designed to maximize evaluation impact and prove technical credibility.

---

## Pre-Demo Checklist (T - 2 Minutes)
1. Open browser to `http://localhost:3000`.
2. Ensure you have the `/login` quick-switch credentials ready:
   - **Student (Non-Medical CS)**: `demo-std-002` (Rahul Nair)
   - **Industry Recruiter**: `demo-ind-001` (Vikram Malhotra / TechLabs Innovations)
   - **Institution Dean**: `demo-org-ruas`
   - **Admin Governance**: `demo-adm-001` (Prof. Sanjeev Mehta)
3. Open a secondary tab with `/api/admin/demo-reset` in case a mid-demo reset is required.

---

## Minute 0:00 – 1:00 | The Problem & Multi-Branch Architecture
- **Action**: Navigate to `http://localhost:3000` (Landing Page).
- **Speaker Pitch**:
  > *"Respected Jury Members, today India's higher education faces a twin placement crisis: unvetted resumes that flood recruiters with noise, and rigid academic silos that prevent talented students from crossing domains.*
  > *Welcome to **AYUSHSetu AI**—a unified, national-scale placement intelligence platform that connects Students, Universities, and Corporate Recruiters across ALL disciplines: from Computer Science and Core Engineering to Biotechnology and AYUSH.*
  > *Notice our live placement ticker and our 5-domain skill intelligence switcher showing real-time readiness across branches."*

---

## Minute 1:00 – 3:00 | Student Experience: Rahul Nair (B.Tech CSE)
- **Action**: Click **Login** → Select **Rahul Nair (Demo Student)** → Arrive at `/student/dashboard`.
- **Speaker Pitch**:
  > *"Meet Rahul Nair, a 4th-year B.Tech Computer Science student specializing in cloud software engineering. Notice this is a pure non-medical engineering profile.*
  > *On his dashboard, Rahul sees his transparent 8-dimension career readiness score: 94%.*
  > *Let's navigate to `/student/skills/digital-twin`: Here is Rahul's Competency Digital Twin, mapping his strengths in Python, React, SQL, and Git & Docker.*
  > *Now let's check his opportunities at `/student/jobs`: His top recommendation is the **Software Engineering Intern** at **TechLabs Innovations** with an exact **94% Compatibility Score**.*
  > *Clicking on the opportunity dossier, Rahul sees the transparent 7-dimension breakdown: 40% Skills, 15% Goal, 10% Projects, 10% Certifications, 10% Experience. Every point is explainable—no black-box AI."*
- **Action**: Click **Apply Now** → Confetti triggers → Application is submitted with status `UNDER_REVIEW`.

---

## Minute 3:00 – 4:15 | Industry Recruiter: TechLabs Innovations
- **Action**: Switch session/login as **Vikram Malhotra (Lead Recruiter, TechLabs Innovations)** → Navigate to `/industry/dashboard`.
- **Speaker Pitch**:
  > *"Now we switch to the employer perspective. Vikram Malhotra, Technical Recruiter at TechLabs Innovations, logs into his recruitment console.*
  > *Opening `/industry/candidates`: Vikram searches across candidates. At the top of the list is Rahul Nair with a 94% match.*
  > *Clicking into Rahul's candidate dossier (`/industry/candidates/[id]`), Vikram sees verified skill credentials validated by university coursework and diagnostic tests.*
  > *Opening the 6-stage Recruiter Kanban at `/industry/recruitment`: Vikram moves Rahul's application from 'Under Review' to 'Shortlisted'.*
  > *Notice our governance policy: AI never makes the decision to hire or reject. Human recruiters maintain 100% control, and every rejection logs an objective reason code."*

---

## Minute 4:15 – 5:15 | Institution Placement Command Center
- **Action**: Switch session/login as **Institution Dean (RUAS)** → Navigate to `/institution/placements`.
- **Speaker Pitch**:
  > *"Now we see the power of integrating the university into the loop.*
  > *In the Central Placement Command Center (`/institution/placements`), deans track 9 real-time placement metrics and a 9-stage cohort funnel across engineering and health streams.*
  > *At `/institution/skill-intelligence`, the Dean inspects the **Skill Supply vs. Market Demand Heatmap**.*
  > *The system detects a 24% cohort gap in Cloud Microservices.*
  > *With one click, the Dean launches a targeted **Remediation Training Batch** to upskill 40 students before the next recruitment drive."*

---

## Minute 5:15 – 6:15 | Admin Governance & Circuit Breaker Defense
- **Action**: Switch session/login as **Admin (Prof. Sanjeev Mehta)** → Navigate to `/admin/dashboard`.
- **Speaker Pitch**:
  > *"Finally, we inspect the National Governance Hub.*
  > *At `/admin/verification`, administrators verify new corporate employers before they receive the verified employer badge, eliminating fraudulent postings.*
  > *At `/admin/system-health`, we monitor real-time diagnostic latency across database, storage, and API route handlers.*
  > *Most importantly: If third-party AI APIs experience an outage or rate limit, our **Dual-Layer Circuit Breaker** immediately provides deterministic local fallbacks so no student or recruiter is blocked.*
  > *And for competition evaluation, our `/api/admin/demo-reset` endpoint resets all demo test data to baseline with one command without touching any production tables."*

---

## Minute 6:15 – 7:00 | Summary & Handover to Jury Q&A
- **Speaker Pitch**:
  > *"In summary, AYUSHSetu AI delivers:
  > 1. Real verified skill credentials replacing inflated resumes.
  > 2. Explainable 7-dimension matching across all academic branches.
  > 3. Tripartite collaboration between Students, Industry, and Universities.
  > 4. Governed, assistive AI with zero autonomous hiring risk.
  >
  > Everything you saw today is running on real database persistence with zero fake data.
  > Thank you, and we are ready for your questions!"*
