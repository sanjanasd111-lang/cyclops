# AYUSHSetu AI — Technical Defense & Architecture Manifesto
**Engineering Specification**: Production Hardened | **Competition Track**: Smart India Hackathon (SIH)

This document provides in-depth technical defenses of the algorithmic, architectural, and security choices implemented in AYUSHSetu AI.

---

## 1. Technological Stack & Architectural Justification

### A. Next.js 14 App Router + React Server Components (RSC)
- **Why Chosen**: Next.js 14 provides hybrid static/server-side rendering and Edge Route Handlers, drastically cutting Time to First Byte (TTFB) to <120ms.
- **Why Not Pure Single Page Application (SPA)**: Pure client-side SPAs suffer from slow initial bundle loading on low-bandwidth Tier-2/Tier-3 college networks and present severe SEO/accreditation reporting limitations.
- **RSC Optimization**: Heavy dashboard queries execute server-side close to the database; only interactive UI elements hydrate on the client.

### B. PostgreSQL + Supabase with Row-Level Security (RLS)
- **Relational Integrity**: Recruitment data is intrinsically relational: Students $\rightarrow$ Verified Skills $\rightarrow$ Opportunities $\rightarrow$ Applications $\rightarrow$ Interviews. Relational constraints and foreign keys guarantee data consistency that NoSQL cannot provide.
- **Database-Level Authorization via RLS**: Instead of relying exclusively on application middleware, PostgreSQL RLS policies enforce data isolation at the storage layer:
  ```sql
  CREATE POLICY student_own_applications ON applications
    FOR SELECT USING (auth.uid() = user_id);
  ```
- **Connection Pooling**: PgBouncer pooling manages high-concurrency placement drive spikes without exhausting database connections.

### C. Strict TypeScript & Zod Schema Validation
- **Zero Runtime Type Drift**: Over 40 strict TypeScript interfaces define data models across profiles, skills, rubrics, and status histories.
- **Zod Runtime Defense**: Every AI generation and external request payload is parsed through strict Zod schemas (`AIAnalysisSchema`, `EvaluationResultSchema`, `GenerateSchema`), preventing unexpected prompt injection or malformed LLM outputs from breaking the UI.

---

## 2. Deterministic 7-Dimension Matching Algorithm

### Algorithm Defense: Why Deterministic Math vs. Black-Box Vector Embeddings?
Commercial recruiting tools often use dense vector embeddings (e.g. cosine distance between resume and job description). While flexible, this creates critical failure modes:
1. **Unexplainability**: A student cannot understand why they scored 72% vs 84%.
2. **Hallucinatory Bias**: Embeddings frequently reward keyword-dense formatting over verified technical competency.
3. **Legal Vulnerability**: Black-box rejection exposes institutions to discrimination claims.

### Mathematical Formulation
AYUSHSetu AI evaluates candidate fit across 7 explainable, weighted dimensions:
$$\text{Overall Fit Score} = \sum_{i=1}^{7} W_i \cdot S_i$$

Where:
- $W_1 = 0.40$ (**Skill Compatibility**):
  $$S_1 = \frac{1}{M} \sum_{j=1}^{M} \min\left(100, \frac{\text{Proficiency}(j)}{\text{Required}(j)} \times 100\right) \times \text{VerificationMultiplier}(j)$$
  *(Verified skills receive a 15% credibility bonus over self-declared skills).*
- $W_2 = 0.15$ (**Career Interest & Target Role Alignment**): Evaluates semantic and categorical goal match.
- $W_3 = 0.10$ (**Academic Qualification & Branch Suitability**): Evaluates degree level and stream, granting cross-domain pathway credits when skills override degree tags.
- $W_4 = 0.10$ (**Practical Project Evidence**): Evaluates verified portfolio projects applying required technologies.
- $W_5 = 0.10$ (**Certifications & Micro-Credentials**): Validates third-party and institutional credentials.
- $W_6 = 0.10$ (**Practical Experience & Internships**): Evaluates prior hands-on work and clinical attachments.
- $W_7 = 0.05$ (**Location & Work Mode Alignment**): Matches on-site/hybrid/remote availability.

**Time Complexity**: $O(N \cdot K)$, where $N$ is candidate pool size and $K \le 20$ required skills. In-memory evaluation completes 1,000 matches in <15 milliseconds.

---

## 3. Dual-Layer AI Architecture & Circuit Breaker Pattern

```
                       [ Incoming Request ]
                                │
                                ▼
                   [ Does API Key Exist & Valid? ]
                                │
                  ┌─────────────┴─────────────┐
                  ▼ YES                       ▼ NO / TIMEOUT
          [ Gemini 1.5 Flash ]       [ Rule-Based Engine ]
                  │                           │
          [ Zod Validation ]                  │
                  │                           │
         ┌────────┴────────┐                  │
         ▼ Success         ▼ Parse Error      │
    [ Format Response ] ──► [ Local Fallback Engine ]
                                  │
                                  ▼
                        [ Guaranteed Valid Response ]
```

- **Fault Tolerance**: If Google Gemini API is unreachable, rate-limited, or throws an error, the system automatically falls back to deterministic local rule engines without crashing.
- **Assistive Policy Manifesto**: Autonomous hiring, automated candidate rejection, or unauthorized profile mutation by AI is blocked at the permission boundary.

---

## 4. Indian Data Privacy (DPDP Act 2023) Compliance

1. **Purpose Limitation**: Data collected from students is strictly used for career acceleration, skills assessment, and job matching.
2. **Granular Privacy Controls**: Students manage their **Digital Passport Visibility**:
   - `PUBLIC`: Accessible via secure public portfolio slug and QR code.
   - `VERIFIED_RECRUITERS_ONLY`: Masked from search engines; visible only to verified corporate partners.
   - `RESTRICTED`: Hidden from talent discovery.
3. **Demographic Masking**: Initial candidate screening hides student photo, gender, and contact details until the recruiter schedules an interview.

---

## 5. Safe Demo Reset Mechanism (`/api/admin/demo-reset`)

- **Isolation Guarantee**: All demo records are marked with `is_demo = true`.
- **Targeted Reset**: The reset endpoint mutates only records tagged `is_demo = true`, restoring baseline profiles (`Rahul Nair`, `Aditi Sharma`), initial application statuses, and clearing test interview attempts.
- **Production Safety**: Real institutional accounts, company profiles, and production applications cannot be affected.
- **Audit Logging**: Every invocation creates an immutable administrative audit record in `audit_logs`.
