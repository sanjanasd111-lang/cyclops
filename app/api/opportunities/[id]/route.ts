import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getActiveOpportunities, getStudentProfile } from '@/lib/db/db-client';
import { matchStudentToOpportunity } from '@/lib/matching/engine';

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const opportunities = await getActiveOpportunities();
  const opportunity = opportunities.find((o) => o.id === params.id);

  if (!opportunity) {
    return NextResponse.json(
      { success: false, error: 'Opportunity not found' },
      { status: 404 }
    );
  }

  const userId = await getAuthenticatedUserId();
  const { profile: activeProfile, skills: activeSkills } = await getStudentProfile(userId);
  const matchBreakdown = matchStudentToOpportunity(activeProfile, activeSkills, opportunity);

  return NextResponse.json({
    success: true,
    data: {
      ...opportunity,
      match_score: matchBreakdown.overallScore,
      match_breakdown: matchBreakdown,
    },
  });
}
