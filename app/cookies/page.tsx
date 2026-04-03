'use client'

import { motion } from 'framer-motion'
import { Cookie, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export default function CookiesPage() {
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
                  <Cookie size={20} className="text-stratiq-blue" />
               </div>
               <h1 className="text-[32px] md:text-[42px] font-display font-bold text-ink-DEFAULT">
                 Cookie Policy
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
              STRATIQ uses cookies and similar tracking technologies to enhance your experience and to analyze how our platform is used.
            </p>

            <h2>1. What are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device that allow us to recognize you and remember your preferences. They can be "session" cookies (deleted when you close your browser) or "persistent" cookies (remain until they expire or are deleted).
            </p>

            <h2>2. Essential Cookies</h2>
            <p>
              These cookies are strictly necessary for the platform to function. They enable core features like authentication, security, and account management. 
            </p>
            <ul className="text-ink-muted text-[15px] space-y-2 list-disc pl-6">
              <li><strong>Session management:</strong> Identifies you while you move between pages.</li>
              <li><strong>Security:</strong> Protects your account from unauthorized access.</li>
              <li><strong>Preferences:</strong> Remembers your language or theme settings.</li>
            </ul>

            <h2>3. Analytical & Performance Cookies</h2>
            <p>
              We use these cookies to understand how users interact with our platform. They help us identify areas for improvement and track the performance of new features. All data collected is aggregated and anonymized.
            </p>

            <h2>4. Third-Party Cookies</h2>
            <p>
              In some cases, our third-party partners (like Flutterwave or SendGrid) may set their own cookies to facilitate their services within our platform. These are governed by their respective cookie policies.
            </p>

            <h2>5. Managing Cookies</h2>
            <p>
              You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies; however, please note that disabling essential cookies may impact the functionality of the STRATIQ platform.
            </p>

            <h2>6. Updates to this Policy</h2>
            <p>
              We may update this policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. 
            </p>
            
            <p>
               For more information, please contact us at <strong>privacy@stratiq.ai</strong>.
            </p>
          </motion.div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
