import { StudentProfile, UserSkill } from '@/lib/types';

export interface QuestionBlueprint {
  userId: string;
  academicBranch: string;
  academicDomain: string;
  careerGoal: string;
  targetRole: string;
  interviewType: string;
  questionCount: number;
  verifiedSkills: Array<{ name: string; score: number; status: string }>;
  skillGaps: Array<{ skill: string; required: number; current: number }>;
  opportunityContext?: { title: string; company: string; requiredSkills: string[] };
  resumeContext?: { summary?: string; projects?: string[]; experience?: string[] };
  distribution: {
    technical: number;
    roleSpecific: number;
    skillGapFocused: number;
    resumeBased: number;
    behavioral: number;
    hr: number;
  };
}

export function createQuestionBlueprint(params: {
  userId: string;
  profile: StudentProfile;
  skills: UserSkill[];
  targetRole?: string;
  interviewType?: string;
  questionCount?: number;
  opportunityDetails?: any;
  resumeContent?: any;
}): QuestionBlueprint {
  const {
    userId,
    profile,
    skills,
    targetRole: inputRole,
    interviewType = 'MIXED',
    questionCount = 10,
    opportunityDetails,
    resumeContent,
  } = params;

  const academicBranch = profile.academic_stream || profile.department || profile.course || 'Computer Science / Engineering';
  const academicDomain = profile.specialization || profile.degree || 'Engineering & Technology';
  const careerGoal = profile.career_goal || 'Software Engineer';
  const targetRole = inputRole || profile.target_role || profile.career_goal || 'Software Engineer';

  // Format verified skills
  const verifiedSkills = (skills || []).map((s) => ({
    name: s.skill_name,
    score: s.proficiency_score,
    status: s.verification_status,
  }));

  // Identify skill gaps (skills with score < 65)
  const skillGaps = (skills || [])
    .filter((s) => s.proficiency_score < 65)
    .map((s) => ({
      skill: s.skill_name,
      required: 70,
      current: s.proficiency_score,
    }));

  const count = Math.max(1, questionCount);

  let technical = 0;
  let roleSpecific = 0;
  let skillGapFocused = 0;
  let resumeBased = 0;
  let behavioral = 0;
  let hr = 0;

  switch (interviewType.toUpperCase()) {
    case 'TECHNICAL':
      technical = Math.ceil(count * 0.6);
      skillGapFocused = Math.floor(count * 0.2);
      roleSpecific = count - technical - skillGapFocused;
      break;
    case 'BEHAVIORAL':
      behavioral = Math.ceil(count * 0.6);
      hr = Math.floor(count * 0.2);
      roleSpecific = count - behavioral - hr;
      break;
    case 'HR':
      hr = Math.ceil(count * 0.6);
      behavioral = Math.floor(count * 0.3);
      roleSpecific = count - hr - behavioral;
      break;
    case 'ROLE_SPECIFIC':
      roleSpecific = Math.ceil(count * 0.6);
      technical = Math.floor(count * 0.2);
      skillGapFocused = count - roleSpecific - technical;
      break;
    case 'RESUME_BASED':
      resumeBased = Math.ceil(count * 0.6);
      technical = Math.floor(count * 0.2);
      behavioral = count - resumeBased - technical;
      break;
    case 'MIXED':
    default:
      technical = Math.round(count * 0.35);
      roleSpecific = Math.round(count * 0.25);
      skillGapFocused = Math.round(count * 0.15);
      resumeBased = Math.round(count * 0.10);
      behavioral = Math.round(count * 0.10);
      hr = count - (technical + roleSpecific + skillGapFocused + resumeBased + behavioral);
      break;
  }

  return {
    userId,
    academicBranch,
    academicDomain,
    careerGoal,
    targetRole,
    interviewType,
    questionCount: count,
    verifiedSkills,
    skillGaps,
    opportunityContext: opportunityDetails
      ? {
          title: opportunityDetails.title,
          company: opportunityDetails.company_name,
          requiredSkills: opportunityDetails.required_skills || [],
        }
      : undefined,
    resumeContext: resumeContent
      ? {
          summary: resumeContent.summary,
          projects: (resumeContent.projects || []).map((p: any) => typeof p === 'string' ? p : p.title),
          experience: (resumeContent.experience || []).map((e: any) => typeof e === 'string' ? e : e.title),
        }
      : undefined,
    distribution: {
      technical: Math.max(0, technical),
      roleSpecific: Math.max(0, roleSpecific),
      skillGapFocused: Math.max(0, skillGapFocused),
      resumeBased: Math.max(0, resumeBased),
      behavioral: Math.max(0, behavioral),
      hr: Math.max(0, hr),
    },
  };
}
