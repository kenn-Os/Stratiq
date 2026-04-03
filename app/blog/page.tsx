'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Newspaper } from 'lucide-react'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

const POSTS = [
  {
    title: 'Why Instinct Fails in High-Stakes Scenarios',
    excerpt: 'Biases like anchoring and overconfidence are the silent killers of strategic decisions. Learn how to identify and neutralize them.',
    author: 'Elena Vance',
    category: 'Decision Theory',
    date: 'Mar 24, 2026',
    readTime: '8 min read',
    accent: '#3B82F6',
  },
  {
    title: 'The Mathematics of Risk Discounting',
    excerpt: 'Understanding the expected value is only half the battle. Discover how to apply discounting for true risk intelligence.',
    author: 'Mark Coburn',
    category: 'Methodology',
    date: 'Mar 18, 2026',
    readTime: '12 min read',
    accent: '#0EA5A4',
  },
  {
    title: 'Building a Culture of Structured Thinking',
    excerpt: 'Moving from individual intuition to organizational intelligence. How top-performing teams model their shared choices.',
    author: 'Sarah Jenkins',
    category: 'Leadership',
    date: 'Mar 12, 2026',
    readTime: '6 min read',
    accent: '#8B5CF6',
  },
  {
    title: 'Visualizing Uncertainty: Radar Plots vs Risk Heatmaps',
    excerpt: 'Choosing the right visual framework for your decision evidence. A guide to communicating complexity to the board.',
    author: 'David Chen',
    category: 'Visual Analytics',
    date: 'Mar 05, 2026',
    readTime: '10 min read',
    accent: '#F59E0B',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <MarketingNav />

      <div className="pt-32 pb-24 px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[12px] font-semibold tracking-[0.15em] text-stratiq-blue uppercase">Resources</span>
          <h1 className="text-[52px] md:text-[64px] font-display font-bold mt-4 mb-6 leading-tight">
            Decision Intelligence Insights.
          </h1>
          <p className="text-[18px] text-ink-muted leading-relaxed">
            Thought leadership at the intersection of strategy, mathematics, and high-performance leadership. 
            No fluff. Just structured evidence.
          </p>
        </motion.div>

        {/* Featured Post */}
        <div className="max-w-6xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-surface p-8 md:p-12 relative overflow-hidden group flex flex-col md:flex-row gap-12"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-stratiq-blue/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            
            <div className="md:w-1/2 relative z-10 flex flex-col justify-center">
              <span className="text-[11px] font-bold tracking-widest text-risk-high uppercase mb-4">Latest Insights</span>
              <h2 className="text-[32px] md:text-[42px] font-display font-bold text-ink-DEFAULT mb-6 leading-[1.1]">
                {POSTS[0].title}
              </h2>
              <p className="text-[15px] text-ink-muted leading-relaxed mb-8">
                {POSTS[0].excerpt}
              </p>
              <div className="flex items-center gap-6 text-[12px] text-ink-faint mb-8">
                <span className="flex items-center gap-2"><Calendar size={14} /> {POSTS[0].date}</span>
                <span className="flex items-center gap-2"><Clock size={14} /> {POSTS[0].readTime}</span>
              </div>
              <Link href={`/blog/${POSTS[0].title.toLowerCase().replace(/ /g, '-')}`} className="btn-primary inline-flex self-start py-3 px-8 text-[14px]">
                Read More
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="md:w-1/2 card-surface aspect-[16/9] flex items-center justify-center border-white/5 opacity-40">
              <Newspaper size={80} className="text-ink-faint" />
            </div>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.slice(1).map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-surface flex flex-col group h-full"
            >
              <div className="p-8 flex-1 flex flex-col">
                <span 
                  className="text-[11px] font-bold tracking-widest uppercase mb-4"
                  style={{ color: post.accent }}
                >
                  {post.category}
                </span>
                <h3 className="text-[20px] font-display font-bold text-ink-DEFAULT mb-4 leading-snug group-hover:text-stratiq-blue transition-colors">
                  {post.title}
                </h3>
                <p className="text-[14px] text-ink-muted leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5 grayscale group-hover:grayscale-0 transition-all">
                  <div className="flex items-center gap-2 text-[11px] text-ink-faint">
                    <Clock size={13} /> {post.readTime}
                  </div>
                  <Link href="#" className="text-[11px] font-bold text-ink-muted group-hover:text-ink-DEFAULT flex items-center gap-1 uppercase tracking-wider">
                    Details <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-32 max-w-4xl mx-auto text-center">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="card-surface p-12 border-white/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid opacity-10" />
            <h3 className="text-[28px] font-display font-bold mb-4">Never settle for intuition.</h3>
            <p className="text-[15px] text-ink-muted mb-8 max-w-xl mx-auto">
              Get the latest insights on decision intelligence and risk modeling sent to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
              <input 
                type="email" 
                placeholder="Work email" 
                className="input-dark flex-1 py-3 text-[14px]"
              />
              <button className="btn-primary py-3 px-8 text-[14px] font-bold">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
