import { StudentProfile, UserSkill, Opportunity, MatchBreakdown } from '@/lib/types';
import { CENTRALIZED_CAREER_ROLES } from '@/lib/data/career-roles';

/**
 * Universal Domain-Agnostic Matching Engine & Transferable Skills Detector
 * Evaluates match compatibility across 7 weighted dimensions and identifies cross-domain pathways.
 */
export function matchStudentToOpportunity(
  student: StudentProfile,
  skills: UserSkill[],
  opportunity: Opportunity
): MatchBreakdown {
  const matchedSkills: Array<{ skillName: string; studentScore: number; requiredScore: number }> = [];
  const missingSkills: Array<{ skillName: string; studentScore: number; requiredScore: number; gap: number }> = [];
  const partialSkills: Array<{ skillName: string; studentScore: number; requiredScore: number }> = [];
  const transferableSkills: string[] = [];
  const reasons: string[] = [];

  const reqSkills = opportunity.required_skills || [];

  // 1. Skill Compatibility (45%)
  let totalSkillScore = 0;
  if (reqSkills.length > 0) {
    let skillSum = 0;
    reqSkills.forEach((req) => {
      const userSkill = skills.find(
        (s) =>
          s.skill_id === req.skill_id ||
          s.skill_name.toLowerCase() === req.skill_name.toLowerCase() ||
          s.skill_name.toLowerCase().includes(req.skill_name.toLowerCase()) ||
          req.skill_name.toLowerCase().includes(s.skill_name.toLowerCase())
      );

      const studentScore = userSkill ? userSkill.proficiency_score : 0;

      if (studentScore >= req.min_proficiency) {
        matchedSkills.push({
          skillName: req.skill_name,
          studentScore,
          requiredScore: req.min_proficiency,
        });
        skillSum += 100;
        if (userSkill) {
          transferableSkills.push(userSkill.skill_name);
        }
      } else if (studentScore > 0 && studentScore >= req.min_proficiency * 0.5) {
        partialSkills.push({
          skillName: req.skill_name,
          studentScore,
          requiredScore: req.min_proficiency,
        });
        const gap = req.min_proficiency - studentScore;
        missingSkills.push({
          skillName: req.skill_name,
          studentScore,
          requiredScore: req.min_proficiency,
          gap,
        });
        skillSum += Math.round((studentScore / req.min_proficiency) * 100);
      } else {
        const gap = req.min_proficiency - studentScore;
        missingSkills.push({
          skillName: req.skill_name,
          studentScore,
          requiredScore: req.min_proficiency,
          gap,
        });
        skillSum += studentScore > 0 ? Math.round((studentScore / req.min_proficiency) * 100) : 0;
      }
    });
    totalSkillScore = Math.round(skillSum / reqSkills.length);
  } else {
    totalSkillScore = 80;
  }

  // 2. Career Interest Alignment (15%)
  const goalLower = (student.career_goal || '').toLowerCase();
  const targetRoleLower = (student.target_role || '').toLowerCase();
  const titleLower = opportunity.title.toLowerCase();
  const prefRoles = (student.preferred_roles || []).map((r) => r.toLowerCase());

  const isExactInterestMatch =
    (goalLower && titleLower.includes(goalLower)) ||
    (targetRoleLower && titleLower.includes(targetRoleLower)) ||
    prefRoles.some((r) => titleLower.includes(r) || r.includes(titleLower));

  const isCategoryInterestMatch =
    (student.preferred_industry && opportunity.company_name.toLowerCase().includes(student.preferred_industry.toLowerCase())) ||
    (student.academic_stream && titleLower.includes(student.academic_stream.toLowerCase()));

  let interestScore = 65;
  if (isExactInterestMatch) {
    interestScore = 100;
    reasons.push(`Direct alignment with your career goal (${student.career_goal || student.target_role || 'Target Role'}).`);
  } else if (isCategoryInterestMatch) {
    interestScore = 85;
    reasons.push(`Aligns with your industry interest in ${student.preferred_industry || 'your target field'}.`);
  } else {
    interestScore = 70;
  }

  // 3. Education Eligibility (10%)
  const allowedStreams = opportunity.eligibility_criteria?.allowed_streams || [];
  const allowedCourse = opportunity.eligibility_criteria?.course || '';
  const studentStream = student.academic_stream || '';
  const studentDept = student.department || student.course || '';

  let isStreamEligible = true;
  if (allowedStreams.length > 0) {
    isStreamEligible = allowedStreams.some(
      (st) =>
        st.toLowerCase() === studentStream.toLowerCase() ||
        studentStream.toLowerCase().includes(st.toLowerCase()) ||
        st.toLowerCase().includes(studentStream.toLowerCase())
    );
  }

  if (allowedCourse && !isStreamEligible) {
    isStreamEligible =
      studentDept.toLowerCase().includes(allowedCourse.toLowerCase()) ||
      allowedCourse.toLowerCase().includes(studentDept.toLowerCase());
  }

  let educationScore = 70;
  if (isStreamEligible) {
    educationScore = 100;
    reasons.push(`Fully eligible under ${student.academic_stream || student.course} degree requirements.`);
  } else if (totalSkillScore >= 65) {
    // Cross-domain eligibility credit!
    educationScore = 85;
    reasons.push(`Cross-domain match: Your demonstrated skills override strict degree stream constraints.`);
  } else {
    educationScore = 50;
    reasons.push(`Primary branch mismatch, but cross-domain application remains possible by developing key required skills.`);
  }

  // 4. Project Relevance (10%)
  const studentProjects = student.projects || [];
  let projectScore = 60;
  if (studentProjects.length > 0) {
    const projectSkillsUsed = studentProjects.flatMap((p) => p.skills_used || []);
    const reqNames = reqSkills.map((r) => r.skill_name.toLowerCase());

    const hasMatchingProjectSkill = projectSkillsUsed.some((ps) =>
      reqNames.some((rn) => rn.includes(ps.toLowerCase()) || ps.toLowerCase().includes(rn))
    );

    if (hasMatchingProjectSkill) {
      projectScore = 95;
      reasons.push(`Your project portfolio demonstrates practical application of required opportunity skills.`);
    } else {
      projectScore = 75;
    }
  } else if (matchedSkills.length >= 2) {
    projectScore = 80;
  }

  // 5. Certification Relevance (10%)
  const studentCerts = student.certifications || [];
  let certificationScore = 60;
  if (studentCerts.length > 0) {
    certificationScore = 90;
    reasons.push(`Verified certifications validate core competency requirements.`);
  } else if (matchedSkills.some((s) => s.studentScore >= 80)) {
    certificationScore = 80;
  }

  // 6. Practical Experience (10%)
  const studentExp = student.experience || [];
  let experienceScore = 60;
  if (studentExp.length > 0) {
    experienceScore = 95;
    reasons.push(`Prior practical/internship experience enhances readiness for this position.`);
  } else if (student.year >= 3) {
    experienceScore = 75;
  }

  // 7. Location & Availability (5%)
  const isRemote = opportunity.is_remote;
  const prefLocs = (student.preferred_locations || []).map((l) => l.toLowerCase());
  const oppLoc = opportunity.location.toLowerCase();

  const isLocMatched = isRemote || prefLocs.some((loc) => oppLoc.includes(loc) || loc.includes(oppLoc));
  const locationScore = isLocMatched ? 100 : 70;

  // Cross-Domain Pathway Analysis
  let crossDomainPathway: string | undefined = undefined;
  if (!isStreamEligible && totalSkillScore >= 65) {
    crossDomainPathway = `Cross-Domain Transfer Pathway: Your ${student.department || student.academic_stream || 'academic'} background combined with demonstrated ${transferableSkills.join(', ')} skills creates a strong cross-domain opportunity fit.`;
  }

  // Calculate Overall Weighted Score
  const overallScore = Math.round(
    totalSkillScore * 0.45 +
    interestScore * 0.15 +
    educationScore * 0.15 +
    projectScore * 0.10 +
    certificationScore * 0.05 +
    experienceScore * 0.05 +
    locationScore * 0.05
  );

  if (matchedSkills.length > 0) {
    reasons.unshift(`Strong proficiency demonstrated in ${matchedSkills.map((m) => m.skillName).join(', ')}.`);
  }
  if (missingSkills.length > 0) {
    reasons.push(`Development opportunity: Strengthening ${missingSkills.slice(0, 2).map((m) => m.skillName).join(' & ')} will increase your match score.`);
  }

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    skillScore: totalSkillScore,
    interestScore,
    educationScore,
    projectScore,
    certificationScore,
    experienceScore,
    locationScore,
    matchedSkills,
    missingSkills,
    partialSkills,
    transferableSkills,
    crossDomainPathway,
    reasons,
    eligibility: {
      isEligible: isStreamEligible || totalSkillScore >= 65,
      summary: isStreamEligible
        ? 'Fully eligible based on academic branch and skill requirements.'
        : totalSkillScore >= 65
        ? 'Cross-domain eligible based on strong demonstrated skill profile.'
        : 'Academic branch or skill proficiency criteria not fully met.',
    },
  };
}

export function evaluateCandidateOpportunities(
  student: StudentProfile,
  skills: UserSkill[],
  opportunities: Opportunity[]
) {
  return opportunities
    .map((opp) => {
      const breakdown = matchStudentToOpportunity(student, skills, opp);
      return {
        opp,
        matchScore: breakdown.overallScore,
        breakdown,
        matchedSkills: breakdown.matchedSkills.map((m) => m.skillName),
        missingSkills: breakdown.missingSkills.map((m) => m.skillName),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

