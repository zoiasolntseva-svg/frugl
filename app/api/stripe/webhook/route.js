import stripe from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const { customer, subscription, metadata } = session;

      // You can store the customer and subscription IDs in your DB
      // For example, update the user's subscription status
      // We assume the metadata contains the user ID from Supabase auth
      const userId = metadata.userId;
      if (userId) {
        await supabase
          .from('profiles')
          .update({ subscription_status: 'active' })
          .eq('id', userId);
      }
      break;
    // Handle other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
