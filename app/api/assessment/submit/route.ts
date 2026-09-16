import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ASSESSMENT_QUESTIONS } from '@/lib/db/seed-data';
import { getStudentProfile, updateStudentProfile } from '@/lib/db/db-client';
import { UserSkill } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'usr-authenticated-student-001';

    const body = await request.json();
    const { answers }: { answers: Record<string, number> } = body;

    let correctAnswersCount = 0;
    const categoryScores: Record<string, { correct: number; total: number }> = {};

    ASSESSMENT_QUESTIONS.forEach((q) => {
      const selectedOption = answers[q.id];
      const isCorrect = selectedOption === q.correct_option_index;

      if (!categoryScores[q.skill_name]) {
        categoryScores[q.skill_name] = { correct: 0, total: 0 };
      }
      categoryScores[q.skill_name].total += 1;

      if (isCorrect) {
        correctAnswersCount += 1;
        categoryScores[q.skill_name].correct += 1;
      }
    });

    const totalQuestions = ASSESSMENT_QUESTIONS.length || 1;
    const overallScore = Math.round((correctAnswersCount / totalQuestions) * 100);

    const categoryBreakdown: Record<string, number> = {};
    Object.keys(categoryScores).forEach((cat) => {
      const { correct, total } = categoryScores[cat];
      categoryBreakdown[cat] = Math.round((correct / total) * 100);
    });

    // Fetch student's existing skills
    const { skills: currentSkills } = await getStudentProfile(userId);
    
    // Update or add skills verified by assessment
    const updatedSkills: UserSkill[] = [...currentSkills];

    Object.entries(categoryBreakdown).forEach(([skillName, score]) => {
      const existingIdx = updatedSkills.findIndex((s) => s.skill_name.toLowerCase() === skillName.toLowerCase());
      if (existingIdx >= 0) {
        updatedSkills[existingIdx] = {
          ...updatedSkills[existingIdx],
          proficiency_score: score,
          verification_status: 'INSTITUTION_VERIFIED',
          verified_by: 'Cyclops Assessment Engine',
          confidence_score: 90,
          updated_at: new Date().toISOString(),
        };
      } else {
        updatedSkills.push({
          id: `us-assm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          student_id: userId,
          skill_id: `s-assm-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          skill_name: skillName,
          category: 'Assessment Verified',
          proficiency_score: score,
          verification_status: 'INSTITUTION_VERIFIED',
          verified_by: 'Cyclops Assessment Engine',
          confidence_score: 90,
          updated_at: new Date().toISOString(),
        });
      }
    });

    // Save updated skills to DB / session state
    await updateStudentProfile(userId, undefined, updatedSkills);

    return NextResponse.json({
      success: true,
      result: {
        id: `res-${Date.now()}`,
        student_id: userId,
        assessment_id: 'assm-ayush-01',
        total_score: overallScore,
        correct_count: correctAnswersCount,
        total_questions: totalQuestions,
        category_breakdown: categoryBreakdown,
        updated_skills: updatedSkills,
        completed_at: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid assessment submission format' },
      { status: 400 }
    );
  }
}

