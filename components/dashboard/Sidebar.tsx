'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  GitBranch,
  Zap,
  FileText,
  Settings,
  Users,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/utils'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/Logo'

const NAV_ITEMS = [
  {
    group: 'WORKSPACE',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/decisions', label: 'Decisions', icon: GitBranch },
      { href: '/simulate', label: 'Simulate', icon: Zap },
      { href: '/reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    group: 'ACCOUNT',
    items: [
      { href: '/team', label: 'Team', icon: Users },
      { href: '/account', label: 'Settings', icon: Settings },
    ],
  },
]

interface SidebarProps {
  userEmail?: string
  userInitials?: string
  tier?: string
}

export default function Sidebar({ userEmail, userInitials = 'U', tier = 'starter' }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-[#0E1117] border-r border-white/5 flex flex-col z-30">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <Logo size={28} />
        <span className="font-display font-bold text-[13px] tracking-[0.2em] text-ink-DEFAULT uppercase">
          STRATIQ
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_ITEMS.map(group => (
          <div key={group.group}>
            <p className="text-[10px] font-semibold text-ink-faint tracking-[0.15em] uppercase px-2 mb-2">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group',
                      active
                        ? 'bg-stratiq-blue/10 text-stratiq-blue-light border-l-2 border-stratiq-blue pl-[10px]'
                        : 'text-ink-faint hover:text-ink-muted hover:bg-white/4'
                    )}
                  >
                    <item.icon size={15} className="flex-shrink-0" />
                    {item.label}
                    {active && (
                      <ChevronRight size={12} className="ml-auto text-stratiq-blue/60" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/5">
        {/* Tier Badge */}
        <div className="px-3 py-2 mb-2">
          <span className={cn(
            'text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full',
            tier === 'starter' ? 'bg-white/5 text-ink-faint' :
            tier === 'professional' ? 'bg-stratiq-blue/10 text-stratiq-blue' :
            'bg-stratiq-teal/10 text-stratiq-teal'
          )}>
            {tier}
          </span>
        </div>

        {/* User info */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-lg bg-stratiq-blue/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-bold text-stratiq-blue-light">{userInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-ink-muted truncate">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-ink-faint hover:text-risk-high transition-colors rounded-lg group mt-1"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
