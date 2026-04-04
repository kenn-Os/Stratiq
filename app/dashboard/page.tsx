import TopBar from '@/components/dashboard/TopBar'
import DashboardContent from '@/components/dashboard/DashboardContent'
import type { Decision } from '@/types'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  // Mock data for UI prototype
  const user = {
    user_metadata: {
      full_name: 'Demo User'
    }
  }

  const decisions: any[] = [
    {
      id: '1',
      title: 'Strategy Expansion Q3',
      status: 'completed',
      updated_at: new Date().toISOString(),
      tags: ['Growth', 'Strategic'],
    },
    {
      id: '2',
      title: 'New Market Entry: APAC',
      status: 'draft',
      updated_at: new Date().toISOString(),
      tags: ['Expansion', 'Risk'],
    }
  ]

  const totalDecisions = 12
  const simulations = 48

  const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="page-enter">
      <TopBar
        title="Dashboard"
        subtitle={`Welcome back, ${firstName}`}
        action={{ label: 'New Decision', href: '/decisions/new' }}
      />
      <DashboardContent
        decisions={(decisions as any as Decision[]) || []}
        totalDecisions={totalDecisions || 0}
        totalSimulations={simulations || 0}
      />
    </div>
  )
}
