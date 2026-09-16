
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getFacultyIndustrialTrainings, createFacultyIndustrialTraining } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'fac-demo-001';

    const trainings = await getFacultyIndustrialTrainings(userId);
    return NextResponse.json({ success: true, data: trainings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch industrial trainings' },
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
    const created = await createFacultyIndustrialTraining(userId, body);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create industrial training' },
      { status: 500 }
    );
  }
}
