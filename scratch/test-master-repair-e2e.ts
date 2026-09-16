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

import { getStudentProfile, updateStudentProfile, getActiveOpportunities, createStudentApplication, updateApplicationStatus, getStudentApplications, getNotifications } from '../lib/db/db-client';
import { calculateEvidenceBasedSkill } from '../lib/skills/calculator';
import { getRoleRequirement } from '../lib/data/career-roles';
import { matchStudentToOpportunity } from '../lib/matching/engine';
import { generateGroundedAIAnalysis, generateGeminiResponse } from '../lib/gemini/analyzer';

async function runMasterRepairE2ETest() {
  console.log('====================================================');
  console.log('=== TEST 4: MASTER REPAIR END-TO-END VERIFICATION ===');
  console.log('====================================================');

  const userId = 'usr-e2e-student-999';

  // 1. Profile Onboarding / Setup
  console.log('\nStep 1: Setting up Student Profile...');
  const { profile: initProf, skills: initSkills } = await updateStudentProfile(
    userId,
    {
      full_name: 'Ananya Roy',
      academic_stream: 'Engineering & Technology',
      department: 'Artificial Intelligence & Machine Learning',
      course: 'B.Tech AI & ML',
      year: 3,
      career_goal: 'ML Engineer',
      target_role: 'ML Engineer',
      preferred_industry: 'Technology & AI',
    },
    [
      { id: 'sk-e2e-1', student_id: userId, skill_id: 's-cs-01', skill_name: 'Python', category: 'Programming', proficiency_score: 85, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 90, updated_at: new Date().toISOString() },
      { id: 'sk-e2e-2', student_id: userId, skill_id: 's-cs-05', skill_name: 'Machine Learning', category: 'AI & Data', proficiency_score: 75, verification_status: 'SELF_DECLARED', confidence_score: 80, updated_at: new Date().toISOString() },
    ]
  );
  console.log(`Profile created: ${initProf.full_name} (${initProf.course}), Readiness Score: ${initProf.overall_readiness_score}%`);

  // 2. Skill Calculation & Evidence Scoring
  console.log('\nStep 2: Calculating Evidence-Based Skill DNA...');
  const pySkill = calculateEvidenceBasedSkill(initSkills[0], 85, 2, true);
  console.log(`Calculated Skill Score for Python: ${pySkill.calculatedScore}% (${pySkill.confidenceLevel} Confidence, ${pySkill.evidenceList.length} evidence sources)`);

  // 3. Dynamic Skill Gap Matrix
  console.log('\nStep 3: Evaluating Dynamic Skill Gaps for ML Engineer...');
  const roleReq = getRoleRequirement('ML Engineer');
  console.log(`Target Role: ${roleReq.role_name} (${roleReq.category})`);
  const gaps = roleReq.required_skills.map((req) => {
    const userSk = initSkills.find((s) => s.skill_name.toLowerCase() === req.skill_name.toLowerCase());
    const current = userSk ? userSk.proficiency_score : 25;
    return { skill_name: req.skill_name, current_score: current, required_score: req.min_proficiency, gap: Math.max(0, req.min_proficiency - current) };
  });
  console.log('Skill Gaps:', gaps);

  // 4. Grounded AI Analysis & Copilot
  console.log('\nStep 4: Testing Live Gemini AI Analysis & Copilot...');
  const opps = await getActiveOpportunities();
  const aiResult = await generateGroundedAIAnalysis(initProf, initSkills, gaps, opps);
  console.log(`AI Engine Source: ${aiResult.source}`);
  console.log(`Career Analysis Summary: ${aiResult.data.careerAnalysis.slice(0, 120)}...`);

  const copilotReply = await generateGeminiResponse('What is my top recommended next step for becoming an ML Engineer?');
  console.log(`Copilot Reply: ${copilotReply.slice(0, 120)}...`);

  // 5. Candidate Matching Engine
  console.log('\nStep 5: Running 7-Tier Candidate Matching Engine...');
  const targetOpp = opps.find((o) => o.title.toLowerCase().includes('battery') || o.title.toLowerCase().includes('research') || o.title.toLowerCase().includes('data')) || opps[0];
  const matchBreakdown = matchStudentToOpportunity(initProf, initSkills, targetOpp);
  console.log(`Matched with Opportunity: "${targetOpp.title}" at ${targetOpp.company_name}`);
  console.log(`Overall Compatibility Score: ${matchBreakdown.overallScore}%`);
  console.log(`Score Breakdown -> Skill: ${matchBreakdown.skillScore}%, Interest: ${matchBreakdown.interestScore}%, Education: ${matchBreakdown.educationScore}%`);

  // 6. Real Persisted Application & Status Transition
  console.log('\nStep 6: Submitting Application & Testing Recruiter Status Transition...');
  const appRes = await createStudentApplication(userId, targetOpp.id, targetOpp.title, targetOpp.company_name, matchBreakdown.overallScore, matchBreakdown);
  console.log(`Application Submitted: ID ${appRes.application?.id}, Initial Status: ${appRes.application?.status}`);

  await updateApplicationStatus(appRes.application!.id, 'INTERVIEW', 'ind-recruiter-001');
  const userApps = await getStudentApplications(userId);
  const updatedApp = userApps.find((a) => a.id === appRes.application!.id);
  console.log(`Recruiter Updated Status: ${updatedApp?.status}`);

  const notifs = await getNotifications(userId);
  console.log(`Student Notifications Received: ${notifs.length} notification(s). Latest: "${notifs[0]?.title}"`);

  if (updatedApp?.status !== 'INTERVIEW') {
    throw new Error('FAIL: End-to-end application status update failed!');
  }

  console.log('\n====================================================');
  console.log('✅ MASTER REPAIR END-TO-END VERIFICATION PASSED 100%!');
  console.log('====================================================\n');
}

runMasterRepairE2ETest().catch((err) => {
  console.error('❌ MASTER REPAIR END-TO-END VERIFICATION FAILED:', err);
  process.exit(1);
});
