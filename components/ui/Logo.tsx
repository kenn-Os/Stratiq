'use client'

import React from 'react'
import { cn } from '@/utils'

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  variant?: 'default' | 'white' | 'dark'
}

export function Logo({ size = 32, className, variant = 'default', ...props }: LogoProps) {
  // Color configuration
  const colors = {
    default: {
      primary: '#3B82F6',
      secondary: '#0EA5E9',
      accent: '#6366F1',
    },
    white: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      accent: '#FFFFFF',
    },
    dark: {
      primary: '#0F172A',
      secondary: '#1E293B',
      accent: '#334155',
    },
  }

  const activeColors = colors[variant]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('transition-all duration-300', className)}
      {...props}
    >
      {/* 
        Concept: 'The Strata Balance'
        A minimalist, architectural construction representing layers of data coming into alignment.
      */}
      
      {/* Left Column - Variable Weights */}
      <rect x="4" y="8" width="4" height="16" rx="2" fill={activeColors.primary} fillOpacity="0.8" />
      
      {/* Right Column - Precision Alignment */}
      <rect x="24" y="4" width="4" height="24" rx="2" fill={activeColors.secondary} fillOpacity="0.4" />
      
      {/* Central Prism - The Decision Point */}
      <path
        d="M10 16L22 16"
        stroke={activeColors.primary}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      
      {/* The Focused Result / Apex */}
      <rect x="14" y="10" width="4" height="12" rx="2" fill={activeColors.accent} />
      
      {/* Subtle geometric detail for 'human' touch - an angled cut */}
      <path
        d="M24 4L28 4L24 8V4Z"
        fill={activeColors.secondary}
        opacity="0.8"
      />
    </svg>
  )
}
