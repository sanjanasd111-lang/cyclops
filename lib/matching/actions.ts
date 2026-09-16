import { StudentProfile, UserSkill } from '@/lib/types';

export interface NextBestAction {
  id: string;
  title: string;
  description: string;
  actionUrl: string;
  ctaText: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'PROFILE' | 'ASSESSMENT' | 'SKILL' | 'RESUME' | 'APPLICATION' | 'INTERVIEW';
}

export interface OnboardingStep {
  id: string;
  label: string;
  isComplete: boolean;
  actionUrl: string;
}

export interface StudentOnboardingProgress {
  progressPercentage: number;
  isSetupComplete: boolean;
  steps: OnboardingStep[];
  nextStepTitle?: string;
  nextStepUrl?: string;
}

/**
 * Deterministic Next Best Action Engine (Section 8.6)
 * Evaluates student database records and determines the highest priority career action
 * without relying on external generative models.
 */
export function getNextBestAction(
  profile?: StudentProfile | null,
  skills?: UserSkill[],
  applications?: any[],
  interviewSessions?: any[],
  skillGaps?: Array<{ skill_name: string; gap: number }>
): NextBestAction {
  // 1. Incomplete Profile check
  if (!profile || !profile.full_name || !profile.academic_stream || !profile.department) {
    return {
      id: 'nba-profile',
      title: 'Complete Your Academic Profile',
      description: 'Fill in your academic stream, department, and contact details to unlock verified matching.',
      actionUrl: '/student/onboarding',
      ctaText: 'Complete Profile',
      priority: 'HIGH',
      category: 'PROFILE',
    };
  }

  // 2. Career Goal Missing
  if (!profile.career_goal && !profile.target_role) {
    return {
      id: 'nba-goal',
      title: 'Declare Your Target Career Goal',
      description: 'Define your desired industry role (e.g. Clinical Research Associate, Full Stack Developer) to calibrate your Skill Digital Twin.',
      actionUrl: '/student/onboarding',
      ctaText: 'Set Career Goal',
      priority: 'HIGH',
      category: 'PROFILE',
    };
  }

  // 3. No Skill Assessment Taken
  const verifiedSkills = (skills || []).filter(
    (s) => s.verification_status !== 'SELF_DECLARED'
  );
  if (!skills || skills.length === 0 || verifiedSkills.length === 0) {
    return {
      id: 'nba-assessment',
      title: 'Take Your Core Skill Assessment',
      description: 'Complete the adaptive 10-question evaluation to scientifically verify your competency levels.',
      actionUrl: '/student/assessment',
      ctaText: 'Start Assessment',
      priority: 'HIGH',
      category: 'ASSESSMENT',
    };
  }

  // 4. Critical Skill Gap Exists
  if (skillGaps && skillGaps.length > 0) {
    const topGap = skillGaps[0];
    return {
      id: 'nba-skill-gap',
      title: `Bridge Skill Gap: ${topGap.skill_name}`,
      description: `Your proficiency in ${topGap.skill_name} is ${topGap.gap} points below top employer thresholds for your target role.`,
      actionUrl: '/student/skill-gap',
      ctaText: 'View Remediation Plan',
      priority: 'HIGH',
      category: 'SKILL',
    };
  }

  // 5. Resume Missing / Incomplete
  const hasResume = Boolean(profile.resume_url || (profile.projects && profile.projects.length > 0));
  if (!hasResume) {
    return {
      id: 'nba-resume',
      title: 'Build Your Verified Resume',
      description: 'Generate an ATS-optimized academic resume with bullet suggestions and verified skill credentials.',
      actionUrl: '/student/resume',
      ctaText: 'Create Resume',
      priority: 'HIGH',
      category: 'RESUME',
    };
  }

  // 6. Strong Profile but Zero Applications Submitted
  const appCount = applications ? applications.length : 0;
  if (appCount === 0) {
    return {
      id: 'nba-apply',
      title: 'Explore Matching Opportunities',
      description: 'Your profile has verified skills and high readiness. Apply to opportunities matching your competencies.',
      actionUrl: '/student/opportunities',
      ctaText: 'Explore Opportunities',
      priority: 'MEDIUM',
      category: 'APPLICATION',
    };
  }

  // 7. Upcoming / Pending Interview Practice
  const completedInterviews = (interviewSessions || []).filter((s) => s.status === 'COMPLETED').length;
  if (completedInterviews === 0) {
    return {
      id: 'nba-interview',
      title: 'Practice with AI Mock Interview',
      description: 'Prepare for technical and behavioral questions tailored to your academic branch and target role.',
      actionUrl: '/student/interview',
      ctaText: 'Start Mock Interview',
      priority: 'MEDIUM',
      category: 'INTERVIEW',
    };
  }

  // Default: Keep exploring new verified credentials & roadmaps
  return {
    id: 'nba-roadmap',
    title: 'Review 30-60-90 Career Roadmap',
    description: 'Track your ongoing career milestones, active applications, and industry skill readiness.',
    actionUrl: '/student/roadmap',
    ctaText: 'View Roadmap',
    priority: 'LOW',
    category: 'SKILL',
  };
}

/**
 * Computes deterministic onboarding progress (Section 8.4)
 */
export function calculateOnboardingProgress(
  profile?: StudentProfile | null,
  skills?: UserSkill[],
  hasResume?: boolean
): StudentOnboardingProgress {
  const isProfileDone = Boolean(profile?.full_name && profile?.academic_stream && profile?.department);
  const isGoalDone = Boolean(profile?.career_goal || profile?.target_role);
  const isAssessmentDone = Boolean(
    skills && skills.some((s) => s.verification_status !== 'SELF_DECLARED')
  );
  const isResumeDone = Boolean(hasResume || (profile?.projects && profile.projects.length > 0));

  const steps: OnboardingStep[] = [
    {
      id: 'step-profile',
      label: 'Academic Profile',
      isComplete: isProfileDone,
      actionUrl: '/student/onboarding',
    },
    {
      id: 'step-goal',
      label: 'Career Goal',
      isComplete: isGoalDone,
      actionUrl: '/student/onboarding',
    },
    {
      id: 'step-assessment',
      label: 'Skill Assessment',
      isComplete: isAssessmentDone,
      actionUrl: '/student/assessment',
    },
    {
      id: 'step-resume',
      label: 'Resume & Projects',
      isComplete: isResumeDone,
      actionUrl: '/student/resume',
    },
  ];

  const completedCount = steps.filter((s) => s.isComplete).length;
  const progressPercentage = Math.round((completedCount / steps.length) * 100);
  const isSetupComplete = progressPercentage === 100;

  const nextStep = steps.find((s) => !s.isComplete);

  return {
    progressPercentage,
    isSetupComplete,
    steps,
    nextStepTitle: nextStep ? nextStep.label : undefined,
    nextStepUrl: nextStep ? nextStep.actionUrl : undefined,
  };
}
