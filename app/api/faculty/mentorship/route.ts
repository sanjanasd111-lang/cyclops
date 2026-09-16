
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getFacultyMentorships, createFacultyMentorship, addMentorshipFeedback } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'fac-demo-001';

    const mentorships = await getFacultyMentorships(userId);
    return NextResponse.json({ success: true, data: mentorships });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch mentorships' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'fac-demo-001';

    const body = await req.json();
    if (body.action === 'ADD_FEEDBACK') {
      const ok = await addMentorshipFeedback(body.mentorshipId, body.author, body.note, body.milestone);
      return NextResponse.json({ success: ok });
    }

    const created = await createFacultyMentorship(userId, body);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save mentorship' },
      { status: 500 }
    );
  }
}
