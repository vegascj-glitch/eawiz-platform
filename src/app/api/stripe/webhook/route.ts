import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { sendWelcomeEmail } from '@/lib/resend';

// Use service role for webhook to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (userId && subscriptionId) {
          // Fetch subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          // Update user profile
          const { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .update({
              subscription_status: 'active',
              stripe_subscription_id: subscriptionId,
              subscription_ends_at: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();

          if (!error && profile) {
            // Send welcome email
            try {
              await sendWelcomeEmail(profile.email, profile.first_name || undefined);
            } catch (emailError) {
              console.error('Failed to send welcome email:', emailError);
            }
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          const status =
            subscription.status === 'active'
              ? 'active'
              : subscription.status === 'past_due'
              ? 'past_due'
              : subscription.status === 'canceled'
              ? 'canceled'
              : 'none';

          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_status: status,
              subscription_ends_at: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_status: 'canceled',
              subscription_ends_at: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq('id', userId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata?.userId;

          if (userId) {
            await supabaseAdmin
              .from('profiles')
              .update({
                subscription_status: 'past_due',
              })
              .eq('id', userId);
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
