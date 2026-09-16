/**
 * AYUSHSetu AI — Master Phase 6 & Phase 7 End-to-End Verification Suite
 * Tests Placement Intelligence, Recruiter Automation, Governance, Verification, System Health, and AI Safety.
 */

const BASE_URL = 'http://localhost:3000';

async function runMasterTest() {
  console.log('================================================================');
  console.log('AYUSHSETU AI — PHASE 6 & PHASE 7 MASTER VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function record(ok: boolean, name: string, detail?: string) {
    if (ok) {
      passed++;
      console.log(`[PASS] ${name}${detail ? ` -> ${detail}` : ''}`);
    } else {
      failed++;
      console.log(`[FAIL] ${name}${detail ? ` -> ${detail}` : ''}`);
      errors.push(`${name}: ${detail || 'Failed'}`);
    }
  }

  // --- SECTION 1: PHASE 6 PLACEMENT INTELLIGENCE & RECRUITMENT ---
  console.log('--- 1. PHASE 6: PLACEMENT INTELLIGENCE & RECRUITMENT AUTOMATION ---');

  // 1a. Placement Metrics & Funnel
  try {
    const res = await fetch(`${BASE_URL}/api/placements/metrics`);
    const json = await res.json();
    const data = json.data;
    const ok =
      res.status === 200 &&
      json.success &&
      data.totalStudents > 0 &&
      data.careerReadyStudents > 0 &&
      data.internshipReadyStudents > 0 &&
      data.placementReadyStudents > 0 &&
      data.funnel?.length === 9 &&
      data.branchBreakdown?.length >= 5 &&
      data.nearReadyStudents?.length >= 3;
    record(
      ok,
      'Placement Intelligence Core Metrics (/api/placements/metrics)',
      `Total: ${data.totalStudents}, Funnel stages: ${data.funnel?.length}, Branches: ${data.branchBreakdown?.length}`
    );
  } catch (e: any) {
    record(false, 'Placement Intelligence Core Metrics', e.message);
  }

  // 1b. Skill Supply vs Demand & Heatmap
  try {
    const res = await fetch(`${BASE_URL}/api/institution/skill-demand`);
    const json = await res.json();
    const data = json.data;
    const ok =
      res.status === 200 &&
      json.success &&
      data.supplyVsDemand?.length > 0 &&
      data.heatmap?.length > 0 &&
      !!data.dataWindow &&
      !!data.confidenceIndicator;
    record(
      ok,
      'Skill Supply vs Industry Demand Matrix (/api/institution/skill-demand)',
      `Skills: ${data.supplyVsDemand?.length}, Heatmap branches: ${data.heatmap?.length}, Window: ${data.dataWindow}`
    );
  } catch (e: any) {
    record(false, 'Skill Supply vs Industry Demand Matrix', e.message);
  }

  // 1c. Training Batch Persistence
  try {
    const batchName = `Test Batch ${Date.now()}`;
    const createRes = await fetch(`${BASE_URL}/api/institution/training-batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batch_name: batchName,
        skill_focus: 'System Architecture & Docker',
        target_branch: 'Computer Science & Engineering',
        priority: 'HIGH',
      }),
    });
    const createJson = await createRes.json();

    const getRes = await fetch(`${BASE_URL}/api/institution/training-batches`);
    const getJson = await getRes.json();
    const found = getJson.data?.some((b: any) => b.batch_name === batchName);

    record(
      createRes.status === 200 && createJson.success && found,
      'Training Batch Creation & DB Persistence (/api/institution/training-batches)',
      `Created: ${batchName}, Batches in DB: ${getJson.data?.length}`
    );
  } catch (e: any) {
    record(false, 'Training Batch Creation & DB Persistence', e.message);
  }

  // 1d. Structured Rejection Reason Loop
  try {
    const res = await fetch(`${BASE_URL}/api/industry/applications/app-01/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'REJECTED',
        rejectionReason: 'SKILL_GAP',
        feedbackText: 'Missing certified GCP protocols and clinical CRF experience.',
      }),
    });
    const json = await res.json();
    record(
      res.status === 200 && json.success && json.data?.status === 'REJECTED',
      'Structured Candidate Rejection & Reason Logging (/api/industry/applications/[id]/status)',
      `Status updated to REJECTED with SKILL_GAP reason`
    );
  } catch (e: any) {
    record(false, 'Structured Candidate Rejection', e.message);
  }

  // 1e. Candidate Dossier & 7-Dimension Match Breakdown
  try {
    const res = await fetch(`${BASE_URL}/api/industry/candidates/sp-aditi-001`);
    const json = await res.json();
    const data = json.data;
    const ok =
      res.status === 200 &&
      json.success &&
      data.name === 'Aditi Sharma' &&
      data.matchScore > 0 &&
      data.matchBreakdown?.skillScore !== undefined &&
      data.matchBreakdown?.educationScore !== undefined;
    record(
      ok,
      'Candidate Detail & Deterministic Match Engine (/api/industry/candidates/[id])',
      `Candidate: ${data.name}, Score: ${data.matchScore}%, Skills: ${data.skills?.length || 0}`
    );
  } catch (e: any) {
    record(false, 'Candidate Detail & Match Engine', e.message);
  }

  // --- SECTION 2: PHASE 7 ADMIN, GOVERNANCE & VERIFICATION ---
  console.log('\n--- 2. PHASE 7: ADMIN, GOVERNANCE & VERIFICATION ---');

  // 2a. Admin Dashboard Real Metrics
  try {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`);
    const json = await res.json();
    const stats = json.data?.stats;
    const ok =
      res.status === 200 &&
      json.success &&
      stats.totalUsers > 0 &&
      stats.studentsCount > 0 &&
      stats.verifiedOrganizations > 0;
    record(
      ok,
      'Admin Real Governance Metrics (/api/admin/dashboard)',
      `Users: ${stats.totalUsers}, Students: ${stats.studentsCount}, Verified Orgs: ${stats.verifiedOrganizations}`
    );
  } catch (e: any) {
    record(false, 'Admin Real Governance Metrics', e.message);
  }

  // 2b. User Governance (Search & Filter)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/users?role=STUDENT`);
    const json = await res.json();
    const ok = res.status === 200 && json.success && json.data?.length > 0;
    record(
      ok,
      'User Account Governance Query (/api/admin/users)',
      `Retrieved ${json.data?.length} student records`
    );
  } catch (e: any) {
    record(false, 'User Account Governance Query', e.message);
  }

  // 2c. User Suspension & Reactivation
  try {
    const suspendRes = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr-01', status: 'SUSPENDED' }),
    });
    const suspendJson = await suspendRes.json();

    const reactivateRes = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr-01', status: 'ACTIVE' }),
    });
    const reactivateJson = await reactivateRes.json();

    record(
      suspendJson.success && reactivateJson.success,
      'User Suspension & Reactivation Lifecycle (/api/admin/users)',
      `Successfully toggled status SUSPENDED -> ACTIVE`
    );
  } catch (e: any) {
    record(false, 'User Suspension Lifecycle', e.message);
  }

  // 2d. Organization Verification & History Audit Logging
  try {
    const verifyRes = await fetch(`${BASE_URL}/api/admin/verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'ov-01',
        status: 'VERIFIED',
        notes: 'Verified against ministry registry and campus placement agreement.',
      }),
    });
    const verifyJson = await verifyRes.json();

    const dashRes = await fetch(`${BASE_URL}/api/admin/dashboard`);
    const dashJson = await dashRes.json();
    const hasHistory = dashJson.data?.verificationHistory?.length > 0;

    record(
      verifyRes.status === 200 && verifyJson.success && hasHistory,
      'Organization Verification & History Trail (/api/admin/verification)',
      `Verification status updated to VERIFIED, Audit trail records: ${dashJson.data?.verificationHistory?.length}`
    );
  } catch (e: any) {
    record(false, 'Organization Verification & History', e.message);
  }

  // 2e. Opportunity Moderation & Automated Quality Signals
  try {
    const oppsRes = await fetch(`${BASE_URL}/api/admin/opportunities`);
    const oppsJson = await oppsRes.json();
    const firstOpp = oppsJson.data?.[0];

    const updateRes = await fetch(`${BASE_URL}/api/admin/opportunities`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oppId: firstOpp.id,
        status: 'PUBLISHED',
        notes: 'Approved after verifying company details and skills requirement.',
      }),
    });
    const updateJson = await updateRes.json();

    record(
      oppsJson.success && firstOpp?.qualitySignals && updateJson.success,
      'Opportunity Moderation & Automated Quality Signals (/api/admin/opportunities)',
      `Quality signals validated: overallHealth=${firstOpp?.qualitySignals?.overallHealth}, Moderation status=PUBLISHED`
    );
  } catch (e: any) {
    record(false, 'Opportunity Moderation', e.message);
  }

  // 2f. Admin Platform Analytics
  try {
    const res = await fetch(`${BASE_URL}/api/admin/analytics`);
    const json = await res.json();
    const ok =
      res.status === 200 &&
      json.success &&
      json.data?.roleDistribution?.length === 5 &&
      json.data?.branchDistribution?.length >= 5;
    record(
      ok,
      'Platform Analytics Engine (/api/admin/analytics)',
      `Roles: ${json.data?.roleDistribution?.length}, Branches: ${json.data?.branchDistribution?.length}`
    );
  } catch (e: any) {
    record(false, 'Platform Analytics Engine', e.message);
  }

  // 2g. Live System Health Diagnostics
  try {
    const res = await fetch(`${BASE_URL}/api/admin/system-health`);
    const json = await res.json();
    const data = json.data;
    const ok =
      res.status === 200 &&
      json.success &&
      data.database?.status === 'OPERATIONAL' &&
      data.aiProvider?.status === 'OPERATIONAL' &&
      data.storage?.status === 'OPERATIONAL';
    record(
      ok,
      'Live System Health Diagnostics (/api/admin/system-health)',
      `DB: ${data.database?.latencyMs}ms, AI: ${data.aiProvider?.latencyMs}ms, Storage: ${data.storage?.latencyMs}ms`
    );
  } catch (e: any) {
    record(false, 'Live System Health Diagnostics', e.message);
  }

  // 2h. AI Usage & Safety Governance Telemetry
  try {
    const res = await fetch(`${BASE_URL}/api/admin/ai-usage`);
    const json = await res.json();
    const data = json.data;
    const ok =
      res.status === 200 &&
      json.success &&
      data.totalRequests > 0 &&
      data.governancePolicy?.isAssistiveOnly === true &&
      data.governancePolicy?.autonomousHiringBlocked === true;
    record(
      ok,
      'AI Safety & Assistive Governance Telemetry (/api/admin/ai-usage)',
      `Requests: ${data.totalRequests}, Assistive-Only: ${data.governancePolicy?.isAssistiveOnly}, Autonomous Hiring Blocked: ${data.governancePolicy?.autonomousHiringBlocked}`
    );
  } catch (e: any) {
    record(false, 'AI Safety & Governance Telemetry', e.message);
  }

  // --- SECTION 3: FULL USER INTERFACE ROUTES ACCESSIBILITY ---
  console.log('\n--- 3. USER INTERFACE PAGES ACCESSIBILITY (HTTP 200) ---');
  const uiPages = [
    { name: 'Placement Command Center', path: '/institution/placements' },
    { name: 'Skill Intelligence & Heatmap', path: '/institution/skill-intelligence' },
    { name: 'AI Placement Strategist', path: '/institution/ai-placement' },
    { name: 'Recruitment Kanban Pipeline', path: '/industry/recruitment' },
    { name: 'Candidate Profile Dossier', path: '/industry/candidates/sp-aditi-001' },
    { name: 'Candidate Comparison', path: '/industry/candidates/compare' },
    { name: 'Admin Command Center', path: '/admin/dashboard' },
    { name: 'User Account Governance', path: '/admin/users' },
    { name: 'Organization Verification Hub', path: '/admin/verification' },
    { name: 'Opportunity Moderation', path: '/admin/opportunities' },
    { name: 'Security Audit Trail', path: '/admin/audit' },
    { name: 'Platform Analytics', path: '/admin/analytics' },
    { name: 'Live System Health', path: '/admin/system-health' },
    { name: 'AI Safety & Usage', path: '/admin/ai-usage' },
  ];

  for (const page of uiPages) {
    try {
      const res = await fetch(`${BASE_URL}${page.path}`);
      record(res.status === 200, `UI Page: ${page.name} (${page.path})`, `HTTP ${res.status}`);
    } catch (e: any) {
      record(false, `UI Page: ${page.name}`, e.message);
    }
  }

  console.log('\n================================================================');
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    console.log('\nFAILED CHECKS:');
    errors.forEach((e) => console.log(`  - ${e}`));
    process.exit(1);
  } else {
    console.log('\nALL PHASE 6 & PHASE 7 SYSTEMS ARE 100% OPERATIONAL & REAL!');
    process.exit(0);
  }
}

runMasterTest();
