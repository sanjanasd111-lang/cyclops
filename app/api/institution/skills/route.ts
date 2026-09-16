
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInstitutionSkillIntelligence, getInstitutionSkillHeatmap } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'inst-demo-001';

    const intelligence = await getInstitutionSkillIntelligence(userId);
    const heatmap = await getInstitutionSkillHeatmap(userId);

    return NextResponse.json({ success: true, data: { intelligence, heatmap } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch skill intelligence' },
      { status: 500 }
    );
  }
}
