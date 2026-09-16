import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getIndustryInterviews, getStudentInterviews, createInterview } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'ind-demo-001';

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') || 'INDUSTRY';

    const interviews = role === 'STUDENT'
      ? await getStudentInterviews(userId)
      : await getIndustryInterviews(userId);

    return NextResponse.json({ success: true, data: interviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'ind-demo-001';

    const body = await req.json();
    const interview = await createInterview(userId, body);

    return NextResponse.json({ success: true, data: interview });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to schedule interview' },
      { status: 500 }
    );
  }
}
