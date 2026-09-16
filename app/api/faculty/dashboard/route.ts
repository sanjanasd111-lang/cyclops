
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getFacultyDashboardMetrics } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'fac-demo-001';

    const metrics = await getFacultyDashboardMetrics(userId);
    return NextResponse.json({ success: true, data: metrics });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch faculty dashboard metrics' },
      { status: 500 }
    );
  }
}
