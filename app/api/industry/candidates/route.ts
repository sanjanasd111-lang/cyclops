import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getIndustryOpportunities, getStudentProfile } from '@/lib/db/db-client';
import { INITIAL_STUDENT_PROFILE, INITIAL_USER_SKILLS } from '@/lib/db/seed-data';
import { matchStudentToOpportunity } from '@/lib/matching/engine';
import { StudentProfile, UserSkill, Opportunity } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'ind-demo-001';

    const { searchParams } = new URL(req.url);
    const opportunityId = searchParams.get('opportunity_id');

    const opps = await getIndustryOpportunities(userId);
    const targetOpp = opps.find((o) => o.id === opportunityId) || opps[0] || {
      id: 'opp-dabur-01',
      title: 'Clinical Research Associate Intern',
      company_name: 'Dabur Ayurvet R&D Division',
      opportunity_type: 'INTERNSHIP',
      location: 'New Delhi',
      is_remote: false,
      duration_months: 6,
      stipend_amount: 25000,
      deadline: '2027-12-31T23:59:59Z',
      status: 'ACTIVE',
      required_skills: [
        { skill_id: 's01', skill_name: 'Clinical Research', min_proficiency: 75, is_required: true },
        { skill_id: 's03', skill_name: 'Ayurvedic Pharmacology', min_proficiency: 80, is_required: true },
        { skill_id: 's02', skill_name: 'Research Methodology', min_proficiency: 70, is_required: true },
      ]
    };

    // Candidates pool
    const candidatesPool: Array<{ profile: StudentProfile; skills: UserSkill[] }> = [
      { profile: INITIAL_STUDENT_PROFILE, skills: INITIAL_USER_SKILLS },
      {
        profile: {
          ...INITIAL_STUDENT_PROFILE,
          id: 'sp-rahul-002',
          full_name: 'Rahul Verma',
          degree: 'M.D. Ayurveda',
          department: 'Ayurvedic Medicine & Surgery',
          overall_readiness_score: 82,
        },
        skills: [
          { id: 'sk-r1', student_id: 'sp-rahul-002', skill_id: 's01', skill_name: 'Clinical Research', category: 'Clinical', proficiency_score: 89, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 90, updated_at: new Date().toISOString() },
          { id: 'sk-r2', student_id: 'sp-rahul-002', skill_id: 's03', skill_name: 'Ayurvedic Pharmacology', category: 'Pharmacology', proficiency_score: 85, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 88, updated_at: new Date().toISOString() },
        ]
      },
      {
        profile: {
          ...INITIAL_STUDENT_PROFILE,
          id: 'sp-priya-003',
          full_name: 'Priya Nair',
          degree: 'B.Tech Biotechnology',
          academic_stream: 'Engineering & Technology',
          department: 'Biotechnology & Bioinformatics',
          overall_readiness_score: 79,
        },
        skills: [
          { id: 'sk-p1', student_id: 'sp-priya-003', skill_id: 's-cs-01', skill_name: 'Python', category: 'Programming', proficiency_score: 88, verification_status: 'SELF_DECLARED', confidence_score: 85, updated_at: new Date().toISOString() },
          { id: 'sk-p2', student_id: 'sp-priya-003', skill_id: 's01', skill_name: 'Clinical Research', category: 'Clinical', proficiency_score: 72, verification_status: 'INSTITUTION_VERIFIED', confidence_score: 80, updated_at: new Date().toISOString() },
        ]
      }
    ];

    // Compute candidate scores deterministically
    const rankedCandidates = candidatesPool.map((c) => {
      const match = matchStudentToOpportunity(c.profile, c.skills, targetOpp as Opportunity);
      return {
        profile: {
          id: c.profile.id,
          full_name: c.profile.full_name,
          institution_name: c.profile.institution_name,
          academic_stream: c.profile.academic_stream,
          department: c.profile.department,
          degree: c.profile.degree,
          year: c.profile.year,
          career_goal: c.profile.career_goal,
          overall_readiness_score: c.profile.overall_readiness_score,
          public_slug: c.profile.public_slug,
          // Privacy Preserving Guardrails: omit private phone and email
        },
        match_score: match.overallScore,
        match_breakdown: match,
      };
    }).sort((a, b) => b.match_score - a.match_score);

    return NextResponse.json({
      success: true,
      opportunity: targetOpp,
      data: rankedCandidates,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to discover candidates' },
      { status: 500 }
    );
  }
}
