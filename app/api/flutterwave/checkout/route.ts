import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, FLW_PLANS } from '@/lib/flutterwave'
import type { SubscriptionTier, BillingInterval } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { tier, billing_interval }: { tier: SubscriptionTier; billing_interval: BillingInterval } =
      await request.json()

    if (!tier || !billing_interval) {
      return NextResponse.json({ error: 'tier and billing_interval are required' }, { status: 400 })
    }

    const planId = FLW_PLANS[tier]?.[billing_interval]
    if (!planId && tier !== 'starter') {
      return NextResponse.json({ error: 'Invalid plan configuration' }, { status: 400 })
    }

    // Define amounts (should match what's in Flutterwave Dashboard)
    const amounts: Record<SubscriptionTier, Record<BillingInterval, number>> = {
      starter: { monthly: 0, annual: 0 },
      professional: { monthly: 49, annual: 470 }, // ~£39/mo
      enterprise: { monthly: 299, annual: 2900 },
    }

    const amount = amounts[tier][billing_interval]

    const response = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email!,
      planId: planId!,
      tier,
      amount,
      currency: 'GBP', // Sticking to GBP as per original Stripe setup
    })

    if (response.status === 'success') {
      return NextResponse.json({ url: response.data.link })
    } else {
      throw new Error(response.message || 'Failed to create checkout session')
    }
  } catch (err: unknown) {
    console.error('[Flutterwave Checkout API Error]', err)
    const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout session'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
