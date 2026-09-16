import { calculateCareerReadiness } from '../lib/matching/readiness';
import { evaluateCandidateOpportunities } from '../lib/matching/engine';
import { StudentProfile, UserSkill, Opportunity } from '../lib/types';

async function runCopilotAndOpportunitiesE2ETest() {
  console.log('========================================================================');
  console.log('=== TEST: AI CAREER COPILOT & OPPORTUNITY INTELLIGENCE E2E SUITE ===');
  console.log('========================================================================\n');

  // Student A: Computer Science Candidate
  const studentAProfile: StudentProfile = {
    id: 'sp-test-a',
    user_id: 'usr-cs-a',
    profile_id: 'prof-a',
    full_name: 'Aarav Sharma',
    academic_stream: 'Computer Science & Engineering',
    department: 'Software Engineering',
    course: 'B.Tech',
    year: 4,
    preferred_roles: ['Software Engineer'],
    preferred_locations: ['Bengaluru'],
    availability: 'IMMEDIATE',
    public_slug: 'aarav-sharma',
    career_goal: 'Software Engineer',
    target_role: 'Software Engineer',
    overall_readiness_score: 82,
    projects: [{ title: 'Full-Stack Web App', description: 'Built React app', skills_used: ['React', 'Node.js'] }],
    certifications: [{ name: 'Full-Stack Certificate', issuer: 'Coursera', year: 2024 }],
    experience: [{ title: 'Software Intern', organization: 'Tech Corp', duration: '6 Months', description: 'Web dev intern' }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const studentASkills: UserSkill[] = [
    { id: 's1', student_id: 'usr-cs-a', skill_id: 'sk-1', skill_name: 'Python', category: 'Backend', proficiency_score: 88, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 90, updated_at: new Date().toISOString() },
    { id: 's2', student_id: 'usr-cs-a', skill_id: 'sk-2', skill_name: 'React', category: 'Frontend', proficiency_score: 85, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 88, updated_at: new Date().toISOString() },
    { id: 's3', student_id: 'usr-cs-a', skill_id: 'sk-3', skill_name: 'SQL', category: 'Database', proficiency_score: 45, verification_status: 'SELF_DECLARED', confidence_score: 55, updated_at: new Date().toISOString() },
  ];

  // Student B: Pharmacy / AYUSH Candidate
  const studentBProfile: StudentProfile = {
    id: 'sp-test-b',
    user_id: 'usr-bams-b',
    profile_id: 'prof-b',
    full_name: 'Bhavna Varma',
    academic_stream: 'AYUSH Medical & Health Sciences',
    department: 'Ayurvedic Pharmacology',
    course: 'BAMS',
    year: 4,
    preferred_roles: ['Clinical Research Associate'],
    preferred_locations: ['New Delhi'],
    availability: 'IMMEDIATE',
    public_slug: 'bhavna-varma',
    career_goal: 'Clinical Research Associate',
    target_role: 'Clinical Research Associate',
    overall_readiness_score: 85,
    projects: [{ title: 'Pharmacovigilance Study', description: 'Standardization study', skills_used: ['Pharmacovigilance'] }],
    certifications: [{ name: 'GCP Certificate', issuer: 'NIDA', year: 2024 }],
    experience: [{ title: 'Clinical Trainee', organization: 'Ayurvedic Hospital', duration: '6 Months', description: 'Clinical intern' }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const studentBSkills: UserSkill[] = [
    { id: 'sb1', student_id: 'usr-bams-b', skill_id: 'sk-b1', skill_name: 'Pharmacovigilance', category: 'Drug Safety', proficiency_score: 90, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 92, updated_at: new Date().toISOString() },
    { id: 'sb2', student_id: 'usr-bams-b', skill_id: 'sk-b2', skill_name: 'Ayurvedic Pharmacology', category: 'Pharmacology', proficiency_score: 92, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 95, updated_at: new Date().toISOString() },
    { id: 'sb3', student_id: 'usr-bams-b', skill_id: 'sk-b3', skill_name: 'Biostatistics', category: 'Analytics', proficiency_score: 40, verification_status: 'SELF_DECLARED', confidence_score: 50, updated_at: new Date().toISOString() },
  ];

  // Test 1: Weighted Career Readiness Engine Calculation
  console.log('Step 1: Calculating 7-Part Weighted Career Readiness Scores...');
  const readinessA = calculateCareerReadiness(studentAProfile, studentASkills, 1, 1, true, 80);
  const readinessB = calculateCareerReadiness(studentBProfile, studentBSkills, 1, 1, true, 75);

  console.log(`Student A Readiness: ${readinessA.overallScore}% (Skill: ${readinessA.skillScore}%, Exp: ${readinessA.experienceScore}%, Proj: ${readinessA.projectScore}%, Cert: ${readinessA.certificationScore}%, Resume: ${readinessA.resumeScore}%)`);
  console.log(`Student B Readiness: ${readinessB.overallScore}% (Skill: ${readinessB.skillScore}%, Exp: ${readinessB.experienceScore}%, Proj: ${readinessB.projectScore}%, Cert: ${readinessB.certificationScore}%, Resume: ${readinessB.resumeScore}%)`);

  if (readinessA.overallScore === 0 || readinessB.overallScore === 0) {
    throw new Error('Readiness score calculation failed.');
  }

  // Test 2: Opportunity Matching & Multi-User Isolation
  console.log('\nStep 2: Testing Personalized Opportunity Feed & Multi-User Isolation...');
  const opportunities: Opportunity[] = [
    {
      id: 'opp-tech-1',
      industry_id: 'ind-1',
      title: 'Full-Stack Software Engineer Intern',
      company_name: 'CloudScale Technologies',
      description: 'Build web applications',
      location: 'Bengaluru, India',
      is_remote: false,
      opportunity_type: 'INTERNSHIP',
      stipend_amount: 35000,
      duration_months: 6,
      required_skills: [
        { skill_id: 'sk-1', skill_name: 'Python', min_proficiency: 70, is_required: true },
        { skill_id: 'sk-2', skill_name: 'React', min_proficiency: 70, is_required: true },
      ],
      eligibility: 'B.Tech / CS',
      source: 'AYUSHSetu Partner',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    },
    {
      id: 'opp-ayush-1',
      industry_id: 'ind-2',
      title: 'Clinical Research & Pharmacovigilance Associate',
      company_name: 'Dabur Ayurvet R&D Division',
      description: 'Clinical trial evaluation',
      location: 'New Delhi, India',
      is_remote: false,
      opportunity_type: 'INTERNSHIP',
      stipend_amount: 30000,
      duration_months: 6,
      required_skills: [
        { skill_id: 'sk-b1', skill_name: 'Pharmacovigilance', min_proficiency: 75, is_required: true },
        { skill_id: 'sk-b2', skill_name: 'Ayurvedic Pharmacology', min_proficiency: 75, is_required: true },
      ],
      eligibility: 'BAMS / Pharmacy',
      source: 'AYUSHSetu Partner',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    },
  ];

  const evalA = evaluateCandidateOpportunities(studentAProfile, studentASkills, opportunities);
  const evalB = evaluateCandidateOpportunities(studentBProfile, studentBSkills, opportunities);

  console.log(`Student A Match 1 (${evalA[0].opp.title}): ${evalA[0].matchScore}%`);
  console.log(`Student B Match 1 (${evalB[0].opp.title}): ${evalB[0].matchScore}%`);

  if (evalA[0].opp.id !== 'opp-tech-1') {
    throw new Error('Student A did not receive CS tech opportunity as top match.');
  }

  if (evalB[0].opp.id !== 'opp-ayush-1') {
    throw new Error('Student B did not receive AYUSH clinical opportunity as top match.');
  }

  console.log('\n========================================================================');
  console.log('✅ AI CAREER COPILOT & OPPORTUNITY INTELLIGENCE E2E VERIFICATION PASSED!');
  console.log('========================================================================\n');
}

runCopilotAndOpportunitiesE2ETest().catch((err) => {
  console.error('❌ E2E Test Failed:', err);
  process.exit(1);
});
