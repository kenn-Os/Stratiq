'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Server, Eye, Key, CheckCircle } from 'lucide-react'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: 'Data Isolation',
    body: 'In this standalone prototype, all decision frameworks are processed locally. Your strategic data never leaves your environment, ensuring absolute privacy by design.',
  },
  {
    icon: Key,
    title: 'Encrypted Communications',
    body: 'All platform interactions are protected with TLS 1.3 encryption. We prioritise secure transmission protocols to safeguard your decision intelligence in transit.',
  },
  {
    icon: Shield,
    title: 'Security Foundations',
    body: 'STRATIQ is architected with security as a first-class concern. Our modular design allows for rapid deployment behind enterprise-grade firewalls and VPNs.',
  },
  {
    icon: Server,
    title: 'Infrastructure Integrity',
    body: 'Future production environments will utilise SOC 2 Type II compliant infrastructure with automated backups and point-in-time recovery to ensure 99.9% availability.',
  },
  {
    icon: Eye,
    title: 'Intellectual Property Protection',
    body: 'Your decision models are your unique competitive advantage. STRATIQ does not store, share, or analyse your private decision logic for any internal purpose.',
  },
  {
    icon: CheckCircle,
    title: 'Verified Inputs',
    body: 'All scenario inputs are subject to strict sanitisation and validation logic. Our simulation engine is built to handle complex datasets while maintaining system integrity.',
  },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <MarketingNav />

      <div className="pt-28 pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="w-16 h-16 rounded-2xl bg-stratiq-teal/10 border border-stratiq-teal/20 flex items-center justify-center mx-auto mb-6">
            <Shield size={28} className="text-stratiq-teal" />
          </div>
          <span className="text-[12px] font-semibold tracking-[0.15em] text-stratiq-teal uppercase">Security</span>
          <h1 className="text-[48px] font-display font-bold mt-3 mb-4">
            Enterprise-grade security foundations.
          </h1>
          <p className="text-[17px] text-ink-muted">
            Decision intelligence requires data trust. Every layer of STRATIQ is built with security as a first-class concern.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECURITY_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-surface p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-stratiq-teal/10 flex items-center justify-center mb-4">
                <feature.icon size={18} className="text-stratiq-teal" />
              </div>
              <h3 className="text-[15px] font-semibold text-ink-DEFAULT mb-2">{feature.title}</h3>
              <p className="text-[13px] text-ink-muted leading-relaxed">{feature.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-12 p-6 card-surface text-center">
          <p className="text-[14px] text-ink-muted">
            For enterprise security questionnaires, compliance documentation, or DPA enquiries, 
            please contact <a href="mailto:security@stratiq.io" className="text-stratiq-blue hover:underline">security@stratiq.io</a>.
          </p>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
