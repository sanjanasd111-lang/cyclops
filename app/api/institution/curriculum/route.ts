
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInstitutionCurriculumIntelligence } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'inst-demo-001';

    const recommendations = await getInstitutionCurriculumIntelligence(userId);
    return NextResponse.json({ success: true, data: recommendations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch curriculum recommendations' },
      { status: 500 }
    );
  }
}
