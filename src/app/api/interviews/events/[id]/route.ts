import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// PATCH /api/interviews/events/[id] - Update interview event
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();

    // Build update object
    const updateData: Record<string, unknown> = {};

    if (body.event_type !== undefined) updateData.event_type = body.event_type || null;
    if (body.event_title !== undefined) updateData.event_title = body.event_title || null;
    if (body.scheduled_at !== undefined) {
      updateData.scheduled_at = body.scheduled_at ? new Date(body.scheduled_at).toISOString() : null;
    }
    if (body.duration_minutes !== undefined) {
      updateData.duration_minutes = body.duration_minutes ? parseInt(body.duration_minutes, 10) : null;
    }
    if (body.timezone !== undefined) updateData.timezone = body.timezone || null;
    if (body.interviewer_names !== undefined) updateData.interviewer_names = body.interviewer_names || null;
    if (body.location_or_link !== undefined) updateData.location_or_link = body.location_or_link || null;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.outcome !== undefined) updateData.outcome = body.outcome;
    if (body.notes !== undefined) updateData.notes = body.notes || null;

    // Handle thank_you_sent
    if (body.thank_you_sent !== undefined) {
      updateData.thank_you_sent = body.thank_you_sent;
      if (body.thank_you_sent && !body.thank_you_sent_at) {
        updateData.thank_you_sent_at = new Date().toISOString();
      } else if (!body.thank_you_sent) {
        updateData.thank_you_sent_at = null;
      }
    }

    const { data: event, error } = await supabase
      .from('interview_events')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error in PATCH /api/interviews/events/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/interviews/events/[id] - Delete interview event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { error } = await supabase
      .from('interview_events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting event:', error);
      return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/interviews/events/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
