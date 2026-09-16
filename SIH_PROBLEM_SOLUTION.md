# AYUSHSetu AI — SIH Problem Statement & Solution Architecture
**Hackathon**: Smart India Hackathon (SIH) | **Problem ID**: 26044 | **Domain**: Higher Education, Skill Intelligence & Placement

---

## 1. The Core Problem in Indian Higher Education Placements

India produces over **1.5 million engineering and technical graduates** and **400,000+ medical, healthcare, and AYUSH professionals** annually. Despite this massive talent output, both students and employers face structural gridlock:

### Key Pain Points:
1. **Unvetted Resumes & Credential Inflation**:
   - Students list dozens of tools and buzzwords without verified evidence.
   - Recruiters receive thousands of generic applications per posting, leading to 90%+ rejection rates and expensive screening costs.
2. **Syllabus-to-Industry Demand Disconnect**:
   - Universities design curricula based on static 5-year syllabus cycles.
   - Industry demands shift every 12–18 months (cloud-native tooling, AI integration, regulatory compliance).
   - Placement officers lack quantitative empirical data showing which specific skills their students lack.
3. **Rigid Branch Silos & Ignored Cross-Domain Talent**:
   - Placement drives restrict applications by rigid branch tags (e.g. only B.Tech CS allowed to apply for data roles).
   - Students with strong analytical or technical capabilities outside their primary degree (e.g. AYUSH students with biostatistics or mechanical students with IoT programming) are systematically locked out.
4. **Black-Box Algorithmic Filtering**:
   - Commercial ATS software filters resumes based on crude keyword counts, arbitrarily rejecting qualified students without explanation or remediation paths.
5. **Manual, Error-Prone Institutional Placement Operations**:
   - Placement cells manage campus drives, shortlists, and recruiter communication using scattered spreadsheets and messaging apps, making NAAC/NIRF accreditation audits painful.

---

## 2. The AYUSHSetu AI Solution

**AYUSHSetu AI** is a unified, national-scale skill intelligence and placement automation platform that connects the entire higher education ecosystem:

```
Students ◄────────► Academic Institutions ◄────────► Corporate Recruiters
                            ▲
                            │
               National Governance & Admin
```

### Core Value Pillars:
1. **Digital Skill Passport with Multi-Source Evidence**:
   - Skills transition from self-declared claims to verified credentials via a 3-tier proof chain (adaptive diagnostic tests, faculty verification, industry internship badges).
2. **Deterministic 7-Dimension Matching Engine**:
   - Evaluates applicant suitability mathematically across 7 weighted criteria (Skills 40%, Career Goal 15%, Academic Eligibility 10%, Projects 10%, Certifications 10%, Experience 10%, Location 5%).
   - Transparent, explainable scores with zero black-box bias.
3. **Institutional Skill Intelligence Heatmap**:
   - Provides deans and department heads with real-time analytics comparing student cohort skill supply against live corporate recruiter demand over a rolling 90-day window.
4. **Assistive, Governed AI Tools**:
   - AI Interview Simulator, AI Resume Studio, and Career Copilot assist student preparation and curriculum alignment while strictly blocking autonomous hiring or unreviewed candidate rejections.
5. **Universal Multi-Branch Coverage**:
   - Native support for Computer Science, Mechanical Engineering, Healthcare/AYUSH, Biotechnology, Commerce/Finance, and Corporate Law.

---

## 3. Five Interconnected Stakeholder Workspaces

| Workspace | Target Persona | Primary Value Delivered |
| :--- | :--- | :--- |
| **Student Portal** (`/student/*`) | Undergraduate & Postgraduate Students | Diagnostic assessments, digital twin radar, 7D job matching, AI interview simulation, and ATS resume studio. |
| **Faculty Workstation** (`/faculty/*`) | Professors, Mentors, Research Guides | Mentee cohort tracking, qualitative milestone notes, research collaboration logging, and syllabus AI assistant. |
| **Institution Center** (`/institution/*`) | Placement Deans, Directors, HODs | Central placement command center, skill supply vs demand heatmap, training batch creator, and NAAC/NIRF reporting. |
| **Industry Console** (`/industry/*`) | Corporate Recruiters & Talent Leads | Candidate discovery with explainable 7D match, 6-stage Kanban pipeline, and structured rejection auditing. |
| **Admin Governance** (`/admin/*`) | University Deans & Regulators | Platform telemetry, user governance, employer verification hub, and opportunity quality moderation. |

---

## 4. Key Technological Innovations

- **Explainable Match Breakdown**: Students and recruiters see exactly which skills matched, which are missing, and the point delta required to reach 100%.
- **Cross-Domain Transfer Pathway Credit**: The matching engine recognizes transferable skills, allowing qualified candidates from any branch to unlock opportunities.
- **Dual-Layer Circuit Breaker**: If third-party AI APIs experience rate limits or downtime, the platform gracefully falls back to deterministic local algorithms without interrupting user workflows.
- **Controlled Demo Environment**: Single-click demo reset endpoint (`/api/admin/demo-reset`) guarantees predictable evaluation during live Hackathon testing without altering production records.
