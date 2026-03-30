import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/dashboard/TopBar'
import DecisionDetailContent from '@/components/dashboard/DecisionDetailContent'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data } = await supabase.from('decisions').select('title').eq('id', params.id).single()
  return { title: data?.title || 'Decision' }
}

export default async function DecisionDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: decision } = await supabase
    .from('decisions')
    .select(`
      *,
      options:decision_options(
        *,
        variable_scores(*)
      ),
      variables(*),
      simulation_results(*)
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!decision) notFound()

  return (
    <div className="page-enter">
      <TopBar
        title={decision.title}
        subtitle={`${decision.options?.length || 0} options · ${decision.variables?.length || 0} variables`}
        action={
          decision.status !== 'simulated' && decision.status !== 'decided'
            ? { label: 'Run Simulation', href: `/simulate?decision=${decision.id}` }
            : undefined
        }
      />
      <DecisionDetailContent decision={decision} />
    </div>
  )
}
