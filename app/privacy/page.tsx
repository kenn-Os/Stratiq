'use client'

import { motion } from 'framer-motion'
import { Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export default function PrivacyPage() {
  const lastUpdated = 'April 03, 2026'

  return (
    <div className="min-h-screen bg-charcoal-DEFAULT text-ink-DEFAULT selection:bg-stratiq-blue/30">
      <MarketingNav />

      <div className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-stratiq-blue/5 to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link href="/" className="text-stratiq-blue hover:text-stratiq-blue-light flex items-center gap-2 text-[13px] font-bold mb-8 transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                  <Shield size={24} className="text-stratiq-blue" />
               </div>
               <h1 className="text-[32px] md:text-[42px] font-display font-bold tracking-tight">
                 Privacy Policy
               </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              <p className="text-[11px] text-ink-faint font-mono tracking-widest uppercase">
                 LAST UPDATED: {lastUpdated}
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="prose prose-invert prose-brand max-w-none prose-h2:font-display prose-h2:text-[24px] prose-h2:mt-12 prose-h2:mb-6 prose-p:text-ink-muted prose-p:text-[16px] prose-p:leading-relaxed prose-li:text-ink-muted prose-li:text-[16px]"
          >
            <p className="text-lg text-ink-DEFAULT !leading-relaxed mb-10">
              At STRATIQ, your privacy is a foundational principle of our decision intelligence platform. We are committed to protecting your strategic assets and personal information through engineering excellence.
            </p>

            <h2>1. Data Principles</h2>
            <p>
              We believe your data belongs to you. In this standalone prototype version of STRATIQ, all data modelling occurs locally and is not persisted to any external database.
            </p>
            <ul>
              <li><strong>Privacy by Design:</strong> Decision frameworks are architected for isolation.</li>
              <li><strong>Minimisation:</strong> We only process data essential for simulation accuracy.</li>
              <li><strong>Control:</strong> You maintain full ownership of all decision models and inputs.</li>
            </ul>

            <h2>2. Information Processing</h2>
            <p>
              The platform processes the following categories of information to perform decision simulations:
            </p>
            <ul>
              <li><strong>Decision Context:</strong> Titles, descriptions, and background logic.</li>
              <li><strong>Variables & Weights:</strong> Factors used to calculate weighted outcomes.</li>
              <li><strong>Option Comparisons:</strong> Values assigned to different strategic paths.</li>
            </ul>

            <h2>3. Security Standards</h2>
            <p>
              We implement industry-leading security measures to protect your intellectual property. All data transmission is encrypted using TLS 1.3, and our architecture is designed to prevent unauthorised access to your decision models.
            </p>

            <h2>4. Third-Party Integration</h2>
            <p>
              STRATIQ is built as a modular system. While this prototype currently operates without external dependencies, future production environments may utilise SOC 2 compliant infrastructure providers for secure data storage and processing.
            </p>

            <h2>5. Your Rights & Data Portability</h2>
            <p>
              You have the right to access, rectify, or delete your data at any time. Our reports interface allows you to export your decision intelligence into portable, executive-grade formats for use outside the platform.
            </p>

            <h2>6. Contact & Compliance</h2>
            <p>
              For enquiries regarding our privacy practices or data handling, please contact our privacy office at <strong className="text-stratiq-blue">privacy@stratiq.ai</strong>.
            </p>
          </motion.div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
