import { NextResponse } from 'next/server';
import { getPlacementMetrics } from '@/lib/db/db-client';

export async function GET() {
  const metrics = await getPlacementMetrics('inst-01');
  return NextResponse.json({ success: true, data: metrics });
}
