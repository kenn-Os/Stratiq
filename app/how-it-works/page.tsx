'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { GitBranch, Zap, Shield, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

const STEPS = [
  {
    number: '01',
    title: 'Structure the Problem',
    tagline: 'Define your variables.',
    body: 'Break down complex decisions into measurable components. Define your options, set your criteria, and identify the weights that matter most — whether its financial impact, strategic alignment, or risk exposure.',
    icon: GitBranch,
    accent: '#3B82F6',
  },
  {
    number: '02',
    title: 'Assign Probability & Impact',
    tagline: 'Precision over intuition.',
    body: 'Replace "gut feel" with structured ranges. Assign probabilities to different outcomes and quantify the impact of each factor. This creates a data-driven model that can be stress-tested.',
    icon: Shield,
    accent: '#8B5CF6',
  },
  {
    number: '03',
    title: 'Run Simulations',
    tagline: 'See the future before it happens.',
    body: 'The STRATIQ engine runs thousands of scenarios across your model. It applies weighted scoring and risk discounting to calculate the expected value and confidence score for every option.',
    icon: Zap,
    accent: '#0EA5A4',
  },
  {
    number: '04',
    title: 'Decide with Evidence',
    tagline: 'Act with absolute confidence.',
    body: 'Review the visual comparison of your options. See the risk matrix, expected value breakdown, and scenario outcomes. Export board-ready reports and make the call with data as your foundation.',
    icon: BarChart3,
    accent: '#F59E0B',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <MarketingNav />

      <div className="pt-32 pb-24 px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <span className="text-[12px] font-semibold tracking-[0.15em] text-stratiq-blue uppercase">Methodology</span>
          <h1 className="text-[52px] md:text-[64px] font-display font-bold mt-4 mb-6 leading-[1.1]">
            Decision intelligence is a process, not a feeling.
          </h1>
          <p className="text-[18px] text-ink-muted leading-relaxed">
            STRATIQ transforms uncertainty into structured logic. By breaking down high-stakes 
            choices into their component parts, it removes the biases that cloud judgement.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto space-y-32">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Visual Side */}
              <div className="w-full md:w-1/2 relative group">
                <div 
                  className="absolute inset-0 blur-[80px] opacity-20 transition-opacity group-hover:opacity-30" 
                  style={{ backgroundColor: step.accent }}
                />
                <div className="relative card-surface aspect-square flex items-center justify-center border border-white/5 overflow-hidden">
                  <div 
                    className="w-24 h-24 rounded-3xl flex items-center justify-center relative z-10"
                    style={{ background: `${step.accent}15` }}
                  >
                    <step.icon size={48} style={{ color: step.accent }} />
                  </div>
                  {/* Decorative grid */}
                  <div className="absolute inset-0 bg-grid opacity-10" />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2">
                <span className="text-[48px] font-display font-bold text-ink-faint leading-none mb-4 block opacity-20">
                  {step.number}
                </span>
                <h2 className="text-[32px] md:text-[42px] font-display font-bold text-ink-DEFAULT mb-3">
                  {step.title}
                </h2>
                <p className="text-[16px] font-semibold mb-6 tracking-wide" style={{ color: step.accent }}>
                  {step.tagline}
                </p>
                <p className="text-[15px] text-ink-muted leading-relaxed mb-8">
                  {step.body}
                </p>
                <div className="space-y-3">
                  {['Repeatable process', 'Data-driven outputs', 'Board-ready evidence'].map(check => (
                    <div key={check} className="flex items-center gap-3 text-[13px] text-ink-muted font-medium">
                      <CheckCircle2 size={16} className="text-risk-low" />
                      {check}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-surface max-w-4xl mx-auto p-12 bg-gradient-to-br from-stratiq-blue/10 via-transparent to-transparent"
          >
            <h3 className="text-[32px] font-display font-bold mb-4 text-ink-DEFAULT">
              Ready to professionalise your thinking?
            </h3>
            <p className="text-[16px] text-ink-muted mb-8 max-w-xl mx-auto">
              Join the organisations using STRATIQ to navigate uncertainty with logic and precision.
            </p>
            <Link href="/auth/signup" className="btn-primary px-10 py-4 text-[16px] font-bold group">
              Get Started Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
