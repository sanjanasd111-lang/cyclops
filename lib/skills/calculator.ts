import { UserSkill, VerificationStatus } from '@/lib/types';

export interface SkillCalculationResult {
  skillId: string;
  skillName: string;
  category: string;
  calculatedScore: number;
  confidenceScore: number; // 0 - 100
  confidenceLevel: 'High' | 'Medium' | 'Low';
  verificationStatus: VerificationStatus;
  evidenceList: Array<{
    type: 'SELF_RATING' | 'ASSESSMENT' | 'PROJECT' | 'CERTIFICATION' | 'EXPERIENCE' | 'MENTOR' | 'INSTITUTION' | 'INDUSTRY' | 'VERIFICATION';
    title: string;
    contribution: number;
  }>;
}

export interface SevenSourceEvidenceInput {
  assessmentScore?: number; // 50%
  projectScore?: number;    // 15%
  certScore?: number;       // 10%
  experienceScore?: number; // 10%
  mentorScore?: number;     // 5%
  institutionScore?: number;// 5%
  industryScore?: number;   // 5%
}

/**
 * Calculates a deterministic 7-Source Skill Score (0-100)
 * based strictly on evidence weights:
 * Assessment = 50%
 * Projects = 15%
 * Certifications = 10%
 * Experience = 10%
 * Mentor Verification = 5%
 * Institution Verification = 5%
 * Industry Verification = 5%
 */
export function calculate7SourceSkillScore(
  skill: UserSkill,
  inputs?: SevenSourceEvidenceInput
): SkillCalculationResult {
  const evidenceList: Array<{ type: 'SELF_RATING' | 'ASSESSMENT' | 'PROJECT' | 'CERTIFICATION' | 'EXPERIENCE' | 'MENTOR' | 'INSTITUTION' | 'INDUSTRY' | 'VERIFICATION'; title: string; contribution: number }> = [];

  const baseline = skill.proficiency_score || 60;
  const assessment = inputs?.assessmentScore !== undefined ? inputs.assessmentScore : (skill.confidence_score || baseline);
  const project = inputs?.projectScore !== undefined ? inputs.projectScore : (baseline > 70 ? 80 : 50);
  const cert = inputs?.certScore !== undefined ? inputs.certScore : 60;
  const exp = inputs?.experienceScore !== undefined ? inputs.experienceScore : 55;
  const mentor = inputs?.mentorScore !== undefined ? inputs.mentorScore : (skill.verification_status !== 'SELF_DECLARED' ? 85 : 50);
  const inst = inputs?.institutionScore !== undefined ? inputs.institutionScore : (skill.verification_status === 'INSTITUTION_VERIFIED' ? 95 : 50);
  const ind = inputs?.industryScore !== undefined ? inputs.industryScore : (skill.verification_status === 'INDUSTRY_VERIFIED' ? 95 : 50);

  const calculatedScore = Math.round(
    assessment * 0.50 +
    project * 0.15 +
    cert * 0.10 +
    exp * 0.10 +
    mentor * 0.05 +
    inst * 0.05 +
    ind * 0.05
  );

  evidenceList.push({ type: 'ASSESSMENT', title: `Diagnostic Assessment (${assessment}%)`, contribution: Math.round(assessment * 0.50) });
  evidenceList.push({ type: 'PROJECT', title: `Verified Projects (${project}%)`, contribution: Math.round(project * 0.15) });
  evidenceList.push({ type: 'CERTIFICATION', title: `Certifications (${cert}%)`, contribution: Math.round(cert * 0.10) });
  evidenceList.push({ type: 'EXPERIENCE', title: `Practical Experience (${exp}%)`, contribution: Math.round(exp * 0.10) });
  evidenceList.push({ type: 'MENTOR', title: `Faculty Mentor Sign-off (${mentor}%)`, contribution: Math.round(mentor * 0.05) });
  evidenceList.push({ type: 'INSTITUTION', title: `Institution Verification (${inst}%)`, contribution: Math.round(inst * 0.05) });
  evidenceList.push({ type: 'INDUSTRY', title: `Industry Partner Endorsement (${ind}%)`, contribution: Math.round(ind * 0.05) });

  let confidence = 50;
  if (inputs?.assessmentScore !== undefined) confidence += 20;
  if (inputs?.projectScore !== undefined) confidence += 10;
  if (skill.verification_status !== 'SELF_DECLARED') confidence += 20;
  confidence = Math.min(100, confidence);

  const confidenceLevel: 'High' | 'Medium' | 'Low' = confidence >= 80 ? 'High' : confidence >= 60 ? 'Medium' : 'Low';

  return {
    skillId: skill.skill_id,
    skillName: skill.skill_name,
    category: skill.category,
    calculatedScore: Math.min(100, Math.max(0, calculatedScore)),
    confidenceScore: confidence,
    confidenceLevel,
    verificationStatus: skill.verification_status,
    evidenceList,
  };
}

export function calculateEvidenceBasedSkill(
  skill: UserSkill,
  assessmentScore?: number,
  projectsCount: number = 0,
  hasCert: boolean = false
): SkillCalculationResult {
  return calculate7SourceSkillScore(skill, {
    assessmentScore,
    projectScore: projectsCount > 0 ? 80 : 40,
    certScore: hasCert ? 85 : 40,
  });
}
