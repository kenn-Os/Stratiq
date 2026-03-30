'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirect)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${redirect}` },
    })
  }

  return (
    <div className="min-h-screen bg-charcoal-DEFAULT flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-white/5 bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-stratiq-blue/5 via-transparent to-transparent" />

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

        <div className="relative z-10">
          <blockquote className="text-[28px] font-display font-bold text-ink-DEFAULT leading-tight mb-4">
            "STRATIQ does not eliminate risk. It models it."
          </blockquote>
          <p className="text-[14px] text-ink-muted">
            The operating system for high-stakes decisions.
          </p>
        </div>

        <div className="flex gap-8 relative z-10">
          {[
            { value: '94%', label: 'Accuracy' },
            { value: '12k+', label: 'Decisions' },
            { value: '3.2×', label: 'Faster' },
          ].map(s => (
            <div key={s.value}>
              <div className="text-[22px] font-display font-bold text-ink-DEFAULT">{s.value}</div>
              <div className="text-[12px] text-ink-faint">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-7 h-7">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="13" height="13" rx="2" fill="#3B82F6" opacity="0.9"/>
                <rect x="17" y="2" width="13" height="13" rx="2" fill="#3B82F6" opacity="0.4"/>
                <rect x="2" y="17" width="13" height="13" rx="2" fill="#3B82F6" opacity="0.4"/>
                <rect x="17" y="17" width="13" height="13" rx="2" fill="#0EA5A4" opacity="0.9"/>
              </svg>
            </div>
            <span className="font-display font-bold text-[13px] tracking-[0.25em] text-ink-DEFAULT uppercase">
              STRATIQ
            </span>
          </Link>

          <h1 className="text-[28px] font-display font-bold text-ink-DEFAULT mb-1">
            Welcome back.
          </h1>
          <p className="text-[14px] text-ink-muted mb-8">
            Sign in to your decision intelligence workspace.
          </p>

          {/* Error */}
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

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full btn-secondary justify-center mb-4 py-2.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[12px] text-ink-faint">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-ink-muted mb-1.5 tracking-wider uppercase">
                Email
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-semibold text-ink-muted tracking-wider uppercase">
                  Password
                </label>
                <Link href="/auth/reset" className="text-[12px] text-stratiq-blue hover:text-stratiq-blue-light transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-ink-muted mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-stratiq-blue hover:text-stratiq-blue-light transition-colors font-medium">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
