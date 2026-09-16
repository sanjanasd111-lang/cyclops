import { NextRequest, NextResponse } from 'next/server';
import { compareCandidates } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const oppId = searchParams.get('opportunityId') || 'opp-tech-01';
  const studentIdsParam = searchParams.get('studentIds');
  const studentIds = studentIdsParam ? studentIdsParam.split(',') : ['usr-aditi-001', 'usr-authenticated-student-001'];

  const comparison = await compareCandidates(studentIds, oppId);
  return NextResponse.json({ success: true, data: comparison });
}
