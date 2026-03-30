'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle } from 'lucide-react'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export default function ContactPage() {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('loading')
    // In production, post to a form handling service
    await new Promise(r => setTimeout(r, 1200))
    setState('success')
  }

  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <MarketingNav />

      <div className="pt-28 pb-24 px-6">
        <div className="max-w-xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="text-[12px] font-semibold tracking-[0.15em] text-stratiq-blue uppercase">Contact</span>
            <h1 className="text-[44px] font-display font-bold mt-3 mb-3">Get in touch.</h1>
            <p className="text-[16px] text-ink-muted">
              Whether you have a question, an enterprise enquiry, or want to request a demo — reach out.
            </p>
          </motion.div>

          {state === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-surface p-8 text-center"
            >
              <CheckCircle size={40} className="text-risk-low mx-auto mb-4" />
              <h2 className="text-[20px] font-display font-bold text-ink-DEFAULT mb-2">Message received.</h2>
              <p className="text-[14px] text-ink-muted">We'll respond within 1 business day.</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <form onSubmit={handleSubmit} className="card-surface p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1.5">First Name</label>
                    <input required className="input-dark w-full text-[14px]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Last Name</label>
                    <input required className="input-dark w-full text-[14px]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Work Email</label>
                  <input type="email" required className="input-dark w-full text-[14px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Enquiry Type</label>
                  <select className="input-dark w-full text-[14px]">
                    <option>General question</option>
                    <option>Enterprise / Sales</option>
                    <option>Technical support</option>
                    <option>Security / Compliance</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Message</label>
                  <textarea required rows={5} className="input-dark w-full text-[14px] resize-none" />
                </div>
                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className="btn-primary w-full justify-center py-3 text-[15px] disabled:opacity-60"
                >
                  {state === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </span>
                  ) : 'Send Message'}
                </button>
              </form>
            </motion.div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="card-surface p-4 text-center">
              <p className="text-[11px] text-ink-faint mb-1">General</p>
              <a href="mailto:hello@stratiq.io" className="text-[13px] text-stratiq-blue hover:underline">hello@stratiq.io</a>
            </div>
            <div className="card-surface p-4 text-center">
              <p className="text-[11px] text-ink-faint mb-1">Enterprise</p>
              <a href="mailto:enterprise@stratiq.io" className="text-[13px] text-stratiq-blue hover:underline">enterprise@stratiq.io</a>
            </div>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
