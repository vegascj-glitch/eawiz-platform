import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/calendar-audit/rules - Get user's category rules
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: rules, error } = await supabase
      .from('calendar_category_rules')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rules:', error);
      return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
    }

    return NextResponse.json({ rules: rules || [] });
  } catch (error) {
    console.error('Error in GET /api/calendar-audit/rules:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/calendar-audit/rules - Create a new category rule
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
    const { pattern, field, category_name, confidence } = body;

    // Validation
    if (!pattern || typeof pattern !== 'string' || pattern.trim().length === 0) {
      return NextResponse.json({ error: 'Pattern is required' }, { status: 400 });
    }

    const validFields = ['title', 'attendee_email', 'attendee_domain'];
    if (!field || !validFields.includes(field)) {
      return NextResponse.json({ error: 'Valid field is required (title, attendee_email, attendee_domain)' }, { status: 400 });
    }

    if (!category_name || typeof category_name !== 'string' || category_name.trim().length === 0) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const validConfidence = ['high', 'low'];
    const ruleConfidence = validConfidence.includes(confidence) ? confidence : 'high';

    const { data: rule, error } = await supabase
      .from('calendar_category_rules')
      .insert({
        user_id: user.id,
        pattern: pattern.trim(),
        field,
        category_name: category_name.trim(),
        confidence: ruleConfidence,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating rule:', error);
      return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 });
    }

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/calendar-audit/rules:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/calendar-audit/rules - Delete a rule
export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('calendar_category_rules')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting rule:', error);
      return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/calendar-audit/rules:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
