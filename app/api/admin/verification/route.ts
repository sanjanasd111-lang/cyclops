import { NextRequest, NextResponse } from 'next/server';
import { verifyOrganization } from '@/lib/db/db-client';

export async function POST(req: NextRequest) {
  try {
    const { id, status, notes } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and Status are required' }, { status: 400 });
    }

    await verifyOrganization(id, status, 'admin-01', notes);
    return NextResponse.json({ success: true, message: `Organization ${status.toLowerCase()} successfully` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
