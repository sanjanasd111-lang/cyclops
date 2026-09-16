import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTrainingBatches, createTrainingBatch } from '@/lib/db/db-client';

async function getInstitutionId(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) return user.id;
  } catch {}
  return 'inst-01';
}

export async function GET() {
  try {
    const instId = await getInstitutionId();
    const batches = await getTrainingBatches(instId);
    return NextResponse.json({ success: true, data: batches });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const instId = await getInstitutionId();
    const body = await req.json();

    if (!body.batch_name || !body.skill_focus) {
      return NextResponse.json(
        { success: false, error: 'batch_name and skill_focus are required' },
        { status: 400 }
      );
    }

    const batch = await createTrainingBatch(instId, body);
    return NextResponse.json({ success: true, data: batch });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
