import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCollaborationPrograms, createCollaborationProgram } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const list = await getCollaborationPrograms();
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch collaboration programs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'ind-demo-001';

    const body = await req.json();
    const program = await createCollaborationProgram(userId, body);

    return NextResponse.json({ success: true, data: program });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create collaboration program' },
      { status: 500 }
    );
  }
}
