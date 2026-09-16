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

import { updateStudentProfile, getStudentProfile, saveStudentResume, getStudentResumes, deleteStudentResume, saveResumeDocument, saveResumeAnalysis } from '../lib/db/db-client';
import { calculateDeterministicATSScore } from '../lib/resume/ats-engine';
import { ResumeContentData } from '../lib/types/resume-types';

async function runResumeStudioE2ETest() {
  console.log('===========================================================');
  console.log('=== TEST: AI RESUME STUDIO END-TO-END VERIFICATION SUITE ===');
  console.log('===========================================================');

  const studentAId = 'usr-test-resume-student-A';
  const studentBId = 'usr-test-resume-student-B';

  // 1. Setup Student A (CS / AI student with real profile skills & projects)
  console.log('\nStep 1: Setting up Student A profile and verified skills...');
  const studentA = await updateStudentProfile(
    studentAId,
    {
      full_name: 'Ananya Varma',
      academic_stream: 'Engineering & Technology',
      department: 'Computer Science & Engineering',
      course: 'B.Tech CS',
      year: 3,
      career_goal: 'Software Engineer',
      target_role: 'Software Engineer',
      projects: [
        { title: 'Smart Skill Marketplace Platform', description: 'Built full-stack React and SQL application for skill matching.', skills_used: ['React', 'SQL', 'Node.js'] },
      ],
    },
    [
      { id: 'us-ra1', student_id: studentAId, skill_id: 's-cs-01', skill_name: 'Python', category: 'Programming', proficiency_score: 90, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 95, updated_at: new Date().toISOString() },
      { id: 'us-ra2', student_id: studentAId, skill_id: 's-cs-02', skill_name: 'React', category: 'Web', proficiency_score: 85, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 90, updated_at: new Date().toISOString() },
      { id: 'us-ra3', student_id: studentAId, skill_id: 's-cs-03', skill_name: 'SQL', category: 'Databases', proficiency_score: 80, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 85, updated_at: new Date().toISOString() },
    ]
  );
  console.log(`Student A Profile: ${studentA.profile.full_name} (${studentA.profile.course}), Verified Skills: ${studentA.skills.map(s => s.skill_name).join(', ')}`);

  // 2. Pre-fill Resume from Real Profile Data
  console.log('\nStep 2: Pre-filling resume data from Student A profile (No invented facts)...');
  const resumeDraftA: ResumeContentData = {
    personalInfo: {
      fullName: studentA.profile.full_name || 'Ananya Varma',
      headline: 'Software Engineer | B.Tech CS Candidate',
      email: 'ananya@university.edu',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      summary: 'Motivated Computer Science student specializing in React, Python, and SQL with verified platform projects.',
    },
    education: [
      { id: 'ed-1', institution: 'RV College of Engineering', degree: 'B.Tech', fieldOfStudy: 'Computer Science', graduationYear: '2025', gpa: '8.4 CGPA' },
    ],
    experience: [],
    projects: [
      {
        id: 'proj-1',
        title: 'Smart Skill Marketplace Platform',
        description: 'Built full-stack React and SQL application for skill matching.',
        technologies: ['React', 'SQL', 'Node.js'],
        bullets: ['Designed and engineered responsive web platform using React and SQL.', 'Optimized database queries and API endpoints.'],
      },
    ],
    skills: [
      { id: 'sk-1', name: 'Python', category: 'Programming', proficiency: 90, isVerified: true },
      { id: 'sk-2', name: 'React', category: 'Web', proficiency: 85, isVerified: true },
      // Omit SQL intentionally to test Resume ↔ Skill Connection
    ],
    certifications: [],
    achievements: ['Achieved 85% career readiness score.'],
    languages: ['English', 'Hindi'],
  };

  // 3. Test Deterministic ATS Rubric Engine
  console.log('\nStep 3: Calculating Deterministic ATS Rubric Scores...');
  const atsAnalysis = calculateDeterministicATSScore(resumeDraftA, studentA.profile, studentA.skills, 'Software Engineer');
  console.log(`Calculated ATS Score: ${atsAnalysis.atsScore}/100 (${atsAnalysis.scoreTier})`);
  console.log(`Keyword Score: ${atsAnalysis.keywordScore}%, Skill Alignment: ${atsAnalysis.skillAlignment}%, Completeness: ${atsAnalysis.sectionCompleteness}%`);
  console.log(`Matched Keywords: ${atsAnalysis.matchedKeywords.join(', ')}`);
  console.log(`Missing Verified Skills on Resume: ${atsAnalysis.verifiedSkillsMissingFromResume.join(', ')}`);
  console.log(`Disclaimer Disclosure: "${atsAnalysis.disclaimer}"`);

  if (!atsAnalysis.verifiedSkillsMissingFromResume.includes('SQL')) {
    throw new Error('FAIL: Resume ↔ Skill Connection failed to detect missing verified skill SQL!');
  }
  if (atsAnalysis.atsScore < 60 || atsAnalysis.atsScore > 100) {
    throw new Error(`FAIL: Calculated ATS score ${atsAnalysis.atsScore} out of expected 60-100 range!`);
  }

  // 4. Save Resume and Test Multi-Version Management
  console.log('\nStep 4: Saving Resume & Versioning...');
  const savedResA = await saveStudentResume(studentAId, {
    name: 'Software Engineer Resume v1',
    target_role: 'Software Engineer',
    template: 'modern',
    content_json: resumeDraftA,
    ats_score: atsAnalysis.atsScore,
    is_default: true,
  });
  console.log(`Saved Resume A: ID ${savedResA.id}, Name: "${savedResA.name}", ATS Score: ${savedResA.ats_score}`);

  // Create a second version (Data Analyst Resume)
  const savedResA2 = await saveStudentResume(studentAId, {
    name: 'Data Analyst Resume v2',
    target_role: 'Data Analyst',
    template: 'minimal',
    content_json: { ...resumeDraftA, personalInfo: { ...resumeDraftA.personalInfo, headline: 'Data Analyst' } },
    ats_score: 78,
  });
  console.log(`Saved Resume A2: ID ${savedResA2.id}, Name: "${savedResA2.name}"`);

  const resListA = await getStudentResumes(studentAId);
  console.log(`Student A Total Saved Resumes: ${resListA.length}`);
  if (resListA.length !== 2) {
    throw new Error(`FAIL: Expected 2 saved resumes for Student A, got ${resListA.length}`);
  }

  // 5. Test Multi-User Security Isolation
  console.log('\nStep 5: Testing Multi-User Security Isolation...');
  const studentB = await updateStudentProfile(studentBId, { full_name: 'Bhavna Kumar', course: 'BAMS' }, []);
  await saveStudentResume(studentBId, { name: 'Student B BAMS Resume', target_role: 'Ayurvedic Doctor', ats_score: 80 });

  const resListB = await getStudentResumes(studentBId);
  console.log(`Student B Saved Resumes: ${resListB.map(r => r.name).join(', ')}`);

  if (resListB.some(r => r.user_id === studentAId || r.name.includes('Software Engineer'))) {
    throw new Error('FAIL: Security isolation breached! Student B sees Student A resumes.');
  }

  // 6. Test File Upload & Document Record
  console.log('\nStep 6: Testing Resume Document Upload & Storage Record...');
  const docRecord = await saveResumeDocument(studentAId, {
    file_name: 'Ananya_CV_2025.pdf',
    file_path: `/uploads/${studentAId}/Ananya_CV_2025.pdf`,
    file_type: 'application/pdf',
    file_size: 245000,
    target_role: 'Software Engineer',
    extracted_text: 'Ananya Varma Software Engineer Python React SQL B.Tech CS',
    status: 'PARSED',
  });
  console.log(`Saved Document Record: ${docRecord.file_name} (${docRecord.file_size} bytes), Status: ${docRecord.status}`);

  console.log('\n===========================================================');
  console.log('✅ AI RESUME STUDIO END-TO-END VERIFICATION PASSED 100%!');
  console.log('===========================================================\n');
}

runResumeStudioE2ETest().catch((err) => {
  console.error('❌ AI RESUME STUDIO END-TO-END VERIFICATION FAILED:', err);
  process.exit(1);
});
