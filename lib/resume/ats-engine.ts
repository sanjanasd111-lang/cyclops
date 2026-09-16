import { StudentProfile, UserSkill, Opportunity } from '@/lib/types';
import { ResumeContentData, ATSScoreBreakdown } from '@/lib/types/resume-types';
import { getRoleRequirement } from '@/lib/data/career-roles';

const ACTION_VERBS = [
  'developed', 'designed', 'built', 'implemented', 'analyzed', 'engineered',
  'created', 'formulated', 'conducted', 'led', 'architected', 'optimized',
  'standardized', 'evaluated', 'collaborated', 'researched', 'executed',
  'managed', 'spearheaded', 'orchestrated', 'synthesized', 'deployed'
];

/**
 * Deterministic ATS Scoring Engine
 * Computes exact 0-100 numerical scores across 7 dimensions using explicit code rubrics.
 * Gemini or LLMs provide qualitative feedback, but numerical scores are strictly computed here.
 */
export function calculateDeterministicATSScore(
  resume: ResumeContentData | string,
  profile: StudentProfile,
  verifiedSkills: UserSkill[],
  targetRoleName?: string,
  targetOpp?: Opportunity
): ATSScoreBreakdown {
  const roleName = targetRoleName || profile.target_role || profile.career_goal || 'Software Engineer';
  const roleReq = getRoleRequirement(roleName);

  // If raw string text passed (e.g. uploaded file text)
  const isStringInput = typeof resume === 'string';
  const rawText = isStringInput ? (resume as string) : flattenResumeToText(resume as ResumeContentData);
  const textLower = rawText.toLowerCase();

  // 1. KEYWORD MATCH (25%)
  const expectedKeywords = targetOpp?.required_skills
    ? targetOpp.required_skills.map((s) => s.skill_name)
    : roleReq.required_skills.map((s) => s.skill_name);

  // Add domain keywords
  const domainKeywords = [roleName, profile.academic_stream || '', profile.department || ''].filter(Boolean);
  const allTargetKeywords = Array.from(new Set([...expectedKeywords, ...domainKeywords]));

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  allTargetKeywords.forEach((kw) => {
    if (kw && textLower.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else if (kw) {
      missingKeywords.push(kw);
    }
  });

  const keywordRatio = allTargetKeywords.length > 0 ? matchedKeywords.length / allTargetKeywords.length : 0.8;
  const keywordScore = Math.min(100, Math.max(0, Math.round(keywordRatio * 100)));

  // 2. SKILL ALIGNMENT (20%)
  const resumeSkillsList: string[] = isStringInput
    ? extractSkillsFromText(rawText)
    : ((resume as ResumeContentData)?.skills || []).map((s) => s.name);

  const resumeSkillsLower = resumeSkillsList.map((s) => (s || '').toLowerCase());

  const verifiedSkillsMissingFromResume: string[] = [];
  const unverifiedSkillsOnResume: string[] = [];
  const matchedVerifiedSkills: string[] = [];

  verifiedSkills.forEach((vs) => {
    const isPresent = resumeSkillsLower.some(
      (rs) => rs.includes(vs.skill_name.toLowerCase()) || vs.skill_name.toLowerCase().includes(rs)
    );
    if (isPresent) {
      matchedVerifiedSkills.push(vs.skill_name);
    } else {
      verifiedSkillsMissingFromResume.push(vs.skill_name);
    }
  });

  resumeSkillsList.forEach((rs) => {
    const isVerified = verifiedSkills.some(
      (vs) => vs.skill_name.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(vs.skill_name.toLowerCase())
    );
    if (!isVerified) {
      unverifiedSkillsOnResume.push(rs);
    }
  });

  const verifiedRatio = verifiedSkills.length > 0 ? matchedVerifiedSkills.length / verifiedSkills.length : 0.75;
  const skillAlignment = Math.min(100, Math.max(0, Math.round(verifiedRatio * 100)));

  // 3. SECTION COMPLETENESS (15%)
  const sectionFeedback: Record<string, { status: 'COMPLETE' | 'NEEDS_WORK' | 'MISSING'; feedback: string }> = {};
  let completenessSum = 0;

  if (isStringInput) {
    const hasContact = textLower.includes('@') || /\d{10}/.test(textLower);
    const hasExp = textLower.includes('experience') || textLower.includes('internship') || textLower.includes('work');
    const hasEd = textLower.includes('education') || textLower.includes('degree') || textLower.includes('university') || textLower.includes('college');
    const hasSk = textLower.includes('skill');

    completenessSum = (hasContact ? 25 : 0) + (hasExp ? 25 : 0) + (hasEd ? 25 : 0) + (hasSk ? 25 : 0);
  } else {
    const resData = (resume || {}) as ResumeContentData;
    const personalInfo = resData.personalInfo || ({} as any);
    const education = resData.education || [];
    const skillsList = resData.skills || [];
    const experience = resData.experience || [];
    const projects = resData.projects || [];

    const hasName = Boolean(personalInfo.fullName && personalInfo.email);
    const hasSummary = Boolean(personalInfo.summary && personalInfo.summary.length > 20);
    const hasEd = education.length > 0;
    const hasSkills = skillsList.length >= 3;
    const hasExpOrProj = experience.length > 0 || projects.length > 0;

    sectionFeedback['Contact Information'] = hasName
      ? { status: 'COMPLETE', feedback: 'Full name and email present.' }
      : { status: 'MISSING', feedback: 'Please provide full name and contact email.' };

    sectionFeedback['Professional Summary'] = hasSummary
      ? { status: 'COMPLETE', feedback: 'Targeted summary included.' }
      : { status: 'NEEDS_WORK', feedback: 'Add a 2-3 sentence summary aligned with target role.' };

    sectionFeedback['Education'] = hasEd
      ? { status: 'COMPLETE', feedback: `${education.length} education entry listed.` }
      : { status: 'MISSING', feedback: 'Add degree, institution, and graduation year.' };

    sectionFeedback['Skills Section'] = hasSkills
      ? { status: 'COMPLETE', feedback: `${skillsList.length} skills listed.` }
      : { status: 'NEEDS_WORK', feedback: 'List at least 4-6 key technical & core domain skills.' };

    sectionFeedback['Experience / Projects'] = hasExpOrProj
      ? { status: 'COMPLETE', feedback: 'Projects/Experience section populated.' }
      : { status: 'MISSING', feedback: 'Include at least 1-2 practical projects or internships.' };

    completenessSum = (hasName ? 20 : 0) + (hasSummary ? 20 : 0) + (hasEd ? 20 : 0) + (hasSkills ? 20 : 0) + (hasExpOrProj ? 20 : 0);
  }

  const sectionCompleteness = completenessSum;

  // 4. ROLE ALIGNMENT (15%)
  const roleTokens = roleName.toLowerCase().split(' ');
  const titleMatches = roleTokens.filter((tok) => tok.length > 2 && textLower.includes(tok)).length;
  const roleAlignmentRatio = roleTokens.length > 0 ? titleMatches / roleTokens.length : 0.8;
  const roleAlignment = Math.min(100, Math.max(0, Math.round(roleAlignmentRatio * 100)));

  // 5. EXPERIENCE / PROJECT IMPACT (10%)
  let actionVerbCount = 0;
  ACTION_VERBS.forEach((verb) => {
    if (textLower.includes(verb)) actionVerbCount++;
  });

  let impactScore = 50;
  if (actionVerbCount >= 4) impactScore = 95;
  else if (actionVerbCount >= 2) impactScore = 75;
  else if (actionVerbCount >= 1) impactScore = 60;

  // 6. FORMATTING & ATS SAFETY (10%)
  let formatScore = 85;
  // Penalty if weird characters or missing key tags
  if (rawText.length < 200) formatScore -= 30;
  if (textLower.includes('table') || textLower.includes('image')) formatScore -= 10;
  formatScore = Math.max(40, formatScore);

  // 7. READABILITY & WORD COUNT (5%)
  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  let readabilityScore = 80;
  if (wordCount >= 250 && wordCount <= 800) readabilityScore = 95;
  else if (wordCount > 800) readabilityScore = 70;
  else if (wordCount < 150) readabilityScore = 50;

  // OVERALL WEIGHTED ATS SCORE
  const rawATSScore = Math.round(
    keywordScore * 0.25 +
    skillAlignment * 0.20 +
    sectionCompleteness * 0.15 +
    roleAlignment * 0.15 +
    impactScore * 0.10 +
    formatScore * 0.10 +
    readabilityScore * 0.05
  );

  const atsScore = Math.min(100, Math.max(0, rawATSScore));

  let scoreTier: ATSScoreBreakdown['scoreTier'] = 'Fair';
  if (atsScore >= 95) scoreTier = 'Excellent';
  else if (atsScore >= 85) scoreTier = 'Strong';
  else if (atsScore >= 75) scoreTier = 'Good';
  else if (atsScore >= 65) scoreTier = 'Fair';
  else if (atsScore >= 50) scoreTier = 'Needs Improvement';
  else scoreTier = 'Poor';

  // GENERATE ACTIONABLE RECOMMENDATIONS & COACHING
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: ATSScoreBreakdown['recommendations'] = [];

  if (keywordScore >= 75) {
    strengths.push(`Strong keyword coverage matching ${roleName} requirements.`);
  } else {
    weaknesses.push(`Missing key role keywords like: ${missingKeywords.slice(0, 3).join(', ')}.`);
    recommendations.push({
      id: 'rec-kw-1',
      type: 'WARNING',
      title: 'Include Target Role Keywords',
      description: `Your resume is missing key industry terms expected for ${roleName}.`,
      why: 'ATS scanners rank candidates higher when exact skill and domain terms are present.',
      howToImprove: `Naturally integrate missing keywords like ${missingKeywords.slice(0, 3).join(', ')} into your project descriptions.`,
      suggestedWording: `Utilized ${missingKeywords[0] || 'domain tools'} to analyze and implement project requirements.`,
    });
  }

  if (verifiedSkillsMissingFromResume.length > 0) {
    weaknesses.push(`${verifiedSkillsMissingFromResume.length} verified skill(s) present in profile but omitted from resume.`);
    recommendations.push({
      id: 'rec-ver-sk',
      type: 'CRITICAL',
      title: 'Sync Verified Skills to Resume',
      description: `Skills like ${verifiedSkillsMissingFromResume.slice(0, 2).join(', ')} are verified on Cyclops but missing from your resume.`,
      why: 'Recruiters check for alignment between verified platform badges and submitted resumes.',
      howToImprove: 'Click [Add to Resume] in the Skills Connection panel to instantly include your verified skills.',
    });
  } else {
    strengths.push('All verified platform skills are listed on your resume.');
  }

  if (impactScore < 70) {
    weaknesses.push('Project bullet points lack strong action verbs.');
    recommendations.push({
      id: 'rec-impact',
      type: 'WARNING',
      title: 'Strengthen Bullet Action Verbs',
      description: 'Start project and experience bullet points with strong action verbs.',
      why: 'Action verbs demonstrate proactive ownership and measurable technical contribution.',
      howToImprove: 'Use verbs like "Developed", "Engineered", "Formulated", "Standardized", or "Analyzed".',
    });
  } else {
    strengths.push('Effective use of proactive action verbs across bullet points.');
  }

  return {
    atsScore,
    keywordScore,
    skillAlignment,
    formatScore,
    sectionCompleteness,
    impactScore,
    readabilityScore,
    scoreTier,
    matchedKeywords,
    missingKeywords,
    missingSkills: missingKeywords.slice(0, 5),
    unverifiedSkillsOnResume,
    verifiedSkillsMissingFromResume,
    strengths,
    weaknesses,
    recommendations,
    sectionFeedback,
    disclaimer: 'ATS compatibility estimate — actual ATS results may vary by employer and system.',
  };
}

function flattenResumeToText(resume: ResumeContentData): string {
  if (!resume) return '';
  const parts: string[] = [];
  const p = resume.personalInfo || ({} as any);
  parts.push(p.fullName || '', p.headline || '', p.summary || '', p.location || '');

  (resume.education || []).forEach((e) => parts.push(e.degree || '', e.fieldOfStudy || '', e.institution || ''));
  (resume.experience || []).forEach((e) => {
    parts.push(e.title || '', e.company || '', e.location || '');
    parts.push(...(e.bullets || []));
  });
  (resume.projects || []).forEach((pr) => {
    parts.push(pr.title || '', pr.description || '', ...(pr.technologies || []), ...(pr.bullets || []));
  });
  (resume.skills || []).forEach((s) => parts.push(s.name || '', s.category || ''));
  (resume.certifications || []).forEach((c) => parts.push(c.name || '', c.issuer || ''));
  parts.push(...(resume.achievements || []));

  return parts.join(' ');
}

function extractSkillsFromText(text: string): string[] {
  const common = ['python', 'react', 'sql', 'javascript', 'java', 'c++', 'html', 'css', 'biostatistics', 'clinical research', 'pharmacology', 'dravyaguna', 'autocad', 'solidworks', 'figma', 'excel', 'machine learning', 'data analysis'];
  const textLower = text.toLowerCase();
  return common.filter((c) => textLower.includes(c));
}
