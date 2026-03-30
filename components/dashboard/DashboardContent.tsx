'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, GitBranch, Zap, TrendingUp, Clock, ArrowUpRight, Plus } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { formatRelativeDate, DECISION_STATUS_COLORS, DECISION_STATUS_LABELS } from '@/utils'
import type { Decision } from '@/types'

interface DashboardContentProps {
  decisions: Decision[]
  totalDecisions: number
  totalSimulations: number
}

const MOCK_RADAR = [
  { subject: 'Financial', A: 80 },
  { subject: 'Strategic', A: 65 },
  { subject: 'Risk', A: 45 },
  { subject: 'Operational', A: 72 },
  { subject: 'Time', A: 58 },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function DashboardContent({
  decisions,
  totalDecisions,
  totalSimulations,
}: DashboardContentProps) {
  const simulatedDecisions = decisions.filter(d => d.status === 'simulated' || d.status === 'decided')
  const avgConfidence = simulatedDecisions.length > 0
    ? Math.round(
        simulatedDecisions.reduce((sum, d) => {
          const result = d.simulation_results?.[0]?.results
          return sum + (result?.confidence_score || 0)
        }, 0) / simulatedDecisions.length
      )
    : 0

  const STATS = [
    {
      label: 'Total Decisions',
      value: totalDecisions.toString(),
      icon: GitBranch,
      change: 'Active workspace',
      color: '#3B82F6',
    },
    {
      label: 'Simulations Run',
      value: totalSimulations.toString(),
      icon: Zap,
      change: 'All time',
      color: '#0EA5A4',
    },
    {
      label: 'Avg Confidence',
      value: avgConfidence > 0 ? `${avgConfidence}%` : '—',
      icon: TrendingUp,
      change: 'Across simulated',
      color: '#10B981',
    },
    {
      label: 'Recent Activity',
      value: decisions.length > 0 ? formatRelativeDate(decisions[0].updated_at) : '—',
      icon: Clock,
      change: 'Last updated',
      color: '#8B5CF6',
    },
  ]

  return (
    <div className="p-6">
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map(stat => (
            <motion.div key={stat.label} variants={item} className="card-surface p-5">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}15` }}
                >
                  <stat.icon size={17} style={{ color: stat.color }} />
                </div>
                <ArrowUpRight size={14} className="text-ink-faint" />
              </div>
              <div className="text-[28px] font-display font-bold text-ink-DEFAULT leading-none mb-1">
                {stat.value}
              </div>
              <div className="text-[12px] font-medium text-ink-DEFAULT mb-0.5">{stat.label}</div>
              <div className="text-[11px] text-ink-faint">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Recent Decisions */}
          <motion.div variants={item} className="xl:col-span-2 card-surface">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-ink-DEFAULT">Recent Decisions</h2>
              <Link href="/decisions" className="text-[12px] text-stratiq-blue flex items-center gap-1 hover:text-stratiq-blue-light transition-colors">
                View all <ArrowRight size={12} />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {decisions.length === 0 ? (
                <div className="p-8 text-center">
                  <GitBranch size={32} className="text-ink-faint mx-auto mb-3" />
                  <p className="text-[14px] text-ink-muted mb-1">No decisions yet</p>
                  <p className="text-[12px] text-ink-faint mb-4">Create your first decision to get started</p>
                  <Link href="/decisions/new" className="btn-primary text-[13px] py-2 px-5 inline-flex">
                    <Plus size={14} />
                    New Decision
                  </Link>
                </div>
              ) : (
                decisions.slice(0, 6).map(decision => {
                  const latestResult = decision.simulation_results?.[0]?.results
                  return (
                    <Link
                      key={decision.id}
                      href={`/decisions/${decision.id}`}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-ink-DEFAULT truncate group-hover:text-stratiq-blue-light transition-colors">
                          {decision.title}
                        </p>
                        <p className="text-[11px] text-ink-faint mt-0.5">
                          {formatRelativeDate(decision.updated_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        {latestResult?.confidence_score && (
                          <div className="text-right">
                            <div className="text-[12px] font-semibold text-stratiq-blue">
                              {latestResult.confidence_score}%
                            </div>
                            <div className="text-[10px] text-ink-faint">confidence</div>
                          </div>
                        )}
                        <span className={`text-[11px] font-medium ${DECISION_STATUS_COLORS[decision.status]}`}>
                          {DECISION_STATUS_LABELS[decision.status]}
                        </span>
                        <ArrowRight size={14} className="text-ink-faint group-hover:text-ink-muted transition-colors" />
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          </motion.div>

          {/* Variable Performance Radar */}
          <motion.div variants={item} className="card-surface">
            <div className="px-5 py-4 border-b border-white/5">
              <h2 className="text-[14px] font-semibold text-ink-DEFAULT">Variable Performance</h2>
              <p className="text-[11px] text-ink-faint mt-0.5">Average across simulations</p>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={MOCK_RADAR}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#4A5568', fontSize: 11, fontFamily: 'DM Sans' }}
                  />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick actions */}
            <div className="px-5 pb-4 space-y-2">
              <Link href="/decisions/new" className="flex items-center gap-2 p-3 rounded-lg bg-stratiq-blue/8 border border-stratiq-blue/15 hover:bg-stratiq-blue/12 transition-colors group">
                <Plus size={14} className="text-stratiq-blue" />
                <span className="text-[13px] text-stratiq-blue-light font-medium">New Decision</span>
              </Link>
              <Link href="/simulate" className="flex items-center gap-2 p-3 rounded-lg bg-white/3 border border-white/6 hover:bg-white/5 transition-colors">
                <Zap size={14} className="text-stratiq-teal" />
                <span className="text-[13px] text-ink-muted font-medium">Run Simulation</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Status Bar */}
        {decisions.length > 0 && (
          <motion.div variants={item} className="card-surface p-5">
            <h3 className="text-[13px] font-semibold text-ink-DEFAULT mb-4">Decision Status Overview</h3>
            <div className="grid grid-cols-5 gap-4">
              {(['draft', 'in_progress', 'simulated', 'decided', 'archived'] as const).map(status => {
                const count = decisions.filter(d => d.status === status).length
                const pct = decisions.length > 0 ? (count / decisions.length) * 100 : 0
                return (
                  <div key={status}>
                    <div className="score-bar-track mb-2">
                      <div
                        className="score-bar-fill bg-stratiq-blue"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className={`text-[11px] font-medium ${DECISION_STATUS_COLORS[status]}`}>
                      {DECISION_STATUS_LABELS[status]}
                    </div>
                    <div className="text-[11px] text-ink-faint">{count}</div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  )
}
