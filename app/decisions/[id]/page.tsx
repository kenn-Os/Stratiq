import TopBar from '@/components/dashboard/TopBar'
import DecisionDetailContent from '@/components/dashboard/DecisionDetailContent'

export async function generateMetadata({ params }: { params: { id: string } }) {
  return { title: 'Strategic Decision Analysis' }
}

export default async function DecisionDetailPage({ params }: { params: { id: string } }) {
  // Mock decision data for UI prototype
  const decision: any = {
    id: params.id,
    title: 'Strategy Expansion Q3',
    description: 'Evaluating market entry for South East Asia with risk discount.',
    status: 'completed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    options: [
      { id: '1', title: 'Direct Entry', description: 'Establish local office' },
      { id: '2', title: 'Partnership', description: 'Joint venture with local firm' }
    ],
    variables: [
      { id: '1', name: 'Market Size', type: 'quantitative' },
      { id: '2', name: 'Regulatory Risk', type: 'qualitative' }
    ],
    simulation_results: [{
      id: 'sim1',
      results: {
        confidence_score: 87,
        option_scores: [
          { option_label: 'Direct Entry', score: 92 },
          { option_label: 'Partnership', score: 78 }
        ]
      }
    }]
  }

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
