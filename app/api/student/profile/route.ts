import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStudentProfile, updateStudentProfile } from '@/lib/db/db-client';
import { calculateCareerReadiness } from '@/lib/matching/readiness';

async function getAuthenticatedUserId(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.id) return user.id;
  } catch {
    // Auth fallback
  }
  return 'usr-authenticated-student-001';
}

function calculateProfileCompleteness(profile: any, skills: any[]): number {
  let score = 0;
  if (profile?.full_name && profile.full_name.trim().length > 1) score += 15;
  if (profile?.academic_stream || profile?.department || profile?.degree) score += 15;
  if (profile?.target_role || profile?.career_goal) score += 15;
  if (Array.isArray(skills) && skills.length > 0) score += 15;
  if ((profile?.linkedin_url && profile.linkedin_url.trim().length > 5) || (profile?.github_url && profile.github_url.trim().length > 5)) score += 15;
  if ((Array.isArray(profile?.projects) && profile.projects.length > 0) || (Array.isArray(profile?.experience) && profile.experience.length > 0)) score += 15;
  if ((profile?.bio && profile.bio.trim().length > 5) || (profile?.phone && profile.phone.trim().length > 4)) score += 10;
  return Math.min(100, score);
}

export async function GET() {
  let userId = 'usr-authenticated-student-001';
  let authUser: any = null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.id) {
      userId = user.id;
      authUser = user;
    }
  } catch {}

  const { profile, skills } = await getStudentProfile(userId);
  if (authUser?.user_metadata?.full_name && (!profile.full_name || profile.full_name === 'Aditi Sharma')) {
    profile.full_name = authUser.user_metadata.full_name;
  }

  const readiness = calculateCareerReadiness(profile, skills);
  profile.overall_readiness_score = readiness.overallScore;
  const completeness = calculateProfileCompleteness(profile, skills);

  return NextResponse.json({
    success: true,
    data: {
      profile,
      skills,
      readiness_breakdown: readiness,
      profile_completeness: completeness,
    },
  });
}

export async function PUT(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await request.json();
    const { profile: inputProfile, skills: inputSkills } = body;

    const { profile, skills } = await updateStudentProfile(userId, inputProfile, inputSkills);
    const readiness = calculateCareerReadiness(profile, skills);
    const completeness = calculateProfileCompleteness(profile, skills);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        skills,
        readiness_breakdown: readiness,
        profile_completeness: completeness,
      },
      message: 'Profile and skills updated successfully',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unable to update profile' },
      { status: 400 }
    );
  }
}
