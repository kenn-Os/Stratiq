'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BarChart3, GitBranch, Shield, FileText, ArrowRight, Zap } from 'lucide-react'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

const MODULES = [
  {
    icon: GitBranch,
    title: 'Decision Builder',
    tagline: 'Structured frameworks for complex choices.',
    body: 'Create a decision, define your options, and assign the variables that matter — financial impact, risk exposure, time horizon, strategic alignment. Build a transparent, reproducible model that can be revisited, revised, and shared.',
    accent: '#3B82F6',
  },
  {
    icon: Zap,
    title: 'Scenario Simulation Engine',
    tagline: 'Applied mathematics. Not guesswork.',
    body: 'The simulation engine applies weighted scoring to your options, calculates expected values with risk discounting, generates confidence percentages, and classifies risk levels. Results are structured, transparent, and repeatable.',
    accent: '#0EA5A4',
  },
  {
    icon: Shield,
    title: 'Risk Intelligence',
    tagline: 'Know what you're accepting before you commit.',
    body: 'Every simulation surfaces risk factors, computes a risk matrix, and provides an overall risk classification — Low, Medium, High, or Critical. Understand the shape of your exposure before you move.',
    accent: '#8B5CF6',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    tagline: 'Data that communicates.',
    body: 'Interactive comparison charts, radar plots, risk heatmaps, and score breakdowns. Visual outputs designed for clarity — whether reviewing alone or presenting to a board.',
    accent: '#F59E0B',
  },
  {
    icon: FileText,
    title: 'Executive Reports',
    tagline: 'Export. Present. Act.',
    body: 'Generate professional PDF reports containing your executive summary, option comparison, risk analysis, and scenario outcomes. Designed for stakeholders who need the conclusions, not the workings.',
    accent: '#10B981',
  },
]

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <MarketingNav />

      <div className="pt-28 pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[12px] font-semibold tracking-[0.15em] text-stratiq-blue uppercase">Product</span>
          <h1 className="text-[52px] md:text-[64px] font-display font-bold mt-3 mb-5 leading-tight">
            The operating system for high-stakes decisions.
          </h1>
          <p className="text-[18px] text-ink-muted leading-relaxed">
            STRATIQ is not a productivity tool. It is a structured intelligence platform — 
            built for decisions where the cost of being wrong is significant.
          </p>
        </motion.div>

        {/* Platform philosophy */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {[
            { label: 'It does not guess.', desc: 'Every output is derived from structured inputs and mathematical modelling.' },
            { label: 'It does not motivate.', desc: 'STRATIQ is an analytical engine, not a coaching tool. It calculates.' },
            { label: 'It does not decide.', desc: 'You retain authority. STRATIQ gives you the evidence base to act with confidence.' },
          ].map(p => (
            <div key={p.label} className="card-surface p-6">
              <p className="text-[15px] font-display font-bold text-ink-DEFAULT mb-2">{p.label}</p>
              <p className="text-[13px] text-ink-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Modules */}
        <div className="max-w-5xl mx-auto space-y-4">
          <h2 className="text-[32px] font-display font-bold text-center mb-8">Core Platform Modules</h2>
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card-surface p-6 flex gap-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${mod.accent}15` }}
              >
                <mod.icon size={22} style={{ color: mod.accent }} />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-ink-DEFAULT mb-0.5">{mod.title}</h3>
                <p className="text-[12px] font-medium mb-2" style={{ color: mod.accent }}>{mod.tagline}</p>
                <p className="text-[13px] text-ink-muted leading-relaxed">{mod.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <Link href="/auth/signup" className="btn-primary text-[15px] px-10 py-3.5 inline-flex group">
            Start Free Today
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
