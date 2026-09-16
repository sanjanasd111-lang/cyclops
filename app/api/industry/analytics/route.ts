import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getIndustryAnalytics } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'ind-demo-001';

    const analytics = await getIndustryAnalytics(userId);
    return NextResponse.json({ success: true, data: analytics });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch industry analytics' },
      { status: 500 }
    );
  }
}
