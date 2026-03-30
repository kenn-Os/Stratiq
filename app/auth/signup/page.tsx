'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, Check, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const STRENGTH_CHECKS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Number', test: (p: string) => /\d/.test(p) },
]

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-charcoal-DEFAULT flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-stratiq-teal/10 border border-stratiq-teal/20 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-stratiq-teal" />
          </div>
          <h2 className="text-[24px] font-display font-bold text-ink-DEFAULT mb-2">
            Check your inbox.
          </h2>
          <p className="text-[14px] text-ink-muted mb-6">
            We sent a confirmation link to <strong className="text-ink-DEFAULT">{email}</strong>. 
            Click it to activate your STRATIQ account.
          </p>
          <Link href="/auth/login" className="btn-secondary text-[14px] inline-flex">
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-charcoal-DEFAULT flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-stratiq-teal/5 rounded-full blur-[100px] pointer-events-none" />

        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="13" height="13" rx="2" fill="#3B82F6" opacity="0.9"/>
              <rect x="17" y="2" width="13" height="13" rx="2" fill="#3B82F6" opacity="0.4"/>
              <rect x="2" y="17" width="13" height="13" rx="2" fill="#3B82F6" opacity="0.4"/>
              <rect x="17" y="17" width="13" height="13" rx="2" fill="#0EA5A4" opacity="0.9"/>
            </svg>
          </div>
          <span className="font-display font-bold text-[14px] tracking-[0.25em] text-ink-DEFAULT uppercase">
            STRATIQ
          </span>
        </Link>

        <div className="relative z-10 space-y-6">
          {[
            'Model high-stakes decisions with structured precision.',
            'Run weighted scenario simulations in minutes.',
            'Generate executive-grade decision reports.',
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-stratiq-teal/20 border border-stratiq-teal/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={11} className="text-stratiq-teal" />
              </div>
              <p className="text-[15px] text-ink-muted leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <p className="text-[12px] text-ink-faint font-mono tracking-wider relative z-10">
          DECIDE WITH PRECISION.
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h1 className="text-[28px] font-display font-bold text-ink-DEFAULT mb-1">
            Create your account.
          </h1>
          <p className="text-[14px] text-ink-muted mb-8">
            Start modelling decisions for free. No credit card required.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3.5 rounded-lg bg-risk-high/10 border border-risk-high/20 mb-6"
            >
              <AlertCircle size={16} className="text-risk-high flex-shrink-0" />
              <p className="text-[13px] text-risk-high">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-ink-muted mb-1.5 tracking-wider uppercase">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                placeholder="Your full name"
                className="input-dark w-full text-[14px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-ink-muted mb-1.5 tracking-wider uppercase">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="input-dark w-full text-[14px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-ink-muted mb-1.5 tracking-wider uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  className="input-dark w-full text-[14px] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {password && (
                <div className="mt-2 space-y-1">
                  {STRENGTH_CHECKS.map(check => (
                    <div key={check.label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center ${check.test(password) ? 'bg-risk-low' : 'bg-white/10'}`}>
                        {check.test(password) && <Check size={8} className="text-white" />}
                      </div>
                      <span className={`text-[11px] ${check.test(password) ? 'text-risk-low' : 'text-ink-faint'}`}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Free Account
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <p className="text-[12px] text-ink-faint text-center mt-4">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-stratiq-blue hover:underline">Terms</Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-stratiq-blue hover:underline">Privacy Policy</Link>.
          </p>

          <p className="text-center text-[13px] text-ink-muted mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-stratiq-blue hover:text-stratiq-blue-light transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
