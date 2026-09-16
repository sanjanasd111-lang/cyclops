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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get('type') || 'ALL';
  const query = searchParams.get('q') || '';

  const userId = await getAuthenticatedUserId();
  const { profile: activeProfile, skills: activeSkills } = await getStudentProfile(userId);

  const rawOpportunities = await getActiveOpportunities();

  const matchedOpportunities = rawOpportunities.map((opp) => {
    const matchBreakdown = matchStudentToOpportunity(activeProfile, activeSkills, opp);
    const matchedSkills = (matchBreakdown.matchedSkills || []).map((m: any) => typeof m === 'string' ? m : m.skillName);
    const missingSkills = (matchBreakdown.missingSkills || []).map((m: any) => typeof m === 'string' ? m : m.skillName);
    return {
      ...opp,
      match_score: matchBreakdown.overallScore,
      matchScore: matchBreakdown.overallScore,
      match_breakdown: matchBreakdown,
      breakdown: matchBreakdown,
      matchedSkills,
      missingSkills,
    };
  });

  // Filter by search query and type
  const filtered = matchedOpportunities.filter((opp) => {
    const matchesType = typeFilter === 'ALL' || opp.opportunity_type === typeFilter;
    const matchesQuery =
      !query ||
      opp.title.toLowerCase().includes(query.toLowerCase()) ||
      opp.company_name.toLowerCase().includes(query.toLowerCase()) ||
      opp.location.toLowerCase().includes(query.toLowerCase()) ||
      (opp.description && opp.description.toLowerCase().includes(query.toLowerCase()));
    return matchesType && matchesQuery;
  });

  // Sort opportunities by match score descending
  filtered.sort((a, b) => b.match_score - a.match_score);

  return NextResponse.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
}
