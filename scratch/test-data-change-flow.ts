import fs from 'fs';
import path from 'path';

// Parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

import { getStudentProfile, updateStudentProfile, updateApplicationStatus, getStudentApplications, createStudentApplication } from '../lib/db/db-client';
import { matchStudentToOpportunity } from '../lib/matching/engine';
import { Opportunity } from '../lib/types';

async function runDataChangeFlowTest() {
  console.log('=== TEST 2: DYNAMIC DATA CHANGE FLOW TEST ===');

  const userId = 'usr-dynamic-flow-test';

  // 1. Initial State
  const initial = await updateStudentProfile(
    userId,
    {
      full_name: 'Devika Ray',
      academic_stream: 'Engineering & Technology',
      department: 'Computer Science & Engineering',
      course: 'B.Tech CS',
      career_goal: 'Data Analyst',
      target_role: 'Data Analyst',
    },
    [
      { id: 'sk-d1', student_id: userId, skill_id: 's-cs-01', skill_name: 'Python', category: 'Programming', proficiency_score: 50, verification_status: 'SELF_DECLARED', confidence_score: 70, updated_at: new Date().toISOString() },
    ]
  );

  console.log('Initial Readiness Score:', initial.profile.overall_readiness_score);

  const testOpp: Opportunity = {
    id: 'opp-data-analyst-test',
    industry_id: 'ind-dabur-01',
    company_name: 'Dabur R&D',
    title: 'Data Analyst Intern',
    description: 'Data analytics internship',
    opportunity_type: 'INTERNSHIP',
    location: 'Remote',
    is_remote: true,
    duration_months: 3,
    stipend_amount: 20000,
    deadline: '2027-12-31T23:59:59Z',
    status: 'ACTIVE',
    required_skills: [
      { skill_id: 's-cs-01', skill_name: 'Python', min_proficiency: 80, is_required: true },
      { skill_id: 's-cs-03', skill_name: 'SQL', min_proficiency: 75, is_required: true },
    ],
    created_at: new Date().toISOString(),
  };

  const initialMatch = matchStudentToOpportunity(initial.profile, initial.skills, testOpp);
  console.log('Initial Opportunity Match Score:', initialMatch.overallScore);

  // 2. Dynamic Update: Student completes SQL course and improves Python score to 85
  const updated = await updateStudentProfile(
    userId,
    {
      overall_readiness_score: undefined, // Let system recalculate
    },
    [
      { id: 'sk-d1', student_id: userId, skill_id: 's-cs-01', skill_name: 'Python', category: 'Programming', proficiency_score: 85, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 90, updated_at: new Date().toISOString() },
      { id: 'sk-d2', student_id: userId, skill_id: 's-cs-03', skill_name: 'SQL', category: 'Databases', proficiency_score: 80, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 90, updated_at: new Date().toISOString() },
    ]
  );

  console.log('Updated Readiness Score:', updated.profile.overall_readiness_score);

  const updatedMatch = matchStudentToOpportunity(updated.profile, updated.skills, testOpp);
  console.log('Updated Opportunity Match Score:', updatedMatch.overallScore);

  if (updatedMatch.overallScore <= initialMatch.overallScore) {
    throw new Error('FAIL: Match score did not increase after acquiring required skills!');
  }

  // 3. Test Application Status Transition
  const appResult = await createStudentApplication(userId, testOpp.id, testOpp.title, testOpp.company_name, updatedMatch.overallScore, updatedMatch);
  console.log('Submitted Application Status:', appResult.application?.status);

  // Recruiter changes status to SHORTLISTED
  await updateApplicationStatus(appResult.application!.id, 'SHORTLISTED', 'ind-dabur-01');

  const apps = await getStudentApplications(userId);
  const updatedApp = apps.find(a => a.id === appResult.application!.id);
  console.log('Recruiter Updated Application Status:', updatedApp?.status);

  if (updatedApp?.status !== 'SHORTLISTED') {
    throw new Error('FAIL: Recruiter application status transition failed!');
  }

  console.log('✅ DYNAMIC DATA CHANGE FLOW TEST PASSED CLEANLY!\n');
}

runDataChangeFlowTest().catch((err) => {
  console.error('❌ DYNAMIC DATA CHANGE FLOW TEST FAILED:', err);
  process.exit(1);
});
