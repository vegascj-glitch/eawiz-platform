import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors when API key is not set
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(apiKey, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    });
  }
  return _stripe;
}

export const PRICE_ID_MONTHLY = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY!;
export const PRICE_ID_ANNUAL = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL!;
export const MONTHLY_PRICE = 40;
export const ANNUAL_PRICE = 400;

export type PlanType = 'monthly' | 'annual';

export function getPriceId(plan: PlanType): string {
  return plan === 'annual' ? PRICE_ID_ANNUAL : PRICE_ID_MONTHLY;
}

export async function createCheckoutSession(
  customerId: string,
  email: string,
  userId: string,
  plan: PlanType = 'monthly'
) {
  const priceId = getPriceId(plan);

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    customer_email: customerId ? undefined : email,
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
      userId,
      plan,
    },
    subscription_data: {
      metadata: {
        userId,
        plan,
      },
    },
  });

  return session;
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
  });

  return session;
}

export async function getOrCreateCustomer(email: string, name?: string) {
  const existingCustomers = await getStripe().customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  const customer = await getStripe().customers.create({
    email,
    name,
  });

  return customer;
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await getStripe().subscriptions.cancel(subscriptionId);
  return subscription;
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
  return subscription;
}
