'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Minus, ArrowRight } from 'lucide-react'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import { cn } from '@/utils'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For individuals exploring structured decision-making.',
    monthlyPrice: 0,
    annualPrice: 0,
    cta: 'Get Started Free',
    href: '/auth/signup',
    featured: false,
    features: [
      { label: 'Up to 5 active decisions', included: true },
      { label: '20 simulations per month', included: true },
      { label: 'Basic scenario simulation', included: true },
      { label: 'Variable weighting system', included: true },
      { label: 'PDF export', included: false },
      { label: 'Team collaboration', included: false },
      { label: 'Priority support', included: false },
      { label: 'Custom variables', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'For professionals with high-frequency decision workloads.',
    monthlyPrice: 49,
    annualPrice: 39,
    cta: 'Start Professional',
    href: '/auth/signup?plan=professional',
    featured: true,
    features: [
      { label: 'Up to 50 active decisions', included: true },
      { label: '200 simulations per month', included: true },
      { label: 'Full simulation engine', included: true },
      { label: 'Variable weighting system', included: true },
      { label: 'PDF report export', included: true },
      { label: 'Up to 5 team members', included: true },
      { label: 'Priority email support', included: true },
      { label: 'Custom variables', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For organisations requiring full capability and custom solutions.',
    monthlyPrice: null,
    annualPrice: null,
    customPricing: true,
    cta: 'Contact Sales',
    href: '/contact?inquiry=enterprise',
    featured: false,
    features: [
      { label: 'Unlimited decisions', included: true },
      { label: 'Unlimited simulations', included: true },
      { label: 'Full simulation engine', included: true },
      { label: 'Variable weighting system', included: true },
      { label: 'PDF report export', included: true },
      { label: 'Unlimited team members', included: true },
      { label: 'Dedicated account support', included: true },
      { label: 'Custom integrations & SSO', included: true },
    ],
  },
]

const COMPARISON_FEATURES = [
  { feature: 'Active Decisions', starter: '5', professional: '50', enterprise: 'Unlimited' },
  { feature: 'Monthly Simulations', starter: '20', professional: '200', enterprise: 'Unlimited' },
  { feature: 'Simulation Engine', starter: 'Basic', professional: 'Full', enterprise: 'Full + Custom' },
  { feature: 'Team Members', starter: '1', professional: '5', enterprise: 'Unlimited' },
  { feature: 'PDF Reports', starter: false, professional: true, enterprise: true },
  { feature: 'Custom Variables', starter: false, professional: true, enterprise: true },
  { feature: 'API Access', starter: false, professional: false, enterprise: true },
  { feature: 'SSO / SAML', starter: false, professional: false, enterprise: true },
  { feature: 'SLA Agreement', starter: false, professional: false, enterprise: true },
  { feature: 'Dedicated Support', starter: false, professional: 'Email', enterprise: 'Dedicated' },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)

  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <MarketingNav />

      <div className="pt-24 pb-32 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-[12px] font-semibold tracking-[0.15em] text-stratiq-blue uppercase">
            Pricing
          </span>
          <h1 className="text-[48px] md:text-[60px] font-display font-bold mt-3 mb-4">
            Simple, transparent pricing.
          </h1>
          <p className="text-[17px] text-ink-muted">
            Start free. Scale as your decision workload grows.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={cn('text-[14px]', !annual ? 'text-ink-DEFAULT' : 'text-ink-faint')}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors duration-300',
                annual ? 'bg-stratiq-blue' : 'bg-white/10'
              )}
              aria-label="Toggle annual billing"
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300',
                  annual ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
            <span className={cn('text-[14px]', annual ? 'text-ink-DEFAULT' : 'text-ink-faint')}>
              Annual
              <span className="ml-2 text-[11px] font-semibold text-stratiq-teal bg-stratiq-teal/10 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'relative rounded-2xl p-8 flex flex-col',
                plan.featured
                  ? 'bg-stratiq-blue/10 border-2 border-stratiq-blue/40 shadow-glow-blue'
                  : 'card-surface'
              )}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-stratiq-blue text-white text-[11px] font-bold px-4 py-1 rounded-full tracking-wider uppercase">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-[13px] font-semibold tracking-[0.12em] text-ink-muted uppercase mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 my-3">
                  {plan.customPricing ? (
                    <span className="text-[32px] font-display font-bold text-ink-DEFAULT">Custom</span>
                  ) : (
                    <>
                      <span className="text-[40px] font-display font-bold text-ink-DEFAULT">
                        £{annual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-[14px] text-ink-faint">/mo</span>
                    </>
                  )}
                </div>
                {annual && !plan.customPricing && plan.monthlyPrice! > 0 && (
                  <p className="text-[12px] text-ink-faint">
                    Billed annually (£{plan.annualPrice! * 12}/yr)
                  </p>
                )}
                <p className="text-[13px] text-ink-muted mt-2">{plan.tagline}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f.label} className="flex items-center gap-3">
                    {f.included ? (
                      <Check size={15} className="text-stratiq-teal flex-shrink-0" />
                    ) : (
                      <Minus size={15} className="text-ink-faint flex-shrink-0" />
                    )}
                    <span className={cn('text-[13px]', f.included ? 'text-ink-DEFAULT' : 'text-ink-faint')}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={cn(
                  'flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-[14px] transition-all duration-200 group',
                  plan.featured
                    ? 'btn-primary'
                    : 'btn-secondary'
                )}
              >
                {plan.cta}
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[24px] font-display font-bold text-center mb-8 text-ink-DEFAULT">
            Full comparison
          </h2>
          <div className="card-surface overflow-hidden rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-ink-faint w-1/2">
                    Feature
                  </th>
                  {['Starter', 'Professional', 'Enterprise'].map(plan => (
                    <th key={plan} className="px-4 py-4 text-[13px] font-semibold text-ink-muted text-center">
                      {plan}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      'border-b border-white/5 transition-colors',
                      i % 2 === 0 ? '' : 'bg-white/[0.01]'
                    )}
                  >
                    <td className="px-6 py-3.5 text-[13px] text-ink-muted">{row.feature}</td>
                    {[row.starter, row.professional, row.enterprise].map((val, j) => (
                      <td key={j} className="px-4 py-3.5 text-center">
                        {typeof val === 'boolean' ? (
                          val ? (
                            <Check size={16} className="mx-auto text-stratiq-teal" />
                          ) : (
                            <Minus size={16} className="mx-auto text-ink-faint" />
                          )
                        ) : (
                          <span className="text-[13px] text-ink-DEFAULT">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
