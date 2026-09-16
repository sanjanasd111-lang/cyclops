import { NextResponse } from 'next/server';
import { ASSESSMENT_QUESTIONS } from '@/lib/db/seed-data';

export async function POST(request: Request) {
  let department = 'General Discipline';
  let targetRole = 'Target Role';

  try {
    const body = await request.json();
    if (body.department) department = body.department;
    if (body.targetRole) targetRole = body.targetRole;
  } catch {
    // Optional request payload
  }

  // Filter or match questions for student's department/skills
  let relevantQuestions = ASSESSMENT_QUESTIONS.filter(
    (q) => q.department && (q.department.toLowerCase().includes(department.toLowerCase()) || department.toLowerCase().includes(q.department.toLowerCase()))
  );

  if (relevantQuestions.length === 0) {
    relevantQuestions = ASSESSMENT_QUESTIONS;
  }

  // Return questions without correct_option_index so client cannot cheat
  const sanitizedQuestions = relevantQuestions.map((q) => {
    const { correct_option_index: _unused, ...rest } = q;
    return rest;
  });

  return NextResponse.json({
    success: true,
    assessment_id: `assm-${department.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: `${department} & ${targetRole} Skill Competency Assessment`,
    time_limit_mins: 20,
    questions: sanitizedQuestions,
  });
}
