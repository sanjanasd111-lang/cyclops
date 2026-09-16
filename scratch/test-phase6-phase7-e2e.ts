import {
  getSavedOpportunities,
  saveOpportunity,
  unsaveOpportunity,
  isOpportunitySaved,
  getJobAlerts,
  createJobAlert,
  getPlacementMetrics,
  compareCandidates,
  getAuditLogs,
  createAuditLog,
  getOrganizationVerifications,
  verifyOrganization,
  getSystemHealthStatus,
  getProfileVisibility,
  updateProfileVisibility,
} from '../lib/db/db-client';

async function runMasterE2ETestSuite() {
  console.log('============================================================');
  console.log('AYUSHSETU AI — PHASE 6 + PHASE 7 MASTER E2E TEST SUITE');
  console.log('JOB PORTAL + PLACEMENT INTELLIGENCE + GOVERNANCE + ADMIN');
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
    // --- 1. SAVED JOBS & PERSISTENCE ---
    console.log('--- 1. SAVED JOBS & PERSISTENCE ---');
    const userId = 'usr-test-e2e-001';
    const oppId = 'opp-tech-01';

    await saveOpportunity(userId, oppId);
    let savedList = await getSavedOpportunities(userId);
    assert(savedList.some((o) => o.id === oppId), 'Opportunity saved successfully for Student A');

    let savedCheck = await isOpportunitySaved(userId, oppId);
    assert(savedCheck === true, 'isOpportunitySaved returns true for saved opportunity');

    await unsaveOpportunity(userId, oppId);
    savedList = await getSavedOpportunities(userId);
    assert(!savedList.some((o) => o.id === oppId), 'Opportunity unsaved successfully for Student A');

    // --- 2. JOB ALERTS & PREFERENCES ---
    console.log('\n--- 2. JOB ALERTS & PREFERENCES ---');
    const alert = await createJobAlert(userId, {
      title: 'Full Stack Engineer Alert',
      target_role: 'Full Stack Engineer',
      academic_branch: 'Computer Science',
      location: 'Bengaluru',
      work_type: 'Hybrid',
      skills: ['React', 'Node.js'],
    });
    assert(alert && alert.id.startsWith('ja-'), 'Job alert created cleanly with unique ID');

    const alertsList = await getJobAlerts(userId);
    assert(alertsList.length > 0 && alertsList[0].target_role === 'Full Stack Engineer', 'Job alert retrieved cleanly from persistence layer');

    // --- 3. PLACEMENT COMMAND CENTER & METRICS ---
    console.log('\n--- 3. PLACEMENT COMMAND CENTER & METRICS ---');
    const metrics = await getPlacementMetrics('inst-01');
    assert(metrics.totalStudents > 0, 'Placement metrics returned non-zero student population');
    assert(metrics.placementRate >= 70, `Placement rate calculated deterministically (${metrics.placementRate}%)`);
    assert(metrics.branchBreakdown.length >= 4, 'Branch breakdown contains multi-branch analytics (CS, Mechanical, Pharmacy, MBA)');

    // --- 4. RECRUITER CANDIDATE COMPARISON MATRIX ---
    console.log('\n--- 4. RECRUITER CANDIDATE COMPARISON MATRIX ---');
    const comparison = await compareCandidates(['usr-aditi-001', 'usr-authenticated-student-001'], 'opp-tech-01');
    assert(comparison.candidates.length === 2, 'Candidate comparison generated for 2 candidates');
    assert(comparison.candidates[0].matchScore > 0, `Candidate A match score computed (${comparison.candidates[0].matchScore}%)`);
    assert(comparison.candidates[0].matchedSkills.length > 0, 'Candidate A matched skills list populated');

    // --- 5. ADMIN VERIFICATION & AUDIT LOGGING ---
    console.log('\n--- 5. ADMIN VERIFICATION & AUDIT LOGGING ---');
    const orgs = await getOrganizationVerifications();
    assert(orgs.length > 0, 'Organization verifications returned existing organizations');

    const verifySuccess = await verifyOrganization('ov-01', 'VERIFIED', 'admin-01', 'Approved during E2E test');
    assert(verifySuccess === true, 'Organization verified cleanly by admin governance');

    await createAuditLog('admin-01', 'ADMIN', 'VERIFY_ORG', 'ORGANIZATION', 'ov-01', { status: 'VERIFIED' });
    const auditLogs = await getAuditLogs();
    assert(auditLogs.some((l) => l.action === 'VERIFY_ORG'), 'Security audit log recorded and retrieved cleanly');

    // --- 6. INFRASTRUCTURE HEALTH & PROFILE VISIBILITY ---
    console.log('\n--- 6. INFRASTRUCTURE HEALTH & PROFILE VISIBILITY ---');
    const health = await getSystemHealthStatus();
    assert(health.database.status === 'HEALTHY', 'Database health status reported HEALTHY');
    assert(health.aiService.status === 'HEALTHY', 'AI Service health status reported HEALTHY');

    const visibility = await getProfileVisibility(userId);
    assert(visibility.public_profile === true, 'Default profile visibility returned public_profile = true');

    const updatedVisibility = await updateProfileVisibility(userId, { contact_visible: true });
    assert(updatedVisibility.contact_visible === true, 'Profile visibility updated cleanly');

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

runMasterE2ETestSuite();
