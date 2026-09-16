
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCollaborationPrograms } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    const collabs = await getCollaborationPrograms();
    return NextResponse.json({ success: true, data: collabs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch industry partners' },
      { status: 500 }
    );
  }
}
