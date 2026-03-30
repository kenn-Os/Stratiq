'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ScatterChart, Scatter, ZAxis,
} from 'recharts'
import { Zap, FileText, AlertTriangle, CheckCircle, TrendingUp, Shield, ArrowRight, Edit3 } from 'lucide-react'
import { formatDate, RISK_COLORS, scoreToColor, cn } from '@/utils'
import type { Decision, OptionScore, DecisionOption, Variable, SimulationResult, VariableScore, RiskFactor } from '@/types'

interface DecisionDetailContentProps {
  decision: Decision & { 
    options: DecisionOption[]
    variables: Variable[]
    simulation_results: SimulationResult[] 
  }
}

export default function DecisionDetailContent({ decision }: DecisionDetailContentProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'scores' | 'simulation' | 'risk'>('scores')
  const [savingScores, setSavingScores] = useState(false)
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {}
    decision.options?.forEach(opt => {
      opt.variable_scores?.forEach((vs) => {
        map[`${opt.id}_${vs.variable_id}`] = vs.score
      })
    })
    return map
  })

  const latestSim = decision.simulation_results?.[0]
  const simResults = latestSim?.results

  const optionScores: OptionScore[] = simResults?.option_scores || []
  const bestOption = optionScores[0]

  const handleScoreChange = (optionId: string, variableId: string, value: number) => {
    setScores(prev => ({ ...prev, [`${optionId}_${variableId}`]: value }))
  }

  const TABS = [
    { id: 'scores', label: 'Scoring Matrix', icon: Edit3 },
    { id: 'simulation', label: 'Simulation Results', icon: TrendingUp, disabled: !simResults },
    { id: 'risk', label: 'Risk Analysis', icon: Shield, disabled: !simResults },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="card-elevated px-3 py-2 text-[12px]">
          <p className="text-ink-muted">{payload[0].name}</p>
          <p className="text-ink-DEFAULT font-semibold">{payload[0].value?.toFixed(1)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-6">
      {/* Status Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-[12px] text-ink-faint">
          <span>Created {formatDate(decision.created_at)}</span>
          <span>·</span>
          <span>Updated {formatDate(decision.updated_at)}</span>
        </div>
        {!simResults && (
          <Link
            href={`/simulate?decision=${decision.id}`}
            className="ml-auto flex items-center gap-2 btn-primary text-[13px] py-2 px-4"
          >
            <Zap size={14} />
            Run Simulation
          </Link>
        )}
        {simResults && (
          <Link href="/reports" className="ml-auto flex items-center gap-2 btn-secondary text-[13px] py-2 px-4">
            <FileText size={14} />
            Generate Report
          </Link>
        )}
      </div>

      {/* Simulation Summary */}
      {simResults && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface border-l-4 border-stratiq-blue p-5 mb-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-stratiq-teal" />
                <span className="text-[12px] font-semibold text-stratiq-teal uppercase tracking-wider">Simulation Complete</span>
              </div>
              <p className="text-[13px] text-ink-muted leading-relaxed max-w-2xl">
                {simResults.executive_summary}
              </p>
            </div>
            <div className="ml-6 text-right flex-shrink-0">
              <div className="text-[11px] text-ink-faint mb-0.5">Confidence</div>
              <div className="text-[32px] font-display font-bold text-stratiq-blue">
                {simResults.confidence_score}%
              </div>
              <div className="text-[11px] text-ink-faint mt-0.5">
                Risk: <span className={`font-semibold ${RISK_COLORS[simResults.risk_summary?.overall_risk_level || 'low'].text}`}>
                  {(simResults.risk_summary?.overall_risk_level || 'low').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/5 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
            disabled={tab.disabled}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed',
              activeTab === tab.id
                ? 'border-stratiq-blue text-stratiq-blue-light'
                : 'border-transparent text-ink-faint hover:text-ink-muted'
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Scoring Matrix */}
      {activeTab === 'scores' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-ink-faint uppercase tracking-wider w-48">
                    Variable
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-ink-faint uppercase tracking-wider text-center w-16">
                    Weight
                  </th>
                  {decision.options?.map(opt => (
                    <th key={opt.id} className="px-4 py-3 text-[11px] font-semibold text-ink-muted text-center min-w-32">
                      {opt.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {decision.variables?.map((variable) => (
                  <tr key={variable.id} className="group">
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink-DEFAULT">{variable.name}</div>
                      <div className="text-[11px] text-ink-faint capitalize">{variable.variable_type}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[12px] font-semibold text-stratiq-blue">{variable.weight}%</span>
                    </td>
                    {decision.options?.map(opt => {
                      const key = `${opt.id}_${variable.id}`
                      const score = scores[key] ?? 5
                      return (
                        <td key={opt.id} className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={score}
                              onChange={e => handleScoreChange(opt.id, variable.id, Number(e.target.value))}
                              className="input-dark w-16 text-center text-[14px] font-semibold"
                            />
                            <div className="score-bar-track w-16">
                              <div
                                className="score-bar-fill"
                                style={{
                                  width: `${(score / 10) * 100}%`,
                                  backgroundColor: scoreToColor((score / 10) * 100),
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
            <p className="text-[12px] text-ink-faint">
              Score each option 0–10 for every variable. Weights are applied during simulation.
            </p>
            <div className="flex gap-3">
              <button className="btn-secondary text-[13px]" disabled={savingScores}>
                Save Scores
              </button>
              <Link
                href={`/simulate?decision=${decision.id}`}
                className="btn-primary text-[13px] flex items-center gap-2"
              >
                <Zap size={14} /> Run Simulation <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab: Simulation Results */}
      {activeTab === 'simulation' && simResults && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Score Comparison */}
          <div className="card-surface p-5">
            <h3 className="text-[14px] font-semibold text-ink-DEFAULT mb-4">Weighted Score Comparison</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={optionScores.map(os => ({ name: os.option_label, score: os.weighted_score, ev: os.expected_value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#8B98A8', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#8B98A8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="Weighted Score" radius={[4, 4, 0, 0]}>
                  {optionScores.map((os, i) => (
                    <Cell key={os.option_id} fill={i === 0 ? '#3B82F6' : 'rgba(59,130,246,0.3)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {optionScores.map((os, i) => (
              <div
                key={os.option_id}
                className={cn(
                  'card-surface p-5',
                  i === 0 && 'border-stratiq-blue/30 bg-stratiq-blue/5'
                )}
              >
                {i === 0 && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <CheckCircle size={13} className="text-stratiq-teal" />
                    <span className="text-[11px] font-semibold text-stratiq-teal uppercase tracking-wider">Recommended</span>
                  </div>
                )}
                <h4 className="text-[15px] font-semibold text-ink-DEFAULT mb-3">{os.option_label}</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-ink-faint mb-0.5">Weighted Score</div>
                    <div className="text-[20px] font-bold" style={{ color: scoreToColor(os.weighted_score) }}>
                      {os.weighted_score.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-faint mb-0.5">Expected Value</div>
                    <div className="text-[20px] font-bold text-ink-DEFAULT">{os.expected_value.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-faint mb-0.5">Risk Score</div>
                    <div className={`text-[14px] font-semibold ${RISK_COLORS[os.risk_level].text}`}>
                      {os.risk_score}/100
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-faint mb-0.5">Risk Level</div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${RISK_COLORS[os.risk_level].bg} ${RISK_COLORS[os.risk_level].text}`}>
                      {os.risk_level.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="text-[10px] text-ink-faint mb-1">Confidence Band</div>
                  <div className="text-[12px] text-ink-muted">
                    {os.confidence_band.low.toFixed(1)} – {os.confidence_band.high.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tab: Risk Analysis */}
      {activeTab === 'risk' && simResults && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk Matrix */}
            <div className="card-surface p-5">
              <h3 className="text-[14px] font-semibold text-ink-DEFAULT mb-4">Risk vs. Impact Matrix</h3>
              <ResponsiveContainer width="100%" height={220}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="probability" name="Risk Probability" tick={{ fill: '#8B98A8', fontSize: 11 }} label={{ value: 'Risk Probability', position: 'insideBottom', fill: '#4A5568', fontSize: 11 }} />
                  <YAxis dataKey="impact" name="Impact" tick={{ fill: '#8B98A8', fontSize: 11 }} label={{ value: 'Impact', angle: -90, position: 'insideLeft', fill: '#4A5568', fontSize: 11 }} />
                  <ZAxis range={[60, 120]} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const d = payload[0].payload
                        return (
                          <div className="card-elevated px-3 py-2 text-[12px]">
                            <p className="text-ink-DEFAULT font-semibold">{d.option_label}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Scatter data={simResults.risk_summary?.risk_matrix || []} fill="#3B82F6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Factors */}
            <div className="card-surface p-5">
              <h3 className="text-[14px] font-semibold text-ink-DEFAULT mb-4">Risk Factors</h3>
              <div className="space-y-3">
                {simResults.risk_summary?.risk_factors?.length > 0 ? (
                  simResults.risk_summary.risk_factors.map((rf, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/3 border border-white/5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-medium text-ink-DEFAULT">{rf.factor}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${RISK_COLORS[rf.severity].bg} ${RISK_COLORS[rf.severity].text}`}>
                          {rf.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[12px] text-ink-faint">{rf.impact_description}</p>
                      <div className="score-bar-track mt-2">
                        <div
                          className="score-bar-fill"
                          style={{
                            width: `${rf.probability * 100}%`,
                            backgroundColor: RISK_COLORS[rf.severity].hex,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle size={24} className="text-risk-low mx-auto mb-2" />
                    <p className="text-[13px] text-ink-muted">No significant risk factors identified</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div className="card-surface p-5">
            <h3 className="text-[14px] font-semibold text-ink-DEFAULT mb-2">Simulation Methodology</h3>
            <p className="text-[13px] text-ink-muted leading-relaxed">{simResults.methodology_notes}</p>
            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
              {[
                { label: 'Variables', value: simResults.simulation_metadata?.variables_used },
                { label: 'Options', value: simResults.simulation_metadata?.options_compared },
                { label: 'Total Weight', value: `${simResults.simulation_metadata?.total_weight}%` },
                { label: 'Duration', value: `${simResults.simulation_metadata?.simulation_duration_ms}ms` },
              ].map(m => (
                <div key={m.label}>
                  <div className="text-[11px] text-ink-faint">{m.label}</div>
                  <div className="text-[14px] font-semibold text-ink-DEFAULT mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
