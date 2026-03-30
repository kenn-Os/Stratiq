import Link from 'next/link'

const FOOTER_LINKS = {
  Product: [
    { href: '/product', label: 'Overview' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/use-cases', label: 'Use Cases' },
    { href: '/pricing', label: 'Pricing' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/security', label: 'Security' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Blog' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
    { href: '/dpa', label: 'Data Processing' },
  ],
}

export default function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#080b0f]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
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
            </div>
            <p className="text-[14px] text-ink-muted leading-relaxed mb-6 max-w-xs">
              The operating system for high-stakes decisions. Model, simulate, decide.
            </p>
            <p className="text-[12px] text-ink-faint font-mono tracking-wider">
              DECIDE WITH PRECISION.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] text-ink-faint uppercase mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-ink-muted hover:text-ink-DEFAULT transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-ink-faint">
            © {new Date().getFullYear()} STRATIQ. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[12px] text-ink-faint">
              Enterprise-grade security
            </span>
            <span className="w-1 h-1 rounded-full bg-ink-faint" />
            <span className="text-[12px] text-ink-faint">
              SOC 2 compliant infrastructure
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
