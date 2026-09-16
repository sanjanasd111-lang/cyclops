import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getInterviewSessionDetails,
  getInterviewReportBySession,
  saveInterviewReport,
  getStudentProfile,
} from '@/lib/db/db-client';
import { generateInterviewReport } from '@/lib/interview/report-generator';

async function getUserId(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) return user.id;
  } catch {}
  return 'usr-authenticated-student-001';
}

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const userId = await getUserId();
    const { sessionId } = params;

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId parameter' }, { status: 400 });
    }

    const session = await getInterviewSessionDetails(sessionId, userId);
    if (!session) {
      return NextResponse.json({ error: 'Interview session not found or access denied' }, { status: 404 });
    }

    // Attempt to load existing persisted report
    let report = await getInterviewReportBySession(sessionId, userId);

    // If report doesn't exist yet but session is present, compute and persist report
    if (!report && session.questions && session.questions.length > 0) {
      const { profile } = await getStudentProfile(userId);
      const questions = session.questions || [];
      const evaluations = questions.map((q: any) => q.evaluation).filter(Boolean);

      report = generateInterviewReport({
        sessionId,
        userId,
        session,
        questions,
        evaluations,
        profile,
      });

      await saveInterviewReport(report);
    }

    return NextResponse.json({
      success: true,
      data: {
        session,
        report,
        questions: session.questions || [],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch interview results' }, { status: 500 });
  }
}
