import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/dashboard/TopBar'
import Sidebar from '@/components/dashboard/Sidebar'
import AccountContent from '@/components/dashboard/AccountContent'
import { getInitials } from '@/utils'

export const metadata = { title: 'Account & Billing' }

export default async function AccountPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const fullName = profile?.full_name || user.email || ''

  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <Sidebar
        userEmail={user.email}
        userInitials={getInitials(fullName)}
        tier={subscription?.tier || 'starter'}
      />
      <div className="pl-[220px] min-h-screen page-enter">
        <TopBar title="Account & Billing" />
        <AccountContent
          user={{ ...user, full_name: profile?.full_name }}
          subscription={subscription}
        />
      </div>
    </div>
  )
}
