-- AYUSHSetu AI Master Repair Schema Migration
-- Complete 23-table schema for production readiness

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('STUDENT', 'INDUSTRY', 'FACULTY', 'INSTITUTION', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE opportunity_type AS ENUM ('INTERNSHIP', 'JOB', 'INDUSTRIAL_TRAINING', 'PROJECT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('SELF_DECLARED', 'INSTITUTION_VERIFIED', 'INDUSTRY_VERIFIED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'STUDENT',
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Institutions Table
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  website TEXT,
  verified BOOLEAN DEFAULT true,
  total_students INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Student Profiles Table
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES institutions(id),
  course TEXT NOT NULL,
  year INT NOT NULL DEFAULT 1,
  career_goal TEXT NOT NULL DEFAULT '',
  preferred_roles TEXT[] DEFAULT '{}',
  preferred_locations TEXT[] DEFAULT '{}',
  availability TEXT DEFAULT 'Immediate',
  overall_readiness_score INT DEFAULT 0,
  bio TEXT,
  resume_url TEXT,
  public_slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Industry Profiles Table
CREATE TABLE IF NOT EXISTS industry_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry_sector TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,
  company_size TEXT,
  location TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Faculty Profiles Table
CREATE TABLE IF NOT EXISTS faculty_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES institutions(id),
  department TEXT NOT NULL,
  title TEXT NOT NULL,
  specialization TEXT[] DEFAULT '{}',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Skills Taxonomy Table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. User Skills Table
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_score INT CHECK (proficiency_score BETWEEN 0 AND 100) DEFAULT 0,
  verification_status verification_status DEFAULT 'SELF_DECLARED',
  verified_by TEXT,
  confidence_score INT DEFAULT 85,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, skill_id)
);

-- 8. Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL,
  skill_category TEXT NOT NULL,
  duration_minutes INT DEFAULT 30,
  total_questions INT DEFAULT 10,
  passing_score INT DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Assessment Questions Table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer_index INT NOT NULL,
  explanation TEXT,
  difficulty TEXT DEFAULT 'MEDIUM',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Assessment Results Table
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  overall_score INT NOT NULL,
  skill_scores JSONB NOT NULL DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  priority_gaps TEXT[] DEFAULT '{}',
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Assessment Answers Table
CREATE TABLE IF NOT EXISTS assessment_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  result_id UUID REFERENCES assessment_results(id) ON DELETE CASCADE,
  question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
  selected_option_index INT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Skill Evidence Table
CREATE TABLE IF NOT EXISTS skill_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_skill_id UUID REFERENCES user_skills(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  description TEXT,
  verified_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Career Roles Table
CREATE TABLE IF NOT EXISTS career_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  description TEXT,
  demand_level TEXT DEFAULT 'HIGH',
  avg_salary_range TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Career Role Skills Table
CREATE TABLE IF NOT EXISTS career_role_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES career_roles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  importance_weight FLOAT DEFAULT 1.0,
  required_proficiency INT DEFAULT 60,
  UNIQUE(role_id, skill_id)
);

-- 15. Opportunities Table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_id UUID REFERENCES industry_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  opportunity_type opportunity_type NOT NULL DEFAULT 'INTERNSHIP',
  location TEXT NOT NULL,
  is_remote BOOLEAN DEFAULT false,
  duration_months INT DEFAULT 3,
  stipend_amount INT DEFAULT 0,
  deadline TIMESTAMPTZ NOT NULL,
  eligibility_criteria JSONB DEFAULT '{}',
  status TEXT DEFAULT 'ACTIVE',
  source TEXT DEFAULT 'INTERNAL',
  external_id TEXT,
  source_url TEXT,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to opportunities if table existed prior
DO $$ BEGIN
  ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'INTERNAL';
  ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS external_id TEXT;
  ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS source_url TEXT;
  ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS posted_at TIMESTAMPTZ DEFAULT NOW();
  ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
  ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 16. Opportunity Required Skills Table
CREATE TABLE IF NOT EXISTS opportunity_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  min_proficiency INT CHECK (min_proficiency BETWEEN 0 AND 100) DEFAULT 50,
  weight INT DEFAULT 1,
  is_required BOOLEAN DEFAULT true
);

-- 17. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  status application_status DEFAULT 'APPLIED',
  match_score INT NOT NULL DEFAULT 0,
  match_breakdown JSONB NOT NULL DEFAULT '{}',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(opportunity_id, student_id)
);

-- 18. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Learning Recommendations Table
CREATE TABLE IF NOT EXISTS learning_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  resource_url TEXT,
  estimated_hours INT DEFAULT 10,
  difficulty TEXT DEFAULT 'INTERMEDIATE',
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'INFO',
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. AI Interactions Audit Log
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  prompt_summary TEXT,
  response_summary TEXT,
  tokens_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. System Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_institution_id ON student_profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_student_id ON user_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_industry_id ON opportunities(industry_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity_id ON applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_role_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Permissive policies for authenticated standard interaction while keeping multi-tenant boundaries
DO $$ BEGIN
  CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read institutions" ON institutions FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read opportunities" ON opportunities FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
