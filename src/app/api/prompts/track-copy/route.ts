import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(null, { status: 204 });
  }

  try {
    const { promptId } = await req.json();

    if (!promptId) {
      return NextResponse.json({ error: 'Missing promptId' }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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
