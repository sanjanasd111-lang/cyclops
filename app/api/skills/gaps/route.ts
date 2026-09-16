import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStudentProfile } from '@/lib/db/db-client';
import { getRoleRequirement } from '@/lib/data/career-roles';
import { UserSkill } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'usr-authenticated-student-001';

    const { profile, skills } = await getStudentProfile(userId);
    const targetRoleName = profile.target_role || profile.career_goal || 'Software Engineer';
    const roleReq = getRoleRequirement(targetRoleName);

    const targetRoleRequirements = roleReq.required_skills.map((reqSkill) => ({
      skill_name: reqSkill.skill_name,
      required: reqSkill.min_proficiency,
      category: roleReq.category,
    }));

    const gaps = targetRoleRequirements.map((target) => {
      const userSkill = skills.find(
        (s: UserSkill) =>
          s.skill_name.toLowerCase() === target.skill_name.toLowerCase() ||
          s.skill_name.toLowerCase().includes(target.skill_name.toLowerCase()) ||
          target.skill_name.toLowerCase().includes(s.skill_name.toLowerCase())
      );

      const current = userSkill ? userSkill.proficiency_score : 25;
      const gap = target.required - current;
      let status: 'Strong' | 'Developing' | 'Needs Development' = 'Strong';
      let priority: 'Top Priority' | 'Medium Priority' | 'Completed' = 'Completed';

      if (gap > 20) {
        status = 'Needs Development';
        priority = 'Top Priority';
      } else if (gap > 0) {
        status = 'Developing';
        priority = 'Medium Priority';
      }

      return {
        skill: target.skill_name,
        skill_name: target.skill_name,
        category: target.category,
        required: target.required,
        current: current,
        gap: gap > 0 ? gap : 0,
        priority,
        status,
      };
    });

    const topDeficit = gaps.find((g) => g.gap > 0) || (gaps[0] ? gaps[0] : { skill_name: 'Python', gap: 20, required: 75, current: 55 });

    return NextResponse.json({
      success: true,
      data: {
        student_name: profile.full_name || 'Learner',
        target_role: roleReq.role_name,
        readiness_score: profile.overall_readiness_score || 0,
        top_deficit: topDeficit,
        gaps,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to calculate skill gaps' },
      { status: 500 }
    );
  }
}

