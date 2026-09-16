
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInstitutionPlacements } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'inst-demo-001';

    const placements = await getInstitutionPlacements(userId);
    const internshipApps = placements.applications.filter((a) => a.opportunity_title.toLowerCase().includes('intern'));

    return NextResponse.json({
      success: true,
      data: {
        totalInternships: internshipApps.length,
        active: internshipApps.filter((a) => a.status === 'SELECTED' || a.status === 'SHORTLISTED').length,
        applications: internshipApps,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch internship intelligence' },
      { status: 500 }
    );
  }
}
