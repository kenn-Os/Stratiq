'use client'

import { motion } from 'framer-motion'
import { Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export default function PrivacyPage() {
  const lastUpdated = 'April 03, 2026'

  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <MarketingNav />

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link href="/" className="text-stratiq-blue hover:text-stratiq-blue-light flex items-center gap-2 text-[13px] font-bold mb-8 transition-colors">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-10 rounded-xl bg-stratiq-blue/10 flex items-center justify-center">
                  <Shield size={20} className="text-stratiq-blue" />
               </div>
               <h1 className="text-[32px] md:text-[42px] font-display font-bold text-ink-DEFAULT">
                 Privacy Policy
               </h1>
            </div>
            <p className="text-[14px] text-ink-faint font-mono tracking-wider">
               LAST UPDATED: {lastUpdated}
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="prose prose-invert prose-brand max-w-none prose-h2:font-display prose-h2:text-[24px] prose-h2:mt-12 prose-h2:mb-6 prose-p:text-ink-muted prose-p:text-[15px] prose-p:leading-relaxed"
          >
            <p>
              At STRATIQ, your privacy is a foundational principle of our decision intelligence platform. This policy outlines how we collect, use, and protect your data when you use our services.
            </p>

            <h2>1. Data Collection</h2>
            <p>
              We collect information that you provide directly to us when creating an account, modelling decisions, or communicating with our team. This includes:
            </p>
            <ul className="text-ink-muted text-[15px] space-y-2 list-disc pl-6">
              <li>Contact information (email, name, organization).</li>
              <li>Decision models and scenario inputs.</li>
              <li>Subscription and billing information.</li>
            </ul>

            <h2>2. How We Use Your Data</h2>
            <p>
              Your data is primarily used to provide and enhance the STRATIQ platform. This includes:
            </p>
            <ul className="text-ink-muted text-[15px] space-y-2 list-disc pl-6">
              <li>Processing simulations and generating reports.</li>
              <li>Personalizing your workspace experience.</li>
              <li>Sending transactional emails and platform updates.</li>
              <li>Improving our mathematical models and simulation engine.</li>
            </ul>

            <h2>3. Data Security & Encryption</h2>
            <p>
              We implement industry-standard security measures to protect your decision models. All data is encrypted at rest and in transit using TLS 1.3. Our infrastructure is hosted on SOC 2 compliant environmental providers.
            </p>

            <h2>4. Third-Party Services</h2>
            <p>
              We partner with trusted third-party services for essential functions:
            </p>
            <ul className="text-ink-muted text-[15px] space-y-2 list-disc pl-6">
              <li><strong>Supabase:</strong> Database and authentication.</li>
              <li><strong>Flutterwave:</strong> Payment processing.</li>
              <li><strong>SendGrid:</strong> Email delivery.</li>
            </ul>

            <h2>5. Your Rights</h2>
            <p>
              Under GDPR and other international privacy regulations, you have the right to access, rectify, or delete your personal data. You can export your decision models at any time via the Reports interface.
            </p>

            <h2>6. Contact Us</h2>
            <p>
              For any questions regarding this policy or our data practices, please contact our Data Protection Officer at <strong>privacy@stratiq.ai</strong>.
            </p>
          </motion.div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
