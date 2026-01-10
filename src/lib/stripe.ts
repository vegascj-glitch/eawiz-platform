import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

export const PRICE_ID = process.env.STRIPE_PRICE_ID!;
export const MONTHLY_PRICE = 20;

export async function createCheckoutSession(
  customerId: string,
  email: string,
  userId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_email: customerId ? undefined : email,
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
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  });

  return session;
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
  });

  return session;
}

export async function getOrCreateCustomer(email: string, name?: string) {
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  const customer = await stripe.customers.create({
    email,
    name,
  });

  return customer;
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}
