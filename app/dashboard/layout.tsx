import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'
import { getInitials } from '@/utils'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Get subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const fullName = user.user_metadata?.full_name || user.email || ''
  const initials = getInitials(fullName)
  const tier = subscription?.tier || 'starter'

  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <Sidebar
        userEmail={user.email}
        userInitials={initials}
        tier={tier}
      />
      <div className="pl-[220px] min-h-screen">
        {children}
      </div>
    </div>
  )
}
