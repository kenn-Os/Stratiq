import { NextRequest, NextResponse } from 'next/server'
import { verifyTransaction, validateWebhook } from '@/lib/flutterwave'
import { createAdminClient } from '@/lib/supabase/server'
import {
  sendSubscriptionConfirmation,
  sendPaymentReceipt,
} from '@/lib/sendgrid'
import { format } from 'date-fns'

export async function POST(request: NextRequest) {
  const signature = request.headers.get('verif-hash')
  // Flutterwave uses 'verif-hash' or just standard validation. 
  // For security, we should check the signature if configured.
  
  if (process.env.FLW_SECRET_HASH && signature !== process.env.FLW_SECRET_HASH) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = await request.json()
  const { event, data } = payload

  // Flutterwave sends different event types
  // For standard checkout, we typically get 'charge.completed'
  
  const supabase = createAdminClient()

  try {
    if (event === 'charge.completed' && data.status === 'successful') {
      const transactionId = data.id
      
      // Verify the transaction with Flutterwave API to be safe
      const verification = await verifyTransaction(transactionId)
      
      if (verification.status === 'success' && verification.data.status === 'successful') {
        const { meta, customer, amount, currency, payment_plan, id } = verification.data
        const userId = meta.userId
        const tier = meta.tier

        if (!userId) {
          console.error('[Flutterwave Webhook] Missing userId in meta')
          return NextResponse.json({ received: true })
        }

        // Update subscription in database
        // Flutterwave Plan intervals are handled in the dashboard, 
        // here we just record the subscription status.
        
        await supabase.from('subscriptions').upsert({
          user_id: userId,
          flw_subscription_id: payment_plan || `flw_sub_${id}`, // Use plan or specific transaction
          flw_customer_id: customer.email,
          tier,
          status: 'active',
          // Flutterwave doesn't expose period dates simply in the webhook, 
          // usually you'd calculate or fetch from Plan API.
          // For now, we'll set a 30-day default if monthly.
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })

        // Send confirmation email
        const { data: profile } = await supabase
          .from('users')
          .select('email, full_name')
          .eq('id', userId)
          .single()

        if (profile?.email) {
          const formattedAmount = `£${amount.toFixed(2)}`
          const nextBilling = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'dd MMM yyyy')
          await sendSubscriptionConfirmation(
            profile.email,
            profile.full_name?.split(' ')[0] || 'there',
            tier.charAt(0).toUpperCase() + tier.slice(1),
            formattedAmount,
            nextBilling
          ).catch(console.error)
          
          await sendPaymentReceipt(
            profile.email,
            profile.full_name?.split(' ')[0] || 'there',
            formattedAmount,
            format(new Date(), 'dd MMM yyyy'),
            '#' // Flutterwave invoice URL if available
          ).catch(console.error)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[Flutterwave Webhook Error]', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
