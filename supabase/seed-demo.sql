-- ============================================================
-- AYUSHSetu AI — SIH Competition Predictable Demo Dataset
-- Section 8.36 & Phase 9 Competition Hardening Specification
-- All records clearly flagged with is_demo = true
-- Multi-Branch Coverage: AYUSH + Computer Science & Core Engineering
-- ============================================================

-- 1. Demo Organizations (Industry & Institution)
INSERT INTO organizations (id, name, type, domain, location, verification_status, is_demo, created_at)
VALUES
  ('demo-org-dabur', 'Dabur Research Foundation (Demo)', 'INDUSTRY', 'Pharma & AYUSH', 'Ghaziabad, UP', 'VERIFIED', true, NOW()),
  ('demo-org-himalaya', 'Himalaya Wellness R&D (Demo)', 'INDUSTRY', 'Healthcare & Biotech', 'Bengaluru, KA', 'VERIFIED', true, NOW()),
  ('demo-org-techlabs', 'TechLabs Innovations (Demo)', 'INDUSTRY', 'Enterprise Software & Cloud', 'Bengaluru, KA', 'VERIFIED', true, NOW()),
  ('demo-org-tcs', 'TCS Health Sciences Innovation (Demo)', 'INDUSTRY', 'Information Technology', 'Hyderabad, TS', 'VERIFIED', true, NOW()),
  ('demo-org-aiia', 'All India Institute of Ayurveda (Demo)', 'INSTITUTION', 'AYUSH & Integrative Medicine', 'New Delhi, DL', 'VERIFIED', true, NOW()),
  ('demo-org-ruas', 'Ramaiah University of Applied Sciences (Demo)', 'INSTITUTION', 'Multidisciplinary Engineering & Health', 'Bengaluru, KA', 'VERIFIED', true, NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  domain = EXCLUDED.domain,
  verification_status = EXCLUDED.verification_status;

-- 2. Demo User Profiles (Multi-Role & Multi-Branch)
INSERT INTO profiles (id, full_name, role, academic_stream, department, course, career_goal, is_demo, created_at)
VALUES
  ('demo-std-001', 'Aditi Sharma (Demo Student)', 'STUDENT', 'Ayurveda & AYUSH', 'Kayachikitsa', 'BAMS Final Year', 'Clinical Research Associate', true, NOW()),
  ('demo-std-002', 'Rahul Nair (Demo Student)', 'STUDENT', 'Engineering & Technology', 'Computer Science & Engineering', 'B.Tech CSE', 'Software Engineer', true, NOW()),
  ('demo-std-003', 'Pooja Verma (Demo Student)', 'STUDENT', 'Pharmacy & Biotech', 'Pharmaceutical Sciences', 'M.Pharm', 'Regulatory Affairs Specialist', true, NOW()),
  ('demo-fac-001', 'Dr. Rajeshwar Sharma (Demo Faculty)', 'FACULTY', 'Ayurveda & AYUSH', 'Dravyaguna', 'Faculty Mentor', 'Research Guide', true, NOW()),
  ('demo-ind-001', 'Vikram Malhotra (Demo Recruiter)', 'INDUSTRY', 'Enterprise Software & Cloud', 'Talent Acquisition', 'Lead Technical Recruiter', 'Hiring Manager', true, NOW()),
  ('demo-adm-001', 'Prof. Sanjeev Mehta (Demo Admin)', 'ADMIN', 'Academic Administration', 'Governance & Accreditation', 'System Dean', 'National Governance', true, NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  academic_stream = EXCLUDED.academic_stream,
  department = EXCLUDED.department,
  course = EXCLUDED.course,
  career_goal = EXCLUDED.career_goal;

-- 3. Demo Verified Skills (Medical & Computer Science)
INSERT INTO user_skills (id, user_id, skill_name, category, proficiency_score, confidence_score, verification_status, is_demo, created_at)
VALUES
  -- Student 1: Aditi Sharma (AYUSH)
  ('demo-sk-01', 'demo-std-001', 'Clinical Research', 'Clinical', 88, 92, 'INSTITUTION_VERIFIED', true, NOW()),
  ('demo-sk-02', 'demo-std-001', 'Research Methodology', 'Clinical', 82, 85, 'INSTITUTION_VERIFIED', true, NOW()),
  ('demo-sk-03', 'demo-std-001', 'Biostatistics', 'Data & Analytics', 55, 60, 'SELF_DECLARED', true, NOW()),
  ('demo-sk-04', 'demo-std-001', 'Good Clinical Practice (GCP)', 'Regulatory', 90, 94, 'INDUSTRY_VERIFIED', true, NOW()),

  -- Student 2: Rahul Nair (Computer Science - B.Tech CSE)
  ('demo-sk-05', 'demo-std-002', 'Python', 'Programming', 92, 95, 'INSTITUTION_VERIFIED', true, NOW()),
  ('demo-sk-06', 'demo-std-002', 'React', 'Frontend', 88, 90, 'INSTITUTION_VERIFIED', true, NOW()),
  ('demo-sk-07', 'demo-std-002', 'SQL', 'Databases', 85, 90, 'INSTITUTION_VERIFIED', true, NOW()),
  ('demo-sk-08', 'demo-std-002', 'Git & Docker', 'DevOps & Tooling', 82, 85, 'INDUSTRY_VERIFIED', true, NOW()),
  ('demo-sk-09', 'demo-std-002', 'Communication', 'Professional Competency', 80, 85, 'INSTITUTION_VERIFIED', true, NOW())
ON CONFLICT (id) DO UPDATE SET
  proficiency_score = EXCLUDED.proficiency_score,
  confidence_score = EXCLUDED.confidence_score,
  verification_status = EXCLUDED.verification_status;

-- 4. Demo Opportunities (Jobs & Internships)
INSERT INTO opportunities (id, organization_id, title, type, description, location, academic_branch, required_skills, stipend_amount, status, is_demo, created_at)
VALUES
  (
    'demo-opp-001',
    'demo-org-dabur',
    'Clinical Research Associate Intern (Demo)',
    'INTERNSHIP',
    'Opportunity to participate in standardized clinical trials and pharmacovigilance documentation.',
    'Ghaziabad, UP / Hybrid',
    'Medical/AYUSH',
    ARRAY['Clinical Research', 'Good Clinical Practice (GCP)', 'Biostatistics'],
    18000,
    'ACTIVE',
    true,
    NOW()
  ),
  (
    'demo-opp-002',
    'demo-org-techlabs',
    'Software Engineering Intern (Demo)',
    'INTERNSHIP',
    'Build and maintain cloud-native backend APIs, microservices, and modern frontend interfaces using Python, React, and SQL.',
    'Bengaluru, KA / Remote',
    'Engineering & Technology',
    ARRAY['Python', 'React', 'SQL', 'Git & Docker', 'Communication'],
    35000,
    'ACTIVE',
    true,
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  required_skills = EXCLUDED.required_skills,
  stipend_amount = EXCLUDED.stipend_amount;

-- 5. Demo Applications (Pre-seeded with 94% Deterministic Match)
INSERT INTO applications (id, user_id, opportunity_id, status, match_score, is_demo, created_at)
VALUES
  ('demo-app-001', 'demo-std-001', 'demo-opp-001', 'SHORTLISTED', 91, true, NOW()),
  ('demo-app-002', 'demo-std-002', 'demo-opp-002', 'UNDER_REVIEW', 94, true, NOW())
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  match_score = EXCLUDED.match_score;
