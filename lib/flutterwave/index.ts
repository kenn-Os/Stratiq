// lib/flutterwave/index.ts
const Flutterwave = require('flutterwave-node-v3');
import { SubscriptionTier, BillingInterval } from '@/types'

export const flw = new Flutterwave(
  process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
  process.env.FLW_SECRET_KEY!
);

// ── Pricing Config ───────────────────────────────────────
export const FLW_PLANS: Record<SubscriptionTier, Record<BillingInterval, string | undefined>> = {
  starter: {
    monthly: process.env.FLW_STARTER_PLAN_ID!,
    annual: undefined,
  },
  professional: {
    monthly: process.env.FLW_PRO_MONTHLY_PLAN_ID!,
    annual: process.env.FLW_PRO_ANNUAL_PLAN_ID!,
  },
  enterprise: {
    monthly: process.env.FLW_ENTERPRISE_MONTHLY_PLAN_ID!,
    annual: process.env.FLW_ENTERPRISE_ANNUAL_PLAN_ID!,
  },
}

export const PLAN_LIMITS: Record<SubscriptionTier, { decisions: number; simulations: number; teamMembers: number; reports: boolean }> = {
  starter: {
    decisions: 5,
    simulations: 20,
    teamMembers: 1,
    reports: false,
  },
  professional: {
    decisions: 50,
    simulations: 200,
    teamMembers: 5,
    reports: true,
  },
  enterprise: {
    decisions: Infinity,
    simulations: Infinity,
    teamMembers: Infinity,
    reports: true,
  },
}

// ── Create Payment Link ──────────────────────────────────
export async function createCheckoutSession({
  userId,
  userEmail,
  planId,
  tier,
  amount,
  currency = 'USD',
}: {
  userId: string
  userEmail: string
  planId: string
  tier: SubscriptionTier
  amount: number
  currency?: string
}) {
  const payload = {
    tx_ref: `tx-${Date.now()}-${userId}`,
    amount: amount.toString(),
    currency: currency,
    redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?success=true`,
    meta: {
      userId: userId,
      tier: tier,
    },
    customer: {
      email: userEmail,
    },
    payment_plan: planId,
    customizations: {
      title: 'STRATIQ Subscription',
      description: `Payment for ${tier} plan`,
      logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    },
  };

  const response = await flw.Transaction.initialize(payload);
  return response;
}

// ── Verify Transaction ───────────────────────────────────
export async function verifyTransaction(transactionId: string) {
  const response = await flw.Transaction.verify({ id: transactionId });
  return response;
}

// ── Validate Webhook ──────────────────────────────────────
export function validateWebhook(signature: string) {
  const secretHash = process.env.FLW_SECRET_HASH;
  return signature === secretHash;
}
