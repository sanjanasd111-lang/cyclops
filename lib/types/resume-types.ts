export type ATSTemplate = 'modern' | 'professional' | 'minimal' | 'academic';
export type ResumeVisibility = 'PRIVATE' | 'APPLICATION_ONLY' | 'PUBLIC';

export interface ResumePersonalInfo {
  fullName: string;
  headline?: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  gpa?: string;
  location?: string;
}

export interface ResumeExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  bullets: string[];
}

export interface ResumeProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface ResumeSkillItem {
  id: string;
  name: string;
  category: string;
  proficiency?: number;
  isVerified?: boolean;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  url?: string;
}

export interface ResumeContentData {
  personalInfo: ResumePersonalInfo;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: ResumeSkillItem[];
  certifications: ResumeCertification[];
  achievements: string[];
  languages: string[];
}

export interface ResumeRecord {
  id: string;
  user_id: string;
  name: string;
  target_role: string;
  template: ATSTemplate;
  content_json: ResumeContentData;
  ats_score: number;
  is_default: boolean;
  visibility: ResumeVisibility;
  created_at: string;
  updated_at: string;
}

export interface ResumeDocumentRecord {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  target_role: string;
  extracted_text?: string;
  status: 'PARSED' | 'ANALYZED' | 'FAILED';
  created_at: string;
  updated_at: string;
}

export interface ATSScoreBreakdown {
  atsScore: number;
  keywordScore: number;
  skillAlignment: number;
  formatScore: number;
  sectionCompleteness: number;
  impactScore: number;
  readabilityScore: number;
  scoreTier: 'Poor' | 'Needs Improvement' | 'Fair' | 'Good' | 'Strong' | 'Excellent';
  matchedKeywords: string[];
  missingKeywords: string[];
  missingSkills: string[];
  unverifiedSkillsOnResume: string[];
  verifiedSkillsMissingFromResume: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    id: string;
    type: 'SUCCESS' | 'WARNING' | 'CRITICAL';
    title: string;
    description: string;
    why: string;
    howToImprove: string;
    suggestedWording?: string;
  }>;
  sectionFeedback: Record<string, { status: 'COMPLETE' | 'NEEDS_WORK' | 'MISSING'; feedback: string }>;
  disclaimer: string;
}

export interface ResumeAnalysisRecord {
  id: string;
  resume_id?: string;
  user_id: string;
  target_role: string;
  opportunity_id?: string;
  ats_score: number;
  keyword_score: number;
  skill_alignment: number;
  format_score: number;
  section_completeness: number;
  impact_score: number;
  readability_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  missing_skills: string[];
  recommendations: any[];
  section_feedback: any;
  created_at: string;
}

export interface ResumeVersionRecord {
  id: string;
  resume_id: string;
  user_id: string;
  version_number: number;
  name: string;
  content_json: ResumeContentData;
  ats_score: number;
  created_at: string;
}
