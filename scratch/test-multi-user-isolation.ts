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

import { getStudentProfile, updateStudentProfile, createStudentApplication, getStudentApplications } from '../lib/db/db-client';

async function runMultiUserIsolationTest() {
  console.log('=== TEST 1: MULTI-USER DATA ISOLATION TEST ===');

  const studentAId = 'usr-test-cs-student-001';
  const studentBId = 'usr-test-pharm-student-002';

  // 1. Setup Student A (Computer Science)
  await updateStudentProfile(
    studentAId,
    {
      full_name: 'Aarav Sharma',
      academic_stream: 'Engineering & Technology',
      department: 'Computer Science & Engineering',
      course: 'B.Tech CS',
      career_goal: 'Software Engineer',
      target_role: 'Software Engineer',
    },
    [
      { id: 'us-a1', student_id: studentAId, skill_id: 's-cs-01', skill_name: 'Python', category: 'Programming', proficiency_score: 90, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 95, updated_at: new Date().toISOString() },
      { id: 'us-a2', student_id: studentAId, skill_id: 's-cs-02', skill_name: 'React', category: 'Web', proficiency_score: 85, verification_status: 'SELF_DECLARED', confidence_score: 80, updated_at: new Date().toISOString() },
    ]
  );

  // 2. Setup Student B (Pharmacy / AYUSH)
  await updateStudentProfile(
    studentBId,
    {
      full_name: 'Bhavna Patel',
      academic_stream: 'Medical, AYUSH & Healthcare',
      department: 'Ayurvedic Medicine & Surgery',
      course: 'BAMS',
      career_goal: 'Ayurvedic Pharmacologist',
      target_role: 'Ayurvedic Pharmacologist',
    },
    [
      { id: 'us-b1', student_id: studentBId, skill_id: 's03', skill_name: 'Ayurvedic Pharmacology', category: 'Pharmacology', proficiency_score: 88, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 92, updated_at: new Date().toISOString() },
    ]
  );

  // 3. Verify Profiles & Skills Isolation
  const profA = await getStudentProfile(studentAId);
  const profB = await getStudentProfile(studentBId);

  console.log('Student A Name:', profA.profile.full_name, '| Stream:', profA.profile.academic_stream, '| Skills:', profA.skills.map(s => s.skill_name).join(', '));
  console.log('Student B Name:', profB.profile.full_name, '| Stream:', profB.profile.academic_stream, '| Skills:', profB.skills.map(s => s.skill_name).join(', '));

  if (profA.profile.full_name === profB.profile.full_name) {
    throw new Error('FAIL: Student A and Student B profile names collided!');
  }
  if (profA.skills.some(s => s.skill_name === 'Ayurvedic Pharmacology')) {
    throw new Error('FAIL: Student A contains Student B skills!');
  }
  if (profB.skills.some(s => s.skill_name === 'React')) {
    throw new Error('FAIL: Student B contains Student A skills!');
  }

  // 4. Test Application Isolation
  await createStudentApplication(studentAId, 'opp-tata-01', 'EV Battery Thermal Engineer', 'Tata Motors', 92, {});
  await createStudentApplication(studentBId, 'opp-dabur-01', 'Clinical Research Associate Intern', 'Dabur Ayurvet R&D', 89, {});

  const appsA = await getStudentApplications(studentAId);
  const appsB = await getStudentApplications(studentBId);

  console.log('Student A Applications:', appsA.map(a => a.opportunity_title).join(', '));
  console.log('Student B Applications:', appsB.map(a => a.opportunity_title).join(', '));

  if (appsA.some(a => a.company_name === 'Dabur Ayurvet R&D')) {
    throw new Error('FAIL: Student A sees Student B applications!');
  }
  if (appsB.some(a => a.company_name === 'Tata Motors')) {
    throw new Error('FAIL: Student B sees Student A applications!');
  }

  console.log('✅ MULTI-USER DATA ISOLATION TEST PASSED CLEANLY!\n');
}

runMultiUserIsolationTest().catch((err) => {
  console.error('❌ MULTI-USER ISOLATION TEST FAILED:', err);
  process.exit(1);
});
