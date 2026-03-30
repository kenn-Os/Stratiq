// utils/index.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

// ── Class Names ───────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Date Formatting ───────────────────────────────────────
export function formatDate(date: string | Date, pattern = 'dd MMM yyyy') {
  return format(new Date(date), pattern)
}

export function formatRelativeDate(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDatetime(date: string | Date) {
  return format(new Date(date), 'dd MMM yyyy, HH:mm')
}

// ── Number Formatting ─────────────────────────────────────
export function formatScore(score: number, decimals = 1) {
  return score.toFixed(decimals)
}

export function formatPercent(value: number, decimals = 0) {
  return `${value.toFixed(decimals)}%`
}

export function formatCurrency(amount: number, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// ── Risk Level Helpers ────────────────────────────────────
export const RISK_COLORS = {
  low: { bg: 'bg-risk-low/10', text: 'text-risk-low', border: 'border-risk-low/20', hex: '#10B981' },
  medium: { bg: 'bg-risk-medium/10', text: 'text-risk-medium', border: 'border-risk-medium/20', hex: '#F59E0B' },
  high: { bg: 'bg-risk-high/10', text: 'text-risk-high', border: 'border-risk-high/20', hex: '#EF4444' },
  critical: { bg: 'bg-risk-critical/10', text: 'text-risk-critical', border: 'border-risk-critical/20', hex: '#DC2626' },
}

// ── Status Helpers ────────────────────────────────────────
export const DECISION_STATUS_LABELS = {
  draft: 'Draft',
  in_progress: 'In Progress',
  simulated: 'Simulated',
  decided: 'Decided',
  archived: 'Archived',
}

export const DECISION_STATUS_COLORS = {
  draft: 'text-ink-muted',
  in_progress: 'text-stratiq-blue',
  simulated: 'text-stratiq-teal',
  decided: 'text-risk-low',
  archived: 'text-ink-faint',
}

// ── Tier Helpers ──────────────────────────────────────────
export const TIER_LABELS = {
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
}

export const TIER_COLORS = {
  starter: 'text-ink-muted',
  professional: 'text-stratiq-blue',
  enterprise: 'text-stratiq-teal',
}

// ── Score to Colour ───────────────────────────────────────
export function scoreToColor(score: number): string {
  if (score >= 75) return '#10B981' // Green
  if (score >= 50) return '#3B82F6' // Blue
  if (score >= 25) return '#F59E0B' // Amber
  return '#EF4444' // Red
}

// ── Truncate Text ─────────────────────────────────────────
export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

// ── Generate Initials ─────────────────────────────────────
export function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// ── Debounce ──────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}
