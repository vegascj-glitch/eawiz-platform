import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

interface CoachingCheckoutRequest {
  name: string;
  email: string;
  linkedin?: string;
  topic: string;
  timezone: string;
  availability: string;
  coach: 'courtney' | 'molly';
  notes?: string;
}

export async function POST(request: Request) {
  try {
    const body: CoachingCheckoutRequest = await request.json();

    // Validate required fields
    const { name, email, topic, timezone, availability, coach } = body;

    if (!name || !email || !topic || !timezone || !availability || !coach) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate coach selection and get price ID
    let priceId: string | undefined;
    if (coach === 'courtney') {
      priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_COURTNEY;
    } else if (coach === 'molly') {
      priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MOLLY;
    }

    if (!priceId) {
      console.error(`Missing price ID for coach: ${coach}`);
      return NextResponse.json(
        { error: 'Invalid coach selection or missing price configuration' },
        { status: 400 }
      );
    }

    // Get site URL for redirects
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout session
    const session = await getStripe().checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/coaching?success=1`,
      cancel_url: `${siteUrl}/coaching?canceled=1`,
      customer_email: email,
      metadata: {
        name,
        email,
        linkedin: body.linkedin || '',
        topic,
        timezone,
        availability,
        coach,
        notes: body.notes || '',
      },
      payment_intent_data: {
        metadata: {
          name,
          email,
          coach,
          topic,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating coaching checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
