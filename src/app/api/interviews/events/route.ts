import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// POST /api/interviews/events - Create interview event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { application_id, ...rest } = body;

    // Validation
    if (!application_id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    // Verify application belongs to user
    const { data: application, error: appError } = await supabase
      .from('interview_applications')
      .select('id')
      .eq('id', application_id)
      .eq('user_id', user.id)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Convert datetime-local to ISO if needed
    let scheduled_at = null;
    if (rest.scheduled_at) {
      scheduled_at = new Date(rest.scheduled_at).toISOString();
    }

    // Handle thank_you_sent_at
    let thank_you_sent_at = null;
    if (rest.thank_you_sent) {
      thank_you_sent_at = new Date().toISOString();
    }

    const { data: event, error } = await supabase
      .from('interview_events')
      .insert({
        user_id: user.id,
        application_id,
        event_type: rest.event_type || null,
        event_title: rest.event_title || null,
        scheduled_at,
        duration_minutes: rest.duration_minutes ? parseInt(rest.duration_minutes, 10) : null,
        timezone: rest.timezone || null,
        interviewer_names: rest.interviewer_names || null,
        location_or_link: rest.location_or_link || null,
        status: rest.status || 'scheduled',
        outcome: rest.outcome || 'pending',
        notes: rest.notes || null,
        thank_you_sent: rest.thank_you_sent || false,
        thank_you_sent_at,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/interviews/events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
