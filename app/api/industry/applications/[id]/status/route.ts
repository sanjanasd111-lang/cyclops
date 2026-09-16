import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateApplicationStatusWithReason } from '@/lib/db/db-client';
import { ApplicationStatus, RejectionReasonCategory } from '@/lib/types';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'ind-demo-001';

    const applicationId = params.id;
    const body = await req.json();
    const newStatus = body.status as ApplicationStatus;
    const rejectionReason = body.rejectionReason as RejectionReasonCategory | undefined;
    const feedbackText = body.feedbackText as string | undefined;

    if (!newStatus) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }

    const res = await updateApplicationStatusWithReason(
      applicationId,
      newStatus,
      userId,
      rejectionReason,
      feedbackText
    );

    if (!res.success) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: res.application,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update application status' },
      { status: 500 }
    );
  }
}
