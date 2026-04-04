import Sidebar from '@/components/dashboard/Sidebar'
import { getInitials } from '@/utils'

export default async function DecisionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Hardcoded dummy user for UI prototype
  const user = {
    email: 'demo@stratiq.io',
    user_metadata: {
      full_name: 'Demo User'
    }
  }

  const initials = getInitials(user.user_metadata.full_name)
  const tier = 'pro'

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
