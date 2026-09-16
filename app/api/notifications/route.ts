import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  let userId = 'usr-authenticated-student-001';
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) userId = user.id;
  } catch {}

  try {
    const notifs = await getNotifications(userId);
    return NextResponse.json({ success: true, data: notifs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  let userId = 'usr-authenticated-student-001';
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) userId = user.id;
  } catch {}

  try {
    const body = await req.json();

    if (body.mark_all) {
      await markAllNotificationsRead(userId);
      return NextResponse.json({ success: true, data: { markedAll: true } });
    }

    const { notification_id } = body;

    if (!notification_id) {
      return NextResponse.json({ success: false, error: 'notification_id is required' }, { status: 400 });
    }

    const success = await markNotificationRead(userId, notification_id);
    return NextResponse.json({ success: true, data: { markedId: notification_id } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update notification' },
      { status: 500 }
    );
  }
}
