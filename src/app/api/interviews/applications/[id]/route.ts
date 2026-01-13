import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/interviews/applications/[id] - Get single application with events
export async function GET(
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

    // Fetch application
    const { data: application, error: appError } = await supabase
      .from('interview_applications')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Fetch all events for this application
    const { data: events, error: eventsError } = await supabase
      .from('interview_events')
      .select('*')
      .eq('application_id', id)
      .eq('user_id', user.id)
      .order('scheduled_at', { ascending: true });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
    }

    // Compute next interview
    const now = new Date().toISOString();
    const nextInterview = events?.find(
      e => e.status === 'scheduled' && e.scheduled_at && e.scheduled_at > now
    ) || null;

    return NextResponse.json({
      application: {
        ...application,
        interview_events: events || [],
        next_interview: nextInterview,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/interviews/applications/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/interviews/applications/[id] - Update application
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

    // Validation
    if (body.company_name !== undefined && (!body.company_name || body.company_name.trim().length === 0)) {
      return NextResponse.json({ error: 'Company name cannot be empty' }, { status: 400 });
    }
    if (body.role_title !== undefined && (!body.role_title || body.role_title.trim().length === 0)) {
      return NextResponse.json({ error: 'Role title cannot be empty' }, { status: 400 });
    }

    // Email validation if provided
    if (body.recruiter_email && body.recruiter_email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.recruiter_email)) {
        return NextResponse.json({ error: 'Invalid recruiter email format' }, { status: 400 });
      }
    }

    // Salary validation
    const salaryMin = body.salary_min !== undefined ? parseInt(body.salary_min, 10) : undefined;
    const salaryMax = body.salary_max !== undefined ? parseInt(body.salary_max, 10) : undefined;
    if (salaryMin !== undefined && salaryMax !== undefined && !isNaN(salaryMin) && !isNaN(salaryMax) && salaryMin > salaryMax) {
      return NextResponse.json({ error: 'Salary min cannot be greater than max' }, { status: 400 });
    }

    // Parse internal_tags
    let internal_tags = undefined;
    if (body.internal_tags !== undefined) {
      if (typeof body.internal_tags === 'string') {
        internal_tags = body.internal_tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      } else if (Array.isArray(body.internal_tags)) {
        internal_tags = body.internal_tags;
      } else {
        internal_tags = null;
      }
    }

    // Build update object
    const updateData: Record<string, unknown> = {};
    if (body.company_name !== undefined) updateData.company_name = body.company_name.trim();
    if (body.role_title !== undefined) updateData.role_title = body.role_title.trim();
    if (body.employment_type !== undefined) updateData.employment_type = body.employment_type || null;
    if (body.work_mode !== undefined) updateData.work_mode = body.work_mode || null;
    if (body.company_address !== undefined) updateData.company_address = body.company_address || null;
    if (body.job_url !== undefined) updateData.job_url = body.job_url || null;
    if (body.job_description !== undefined) updateData.job_description = body.job_description || null;
    if (body.salary_min !== undefined) updateData.salary_min = body.salary_min ? parseInt(body.salary_min, 10) : null;
    if (body.salary_max !== undefined) updateData.salary_max = body.salary_max ? parseInt(body.salary_max, 10) : null;
    if (body.salary_notes !== undefined) updateData.salary_notes = body.salary_notes || null;
    if (body.recruiting_firm !== undefined) updateData.recruiting_firm = body.recruiting_firm || null;
    if (body.recruiter_name !== undefined) updateData.recruiter_name = body.recruiter_name || null;
    if (body.recruiter_email !== undefined) updateData.recruiter_email = body.recruiter_email || null;
    if (body.recruiter_phone !== undefined) updateData.recruiter_phone = body.recruiter_phone || null;
    if (body.pipeline_status !== undefined) updateData.pipeline_status = body.pipeline_status;
    if (body.overall_notes !== undefined) updateData.overall_notes = body.overall_notes || null;
    if (internal_tags !== undefined) updateData.internal_tags = internal_tags;

    const { data: application, error } = await supabase
      .from('interview_applications')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating application:', error);
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error('Error in PATCH /api/interviews/applications/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/interviews/applications/[id] - Delete application
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
      .from('interview_applications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting application:', error);
      return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/interviews/applications/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
