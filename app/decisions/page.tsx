import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/dashboard/TopBar'
import { formatRelativeDate, DECISION_STATUS_COLORS, DECISION_STATUS_LABELS } from '@/utils'
import { GitBranch, Plus, ArrowRight, Zap } from 'lucide-react'

export const metadata = { title: 'Decisions' }

export default async function DecisionsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: decisions } = await supabase
    .from('decisions')
    .select(`
      id, title, description, status, created_at, updated_at, tags,
      options:decision_options(id),
      variables(id),
      simulation_results(id, results, created_at)
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="page-enter">
      <TopBar
        title="Decisions"
        subtitle={`${decisions?.length || 0} total`}
        action={{ label: 'New Decision', href: '/decisions/new' }}
      />

      <div className="p-6">
        {!decisions || decisions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-stratiq-blue/10 border border-stratiq-blue/20 flex items-center justify-center mb-5">
              <GitBranch size={28} className="text-stratiq-blue" />
            </div>
            <h2 className="text-[20px] font-display font-bold text-ink-DEFAULT mb-2">
              No decisions yet
            </h2>
            <p className="text-[14px] text-ink-muted mb-6 max-w-sm">
              Create your first structured decision to start modelling scenarios and comparing options.
            </p>
            <Link href="/decisions/new" className="btn-primary">
              <Plus size={15} /> Create First Decision
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {decisions.map(decision => {
              const latestSim = decision.simulation_results?.[0]
              const confidence = latestSim?.results?.confidence_score
              const recommendation = latestSim?.results?.option_scores?.[0]?.option_label

              return (
                <Link
                  key={decision.id}
                  href={`/decisions/${decision.id}`}
                  className="card-surface flex items-center justify-between p-5 hover:border-white/10 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-graphite flex items-center justify-center flex-shrink-0 mt-0.5">
                      <GitBranch size={16} className="text-stratiq-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-semibold text-ink-DEFAULT group-hover:text-stratiq-blue-light transition-colors truncate">
                        {decision.title}
                      </h3>
                      {decision.description && (
                        <p className="text-[12px] text-ink-faint mt-0.5 line-clamp-1">{decision.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] text-ink-faint">
                          {decision.options?.length || 0} options · {decision.variables?.length || 0} variables
                        </span>
                        {decision.tags?.length > 0 && (
                          <div className="flex gap-1">
                            {decision.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-ink-faint">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 ml-4">
                    {recommendation && (
                      <div className="text-right hidden md:block">
                        <div className="text-[11px] text-ink-faint mb-0.5">Recommended</div>
                        <div className="text-[13px] font-medium text-ink-DEFAULT">{recommendation}</div>
                      </div>
                    )}
                    {confidence !== undefined && (
                      <div className="text-right hidden md:block">
                        <div className="text-[11px] text-ink-faint mb-0.5">Confidence</div>
                        <div className="text-[16px] font-bold text-stratiq-blue">{confidence}%</div>
                      </div>
                    )}
                    <div className="text-right">
                      <span className={`text-[11px] font-medium ${DECISION_STATUS_COLORS[decision.status]}`}>
                        {DECISION_STATUS_LABELS[decision.status]}
                      </span>
                      <div className="text-[11px] text-ink-faint mt-0.5">{formatRelativeDate(decision.updated_at)}</div>
                    </div>
                    <ArrowRight size={16} className="text-ink-faint group-hover:text-ink-muted transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
