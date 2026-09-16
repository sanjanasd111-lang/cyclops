import { NextResponse } from 'next/server';
import { getLiveSystemHealth } from '@/lib/db/db-client';

export async function GET() {
  try {
    const health = await getLiveSystemHealth();
    return NextResponse.json({ success: true, data: health });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
