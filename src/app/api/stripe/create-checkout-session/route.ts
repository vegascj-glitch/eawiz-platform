import { NextRequest, NextResponse } from 'next/server';
import { getProfile, createServerSupabaseClient } from '@/lib/supabase-server';
import { getStripe, getPriceId, getOrCreateCustomer, PlanType, PRICE_ID_MONTHLY, PRICE_ID_ANNUAL } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Parse request body for plan selection
    const body = await request.json().catch(() => ({}));
    const plan: PlanType = body.plan === 'annual' ? 'annual' : 'monthly';

    // Validate env vars
    const priceId = getPriceId(plan);
    if (!priceId) {
      const missingVar = plan === 'annual'
        ? 'NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL'
        : 'NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY';
      console.error(`Missing environment variable: ${missingVar}`);
      return NextResponse.json(
        { error: `Server configuration error: ${missingVar} is not set` },
        { status: 500 }
      );
    }

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
      if (supabase) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('profiles') as any)
          .update({ stripe_customer_id: customer.id })
          .eq('id', profile.id);
      }
    }

    // Create checkout session with selected plan
    const session = await getStripe().checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/join?canceled=true`,
      metadata: {
        userId: profile.id,
        plan,
      },
      subscription_data: {
        metadata: {
          userId: profile.id,
          plan,
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
