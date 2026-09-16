-- AYUSHSetu AI - Core PostgreSQL Database Schema
-- SIH Problem Statement 26044

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role Enum
CREATE TYPE user_role AS ENUM ('STUDENT', 'INDUSTRY', 'FACULTY', 'INSTITUTION', 'ADMIN');
CREATE TYPE opportunity_type AS ENUM ('INTERNSHIP', 'JOB', 'INDUSTRIAL_TRAINING', 'PROJECT');
CREATE TYPE application_status AS ENUM ('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED');
CREATE TYPE verification_status AS ENUM ('SELF_DECLARED', 'INSTITUTION_VERIFIED', 'INDUSTRY_VERIFIED');

-- Core Profiles Table
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

-- Institutions Table
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

-- Student Profiles Table
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES institutions(id),
  course TEXT NOT NULL,
  year INT NOT NULL,
  career_goal TEXT NOT NULL,
  preferred_roles TEXT[],
  preferred_locations TEXT[],
  availability TEXT,
  overall_readiness_score INT DEFAULT 0,
  bio TEXT,
  resume_url TEXT,
  public_slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Industry Profiles Table
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

-- Faculty Profiles Table
CREATE TABLE IF NOT EXISTS faculty_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES institutions(id),
  department TEXT NOT NULL,
  title TEXT NOT NULL,
  specialization TEXT[],
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills Taxonomy Table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Skills Table
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

-- Opportunities Table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_id UUID REFERENCES industry_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  opportunity_type opportunity_type NOT NULL,
  location TEXT NOT NULL,
  is_remote BOOLEAN DEFAULT false,
  duration_months INT DEFAULT 3,
  stipend_amount INT DEFAULT 0,
  deadline TIMESTAMPTZ NOT NULL,
  eligibility_criteria JSONB,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunity Required Skills
CREATE TABLE IF NOT EXISTS opportunity_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  min_proficiency INT CHECK (min_proficiency BETWEEN 0 AND 100) DEFAULT 50,
  weight INT DEFAULT 1,
  is_required BOOLEAN DEFAULT true
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  status application_status DEFAULT 'APPLIED',
  match_score INT NOT NULL DEFAULT 0,
  match_breakdown JSONB NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(opportunity_id, student_id)
);

-- Enable RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Public read policies for active skills & public portfolios
CREATE POLICY "Public skills read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public student profile read by slug" ON student_profiles FOR SELECT USING (true);
