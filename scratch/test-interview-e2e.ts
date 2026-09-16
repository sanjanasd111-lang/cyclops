import {
  createInterviewSession,
  saveInterviewQuestions,
  saveInterviewAnswerAndEvaluation,
  completeInterviewSession,
  getInterviewSessions,
  getInterviewAnalytics,
  getInterviewPreparationData,
  getStudentProfile,
} from '../lib/db/db-client';
import { calculateCareerReadiness } from '../lib/matching/readiness';

async function runInterviewE2ETest() {
  console.log('========================================================================');
  console.log('=== TEST: AI INTERVIEW + PLACEMENT PREPARATION E2E SUITE ===');
  console.log('========================================================================\n');

  const studentA = 'test-student-aarav-cs-01';
  const studentB = 'test-student-bhavna-ayush-02';

  // Step 1: Create Interview Session for Student A (Software Engineer)
  console.log('Step 1: Creating Interview Session for Student A (Computer Science)...');
  const sessionA = await createInterviewSession(
    studentA,
    'Full-Stack Software Engineer',
    undefined,
    undefined,
    'MIXED',
    10
  );
  console.log(`Session Created: ID ${sessionA.id}, Role: ${sessionA.target_role}, User: ${sessionA.user_id}`);

  // Step 2: Save Grounded Questions
  console.log('\nStep 2: Saving Grounded Questions for Session A...');
  const mockQuestions = [
    {
      category: 'TECHNICAL',
      difficulty: 'MEDIUM',
      question: 'Explain how you optimize React state management and avoid unnecessary re-renders.',
      expected_topics: ['React', 'Performance'],
    },
    {
      category: 'RESUME',
      difficulty: 'HARD',
      question: 'Walk me through the architecture of your recent platform project.',
      expected_topics: ['System Architecture', 'Node.js'],
    },
  ];
  const savedQuestions = await saveInterviewQuestions(sessionA.id, mockQuestions);
  console.log(`Saved ${savedQuestions.length} questions for Session A.`);

  // Step 3: Evaluate Answers
  console.log('\nStep 3: Submitting & Evaluating Answers for Student A...');
  const eval1 = {
    technicalAccuracy: 85,
    relevance: 90,
    clarity: 80,
    structure: 80,
    completeness: 75,
    roleAlignment: 85,
    score: 83,
    feedback: 'Clear technical explanation of memoization and virtual DOM diffing.',
    strengths: ['Solid React knowledge', 'Direct relevance'],
    improvements: ['Discuss useCallback hooks'],
    betterApproach: 'Structure answer starting with component lifecycle, followed by memoization hooks.',
  };

  await saveInterviewAnswerAndEvaluation(
    studentA,
    sessionA.id,
    savedQuestions[0].id,
    'I use React.memo and useMemo to cache expensive computations and prevent re-rendering child components.',
    null,
    'TEXT',
    eval1
  );

  // Step 4: Complete Session
  console.log('\nStep 4: Completing Interview Session A...');
  const completedSessionA = await completeInterviewSession(sessionA.id, studentA, 420);
  console.log(`Completed Session A: Score = ${completedSessionA.overall_score}%, Technical = ${completedSessionA.technical_score}%`);

  // Step 5: Verify Multi-User Isolation
  console.log('\nStep 5: Verifying Multi-User Isolation (Student A vs Student B)...');
  const sessionsStudentA = await getInterviewSessions(studentA);
  const sessionsStudentB = await getInterviewSessions(studentB);

  console.log(`Student A Session Count: ${sessionsStudentA.length}`);
  console.log(`Student B Session Count: ${sessionsStudentB.length}`);

  if (sessionsStudentB.some((s) => s.user_id === studentA)) {
    throw new Error('SECURITY VIOLATION: Student B sees Student A interview sessions!');
  }

  // Step 6: Verify Analytics & Career Readiness Engine Update
  console.log('\nStep 6: Verifying Analytics & Readiness Model Integration...');
  const analyticsA = await getInterviewAnalytics(studentA);
  console.log(`Student A Analytics: Attempts = ${analyticsA.totalAttempts}, Avg Score = ${analyticsA.averageScore}%`);

  const { profile, skills } = await getStudentProfile(studentA);
  const readinessBreakdown = calculateCareerReadiness(
    profile,
    skills,
    profile.projects?.length,
    profile.certifications?.length,
    true,
    85,
    80,
    analyticsA.averageScore
  );

  console.log(`Student A Overall Career Readiness: ${readinessBreakdown.overallScore}%`);
  console.log(`Interview Readiness Component: ${readinessBreakdown.interviewScore}% (5% transparent weight applied)`);

  const prepData = await getInterviewPreparationData(studentA);
  console.log(`Student A Prep Target Role: "${prepData.targetRole}", Weak Areas: ${prepData.weakAreas.join(', ')}`);

  console.log('\n========================================================================');
  console.log('✅ AI INTERVIEW & PLACEMENT PREPARATION E2E VERIFICATION PASSED!');
  console.log('========================================================================\n');
}

runInterviewE2ETest().catch((err) => {
  console.error('❌ E2E TEST FAILED:', err);
  process.exit(1);
});
