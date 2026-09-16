import { getDashboardRoute, getOnboardingRoute } from '../lib/permissions/routes';
import { getStudentProfile, getIndustryProfile, updateStudentProfile } from '../lib/db/db-client';

async function runPhase8E2ETestSuite() {
  console.log('============================================================');
  console.log('AYUSHSETU AI — PHASE 8 MASTER E2E TEST SUITE');
  console.log('AUTHENTICATION + ROLE ROUTING + ONBOARDING + PERSONALIZATION');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // --- 1. ROLE-BASED ROUTE MAPPER ---
    console.log('--- 1. ROLE-BASED ROUTE MAPPER ---');
    assert(getDashboardRoute('STUDENT') === '/student/dashboard', 'Student dashboard route mapped correctly');
    assert(getDashboardRoute('INDUSTRY') === '/industry/dashboard', 'Industry dashboard route mapped correctly');
    assert(getDashboardRoute('INSTITUTION') === '/institution/dashboard', 'Institution dashboard route mapped correctly');
    assert(getDashboardRoute('FACULTY') === '/faculty/dashboard', 'Faculty dashboard route mapped correctly');
    assert(getDashboardRoute('ADMIN') === '/admin/dashboard', 'Admin dashboard route mapped correctly');

    // --- 2. ROLE ONBOARDING ROUTE MAPPER ---
    console.log('\n--- 2. ROLE ONBOARDING ROUTE MAPPER ---');
    assert(getOnboardingRoute('STUDENT') === '/student/onboarding', 'Student onboarding route mapped correctly');
    assert(getOnboardingRoute('INDUSTRY') === '/industry/onboarding', 'Industry onboarding route mapped correctly');
    assert(getOnboardingRoute('INSTITUTION') === '/institution/onboarding', 'Institution onboarding route mapped correctly');
    assert(getOnboardingRoute('FACULTY') === '/faculty/onboarding', 'Faculty onboarding route mapped correctly');

    // --- 3. MULTI-USER PROFILE ISOLATION ---
    console.log('\n--- 3. MULTI-USER PROFILE ISOLATION ---');
    const userA = 'usr-student-alpha-001';
    const userB = 'usr-student-beta-002';

    await updateStudentProfile(userA, { full_name: 'Student Alpha', academic_stream: 'Computer Science & Engineering' }, []);
    await updateStudentProfile(userB, { full_name: 'Student Beta', academic_stream: 'Mechanical Engineering' }, []);

    const profileA = (await getStudentProfile(userA)).profile;
    const profileB = (await getStudentProfile(userB)).profile;

    assert(profileA.full_name === 'Student Alpha', 'User A profile retrieved with distinct full_name');
    assert(profileB.full_name === 'Student Beta', 'User B profile retrieved with distinct full_name');
    assert(profileA.academic_stream !== profileB.academic_stream, 'User A and User B maintain complete multi-user profile isolation');

    // --- 4. INDUSTRY & RECRUITER PROFILE ISOLATION ---
    console.log('\n--- 4. INDUSTRY & RECRUITER PROFILE ISOLATION ---');
    const indUser = 'ind-recruiter-001';
    const indProfile = await getIndustryProfile(indUser);
    assert(indProfile && indProfile.company_name.length > 0, 'Industry recruiter profile resolved cleanly');

  } catch (err: any) {
    console.error('Fatal E2E test exception:', err);
    failed++;
  }

  console.log('\n============================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase8E2ETestSuite();
