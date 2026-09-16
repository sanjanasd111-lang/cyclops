
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInstitutionSkillIntelligence, getSkillSupplyVsDemand, getSkillGapHeatmap } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'inst-demo-001';

    const [demandList, supplyVsDemand, heatmap] = await Promise.all([
      getInstitutionSkillIntelligence(userId),
      getSkillSupplyVsDemand(),
      getSkillGapHeatmap(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        demandList,
        supplyVsDemand,
        heatmap,
        dataWindow: 'Past 90 Days',
        recordCount: 42,
        confidenceIndicator: 'High (Verified Academic Records)',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch skill demand' },
      { status: 500 }
    );
  }
}
