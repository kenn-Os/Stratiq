import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Palette
        charcoal: {
          DEFAULT: '#0E1117',
          50: '#1a1f2a',
          100: '#161b24',
          200: '#12171e',
          900: '#080b0f',
        },
        graphite: {
          DEFAULT: '#1C1F26',
          light: '#252932',
          dark: '#14171d',
        },
        stratiq: {
          blue: '#3B82F6',
          'blue-dark': '#2563EB',
          'blue-light': '#60A5FA',
          teal: '#0EA5A4',
          'teal-dark': '#0C8F8E',
          'teal-light': '#14B8B7',
        },
        ink: {
          DEFAULT: '#E6EDF3',
          muted: '#8B98A8',
          faint: '#4A5568',
          dim: '#2D3748',
        },
        risk: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
          critical: '#DC2626',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 .5H31.5V32' stroke='%23ffffff08'/%3E%3C/svg%3E\")",
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-teal': '0 0 20px rgba(14, 165, 164, 0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
