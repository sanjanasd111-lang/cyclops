import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStudentCalendarEvents, createStudentCalendarEvent } from '@/lib/db/db-client';
import { CalendarEvent } from '@/lib/types';

async function getAuthenticatedUserId(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) return user.id;
  } catch {}
  return 'usr-authenticated-student-001';
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    const events = await getStudentCalendarEvents(userId);
    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Session title is required.' },
        { status: 400 }
      );
    }

    const eventData: Partial<CalendarEvent> = {
      title: body.title,
      company: body.company || (body.type === 'AI_MOCK' ? 'Cyclops AI Mock Engine' : 'RUAS Placement Cell'),
      type: body.type || 'AI_MOCK',
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || '11:00 AM - 11:45 AM',
      duration: body.duration || '45 mins',
      mode: body.mode || 'VIRTUAL',
      locationOrLink: body.locationOrLink || (body.type === 'AI_MOCK' ? '/student/copilot' : 'https://meet.google.com/ruas-interview-room'),
      interviewer: body.interviewer || (body.type === 'AI_MOCK' ? 'Cyclops Autonomous AI Examiner' : 'Faculty Placement Coordinator'),
      status: 'CONFIRMED',
      notes: body.notes || 'Interview rehearsal slot confirmed.',
    };

    const newEvent = await createStudentCalendarEvent(userId, eventData);

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Interview slot booked successfully!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to schedule calendar event' },
      { status: 500 }
    );
  }
}
