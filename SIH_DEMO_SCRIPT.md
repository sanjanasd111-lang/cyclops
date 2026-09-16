# AYUSHSetu AI — SIH Live Demonstration Script
**Competition**: Smart India Hackathon (SIH) | **Problem Statement**: 26044 | **Duration**: 5–7 Minutes

This script is structured for a high-impact, live demonstration to evaluators and jury members. It walks through the four interconnected roles (Student, Industry Recruiter, Institution Placement Leader, and System Administrator) in real time.

---

## Timeline & Narrative Breakdown

```
00:00 - 00:40   Problem Statement, Core Innovation & Architecture
00:40 - 02:30   DEMO 1: Student Career Journey & Skill Digital Twin
02:30 - 03:40   DEMO 2: Industry Recruiter Kanban & Explainable Shortlisting
03:40 - 04:50   DEMO 3: Institutional Placement Intelligence & Supply vs. Demand
04:50 - 05:30   DEMO 4: Governance, Verification & Security Audit
05:30 - 06:30   Technical Architecture, AI Safety & Resilience
06:30 - 07:00   Closing Impact & National Scalability
```

---

### Segment 1: The Problem & The Breakthrough (00:00 – 00:40)
- **Visual**: Open Landing Page at `http://localhost:3000/`.
- **Narrator Script**:
  > *"Respected Jury Members, across Indian higher education—from AYUSH and Life Sciences to Computer Science and Engineering—students struggle to translate academic coursework into verifiable industry competencies. Traditional portals rely on static resumes and unverified self-declarations, leaving employers sifting through thousands of unranked applicants and colleges blind to actual market demand.*
  >
  > *We present **AYUSHSetu AI**: a production-grade, branch-inclusive academia–industry skill and placement intelligence platform. It replaces generic resumes with a **7-dimension deterministic Skill Digital Twin**, connects recruiters with transparently ranked talent, and equips institutions with predictive placement command centers. Everything you see today is connected to a live PostgreSQL database, real business logic, and grounded Gemini AI."*

---

### Segment 2: Student Career Journey & Digital Twin (00:40 – 02:30)
- **Actions**:
  1. Click **Get Started** or **Login** → Select **Student** preset (`student@ayushsetu.edu.in`) → Click **Sign In**.
  2. The browser automatically navigates to `/student/dashboard`.
- **Narrator Script**:
  > *"When a student signs in, they enter their personalized **Career Command Center**. Notice the deterministic **Next Best Action Engine**: based on real database records, the system immediately tells this student: **'Bridge Skill Gap: Biostatistics'**—because our algorithm detected their score is below the employer requirement for their declared target role.*
  >
  > *Let's navigate to their **Skill Digital Twin** (`/student/skills/digital-twin`). Here, student capabilities are mapped across 8 core dimensions—clinical research, pharmacology, data analysis, regulatory compliance, and soft skills. Each skill is marked as **Self-Declared**, **Institution-Verified**, or **Industry-Verified** based on actual assessment evidence.*
  >
  > *Now, notice the **Opportunities Feed** (`/student/opportunities`). When Aditi looks at an opportunity, our **7-dimension matching algorithm** (40% skills, 15% interests, 10% education, 10% projects, 10% certs, 10% experience, 5% location) calculates a transparent 92% match score. Students can launch the **AI Mock Interview Simulator** (`/student/interview`) to practice speech-to-text behavioral and technical rounds, generate an ATS-verified resume (`/student/resume`), and generate their verifiable **Public Digital Passport** (`/student/portfolio`) with a live QR code."*

---

### Segment 3: Industry Recruiter Kanban & Explainable Shortlisting (02:30 – 03:40)
- **Actions**:
  1. Use Command Palette (`Ctrl+K` / `⌘K`) or Header switch → Navigate to `/industry/dashboard`.
  2. Open `/industry/recruitment` (Recruitment Pipeline).
  3. Click a candidate card → Inspect `/industry/candidates/[id]` dossier.
- **Narrator Script**:
  > *"Let's switch to the perspective of a hiring manager at Dabur Research Foundation or Himalaya Wellness. On the **Recruiter Console**, employers manage active postings and live pipelines.*
  >
  > *In the **Recruiter Kanban Pipeline** (`/industry/recruitment`), candidates progress through 6 stages: Applied, Under Review, Shortlisted, Interview, Selected, or Rejected. Notice how candidate dossiers provide an **explainable match breakdown**: recruiters see exactly why a student scored 91%—how many required skills match, project depth, and certification validity.*
  >
  > *When a recruiter rejects a candidate, the platform enforces **Structured Rejection Logging** (e.g. Skill Gap, Eligibility, Experience), which feeds directly back into the student's Remediation Roadmap and the institution's curriculum intelligence."*

---

### Segment 4: Institutional Placement Intelligence & Skill Demand (03:40 – 04:50)
- **Actions**:
  1. Jump via `Ctrl+K` to `/institution/placements` (Placement Command Center).
  2. Highlight the 9-stage progression funnel, multi-branch table, and Supply vs. Demand matrix.
  3. Click **Create Training Batch**.
- **Narrator Script**:
  > *"For university vice-chancellors, deans, and placement directors, AYUSHSetu AI provides the **Placement Command Center** (`/institution/placements`).*
  >
  > *Unlike generic dashboards with static numbers, this command center calculates 9 live metrics across the entire student body: Career Readiness, Internship Readiness, Placement Readiness, and total offers. The **9-stage Progression Funnel** tracks students from eligibility to verified placement. Clicking any funnel stage opens the underlying cohort records.*
  >
  > *Below, our **Skill Supply vs. Industry Demand Matrix** compares aggregate student competencies against real employer job specifications. When a bottleneck is identified—such as a deficit in Clinical Data Analytics—the institution director clicks **'Create Batch'**, instantly launching a curriculum intervention cohort with automated student enrollment."*

---

### Segment 5: Governance, Verification & Security (04:50 – 05:30)
- **Actions**:
  1. Open `/admin/dashboard` → Go to `/admin/verification` → Go to `/admin/system-health`.
- **Narrator Script**:
  > *"On the **Admin Governance Console** (`/admin/dashboard`), platform administrators enforce strict institutional credibility. Organizations must submit registration documentation to earn the **'✓ Verified Organization'** badge; unverified entities cannot contact students.*
  >
  > *The **Opportunity Moderation Engine** automatically flags duplicate listings, missing skill requirements, and expired postings. On our **System Health Monitor** (`/admin/system-health`), you can see real-time database, Gemini AI, and cloud storage response latencies."*

---

### Segment 6: Architecture, AI Safety & Resilience (05:30 – 06:30)
- **Narrator Script**:
  > *"Technically, the platform is built on Next.js 14 App Router, TypeScript, and Supabase PostgreSQL with strict Row-Level Security (RLS). Crucially, our matching engine and Next Best Action system are **100% deterministic**. We use Google Gemini AI strictly as **assistive intelligence**—explaining why matches occur and generating adaptive interview questions. If an internet drop occurs during competition, the core matching, readiness calculation, and recruitment workflows continue to run uninterrupted."*

---

### Segment 7: Summary & Closing Impact (06:30 – 07:00)
- **Narrator Script**:
  > *"In summary, AYUSHSetu AI bridges the long-standing gap between curriculum and industry employability. It empowers students with verified capabilities, guarantees recruiters verified talent, and gives government ministries real-time human capital intelligence. Thank you, and we welcome your questions."*
