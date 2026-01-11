import { NextResponse } from 'next/server';
import { getProfile, createServerSupabaseClient } from '@/lib/supabase-server';
import { stripe, PRICE_ID, getOrCreateCustomer } from '@/lib/stripe';

export async function POST() {
  try {
    const profile = await getProfile();

    if (!profile) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      profile.email,
      `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || undefined
    );

    // Update profile with Stripe customer ID if not already set
    if (!profile.stripe_customer_id) {
      const supabase = await createServerSupabaseClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('profiles') as any)
        .update({ stripe_customer_id: customer.id })
        .eq('id', profile.id);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/join?canceled=true`,
      metadata: {
        userId: profile.id,
      },
      subscription_data: {
        metadata: {
          userId: profile.id,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
