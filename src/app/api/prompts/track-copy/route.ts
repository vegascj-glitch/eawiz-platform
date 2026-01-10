import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Use service role to bypass RLS for incrementing copy count
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { promptId } = await req.json();

    if (!promptId) {
      return NextResponse.json({ error: 'Missing promptId' }, { status: 400 });
    }

    // Increment copy count
    const { error } = await supabaseAdmin.rpc('increment_copy_count', {
      prompt_id: promptId,
    });

    if (error) {
      // If the RPC doesn't exist, try a direct update
      await supabaseAdmin
        .from('prompts')
        .update({ copy_count: supabaseAdmin.rpc('increment', { x: 1 }) as any })
        .eq('id', promptId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking prompt copy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
