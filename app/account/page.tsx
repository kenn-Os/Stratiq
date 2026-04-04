import TopBar from '@/components/dashboard/TopBar'
import Sidebar from '@/components/dashboard/Sidebar'
import AccountContent from '@/components/dashboard/AccountContent'
import { getInitials } from '@/utils'

export const metadata = { title: 'Account & Billing' }

export default async function AccountPage() {
  // Hardcoded dummy user for UI prototype
  const user = {
    id: 'demo-id',
    email: 'demo@stratiq.io',
    full_name: 'Demo User'
  }

  // Mock subscription for UI prototype
  const subscription: any = {
    tier: 'pro',
    status: 'active',
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }

  const initials = getInitials(user.full_name)

  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <Sidebar
        userEmail={user.email}
        userInitials={initials}
        tier={subscription.tier}
      />
      <div className="pl-[220px] min-h-screen page-enter">
        <TopBar title="Account & Billing" />
        <AccountContent
          user={user}
          subscription={subscription}
        />
      </div>
    </div>
  )
}
