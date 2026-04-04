'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BarChart3, Shield, Zap, ChevronRight, TrendingUp, Target, Brain } from 'lucide-react'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

// ── Animation Variants ──────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

// ── Hero Stats ──────────────────────────────────────────────
const STATS = [
  { value: '94%', label: 'Decision accuracy improvement' },
  { value: '3.2×', label: 'Faster consensus in teams' },
  { value: '60%', label: 'Reduction in analysis time' },
  { value: '12k+', label: 'Decisions modelled' },
]

// ── Core Features ───────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    title: 'Structured Decision Modelling',
    description: 'Define variables, assign weights, and compare options with mathematical precision. No guesswork. No gut feel.',
    accent: '#3B82F6',
  },
  {
    icon: TrendingUp,
    title: 'Scenario Simulation Engine',
    description: 'Run weighted simulations that calculate expected values, risk scores, and confidence percentages for each option.',
    accent: '#0EA5A4',
  },
  {
    icon: Shield,
    title: 'Risk Intelligence',
    description: 'Identify risk factors, model impact scenarios, and understand your exposure before you commit.',
    accent: '#8B5CF6',
  },
  {
    icon: Target,
    title: 'Executive Reports',
    description: 'Generate professional PDF reports with decision summaries, scenario comparisons, and risk analysis.',
    accent: '#F59E0B',
  },
  {
    icon: Zap,
    title: 'Real-Time Collaboration',
    description: 'Professional and Enterprise teams can model decisions together with shared access and role-based controls.',
    accent: '#10B981',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Risk heatmaps, score comparison charts, and interactive scenario views built for clear communication.',
    accent: '#EC4899',
  },
]

// ── How It Works Steps ──────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Define the Decision',
    description: 'Name your decision, set context, and establish the criteria that matter most.',
  },
  {
    step: '02',
    title: 'Model Your Options',
    description: 'Add competing options and assign weighted variables — cost, risk, return, time horizon, strategic fit.',
  },
  {
    step: '03',
    title: 'Run the Simulation',
    description: 'The engine calculates weighted scores, expected values, and risk classifications for each option.',
  },
  {
    step: '04',
    title: 'Act With Confidence',
    description: 'Export an executive report. Present the analysis. Decide with structured evidence behind you.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-charcoal-DEFAULT overflow-hidden">
      <MarketingNav />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-stratiq-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-2/3 left-1/3 w-[400px] h-[400px] rounded-full bg-stratiq-teal/5 blur-[100px] pointer-events-none" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stratiq-blue/10 border border-stratiq-blue/20 text-stratiq-blue-light text-[12px] font-semibold tracking-[0.1em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-stratiq-blue animate-pulse" />
              Decision Intelligence Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[56px] md:text-[72px] lg:text-[84px] font-display font-bold leading-[1.05] tracking-tight mb-6"
          >
            Make Critical Decisions
            <br />
            <span className="gradient-text-blue">With Precision.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp}
            className="text-[18px] md:text-[20px] text-ink-muted max-w-2xl mx-auto leading-relaxed mb-10"
          >
            STRATIQ is the operating system for high-stakes decisions. Model scenarios, 
            simulate outcomes, and act with structured confidence — not instinct.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/dashboard" className="btn-primary text-[15px] px-8 py-3.5 group">
              Start Modelling Free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/how-it-works" className="btn-secondary text-[15px] px-8 py-3.5">
              See How It Works
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {STATS.map(stat => (
              <div key={stat.value} className="text-center">
                <div className="text-[28px] md:text-[34px] font-display font-bold text-ink-DEFAULT mb-1">
                  {stat.value}
                </div>
                <div className="text-[12px] text-ink-muted leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Dashboard Preview ────────────────────────────── */}
      <section className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto"
        >
          <div className="relative rounded-2xl border border-white/8 overflow-hidden shadow-glass-lg">
            {/* Window Chrome */}
            <div className="bg-graphite px-5 py-3.5 flex items-center gap-2 border-b border-white/5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-4 text-[12px] text-ink-faint font-mono">
                app.stratiq.io/dashboard
              </span>
            </div>

            {/* Simulated Dashboard */}
            <div className="bg-charcoal-DEFAULT p-6 min-h-[400px]">
              <div className="grid grid-cols-12 gap-4">
                {/* Sidebar */}
                <div className="col-span-2 hidden lg:block space-y-1">
                  {['Dashboard', 'Decisions', 'Simulate', 'Reports', 'Account'].map((item, i) => (
                    <div
                      key={item}
                      className={`px-3 py-2 rounded-lg text-[12px] font-medium ${
                        i === 0
                          ? 'bg-stratiq-blue/10 text-stratiq-blue-light border-l-2 border-stratiq-blue'
                          : 'text-ink-faint hover:text-ink-muted'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Main Content */}
                <div className="col-span-12 lg:col-span-10 space-y-4">
                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Active Decisions', value: '7', change: '+2' },
                      { label: 'Avg Confidence', value: '84%', change: '+6%' },
                      { label: 'Risk Score', value: 'LOW', change: '↓' },
                    ].map(metric => (
                      <div key={metric.label} className="card-surface p-4">
                        <div className="text-[11px] text-ink-faint mb-2">{metric.label}</div>
                        <div className="text-[22px] font-display font-bold text-ink-DEFAULT">{metric.value}</div>
                        <div className="text-[11px] text-risk-low mt-1">{metric.change}</div>
                      </div>
                    ))}
                  </div>

                  {/* Decision Cards */}
                  <div className="space-y-2">
                    {[
                      { title: 'Series A Investment – Route to Market', status: 'Simulated', confidence: 78, risk: 'MEDIUM' },
                      { title: 'Office Expansion – London vs Manchester', status: 'In Progress', confidence: 62, risk: 'LOW' },
                      { title: 'Technology Stack Migration', status: 'Draft', confidence: null, risk: null },
                    ].map(decision => (
                      <div key={decision.title} className="card-surface px-4 py-3 flex items-center justify-between">
                        <div>
                          <div className="text-[13px] font-medium text-ink-DEFAULT">{decision.title}</div>
                          <div className="text-[11px] text-ink-faint mt-0.5">{decision.status}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {decision.confidence && (
                            <div className="text-right">
                              <div className="text-[11px] text-ink-faint">Confidence</div>
                              <div className="text-[14px] font-semibold text-stratiq-blue">{decision.confidence}%</div>
                            </div>
                          )}
                          {decision.risk && (
                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                              decision.risk === 'LOW' ? 'bg-risk-low/10 text-risk-low' : 'bg-risk-medium/10 text-risk-medium'
                            }`}>
                              {decision.risk}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features Grid ─────────────────────────────────── */}
      <section className="px-6 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[12px] font-semibold tracking-[0.15em] text-stratiq-blue uppercase">
              Platform Capabilities
            </span>
            <h2 className="text-[40px] md:text-[48px] font-display font-bold mt-3 mb-4">
              Built for serious decisions.
            </h2>
            <p className="text-[17px] text-ink-muted max-w-xl mx-auto">
              Every feature serves one purpose — giving you structured confidence when the stakes are high.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-surface p-6 group hover:border-white/10 transition-all duration-300 border-glow"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${feature.accent}15` }}
                >
                  <feature.icon size={20} style={{ color: feature.accent }} />
                </div>
                <h3 className="text-[15px] font-semibold text-ink-DEFAULT mb-2">{feature.title}</h3>
                <p className="text-[13px] text-ink-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="px-6 py-24 bg-graphite-dark/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[12px] font-semibold tracking-[0.15em] text-stratiq-teal uppercase">
              Process
            </span>
            <h2 className="text-[40px] md:text-[48px] font-display font-bold mt-3 mb-4">
              Four steps to clarity.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-[48px] font-display font-bold text-white/5 mb-3 leading-none">
                  {step.step}
                </div>
                <h3 className="text-[15px] font-semibold text-ink-DEFAULT mb-2">{step.title}</h3>
                <p className="text-[13px] text-ink-muted leading-relaxed">{step.description}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-8 -right-4 text-white/10" size={20} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────── */}
      <section className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="relative rounded-2xl overflow-hidden p-12 border border-white/8">
            <div className="absolute inset-0 bg-gradient-radial from-stratiq-blue/10 via-transparent to-transparent" />
            <div className="relative z-10">
              <h2 className="text-[36px] md:text-[44px] font-display font-bold mb-4">
                STRATIQ does not guess.
                <br />
                <span className="gradient-text-blue">It calculates.</span>
              </h2>
              <p className="text-[16px] text-ink-muted mb-8 max-w-lg mx-auto">
                Join professionals and enterprises who model decisions with precision.
              </p>
              <Link href="/dashboard" className="btn-primary text-[15px] px-10 py-3.5 inline-flex group">
                Get Started Free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-[12px] text-ink-faint mt-4">
                No credit card required · Starter plan free forever
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <MarketingFooter />
    </div>
  )
}
