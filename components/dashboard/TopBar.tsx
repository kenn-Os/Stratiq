'use client'

import { Bell, Plus } from 'lucide-react'
import Link from 'next/link'

interface TopBarProps {
  title: string
  subtitle?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export default function TopBar({ title, subtitle, action }: TopBarProps) {
  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-charcoal-DEFAULT/80 backdrop-blur-sm sticky top-0 z-20">
      <div>
        <h1 className="text-[15px] font-semibold text-ink-DEFAULT">{title}</h1>
        {subtitle && (
          <p className="text-[12px] text-ink-faint">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-ink-faint hover:text-ink-muted transition-colors rounded-lg hover:bg-white/5">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-stratiq-blue rounded-full" />
        </button>

        {action && (
          action.href ? (
            <Link href={action.href} className="btn-primary text-[13px] py-2 px-4">
              <Plus size={14} />
              {action.label}
            </Link>
          ) : (
            <button onClick={action.onClick} className="btn-primary text-[13px] py-2 px-4">
              <Plus size={14} />
              {action.label}
            </button>
          )
        )}
      </div>
    </header>
  )
}
