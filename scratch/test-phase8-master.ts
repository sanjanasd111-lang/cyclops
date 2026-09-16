/**
 * AYUSHSetu AI — Phase 8 Master Verification Suite
 * Tests all 44 major routes, authentication redirects, Next Best Action engine,
 * notification APIs, and data isolation.
 */

import { getNextBestAction, calculateOnboardingProgress } from '../lib/matching/actions';

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function record(name: string, passed: boolean, details?: string) {
  results.push({ name, passed, details });
  const status = passed ? '[PASS]' : '[FAIL]';
  console.log(`${status} ${name}${details ? ` -> ${details}` : ''}`);
}

async function fetchRoute(path: string, options?: RequestInit): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    redirect: 'manual',
    ...options,
  });
}

async function runMasterSuite() {
  console.log('================================================================');
  console.log('AYUSHSETU AI — PHASE 8 MASTER VERIFICATION SUITE');
  console.log('================================================================\n');

  // --- SECTION 1: PUBLIC & AUTHENTICATION ROUTES ---
  console.log('--- 1. PUBLIC & AUTHENTICATION EXPERIENCES ---');
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
  for (const route of publicRoutes) {
    try {
      const res = await fetchRoute(route);
      const isOk = res.status === 200;
      record(`Public Route: ${route}`, isOk, `HTTP ${res.status}`);
    } catch (err: any) {
      record(`Public Route: ${route}`, false, err.message);
    }
  }

  // --- SECTION 2: AUTHENTICATED REDIRECTS & ACCESS CONTROL ---
  console.log('\n--- 2. AUTHENTICATION, RBAC & ROLE REDIRECTS ---');
  try {
    // 2.1 Authenticated user can view website (/) and visiting /login redirects to role dashboard
    const resAuthHome = await fetchRoute('/', {
      headers: { Cookie: 'ayush_demo_session=STUDENT' },
    });
    record(
      'Authenticated Student can view website (/)',
      resAuthHome.status === 200,
      `Status ${resAuthHome.status}`
    );

    const resAuthLogin = await fetchRoute('/login', {
      headers: { Cookie: 'ayush_demo_session=STUDENT' },
    });
    const isLoginRedirect = resAuthLogin.status === 307 || resAuthLogin.status === 308;
    const loginLocation = resAuthLogin.headers.get('location') || '';
    record(
      'Authenticated Student visiting "/login" redirects to Dashboard',
      isLoginRedirect && loginLocation.includes('/student/dashboard'),
      `Status ${resAuthLogin.status}, Location: ${loginLocation}`
    );

    // 2.2 Unauthenticated user visiting protected workspace is blocked with 307 to login
    const resUnauth = await fetchRoute('/student/dashboard');
    const isBlocked = resUnauth.status === 307 || resUnauth.status === 308;
    const unauthRedirectLocation = resUnauth.headers.get('location') || '';
    record(
      'Unauthenticated user visiting "/student/dashboard" is redirected to /login',
      isBlocked && unauthRedirectLocation.includes('/login'),
      `Status ${resUnauth.status}, Location: ${unauthRedirectLocation}`
    );
  } catch (err: any) {
    record('Authentication & RBAC', false, err.message);
  }

  // --- SECTION 3: STUDENT WORKSPACE ROUTES ---
  console.log('\n--- 3. STUDENT WORKSPACE ROUTES ---');
  const studentRoutes = [
    '/student/dashboard',
    '/student/onboarding',
    '/student/assessment',
    '/student/skills',
    '/student/skills/digital-twin',
    '/student/skill-gap',
    '/student/roadmap',
    '/student/jobs',
    '/student/internships',
    '/student/opportunities',
    '/student/applications',
    '/student/resume',
    '/student/interview',
    '/student/copilot',
    '/student/portfolio',
    '/student/notifications',
    '/student/readiness',
  ];

  for (const route of studentRoutes) {
    try {
      const res = await fetchRoute(route, {
        headers: { Cookie: 'ayush_demo_session=STUDENT' },
      });
      const isOk = res.status === 200;
      record(`Student Route: ${route}`, isOk, `HTTP ${res.status}`);
    } catch (err: any) {
      record(`Student Route: ${route}`, false, err.message);
    }
  }

  // --- SECTION 4: FACULTY WORKSPACE ROUTES ---
  console.log('\n--- 4. FACULTY WORKSPACE ROUTES ---');
  const facultyRoutes = [
    '/faculty/dashboard',
    '/faculty/profile',
    '/faculty/students',
    '/faculty/mentorship',
    '/faculty/research',
    '/faculty/industrial-training',
    '/faculty/collaborations',
    '/faculty/workshops',
    '/faculty/analytics',
    '/faculty/ai',
  ];

  for (const route of facultyRoutes) {
    try {
      const res = await fetchRoute(route, {
        headers: { Cookie: 'ayush_demo_session=FACULTY' },
      });
      const isOk = res.status === 200;
      record(`Faculty Route: ${route}`, isOk, `HTTP ${res.status}`);
    } catch (err: any) {
      record(`Faculty Route: ${route}`, false, err.message);
    }
  }

  // --- SECTION 5: INSTITUTION WORKSPACE ROUTES ---
  console.log('\n--- 5. INSTITUTION WORKSPACE ROUTES ---');
  const institutionRoutes = [
    '/institution/dashboard',
    '/institution/students',
    '/institution/placements',
    '/institution/skill-intelligence',
    '/institution/ai-placement',
    '/institution/curriculum',
    '/institution/reports',
    '/institution/industry',
    '/institution/collaborations',
  ];

  for (const route of institutionRoutes) {
    try {
      const res = await fetchRoute(route, {
        headers: { Cookie: 'ayush_demo_session=INSTITUTION' },
      });
      const isOk = res.status === 200;
      record(`Institution Route: ${route}`, isOk, `HTTP ${res.status}`);
    } catch (err: any) {
      record(`Institution Route: ${route}`, false, err.message);
    }
  }

  // --- SECTION 6: INDUSTRY WORKSPACE ROUTES ---
  console.log('\n--- 6. INDUSTRY WORKSPACE ROUTES ---');
  const industryRoutes = [
    '/industry/dashboard',
    '/industry/opportunities',
    '/industry/opportunities/create',
    '/industry/candidates',
    '/industry/recruitment',
    '/industry/interviews',
    '/industry/analytics',
    '/industry/collaborations',
    '/industry/ai',
  ];

  for (const route of industryRoutes) {
    try {
      const res = await fetchRoute(route, {
        headers: { Cookie: 'ayush_demo_session=INDUSTRY' },
      });
      const isOk = res.status === 200;
      record(`Industry Route: ${route}`, isOk, `HTTP ${res.status}`);
    } catch (err: any) {
      record(`Industry Route: ${route}`, false, err.message);
    }
  }

  // --- SECTION 7: ADMIN WORKSPACE ROUTES ---
  console.log('\n--- 7. ADMIN WORKSPACE ROUTES ---');
  const adminRoutes = [
    '/admin/dashboard',
    '/admin/users',
    '/admin/verification',
    '/admin/opportunities',
    '/admin/reports',
    '/admin/analytics',
    '/admin/audit',
    '/admin/system-health',
    '/admin/ai-usage',
  ];

  for (const route of adminRoutes) {
    try {
      const res = await fetchRoute(route, {
        headers: { Cookie: 'ayush_demo_session=ADMIN' },
      });
      const isOk = res.status === 200;
      record(`Admin Route: ${route}`, isOk, `HTTP ${res.status}`);
    } catch (err: any) {
      record(`Admin Route: ${route}`, false, err.message);
    }
  }

  // --- SECTION 8: ERROR & BOUNDARY PAGES ---
  console.log('\n--- 8. ERROR BOUNDARIES & NOT FOUND PAGES ---');
  try {
    const resForbidden = await fetchRoute('/forbidden');
    record('Custom 403 Forbidden Route', resForbidden.status === 200, `HTTP ${resForbidden.status}`);

    const res404 = await fetchRoute('/non-existent-page-404-check');
    record('Custom 404 Route Handling', res404.status === 404, `HTTP ${res404.status}`);
  } catch (err: any) {
    record('Error boundaries', false, err.message);
  }

  // --- SECTION 9: DETERMINISTIC ENGINES ---
  console.log('\n--- 9. DETERMINISTIC BUSINESS LOGIC ENGINES ---');
  const nbaIncomplete = getNextBestAction(null, []);
  record(
    'Next Best Action: Incomplete Profile evaluates correctly',
    nbaIncomplete.id === 'nba-profile' && nbaIncomplete.category === 'PROFILE',
    `Action: ${nbaIncomplete.title}`
  );

  const mockProfile: any = {
    full_name: 'Aditi Sharma',
    academic_stream: 'Ayurveda & AYUSH',
    department: 'Kayachikitsa',
    career_goal: 'Clinical Research Associate',
  };
  const nbaMissingAssessment = getNextBestAction(mockProfile, []);
  record(
    'Next Best Action: Missing Assessment evaluates correctly',
    nbaMissingAssessment.id === 'nba-assessment',
    `Action: ${nbaMissingAssessment.title}`
  );

  const mockVerifiedSkills: any[] = [
    { skill_name: 'Clinical Research', proficiency_score: 85, verification_status: 'INSTITUTION_VERIFIED' },
  ];
  const nbaSkillGap = getNextBestAction(mockProfile, mockVerifiedSkills, [], [], [{ skill_name: 'Biostatistics', gap: 20 }]);
  record(
    'Next Best Action: Priority Skill Gap evaluates correctly',
    nbaSkillGap.id === 'nba-skill-gap' && nbaSkillGap.title.includes('Biostatistics'),
    `Action: ${nbaSkillGap.title}`
  );

  const onboarding = calculateOnboardingProgress(mockProfile, mockVerifiedSkills, true);
  record(
    'Deterministic Onboarding Progress calculation',
    onboarding.progressPercentage === 100 && onboarding.isSetupComplete === true,
    `Progress: ${onboarding.progressPercentage}%, Complete: ${onboarding.isSetupComplete}`
  );

  // --- SECTION 10: NOTIFICATION LIFECYCLE ---
  console.log('\n--- 10. NOTIFICATION LIFECYCLE API ---');
  try {
    const notifsRes = await fetch(`${BASE_URL}/api/notifications`);
    const notifsData = await notifsRes.json();
    record(
      'GET /api/notifications returns user alerts',
      notifsData.success && Array.isArray(notifsData.data) && notifsData.data.length > 0,
      `Count: ${notifsData.data?.length}`
    );

    if (notifsData.data && notifsData.data.length > 0) {
      const targetId = notifsData.data[0].id;
      const putRes = await fetch(`${BASE_URL}/api/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: targetId }),
      });
      const putData = await putRes.json();
      record(
        'PUT /api/notifications marks alert as read',
        putData.success === true,
        `Marked ID: ${targetId}`
      );
    }
  } catch (err: any) {
    record('Notification API Lifecycle', false, err.message);
  }

  // --- SUMMARY ---
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  const passRate = Math.round((passedCount / results.length) * 100);

  console.log('\n================================================================');
  console.log(`VERIFICATION SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED (${passRate}% HEALTHY)`);
  console.log('================================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runMasterSuite().catch((err) => {
  console.error('Fatal suite error:', err);
  process.exit(1);
});
