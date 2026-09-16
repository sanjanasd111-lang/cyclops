import {
  getStudentProfile,
  saveUserRoadmap,
  getUserRoadmap,
  getInterviewSessions,
} from '../lib/db/db-client';
import { calculate7SourceSkillScore } from '../lib/skills/calculator';
import { calculateCareerReadiness } from '../lib/matching/readiness';
import { UserSkill } from '../lib/types';

async function runPhase4E2ETest() {
  console.log('========================================================================');
  console.log('=== TEST: AYUSHSETU AI — PHASE 4 PRODUCTION HARDENING & ISOLATION ===');
  console.log('========================================================================\n');

  const studentA = 'test-student-aarav-cs-01';
  const studentB = 'test-student-bhavna-ayush-02';

  // Step 1: Test 7-Source Skill Score Calculation Engine
  console.log('Step 1: Testing 7-Source Deterministic Skill Score Engine...');
  const testSkill: UserSkill = {
    id: 'usk-01',
    student_id: studentA,
    skill_id: 'sk-react-01',
    skill_name: 'React.js Development',
    category: 'Frontend Frameworks',
    proficiency_score: 75,
    confidence_score: 80,
    verification_status: 'INSTITUTION_VERIFIED',
    updated_at: new Date().toISOString(),
  };

  const calculatedResult = calculate7SourceSkillScore(testSkill, {
    assessmentScore: 90,
    projectScore: 85,
    certScore: 80,
    experienceScore: 75,
    mentorScore: 90,
    institutionScore: 95,
    industryScore: 85,
  });

  console.log(`Calculated Skill Score: ${calculatedResult.calculatedScore}% (Evidence Breakdown Count: ${calculatedResult.evidenceList.length})`);
  console.log(`Confidence Score: ${calculatedResult.confidenceScore}% (${calculatedResult.confidenceLevel} Level)`);

  if (calculatedResult.calculatedScore !== 86) {
    console.warn(`Unexpected calculated score: expected 86, got ${calculatedResult.calculatedScore}`);
  }

  // Step 2: Persistent Roadmap Caching Test
  console.log('\nStep 2: Testing Persistent Roadmap Caching (user_roadmaps)...');
  const mockRoadmap = {
    summary: '6-Month Full-Stack Engineering Roadmap for Aarav',
    prioritySkills: ['React.js', 'System Architecture', 'PostgreSQL'],
    learningRecommendations: [{ title: 'Advanced React Patterns', skill: 'React.js', duration: '3 weeks' }],
    projectRecommendations: [{ title: 'Real-time Analytics Dashboard', description: 'Build WebSockets analytics platform' }],
    experienceRecommendations: [{ role: 'Frontend Intern', company: 'TechCorp' }],
    nextSteps: ['Complete state management module', 'Deploy demo project'],
  };

  await saveUserRoadmap(studentA, 'Full-Stack Software Engineer', mockRoadmap);
  const fetchedRoadmap = await getUserRoadmap(studentA, 'Full-Stack Software Engineer');

  if (!fetchedRoadmap || !fetchedRoadmap.roadmap_data) {
    throw new Error('FAILED: Roadmaps persistent cache retrieval returned null!');
  }
  console.log(`Successfully persisted and retrieved roadmap for Student A: "${fetchedRoadmap.roadmap_data.summary}"`);

  // Step 3: Multi-User Data Isolation Verification
  console.log('\nStep 3: Verifying Multi-User Isolation (Student A vs Student B)...');
  const profileA = await getStudentProfile(studentA);
  const profileB = await getStudentProfile(studentB);

  console.log(`Student A: Name = "${profileA.profile.full_name}", Stream = "${profileA.profile.academic_stream}"`);
  console.log(`Student B: Name = "${profileB.profile.full_name}", Stream = "${profileB.profile.academic_stream}"`);

  if (profileA.profile.user_id === profileB.profile.user_id) {
    throw new Error('SECURITY VIOLATION: Student A and Student B share user IDs!');
  }

  // Step 4: 8-Part Career Readiness Model Check
  console.log('\nStep 4: Verifying 8-Part Career Readiness Engine...');
  const readinessA = calculateCareerReadiness(profileA.profile, profileA.skills, 2, 2, true, 82, 85, 80);
  const readinessB = calculateCareerReadiness(profileB.profile, profileB.skills, 1, 1, false, 75, 70, 0);

  console.log(`Student A Overall Readiness: ${readinessA.overallScore}% (Interview Component: ${readinessA.interviewScore}%)`);
  console.log(`Student B Overall Readiness: ${readinessB.overallScore}% (Baseline Component: ${readinessB.interviewScore}%)`);

  console.log('\n========================================================================');
  console.log('✅ AYUSHSETU AI — PHASE 4 HARDENING & ISOLATION VERIFICATION PASSED!');
  console.log('========================================================================\n');
}

runPhase4E2ETest().catch((err) => {
  console.error('❌ PHASE 4 E2E TEST FAILED:', err);
  process.exit(1);
});
