'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Target, Users, ArrowRight, MessageCircle } from 'lucide-react'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

const VALUES = [
  {
    icon: Target,
    title: 'Precision over Intuition',
    body: 'Instinct is for the lunch menu. For high-stakes decisions, we believe in mathematical modelling, weighted variables, and structured evidence.',
    accent: '#3B82F6',
  },
  {
    icon: Shield,
    title: 'Transparency as Standard',
    body: 'The "why" behind a decision should never be a black box. Our models are reproducible, shareable, and fundamentally logical.',
    accent: '#0EA5A4',
  },
  {
    icon: Users,
    title: 'Human Authority',
    body: 'STRATIQ does not decide for you. It provides the structured intelligence for you to act with absolute confidence and accountability.',
    accent: '#8B5CF6',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <MarketingNav />

      <div className="pt-32 pb-24 px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <span className="text-[12px] font-semibold tracking-[0.15em] text-stratiq-blue uppercase">Our Story</span>
          <h1 className="text-[52px] md:text-[64px] font-display font-bold mt-4 mb-6 leading-[1.1]">
            Uncertainty shouldn&apos;t be an obstacle.
          </h1>
          <p className="text-[18px] text-ink-muted leading-relaxed">
            STRATIQ was built on a simple principle: Better decisions come from better structure. 
            We are redefining how organisations approach high-stakes choices.
          </p>
        </motion.div>

        {/* Philosophy */}
        <div className="max-w-6xl mx-auto mb-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-[32px] md:text-[42px] font-display font-bold text-ink-DEFAULT leading-[1.2]">
              Instinct is the enemy of strategy.
            </h2>
            <div className="h-1 w-20 bg-stratiq-blue rounded-full mb-8" />
            <p className="text-[16px] text-ink-muted leading-relaxed">
              In most businesses, the most important decisions are still made by the &quot;Highest Paid Person Opinion&quot; or by flawed human intuition that is clouded by recency bias and emotional attachment.
            </p>
            <p className="text-[16px] text-ink-muted leading-relaxed">
              STRATIQ was founded to bridge the gap between complex choices and clear outcomes. We provide the tools for leaders to model their thinking, simulate scenarios, and defend their conclusions with hard evidence.
            </p>
          </motion.div>
          <div className="card-surface p-12 aspect-square flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="w-16 h-16 rounded-3xl bg-stratiq-blue/10 flex items-center justify-center animate-bounce duration-[3000ms] relative z-10">
               <Target size={40} className="text-stratiq-blue" />
            </div>
            {/* Geometric layers */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-white/5 rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 border border-white/5 rounded-full" />
          </div>
        </div>

        {/* Values */}
        <div className="max-w-6xl mx-auto mb-32">
          <h3 className="text-[11px] font-bold tracking-widest text-ink-faint uppercase mb-16 text-center">The STRATIQ DNA</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-surface p-8 group h-full"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${val.accent}15` }}
                >
                  <val.icon size={24} style={{ color: val.accent }} />
                </div>
                <h4 className="text-[20px] font-display font-bold text-ink-DEFAULT mb-4">
                  {val.title}
                </h4>
                <p className="text-[14px] text-ink-muted leading-relaxed">
                  {val.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team/Vision CTA */}
        <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="card-surface p-12 bg-gradient-to-tr from-stratiq-teal/5 via-transparent to-transparent"
            >
                <h3 className="text-[28px] font-display font-bold mb-4 text-ink-DEFAULT leading-snug">
                   Building the future of executive intelligence.
                </h3>
                <p className="text-[15px] text-ink-muted mb-8 max-w-xl mx-auto">
                    We&apos;re always looking for brilliant minds at the intersection of psychology, mathematics, and product design.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact" className="btn-primary px-8 py-3.5 text-[14px] font-bold inline-flex">
                    Contact Us <MessageCircle size={15} className="ml-2" />
                  </Link>
                  <Link href="/dashboard" className="btn-secondary px-8 py-3.5 text-[14px] font-bold inline-flex">
                    Join the Platform <ArrowRight size={15} className="ml-2" />
                  </Link>
                </div>
            </motion.div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
