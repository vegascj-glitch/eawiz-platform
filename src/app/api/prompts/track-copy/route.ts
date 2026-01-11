import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to bypass RLS for incrementing copy count
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { promptId } = await req.json();

    if (!promptId) {
      return NextResponse.json({ error: 'Missing promptId' }, { status: 400 });
    }

    // Try using the increment_copy_count RPC if it exists
    const { error: rpcError } = await supabaseAdmin.rpc('increment_copy_count', {
      prompt_id: promptId,
    });

    if (rpcError) {
      // If the RPC doesn't exist, do a manual increment
      const { data: prompt } = await supabaseAdmin
        .from('prompts')
        .select('copy_count')
        .eq('id', promptId)
        .single();

      if (prompt) {
        await supabaseAdmin
          .from('prompts')
          .update({ copy_count: (prompt.copy_count || 0) + 1 })
          .eq('id', promptId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking prompt copy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
