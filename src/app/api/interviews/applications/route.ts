import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/interviews/applications - List applications with next interview
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const workMode = searchParams.get('work_mode') || '';
    const sort = searchParams.get('sort') || 'updated';

    // Fetch applications
    let query = supabase
      .from('interview_applications')
      .select('*')
      .eq('user_id', user.id);

    // Apply filters
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,role_title.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('pipeline_status', status);
    }
    if (workMode) {
      query = query.eq('work_mode', workMode);
    }

    const { data: applications, error: appError } = await query;

    if (appError) {
      console.error('Error fetching applications:', appError);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    if (!applications || applications.length === 0) {
      return NextResponse.json({ applications: [] });
    }

    // Fetch next interview for each application
    const appIds = applications.map(a => a.id);
    const now = new Date().toISOString();

    const { data: events, error: eventsError } = await supabase
      .from('interview_events')
      .select('*')
      .eq('user_id', user.id)
      .in('application_id', appIds)
      .eq('status', 'scheduled')
      .gt('scheduled_at', now)
      .order('scheduled_at', { ascending: true });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
    }

    // Map next interview to each application
    const applicationsWithNext = applications.map(app => {
      const nextEvent = events?.find(e => e.application_id === app.id) || null;
      return { ...app, next_interview: nextEvent };
    });

    // Sort applications
    let sortedApps = [...applicationsWithNext];
    switch (sort) {
      case 'next_interview':
        sortedApps.sort((a, b) => {
          if (!a.next_interview?.scheduled_at && !b.next_interview?.scheduled_at) return 0;
          if (!a.next_interview?.scheduled_at) return 1;
          if (!b.next_interview?.scheduled_at) return -1;
          return new Date(a.next_interview.scheduled_at).getTime() - new Date(b.next_interview.scheduled_at).getTime();
        });
        break;
      case 'company':
        sortedApps.sort((a, b) => a.company_name.localeCompare(b.company_name));
        break;
      case 'updated':
      default:
        sortedApps.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
    }

    return NextResponse.json({ applications: sortedApps });
  } catch (error) {
    console.error('Error in GET /api/interviews/applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/interviews/applications - Create application
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { company_name, role_title, ...rest } = body;

    // Validation
    if (!company_name || typeof company_name !== 'string' || company_name.trim().length === 0) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }
    if (!role_title || typeof role_title !== 'string' || role_title.trim().length === 0) {
      return NextResponse.json({ error: 'Role title is required' }, { status: 400 });
    }

    // Email validation if provided
    if (rest.recruiter_email && rest.recruiter_email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rest.recruiter_email)) {
        return NextResponse.json({ error: 'Invalid recruiter email format' }, { status: 400 });
      }
    }

    // Salary validation
    if (rest.salary_min !== undefined && rest.salary_max !== undefined) {
      const min = parseInt(rest.salary_min, 10);
      const max = parseInt(rest.salary_max, 10);
      if (!isNaN(min) && !isNaN(max) && min > max) {
        return NextResponse.json({ error: 'Salary min cannot be greater than max' }, { status: 400 });
      }
    }

    // Parse internal_tags from comma-separated string
    let internal_tags = null;
    if (rest.internal_tags && typeof rest.internal_tags === 'string') {
      internal_tags = rest.internal_tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    } else if (Array.isArray(rest.internal_tags)) {
      internal_tags = rest.internal_tags;
    }

    const { data: application, error } = await supabase
      .from('interview_applications')
      .insert({
        user_id: user.id,
        company_name: company_name.trim(),
        role_title: role_title.trim(),
        employment_type: rest.employment_type || null,
        work_mode: rest.work_mode || null,
        company_address: rest.company_address || null,
        job_url: rest.job_url || null,
        job_description: rest.job_description || null,
        salary_min: rest.salary_min ? parseInt(rest.salary_min, 10) : null,
        salary_max: rest.salary_max ? parseInt(rest.salary_max, 10) : null,
        salary_notes: rest.salary_notes || null,
        recruiting_firm: rest.recruiting_firm || null,
        recruiter_name: rest.recruiter_name || null,
        recruiter_email: rest.recruiter_email || null,
        recruiter_phone: rest.recruiter_phone || null,
        pipeline_status: rest.pipeline_status || 'saved',
        overall_notes: rest.overall_notes || null,
        internal_tags,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating application:', error);
      return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
    }

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/interviews/applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
