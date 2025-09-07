require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function testStripe() {
  try {
    const account = await stripe.accounts.retrieve();
    console.log('Stripe account details:', account.email, account.id);
    console.log('Stripe secret key is working!');
  } catch (err) {
    console.error('Stripe test failed:', err.message);
  }
}

testStripe();
