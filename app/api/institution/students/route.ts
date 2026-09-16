
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInstitutionStudents } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'inst-demo-001';

    const url = new URL(req.url);
    const branch = url.searchParams.get('branch') || undefined;
    const yearStr = url.searchParams.get('year');
    const year = yearStr ? parseInt(yearStr, 10) : undefined;
    const search = url.searchParams.get('search') || undefined;

    const students = await getInstitutionStudents(userId, { branch, year, search });
    return NextResponse.json({ success: true, data: students });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch institution students' },
      { status: 500 }
    );
  }
}
