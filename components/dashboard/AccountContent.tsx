'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, User, Shield, ExternalLink, Check, ArrowUpRight } from 'lucide-react'
import { formatDate, TIER_LABELS, TIER_COLORS, cn } from '@/utils'
import type { Subscription } from '@/types'

interface AccountContentProps {
  user: any
  subscription: Subscription | null
}

const PLAN_FEATURES = {
  starter: ['5 active decisions', '20 simulations/month', 'Basic simulation engine'],
  professional: ['50 active decisions', '200 simulations/month', 'Full simulation engine', 'PDF reports', '5 team members', 'Priority support'],
  enterprise: ['Unlimited decisions', 'Unlimited simulations', 'Full simulation engine', 'PDF reports', 'Unlimited team members', 'Dedicated support', 'Custom integrations'],
}

export default function AccountContent({ user, subscription }: AccountContentProps) {
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [manageLoading, setManageLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'security'>('profile')

  const tier = subscription?.tier || 'starter'

  const handleUpgrade = async (planTier: string) => {
    alert('Please contact support to upgrade your plan.')
  }

  const handleManageBilling = async () => {
    alert('Please contact support to manage your billing.')
  }

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="p-6">
      <div className="flex gap-1 border-b border-white/5 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-all',
              activeTab === tab.id
                ? 'border-stratiq-blue text-stratiq-blue-light'
                : 'border-transparent text-ink-faint hover:text-ink-muted'
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="card-surface p-6 space-y-4">
              <h3 className="text-[14px] font-semibold text-ink-DEFAULT">Profile Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-ink-faint mb-1 uppercase tracking-wider">Full Name</label>
                  <input
                    defaultValue={user.full_name || ''}
                    className="input-dark w-full text-[14px]"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-ink-faint mb-1 uppercase tracking-wider">Email</label>
                  <input
                    defaultValue={user.email || ''}
                    disabled
                    className="input-dark w-full text-[14px] opacity-60 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-ink-faint mt-1">Email cannot be changed directly. Contact support.</p>
                </div>
              </div>
              <button className="btn-primary text-[13px]">Save Changes</button>
            </div>
          </motion.div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Current Plan */}
            <div className="card-surface p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[14px] font-semibold text-ink-DEFAULT">Current Plan</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[18px] font-display font-bold ${TIER_COLORS[tier as keyof typeof TIER_COLORS]}`}>
                      {TIER_LABELS[tier as keyof typeof TIER_LABELS]}
                    </span>
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      subscription?.status === 'active' ? 'bg-risk-low/10 text-risk-low' : 'bg-risk-high/10 text-risk-high'
                    )}>
                      {(subscription?.status || 'active').toUpperCase()}
                    </span>
                  </div>
                </div>
                {subscription?.status === 'active' && (
                  <button
                    onClick={handleManageBilling}
                    className="btn-secondary text-[12px] flex items-center gap-1.5"
                  >
                    <ExternalLink size={12} />
                    Manage Billing
                  </button>
                )}
              </div>

              <ul className="space-y-1.5 mb-4">
                {PLAN_FEATURES[tier as keyof typeof PLAN_FEATURES]?.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-ink-muted">
                    <Check size={13} className="text-stratiq-teal flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {subscription?.current_period_end && (
                <p className="text-[12px] text-ink-faint">
                  {subscription.cancel_at_period_end
                    ? `Cancels on ${formatDate(subscription.current_period_end)}`
                    : `Renews on ${formatDate(subscription.current_period_end)}`
                  }
                </p>
              )}
            </div>

            {/* Upgrade Options */}
            {tier !== 'enterprise' && (
              <div className="card-surface p-6">
                <h3 className="text-[14px] font-semibold text-ink-DEFAULT mb-4">Upgrade Plan</h3>
                <div className="space-y-3">
                  {tier === 'starter' && (
                    <div className="flex items-center justify-between p-4 bg-stratiq-blue/5 border border-stratiq-blue/15 rounded-xl">
                      <div>
                        <p className="text-[14px] font-semibold text-ink-DEFAULT">Professional — £49/mo</p>
                        <p className="text-[12px] text-ink-muted">50 decisions, 200 simulations, PDF reports, team collaboration</p>
                      </div>
                      <button
                        onClick={() => handleUpgrade('professional')}
                        disabled={upgradeLoading}
                        className="btn-primary text-[13px] flex items-center gap-1.5"
                      >
                        <ArrowUpRight size={13} />
                        {upgradeLoading ? '…' : 'Upgrade'}
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-4 bg-stratiq-teal/5 border border-stratiq-teal/15 rounded-xl">
                    <div>
                      <p className="text-[14px] font-semibold text-ink-DEFAULT">Enterprise — Custom</p>
                      <p className="text-[12px] text-ink-muted">Unlimited everything, dedicated support, custom integrations</p>
                    </div>
                    <a href="/contact?inquiry=enterprise" className="btn-secondary text-[13px]">
                      Contact Sales
                    </a>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="card-surface p-6 space-y-4">
              <h3 className="text-[14px] font-semibold text-ink-DEFAULT">Password</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-ink-faint mb-1 uppercase tracking-wider">Current Password</label>
                  <input type="password" className="input-dark w-full text-[14px]" />
                </div>
                <div>
                  <label className="block text-[11px] text-ink-faint mb-1 uppercase tracking-wider">New Password</label>
                  <input type="password" className="input-dark w-full text-[14px]" />
                </div>
                <div>
                  <label className="block text-[11px] text-ink-faint mb-1 uppercase tracking-wider">Confirm New Password</label>
                  <input type="password" className="input-dark w-full text-[14px]" />
                </div>
              </div>
              <button className="btn-primary text-[13px]">Update Password</button>
            </div>

            <div className="card-surface p-6">
              <h3 className="text-[14px] font-semibold text-ink-DEFAULT mb-2">Account Security</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-[13px] text-ink-muted">Two-factor authentication</span>
                  <span className="text-[11px] text-ink-faint">Coming soon</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[13px] text-ink-muted">Active sessions</span>
                  <button className="text-[12px] text-risk-high hover:underline">Sign out all devices</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
