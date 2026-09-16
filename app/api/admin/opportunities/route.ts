import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getModerationOpportunities, updateOpportunityModeration } from '@/lib/db/db-client';
import { OpportunityModerationStatus } from '@/lib/types';

async function getAdminId(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) return user.id;
  } catch {}
  return 'admin-governance-01';
}

export async function GET() {
  try {
    const opps = await getModerationOpportunities();
    return NextResponse.json({ success: true, data: opps });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const adminId = await getAdminId();
    const body = await req.json();
    const { oppId, status, notes } = body;

    if (!oppId || !status) {
      return NextResponse.json(
        { success: false, error: 'oppId and status are required' },
        { status: 400 }
      );
    }

    const ok = await updateOpportunityModeration(oppId, status as OpportunityModerationStatus, adminId, notes);
    return NextResponse.json({ success: ok, data: { oppId, status, notes } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
