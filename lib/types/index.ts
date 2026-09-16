export type UserRole = 'STUDENT' | 'INDUSTRY' | 'FACULTY' | 'INSTITUTION' | 'ADMIN';

export type OpportunityType = 
  | 'INTERNSHIP' 
  | 'JOB' 
  | 'INDUSTRIAL_TRAINING' 
  | 'PROJECT'
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'RESEARCH_PROJECT'
  | 'LIVE_PROJECT'
  | 'APPRENTICESHIP'
  | 'FELLOWSHIP'
  | 'WORKSHOP'
  | 'MENTORSHIP'
  | 'CONSULTANCY';

export type ApplicationStatus = 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED';

export type VerificationStatus = 'SELF_DECLARED' | 'INSTITUTION_VERIFIED' | 'INDUSTRY_VERIFIED';

export type IndustryVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  profile_id: string;
  full_name?: string;
  institution_id?: string;
  institution_name?: string;
  academic_stream?: string;
  department?: string;
  degree?: string;
  specialization?: string;
  course: string;
  year: number;
  career_goal: string;
  target_role?: string;
  preferred_roles: string[];
  preferred_industry?: string;
  preferred_locations: string[];
  preferred_work_type?: string;
  availability: string;
  overall_readiness_score: number;
  interests?: string[];
  bio?: string;
  phone?: string;
  email?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  profile_completed?: boolean;
  resume_url?: string;
  public_slug: string;
  created_at: string;
  updated_at?: string;
  projects?: Array<{ title: string; description: string; skills_used: string[] }>;
  certifications?: Array<{ name: string; issuer: string; year: number }>;
  experience?: Array<{ title: string; organization: string; duration: string; description: string }>;
}

export interface IndustryProfile {
  id: string;
  user_id: string;
  profile_id: string;
  company_name: string;
  official_email?: string;
  contact_person?: string;
  phone?: string;
  organization_type?: string;
  industry_domain?: string;
  industry_sector?: string;
  website?: string;
  logo_url?: string;
  company_size?: string;
  location?: string;
  description?: string;
  verified: boolean;
  verification_status: IndustryVerificationStatus;
  created_at: string;
  updated_at?: string;
}

export interface FacultyProfile {
  id: string;
  user_id: string;
  profile_id: string;
  full_name?: string;
  institution_id: string;
  institution_name?: string;
  department: string;
  title: string; // Designation e.g. Associate Professor, HOD
  specialization: string[];
  bio?: string;
  official_email?: string;
  phone?: string;
  research_interests?: string[];
  experience_years?: number;
  created_at: string;
}

export interface InstitutionProfile {
  id: string;
  user_id?: string;
  name: string;
  code: string;
  type: string; // E.g. National Institute, Central University, Autonomous University
  location: string;
  state: string;
  website?: string;
  official_email?: string;
  phone?: string;
  accreditation?: string; // E.g. NAAC A++, NBA Accredited, Ministry of Ayush Center of Excellence
  description?: string;
  departments?: string[];
  established_year?: number;
  logo_url?: string;
  verified: boolean;
  total_students: number;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  is_active: boolean;
}

export interface UserSkill {
  id: string;
  student_id: string;
  skill_id: string;
  skill_name: string;
  category: string;
  proficiency_score: number; // 0 - 100
  verification_status: VerificationStatus;
  verified_by?: string;
  confidence_score: number;
  evidence_sources?: Array<{ source: string; score: number; title: string; date: string }>;
  updated_at: string;
}

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  skill_id: string;
  skill_name: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  difficulty_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  weight: number;
  department?: string;
}

export interface AssessmentResult {
  id: string;
  student_id: string;
  assessment_id: string;
  total_score: number;
  category_breakdown: Record<string, number>;
  completed_at: string;
}

export interface OpportunitySkillRequirement {
  skill_id: string;
  skill_name: string;
  min_proficiency: number;
  is_required: boolean;
  importance?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Opportunity {
  id: string;
  industry_id: string;
  company_name: string;
  logo_url?: string;
  title: string;
  description: string;
  opportunity_type: OpportunityType;
  location: string;
  is_remote: boolean;
  duration_months: number;
  stipend_amount: number;
  salary_amount?: number;
  deadline?: string;
  application_deadline?: string;
  eligibility?: string;
  experience_level?: string;
  source?: string;
  eligibility_criteria?: {
    min_cgpa?: number;
    course?: string;
    allowed_streams?: string[];
    allowed_years?: number[];
    required_experience_months?: number;
    graduation_year?: number;
  };
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  required_skills: OpportunitySkillRequirement[];
  preferred_skills?: OpportunitySkillRequirement[];
  created_at: string;
}

export interface MatchBreakdown {
  overallScore: number;
  skillScore: number;
  interestScore: number;
  educationScore: number;
  projectScore: number;
  certificationScore: number;
  experienceScore: number;
  locationScore: number;
  matchedSkills: Array<{ skillName: string; studentScore: number; requiredScore: number }>;
  missingSkills: Array<{ skillName: string; studentScore: number; requiredScore: number; gap: number }>;
  partialSkills?: Array<{ skillName: string; studentScore: number; requiredScore: number }>;
  transferableSkills?: string[];
  crossDomainPathway?: string;
  reasons?: string[];
  eligibility?: {
    isEligible: boolean;
    summary: string;
  };
}

export interface Application {
  id: string;
  opportunity_id: string;
  student_id: string;
  student_name: string;
  opportunity_title: string;
  company_name: string;
  resume_id?: string;
  resume_used_name?: string;
  status: ApplicationStatus;
  match_score: number;
  match_breakdown?: MatchBreakdown;
  applied_at: string;
  updated_at: string;
}

export interface ApplicationStatusHistory {
  id: string;
  application_id: string;
  old_status: ApplicationStatus;
  new_status: ApplicationStatus;
  changed_by: string;
  changed_at: string;
}

export interface Interview {
  id: string;
  application_id: string;
  opportunity_id: string;
  student_id: string;
  student_name: string;
  industry_id: string;
  company_name: string;
  scheduled_at: string;
  mode: 'ONLINE' | 'IN_PERSON' | 'TELEPHONIC';
  meeting_link?: string;
  notes?: string;
  interviewer_name?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}

export interface CollaborationProgram {
  id: string;
  industry_id: string;
  company_name: string;
  title: string;
  type: 'RESEARCH_PROJECT' | 'LIVE_PROJECT' | 'INNOVATION_CHALLENGE' | 'WORKSHOP' | 'MENTORSHIP' | 'GUEST_LECTURE' | 'INDUSTRIAL_TRAINING';
  description: string;
  duration: string;
  location?: string;
  eligibility?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DRAFT';
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'APPLICATION' | 'OPPORTUNITY' | 'INTERVIEW' | 'MENTOR' | 'SYSTEM' | 'WORKSHOP' | 'COLLABORATION' | 'RESEARCH';
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  company: string;
  type: 'COMPANY_INTERVIEW' | 'AI_MOCK' | 'ASSESSMENT' | 'DEADLINE';
  date: string; // YYYY-MM-DD
  time: string;
  duration: string;
  mode: 'VIRTUAL' | 'IN_PERSON';
  locationOrLink: string;
  interviewer?: string;
  status: 'CONFIRMED' | 'UPCOMING' | 'COMPLETED';
  notes?: string;
}

// ----------------------------------------------------
// PHASE 3 — ACADEMIA & FACULTY INTELLIGENCE TYPES
// ----------------------------------------------------

export interface MentorshipRecord {
  id: string;
  faculty_id: string;
  faculty_name: string;
  student_id: string;
  student_name: string;
  academic_branch: string;
  career_goal: string;
  target_role?: string;
  start_date: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  progress_percent: number;
  last_review_date?: string;
  next_review_date?: string;
  skill_gaps_addressed: string[];
  feedback_history: Array<{
    date: string;
    author: string;
    note: string;
    milestone?: string;
  }>;
  created_at: string;
}

export interface ResearchProject {
  id: string;
  faculty_id: string;
  faculty_name: string;
  institution_id: string;
  title: string;
  description: string;
  research_domain: string;
  required_skills: string[];
  industry_partner?: string;
  participating_student_ids: string[];
  start_date: string;
  deadline?: string;
  status: 'IDEA' | 'OPEN' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  research_outcomes?: string[];
  created_at: string;
}

export interface IndustrialTraining {
  id: string;
  institution_id: string;
  faculty_id: string;
  faculty_name: string;
  title: string;
  organization_name: string;
  training_type: 'INDUSTRIAL_TRAINING' | 'FDP' | 'INDUSTRY_WORKSHOP' | 'GUEST_LECTURE' | 'CERTIFICATION_PROGRAM';
  date: string;
  duration: string;
  skills_focused: string[];
  participant_count: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  location_or_url?: string;
  created_at: string;
}

export interface Workshop {
  id: string;
  institution_id: string;
  faculty_id: string;
  faculty_name: string;
  title: string;
  description: string;
  trainer_name: string;
  organization: string;
  target_skills: string[];
  date: string;
  duration_hours: number;
  capacity: number;
  registered_student_ids: string[];
  registration_deadline: string;
  mode: 'ONLINE' | 'HYBRID' | 'IN_PERSON';
  location_or_url: string;
  status: 'OPEN' | 'FULL' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}

export interface CurriculumRecommendation {
  id: string;
  institution_id: string;
  skill_name: string;
  category: string;
  industry_demand_count: number;
  avg_student_level: number;
  target_required_level: number;
  gap_points: number;
  priority: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  recommended_action: 'WORKSHOP' | 'FDP' | 'NEW_COURSE' | 'LIVE_PROJECT' | 'INDUSTRY_TRAINING' | 'MENTORSHIP';
  action_title: string;
  reasoning: string;
  created_at: string;
}

export interface SkillHeatmapCell {
  skill_name: string;
  category: string;
  branch: string;
  avg_proficiency: number; // 0 - 100
  student_count: number;
  industry_demand_level: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface InstitutionReportFilter {
  academic_year?: string;
  semester?: string;
  branch?: string;
  department?: string;
  career_domain?: string;
  skill?: string;
  opportunity_type?: string;
}

export interface InstitutionReport {
  id: string;
  institution_id: string;
  report_type: 'SKILL_GAP' | 'SKILL_DEMAND' | 'PLACEMENT' | 'INTERNSHIP' | 'INDUSTRY_ENGAGEMENT' | 'CAREER_READINESS' | 'BRANCH_PERFORMANCE';
  title: string;
  generated_at: string;
  period: string;
  metrics_summary: Record<string, any>;
  findings: string[];
  recommendations: string[];
}

export * from './resume-types';

export type InterviewType = 'TECHNICAL' | 'HR' | 'BEHAVIORAL' | 'ROLE_SPECIFIC' | 'RESUME_BASED' | 'MIXED';
export type InterviewSessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
export type QuestionCategory = 'TECHNICAL' | 'BEHAVIORAL' | 'HR' | 'ROLE_SPECIFIC' | 'RESUME' | 'COMMUNICATION' | 'PROBLEM_SOLVING';

export interface InterviewSession {
  id: string;
  user_id: string;
  target_role: string;
  opportunity_id?: string;
  resume_id?: string;
  interview_type: InterviewType;
  question_count: number;
  status: InterviewSessionStatus;
  overall_score: number;
  technical_score: number;
  relevance_score: number;
  clarity_score: number;
  structure_score: number;
  completeness_score: number;
  role_alignment_score: number;
  duration_seconds: number;
  started_at: string;
  completed_at?: string;
  questions?: InterviewQuestion[];
}

export interface InterviewQuestion {
  id: string;
  session_id: string;
  question_number: number;
  category: QuestionCategory;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  question: string;
  expected_topics: string[];
  is_adaptive_followup?: boolean;
  parent_question_id?: string;
  created_at: string;
  answer?: InterviewAnswer;
  evaluation?: InterviewEvaluation;
}

export interface InterviewAnswer {
  id: string;
  question_id: string;
  session_id: string;
  user_id: string;
  answer_text: string;
  transcript?: string;
  input_mode?: 'TEXT' | 'VOICE';
  answered_at: string;
}

export interface InterviewEvaluation {
  id: string;
  answer_id: string;
  session_id: string;
  user_id: string;
  technical_score: number;
  relevance_score: number;
  clarity_score: number;
  structure_score: number;
  completeness_score: number;
  role_alignment_score: number;
  overall_score: number;
  star_situation_score?: number;
  star_task_score?: number;
  star_action_score?: number;
  star_result_score?: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  better_approach: string;
  created_at: string;
}

export interface STAREvaluation {
  situationScore: number;
  taskScore: number;
  actionScore: number;
  resultScore: number;
  recommendations: string[];
}

export interface AdaptiveProgression {
  previousDifficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EASY' | 'MEDIUM' | 'HARD';
  nextDifficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EASY' | 'MEDIUM' | 'HARD';
  reasoning: string;
}

export interface AICoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface InterviewPreparationData {
  targetRole: string;
  interviewReadiness: number;
  technicalScore: number;
  communicationScore: number;
  roleKnowledgeScore: number;
  resumeDefenseScore: number;
  weakAreas: string[];
  recommendedTopics: string[];
  practiceQuestions: string[];
  resumeAreasToKnow: string[];
  projectsToPrepare: string[];
}

export interface InterviewAnalytics {
  totalAttempts: number;
  averageScore: number;
  scoreOverTime: Array<{ date: string; score: number; role: string }>;
  categoryScores: Array<{ category: string; score: number }>;
  topWeaknesses: string[];
  topStrengths: string[];
  improvementDelta: number;
}

// ----------------------------------------------------
// PHASE 6 & PHASE 7 EXTENDED TYPES
// ----------------------------------------------------

export interface SavedOpportunity {
  id: string;
  user_id: string;
  opportunity_id: string;
  created_at: string;
  opportunity?: Opportunity;
}

export interface JobAlert {
  id: string;
  user_id: string;
  title: string;
  target_role?: string;
  academic_branch?: string;
  location?: string;
  work_type?: string;
  skills?: string[];
  is_active: boolean;
  created_at: string;
}

export interface PlacementCycle {
  id: string;
  institution_id: string;
  academic_year: string;
  cycle_name: string;
  start_date?: string;
  end_date?: string;
  target_placement_rate: number;
  status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
  created_at: string;
}

export interface CandidateShortlist {
  id: string;
  industry_id: string;
  opportunity_id: string;
  student_id: string;
  match_score: number;
  notes?: string;
  status: 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'SELECTED' | 'REJECTED';
  created_at: string;
  student?: StudentProfile;
}

export interface RejectionReason {
  id: string;
  application_id: string;
  recruiter_id: string;
  reason_category: 'SKILL_GAP' | 'EXPERIENCE' | 'EDUCATION' | 'RESUME' | 'INTERVIEW' | 'ROLE_CLOSED' | 'OTHER';
  feedback_text?: string;
  created_at: string;
}

export interface OrganizationVerification {
  id: string;
  organization_id: string;
  organization_name: string;
  organization_type: 'INDUSTRY' | 'INSTITUTION' | 'RECRUITER' | 'FACULTY';
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  document_urls?: string[];
  notes?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
}

export interface OpportunityReport {
  id: string;
  opportunity_id: string;
  student_id: string;
  reason: 'SUSPICIOUS' | 'EXPIRED' | 'INCORRECT_INFO' | 'BROKEN_LINK' | 'SPAM' | 'OTHER';
  details?: string;
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED' | 'ACTIONED';
  resolved_by?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_role?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: any;
  ip_address?: string;
  created_at: string;
}

export interface AiUsageLog {
  id: string;
  user_id: string;
  feature_name: string;
  prompt_tokens: number;
  completion_tokens: number;
  latency_ms: number;
  status: 'SUCCESS' | 'FAILURE';
  error_message?: string;
  created_at: string;
}

export interface ProfileVisibilitySettings {
  id: string;
  user_id: string;
  public_profile: boolean;
  recruiter_profile: boolean;
  resume_visible: boolean;
  projects_visible: boolean;
  skills_visible: boolean;
  interview_visible: boolean;
  contact_visible: boolean;
  updated_at: string;
}

export interface PlacementMetrics {
  totalStudents: number;
  careerReadyStudents: number;
  internshipReadyStudents: number;
  placementReadyStudents: number;
  totalApplications: number;
  shortlistedCount: number;
  interviewsCount: number;
  offersCount: number;
  placementRate: number;
  internshipRate: number;
  branchBreakdown: Array<{
    branch: string;
    studentCount: number;
    readinessScore: number;
    applicationsCount: number;
    shortlistRate: number;
    interviewRate: number;
    selectionRate: number;
  }>;
}

export interface CandidateComparison {
  opportunityId: string;
  opportunityTitle: string;
  candidates: Array<{
    student: StudentProfile;
    matchScore: number;
    skillsMatchPercent: number;
    educationMatchPercent: number;
    experienceMatchPercent: number;
    projectsMatchPercent: number;
    certificationsMatchPercent: number;
    interviewReadinessScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    atsScore: number;
  }>;
}

export interface TrainingBatch {
  id: string;
  institution_id: string;
  batch_name: string;
  skill_focus: string;
  target_branch: string;
  target_score: number;
  current_score: number;
  student_count: number;
  potential_opportunities: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  created_at: string;
}

export type RejectionReasonCategory =
  | 'SKILL_GAP'
  | 'ELIGIBILITY'
  | 'EXPERIENCE'
  | 'ROLE_CLOSED'
  | 'CANDIDATE_WITHDREW'
  | 'OTHER';

export interface VerificationHistoryItem {
  id: string;
  organization_id: string;
  action: string;
  previous_status: string;
  new_status: string;
  admin_id: string;
  reason?: string;
  created_at: string;
}

export type OpportunityModerationStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'SUSPENDED';

export interface OpportunityQualitySignal {
  isDuplicate: boolean;
  hasInvalidUrl: boolean;
  missingDescription: boolean;
  missingSkills: boolean;
  isExpired: boolean;
  overallHealth: 'HEALTHY' | 'NEEDS_REVIEW';
}


