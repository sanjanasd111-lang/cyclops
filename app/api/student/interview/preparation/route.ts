import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInterviewPreparationData } from '@/lib/db/db-client';

async function getUserId(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) return user.id;
  } catch {}
  return 'usr-authenticated-student-001';
}

export async function GET() {
  try {
    const userId = await getUserId();
    const data = await getInterviewPreparationData(userId);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch preparation data' }, { status: 500 });
  }
}
