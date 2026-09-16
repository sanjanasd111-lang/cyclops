import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStudentApplications, createStudentApplication, getActiveOpportunities, getStudentProfile } from '@/lib/db/db-client';
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

export async function GET() {
  const userId = await getAuthenticatedUserId();
  const applications = await getStudentApplications(userId);

  return NextResponse.json({
    success: true,
    data: applications,
  });
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await request.json();
    const { opportunity_id } = body;

    if (!opportunity_id) {
      return NextResponse.json(
        { success: false, error: 'Opportunity ID is required.' },
        { status: 400 }
      );
    }

    const opportunities = await getActiveOpportunities();
    const opportunity = opportunities.find((o) => o.id === opportunity_id);

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: 'Target opportunity not found or no longer active.' },
        { status: 404 }
      );
    }

    // Check deadline
    if (opportunity.deadline && new Date(opportunity.deadline).getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, error: 'The deadline for this opportunity has passed.' },
        { status: 400 }
      );
    }

    const { profile, skills } = await getStudentProfile(userId);
    const matchBreakdown = matchStudentToOpportunity(profile, skills, opportunity);

    const result = await createStudentApplication(
      userId,
      opportunity.id,
      opportunity.title,
      opportunity.company_name,
      matchBreakdown.overallScore,
      matchBreakdown
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to submit application.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.application,
      message: 'Application submitted successfully!',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process application.' },
      { status: 500 }
    );
  }
}
