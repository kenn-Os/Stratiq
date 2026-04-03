'use client'

import { motion } from 'framer-motion'
import { Landmark, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export default function DPAPage() {
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
                  <Landmark size={20} className="text-stratiq-blue" />
               </div>
               <h1 className="text-[32px] md:text-[42px] font-display font-bold text-ink-DEFAULT">
                 Data Processing Addendum
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
               This Data Processing Addendum (&quot;DPA&quot;) forms part of the Terms of Service between STRATIQ and its customers. It outlines our commitment to data protection and compliance with applicable data privacy laws, including the GDPR.
            </p>

            <h2>1. Object of the Agreement</h2>
            <p>
              STRATIQ acts as a data processor for personal data provided by the customer (&quot;Data Controller&quot;) during the use of our decision intelligence platform. We process personal data only on documented instructions from the customer and in accordance with these terms.
            </p>

            <h2>2. Processing Details</h2>
            <p>
              The processing of personal data includes:
            </p>
            <ul className="text-ink-muted text-[15px] space-y-2 list-disc pl-6">
              <li><strong>Subject:</strong> Providing the STRATIQ platform and its simulation engine.</li>
              <li><strong>Duration:</strong> The term of the customer&apos;s subscription.</li>
              <li><strong>Nature:</strong> Storing, analyzing, and reporting on customer-provided decision data.</li>
            </ul>

            <h2>3. Technical & Organizational Measures</h2>
            <p>
              STRATIQ implements rigorous security measures to protect personal data from unauthorized access, accidental loss, or destruction. These measures include:
            </p>
            <ul className="text-ink-muted text-[15px] space-y-2 list-disc pl-6">
              <li>End-to-end encryption for all data in transit.</li>
              <li>Regular security audits and vulnerability scanning.</li>
              <li>Strict access control policies for all internal systems.</li>
            </ul>

            <h2>4. Sub-Processors</h2>
            <p>
              By using STRATIQ, you authorize the use of sub-processors necessary for the platform to function. We maintain a list of all sub-processors and ensure they adhere to data protection standards equivalent to our own.
            </p>

            <h2>5. Data Transmission</h2>
            <p>
              Personal data may be transferred to and processed in countries outside of your own. We ensure that any such transfers comply with legal frameworks like the EU-US Data Privacy Framework or Standard Contractual Clauses.
            </p>

            <h2>6. Audits and Compliance</h2>
            <p>
               We agree to provide the customer with all information necessary to demonstrate compliance with this DPA and to allow for and contribute to audits conducted by the customer or another auditor mandated by the customer.
            </p>

            <h2>7. Contact</h2>
            <p>
              For any questions regarding our DPA or data processing activities, please reach out to our legal team at <strong>legal@stratiq.ai</strong>.
            </p>
          </motion.div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
