import { StudentProfile, UserSkill } from '@/lib/types';

export interface CareerReadinessBreakdown {
  overallScore: number;
  skillScore: number;
  assessmentScore: number;
  experienceScore: number;
  projectScore: number;
  certificationScore: number;
  resumeScore: number;
  interviewScore: number;
  careerAlignmentScore: number;
  profileScore: number;
}

/**
 * Calculates a transparent, 8-part weighted Career Readiness score (0-100)
 * based strictly on real student profile, skills, assessments, projects, credentials, and interview attempts.
 *
 * Formula Weights (Section 21 Specification):
 * 1. 20% / 25% Skill Readiness
 * 2. 20% Assessment Performance
 * 3. 15% Practical Experience / Internships
 * 4. 15% Verified Projects
 * 5. 10% Certifications & Credentials
 * 6. 10% Resume Strength / ATS Compatibility
 * 7. 5% Interview Readiness
 * 8. 5% Career Goal Alignment
 */
export function calculateCareerReadiness(
  profile: StudentProfile,
  skills: UserSkill[],
  projectsCount?: number,
  certsCount?: number,
  hasInternship?: boolean,
  resumeATSScore?: number,
  assessmentAvgScore?: number,
  interviewAvgScore?: number
): CareerReadinessBreakdown {
  // 1. Skill Readiness
  let skillScore = 0;
  if (skills && skills.length > 0) {
    const totalProficiency = skills.reduce((sum, s) => {
      const weight = s.verification_status === 'INSTITUTION_VERIFIED' || s.verification_status === 'INDUSTRY_VERIFIED' ? 1.15 : 1.0;
      return sum + Math.min(100, (s.proficiency_score || 60) * weight);
    }, 0);
    skillScore = Math.min(100, Math.round(totalProficiency / skills.length));
  } else {
    skillScore = 35;
  }

  // 2. Assessment Performance (20%)
  let assessmentScore = assessmentAvgScore || 0;
  if (!assessmentScore) {
    const verifiedSkills = (skills || []).filter((s) => s.verification_status !== 'SELF_DECLARED');
    if (verifiedSkills.length > 0) {
      const sumConf = verifiedSkills.reduce((acc, s) => acc + (s.confidence_score || s.proficiency_score || 70), 0);
      assessmentScore = Math.min(100, Math.round(sumConf / verifiedSkills.length));
    } else {
      assessmentScore = 50;
    }
  }

  // 3. Practical Experience (15%)
  const expList = profile.experience || [];
  const actualExpCount = expList.length;
  const isExp = hasInternship !== undefined ? hasInternship : actualExpCount > 0;
  let experienceScore = 0;
  if (actualExpCount >= 2) experienceScore = 95;
  else if (actualExpCount === 1 || isExp) experienceScore = 75;
  else experienceScore = 30;

  // 4. Projects Evidence (15%)
  const projList = profile.projects || [];
  const actualProjCount = projectsCount !== undefined ? projectsCount : projList.length;
  let projectScore = 0;
  if (actualProjCount >= 2) projectScore = 90;
  else if (actualProjCount === 1) projectScore = 65;
  else projectScore = 25;

  // 5. Certifications (10%)
  const certList = profile.certifications || [];
  const actualCertCount = certsCount !== undefined ? certsCount : certList.length;
  let certificationScore = 0;
  if (actualCertCount >= 2) certificationScore = 95;
  else if (actualCertCount === 1) certificationScore = 70;
  else certificationScore = 20;

  // 6. Resume Strength (10%)
  const resumeScore = resumeATSScore !== undefined ? resumeATSScore : 55;

  // 7. Interview Readiness (5% or incorporated)
  const interviewScore = interviewAvgScore !== undefined && interviewAvgScore > 0 ? interviewAvgScore : 50;
  const hasInterviewAttempt = interviewAvgScore !== undefined && interviewAvgScore > 0;

  // 8. Career Goal Alignment (5%)
  let careerAlignmentScore = 30;
  if (profile.target_role || profile.career_goal) careerAlignmentScore += 35;
  if (profile.academic_stream || profile.course) careerAlignmentScore += 35;
  careerAlignmentScore = Math.min(100, careerAlignmentScore);

  // Overall Weighted Score Calculation
  let overallScore = 0;
  if (hasInterviewAttempt) {
    overallScore = Math.round(
      skillScore * 0.20 +
      assessmentScore * 0.20 +
      experienceScore * 0.15 +
      projectScore * 0.15 +
      certificationScore * 0.10 +
      resumeScore * 0.10 +
      interviewScore * 0.05 +
      careerAlignmentScore * 0.05
    );
  } else {
    overallScore = Math.round(
      skillScore * 0.25 +
      assessmentScore * 0.20 +
      experienceScore * 0.15 +
      projectScore * 0.15 +
      certificationScore * 0.10 +
      resumeScore * 0.10 +
      careerAlignmentScore * 0.05
    );
  }

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    skillScore,
    assessmentScore,
    experienceScore,
    projectScore,
    certificationScore,
    resumeScore,
    interviewScore,
    careerAlignmentScore,
    profileScore: Math.min(100, Math.round((skillScore + experienceScore + projectScore + careerAlignmentScore) / 4)),
  };
}

