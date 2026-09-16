
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getFacultyWorkshops, createFacultyWorkshop, registerStudentForWorkshop } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'fac-demo-001';

    const workshops = await getFacultyWorkshops(userId);
    return NextResponse.json({ success: true, data: workshops });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch workshops' },
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
    if (body.action === 'REGISTER') {
      const ok = await registerStudentForWorkshop(body.workshopId, body.studentId || userId);
      return NextResponse.json({ success: ok });
    }

    const created = await createFacultyWorkshop(userId, body);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process workshop' },
      { status: 500 }
    );
  }
}
