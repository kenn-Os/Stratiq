import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/dashboard/TopBar'
import DashboardContent from '@/components/dashboard/DashboardContent'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Fetch decisions
  const { data: decisions } = await supabase
    .from('decisions')
    .select(`
      id, title, status, created_at, updated_at,
      simulation_results(id, created_at, results)
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(10)

  // Stats
  const { count: totalDecisions } = await supabase
    .from('decisions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: simulations } = await supabase
    .from('simulation_results')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="page-enter">
      <TopBar
        title="Dashboard"
        subtitle={`Welcome back, ${firstName}`}
        action={{ label: 'New Decision', href: '/decisions/new' }}
      />
      <DashboardContent
        decisions={decisions || []}
        totalDecisions={totalDecisions || 0}
        totalSimulations={simulations || 0}
      />
    </div>
  )
}
