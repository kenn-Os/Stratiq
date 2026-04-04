'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import TopBar from '@/components/dashboard/TopBar'
import Sidebar from '@/components/dashboard/Sidebar'
import { getInitials } from '@/utils'

type SimulateState = 'idle' | 'loading' | 'success' | 'error'

function SimulateContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const decisionId = searchParams.get('decision')
  const [decisions, setDecisions] = useState<{ id: string; title: string }[]>([])
  const [selectedDecisionId, setSelectedDecisionId] = useState(decisionId || '')
  const [state, setState] = useState<SimulateState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  // Mock user for UI prototype
  const user = {
    email: 'demo@stratiq.io',
    user_metadata: {
      full_name: 'Demo User'
    }
  }

  useEffect(() => {
    // Mock decisions for UI prototype
    setDecisions([
      { id: '1', title: 'Strategy Expansion Q3' },
      { id: '2', title: 'New Market Entry: APAC' }
    ])
  }, [])

  const runSimulation = async () => {
    if (!selectedDecisionId) return
    setState('loading')
    setError(null)
    setProgress(0)

    // Animate progress to simulate simulation engine running
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return Math.min(p + Math.random() * 20, 100)
      })
    }, 400)

    try {
      // Simulate simulation time
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      clearInterval(progressInterval)
      setProgress(100)
      setState('success')
    } catch (err: unknown) {
      clearInterval(progressInterval)
      setError('Simulation failed')
      setState('error')
    }
  }

  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <Sidebar
        userEmail={user.email}
        userInitials={getInitials(user.user_metadata.full_name)}
        tier="pro"
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
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
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
                  onClick={() => router.push(`/decisions/${selectedDecisionId || 'mock-id'}`)}
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

export default function SimulatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-charcoal-DEFAULT flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stratiq-blue/30 border-t-stratiq-blue rounded-full animate-spin" />
      </div>
    }>
      <SimulateContent />
    </Suspense>
  )
}
