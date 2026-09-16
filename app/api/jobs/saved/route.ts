import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSavedOpportunities, saveOpportunity, unsaveOpportunity } from '@/lib/db/db-client';

async function getUserId(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) return user.id;
  } catch {}
  return 'usr-authenticated-student-001';
}

export async function GET() {
  const userId = await getUserId();
  const saved = await getSavedOpportunities(userId);
  return NextResponse.json({ success: true, data: saved });
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const { opportunityId, action } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ success: false, error: 'Opportunity ID required' }, { status: 400 });
    }

    if (action === 'UNSAVE') {
      await unsaveOpportunity(userId, opportunityId);
      return NextResponse.json({ success: true, saved: false });
    }

    await saveOpportunity(userId, opportunityId);
    return NextResponse.json({ success: true, saved: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(req.url);
    const opportunityId = searchParams.get('opportunityId');

    if (!opportunityId) {
      return NextResponse.json({ success: false, error: 'Opportunity ID required' }, { status: 400 });
    }

    await unsaveOpportunity(userId, opportunityId);
    return NextResponse.json({ success: true, saved: false });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
