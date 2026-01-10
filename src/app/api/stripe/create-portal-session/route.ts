import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/supabase';
import { createCustomerPortalSession } from '@/lib/stripe';

export async function POST() {
  try {
    const profile = await getProfile();

    if (!profile) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!profile.stripe_customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 });
    }

    const session = await createCustomerPortalSession(profile.stripe_customer_id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
