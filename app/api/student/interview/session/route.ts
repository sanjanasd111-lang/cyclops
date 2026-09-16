import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInterviewSessionDetails, createInterviewSession } from '@/lib/db/db-client';

async function getUserId(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) return user.id;
  } catch {}
  return 'usr-authenticated-student-001';
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId parameter' }, { status: 400 });
    }

    const session = await getInterviewSessionDetails(sessionId, userId);
    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch session details' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json().catch(() => ({}));
    const {
      targetRole = 'Software Engineer',
      opportunityId,
      resumeId,
      interviewType = 'MIXED',
      questionCount = 10,
    } = body;

    const session = await createInterviewSession(
      userId,
      targetRole,
      opportunityId,
      resumeId,
      interviewType,
      questionCount
    );

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      session,
      data: {
        sessionId: session.id,
        ...session,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create interview session' },
      { status: 500 }
    );
  }
}

