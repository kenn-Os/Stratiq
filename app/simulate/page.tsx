'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import TopBar from '@/components/dashboard/TopBar'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/dashboard/Sidebar'
import { getInitials } from '@/utils'

type SimulateState = 'idle' | 'loading' | 'success' | 'error'

export default function SimulatePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const decisionId = searchParams.get('decision')
  const [decisions, setDecisions] = useState<{ id: string; title: string }[]>([])
  const [selectedDecisionId, setSelectedDecisionId] = useState(decisionId || '')
  const [state, setState] = useState<SimulateState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [resultId, setResultId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: decisions } = await supabase
        .from('decisions')
        .select('id, title')
        .eq('user_id', user?.id)
        .in('status', ['draft', 'in_progress'])
        .order('updated_at', { ascending: false })

      setDecisions(decisions || [])
    }
    load()
  }, [])

  const runSimulation = async () => {
    if (!selectedDecisionId) return
    setState('loading')
    setError(null)
    setProgress(0)

    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 85))
    }, 300)

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision_id: selectedDecisionId }),
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Simulation failed')
      }

      const data = await response.json()
      setProgress(100)
      setResultId(data.result_id)
      setState('success')
    } catch (err: unknown) {
      clearInterval(progressInterval)
      const errorMessage = err instanceof Error ? err.message : 'Simulation failed'
      setError(errorMessage)
      setState('error')
    }
  }

  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <Sidebar
        userEmail={user?.email}
        userInitials={getInitials(user?.user_metadata?.full_name || user?.email || '')}
      />
      <div className="pl-[220px] min-h-screen page-enter">
        <TopBar title="Scenario Simulation" subtitle="Apply weighted scoring and calculate expected values" />

        <div className="p-6 max-w-2xl">
          <div className="card-surface p-6 space-y-6">

            {/* Select Decision */}
            <div>
              <label className="block text-[12px] font-semibold text-ink-muted tracking-wider uppercase mb-2">
                Select Decision
              </label>
              <select
                value={selectedDecisionId}
                onChange={e => setSelectedDecisionId(e.target.value)}
                disabled={state === 'loading'}
                className="input-dark w-full text-[14px]"
              >
                <option value="">— Choose a decision —</option>
                {decisions.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>

            {/* What the simulation does */}
            <div className="bg-white/3 rounded-lg p-4 border border-white/5 space-y-2">
              <p className="text-[12px] font-semibold text-ink-muted uppercase tracking-wider">Simulation Engine</p>
              <ul className="space-y-1.5">
                {[
                  'Normalises variable weights',
                  'Calculates weighted score per option',
                  'Applies risk discount to compute expected value',
                  'Generates confidence band using variance analysis',
                  'Classifies risk level per option',
                  'Identifies top risk factors',
                  'Produces executive summary',
                ].map(step => (
                  <li key={step} className="flex items-center gap-2 text-[12px] text-ink-muted">
                    <span className="w-1 h-1 rounded-full bg-stratiq-blue" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Loading State */}
            {state === 'loading' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-stratiq-blue/30 border-t-stratiq-blue rounded-full animate-spin" />
                  <span className="text-[14px] text-ink-muted">Running simulation…</span>
                </div>
                <div className="score-bar-track">
                  <motion.div
                    className="score-bar-fill bg-stratiq-blue"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-[12px] text-ink-faint">{Math.round(progress)}% complete</p>
              </motion.div>
            )}

            {/* Success */}
            {state === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-risk-low/10 border border-risk-low/20"
              >
                <CheckCircle size={18} className="text-risk-low flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-risk-low">Simulation complete</p>
                  <p className="text-[12px] text-ink-muted mt-0.5">Results have been calculated and saved.</p>
                </div>
                <button
                  onClick={() => router.push(`/decisions/${selectedDecisionId}`)}
                  className="btn-primary text-[13px] py-2 px-4 flex items-center gap-1.5"
                >
                  View Results <ArrowRight size={13} />
                </button>
              </motion.div>
            )}

            {/* Error */}
            {state === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-risk-high/10 border border-risk-high/20"
              >
                <AlertTriangle size={16} className="text-risk-high flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-risk-high">Simulation failed</p>
                  <p className="text-[12px] text-ink-muted mt-0.5">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Run Button */}
            {state !== 'loading' && state !== 'success' && (
              <button
                onClick={runSimulation}
                disabled={!selectedDecisionId}
                className="btn-primary w-full justify-center py-3.5 text-[15px] disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <Zap size={17} />
                Run Simulation
                <ArrowRight size={15} className="ml-auto group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-ink-faint mt-4 px-1 leading-relaxed">
            STRATIQ simulations apply mathematical modelling to the data you provide. 
            Results should be used as one input in your decision-making process, not as a definitive answer. 
            Garbage in, garbage out — ensure your scores and weights accurately reflect reality.
          </p>
        </div>
      </div>
    </div>
  )
}
