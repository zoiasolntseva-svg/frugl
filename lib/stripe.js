const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder_build_key', {
  apiVersion: '2023-10-16',
});

export default stripe;
