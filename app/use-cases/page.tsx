'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Briefcase, TrendingUp, ShieldCheck, Zap, ArrowRight, BarChart3 } from 'lucide-react'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

const USE_CASES = [
  {
    icon: Briefcase,
    title: 'Venture Capital & Private Equity',
    tagline: 'Precision deal evaluation.',
    body: 'Model potential investments based on market size, team strength, and exit multiples. Run simulations to see the distribution of potential returns and identify the key risks that could break the investment thesis.',
    metric: '12% Increase in IRR Accuracy',
    accent: '#3B82F6',
  },
  {
    icon: BarChart3,
    title: 'Product Strategy & Roadmap',
    tagline: 'Prioritisation by value and risk.',
    body: 'Moving beyond "Highest Paid Person Opinion" (HiPPO). Weigh features by expected impact, development complexity, and market risk. Create a roadmap backed by mathematical certainty.',
    metric: '32.1% Faster Roadmapping',
    accent: '#0EA5A4',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Risk & Compliance',
    tagline: 'Quantified exposure mapping.',
    body: 'Stop treating risk as a checklist. Map out potential regulatory, legal, and operational risks as probability-based variables. See the financial impact of every risk before it manifests.',
    metric: '48% Reduction in Surplus Risk',
    accent: '#8B5CF6',
  },
  {
    icon: TrendingUp,
    title: 'Market Expansion & M&A',
    tagline: 'Strategic growth modeling.',
    body: 'Simulate new market entries or potential acquisitions. Factor in competitor response, regulatory hurdles, and currency fluctuations. Know which move is statistically superior.',
    metric: '94% Confidence in Entry Strategy',
    accent: '#F59E0B',
  },
]

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <MarketingNav />

      <div className="pt-32 pb-24 px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <span className="text-[12px] font-semibold tracking-[0.15em] text-stratiq-blue uppercase">Applications</span>
          <h1 className="text-[52px] md:text-[64px] font-display font-bold mt-4 mb-6 leading-[1.1]">
            Decisions that matter deserve better logic.
          </h1>
          <p className="text-[18px] text-ink-muted leading-relaxed">
            From deal evaluation to enterprise risk management, STRATIQ provides the 
            evidence base for high-stakes leadership across every sector.
          </p>
        </motion.div>

        {/* Feature Case */}
        <div className="max-w-6xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-surface p-12 bg-gradient-to-br from-stratiq-blue/10 via-transparent to-transparent border-white/5 relative overflow-hidden group"
          >
             <div className="md:flex gap-16 items-center">
                <div className="md:w-3/5">
                  <span className="text-[11px] font-bold tracking-widest text-stratiq-blue uppercase mb-6 block">Featured Application</span>
                  <h2 className="text-[32px] md:text-[42px] font-display font-bold mb-6">Strategic Capital Allocation</h2>
                  <p className="text-[16px] text-ink-muted leading-relaxed mb-8">
                    Stop allocating capital based on the most persuasive presentation. STRATIQ empowers CEOs and boards to model competing projects, acquisitions, and expansions as a mathematical portfolio. Evaluate the expected value, the risk-adjusted return, and the strategic alignment of every pound spent.
                  </p>
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <div className="text-[28px] font-display font-bold text-ink-DEFAULT">94%</div>
                      <div className="text-[12px] text-ink-faint uppercase font-semibold">Modeling Accuracy</div>
                    </div>
                    <div className="w-px h-12 bg-white/10 hidden sm:block" />
                    <div>
                      <div className="text-[28px] font-display font-bold text-ink-DEFAULT">£400M+</div>
                      <div className="text-[12px] text-ink-faint uppercase font-semibold">Capital Optimized</div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex md:w-2/5 justify-center">
                  <div className="w-32 h-32 rounded-3xl bg-stratiq-blue/10 flex items-center justify-center animate-pulse">
                    <TrendingUp size={64} className="text-stratiq-blue" />
                  </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Use Case Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {USE_CASES.map((useCase, i) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-surface p-8 group hover:border-white/10 transition-colors"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `${useCase.accent}15` }}
              >
                <useCase.icon size={24} style={{ color: useCase.accent }} />
              </div>
              <h3 className="text-[22px] font-display font-bold text-ink-DEFAULT mb-3">
                {useCase.title}
              </h3>
              <p className="text-[14px] font-semibold mb-4 tracking-wide" style={{ color: useCase.accent }}>
                {useCase.tagline}
              </p>
              <p className="text-[14px] text-ink-muted leading-relaxed mb-6">
                {useCase.body}
              </p>
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-[12px] font-bold text-ink-DEFAULT flex items-center gap-2">
                   <Zap size={14} className="text-risk-low" /> {useCase.metric}
                </span>
                <Link href="/dashboard" className="text-[11px] font-bold text-ink-muted group-hover:text-ink-DEFAULT flex items-center gap-1 uppercase tracking-widest">
                  View Case Study <ArrowRight size={11} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sector Footer */}
        <div className="mt-32 text-center pb-12">
            <h4 className="text-[11px] font-bold tracking-widest text-ink-faint uppercase mb-8">Trusted by decision-makers in</h4>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-40 grayscale pointer-events-none">
                <span className="text-[15px] font-display font-bold text-ink-DEFAULT">Public Equities</span>
                <span className="text-[15px] font-display font-bold text-ink-DEFAULT">SaaS & Enterprise</span>
                <span className="text-[15px] font-display font-bold text-ink-DEFAULT">Energy & Infrastructure</span>
                <span className="text-[15px] font-display font-bold text-ink-DEFAULT">Global Logistics</span>
            </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
