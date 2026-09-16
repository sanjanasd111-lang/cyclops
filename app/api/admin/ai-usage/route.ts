import { NextResponse } from 'next/server';
import { getAiUsageStats } from '@/lib/db/db-client';

export async function GET() {
  try {
    const stats = await getAiUsageStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
