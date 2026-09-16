-- AYUSHSetu AI Resume Studio Database Migration Script

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Professional Resume',
  target_role TEXT NOT NULL DEFAULT 'Software Engineer',
  template TEXT NOT NULL DEFAULT 'modern',
  content_json JSONB NOT NULL DEFAULT '{}',
  ats_score INT DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  visibility TEXT DEFAULT 'PRIVATE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Resume Documents Table (Uploaded Resumes)
CREATE TABLE IF NOT EXISTS resume_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INT NOT NULL,
  target_role TEXT DEFAULT 'General',
  extracted_text TEXT,
  status TEXT DEFAULT 'PARSED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Resume Analysis Table
CREATE TABLE IF NOT EXISTS resume_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  ats_score INT NOT NULL DEFAULT 0,
  keyword_score INT DEFAULT 0,
  skill_alignment INT DEFAULT 0,
  format_score INT DEFAULT 0,
  section_completeness INT DEFAULT 0,
  impact_score INT DEFAULT 0,
  readability_score INT DEFAULT 0,
  matched_keywords TEXT[] DEFAULT '{}',
  missing_keywords TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  section_feedback JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Resume Versions Table
CREATE TABLE IF NOT EXISTS resume_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  version_number INT NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  content_json JSONB NOT NULL DEFAULT '{}',
  ats_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add resume_id foreign key to applications if not present
DO $$ BEGIN
  ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_documents_user_id ON resume_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analysis_user_id ON resume_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analysis_resume_id ON resume_analysis(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON resume_versions(resume_id);

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;

-- Permissive authenticated owner policies
DO $$ BEGIN
  CREATE POLICY "Users access own resumes" ON resumes FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users access own resume docs" ON resume_documents FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users access own resume analysis" ON resume_analysis FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users access own resume versions" ON resume_versions FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
