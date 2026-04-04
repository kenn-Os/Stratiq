import Stripe from 'stripe'

export const stripe = new Proxy({} as Stripe, {
  get: () => () => ({
    checkout: {
      sessions: {
        create: async () => ({ url: '#' }),
      },
    },
    billingPortal: {
      sessions: {
        create: async () => ({ url: '#' }),
      },
    },
    webhooks: {
      constructEvent: () => ({}),
    },
  }),
})

export const STRIPE_PRICES = {
  starter: 'price_starter',
  pro: 'price_pro',
  enterprise: 'price_enterprise',
}

export const PLAN_LIMITS = {
  starter: { decisions: 3, teams: 1 },
  pro: { decisions: 20, teams: 5 },
  enterprise: { decisions: 100, teams: 20 },
}

export const getStripeSession = async (priceId: string, customerId?: string) => {
  return { url: '#' }
}

export const getPortalSession = async (customerId: string) => {
  return { url: '#' }
}
