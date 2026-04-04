import Link from 'next/link'
import TopBar from '@/components/dashboard/TopBar'
import Sidebar from '@/components/dashboard/Sidebar'
import { getInitials, formatDate } from '@/utils'
import { FileText, Download, ExternalLink } from 'lucide-react'

export const metadata = { title: 'Reports' }

export default async function ReportsPage() {
  // Hardcoded dummy user for UI prototype
  const user = {
    email: 'demo@stratiq.io',
    user_metadata: {
      full_name: 'Demo User'
    }
  }

  // Mock data for UI prototype
  const reports: any[] = [
    {
      id: '1',
      title: 'Q3 Strategy Analysis',
      decision_id: '1',
      generated_at: new Date().toISOString(),
      storage_path: '#',
      decision: { title: 'Strategy Expansion Q3' }
    },
    {
      id: '2',
      title: 'APAC Market Entry Assessment',
      decision_id: '2',
      generated_at: new Date().toISOString(),
      storage_path: '#',
      decision: { title: 'New Market Entry: APAC' }
    }
  ]

  const tier = 'pro'
  const canGenerateReports = true
  const initials = getInitials(user.user_metadata.full_name)

  return (
    <div className="min-h-screen bg-charcoal-DEFAULT">
      <Sidebar
        userEmail={user.email}
        userInitials={initials}
        tier={tier}
      />
      <div className="pl-[220px] min-h-screen page-enter">
        <TopBar title="Reports" subtitle={`${reports?.length || 0} generated`} />
        <div className="p-6">
          {!canGenerateReports ? (
            <div className="card-surface p-8 text-center max-w-md mx-auto mt-8">
              <div className="w-14 h-14 rounded-2xl bg-stratiq-blue/10 border border-stratiq-blue/20 flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-stratiq-blue" />
              </div>
              <h2 className="text-[18px] font-display font-bold text-ink-DEFAULT mb-2">Reports require Professional+</h2>
              <p className="text-[13px] text-ink-muted mb-5">
                Upgrade to Professional to generate executive-grade PDF reports for your decisions.
              </p>
              <Link href="/account" className="btn-primary text-[13px] inline-flex">
                Upgrade Plan
              </Link>
            </div>
          ) : reports && reports.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={32} className="text-ink-faint mx-auto mb-3" />
              <p className="text-[14px] text-ink-muted mb-1">No reports yet</p>
              <p className="text-[12px] text-ink-faint mb-5">Generate reports from your simulated decisions</p>
              <Link href="/decisions" className="btn-primary text-[13px] inline-flex">
                View Decisions
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reports?.map(report => (
                <div key={report.id} className="card-surface flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-graphite flex items-center justify-center">
                      <FileText size={16} className="text-stratiq-blue" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-ink-DEFAULT">{report.title}</p>
                      <p className="text-[12px] text-ink-faint">
                        {report.decision?.title} · {formatDate(report.generated_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.storage_path && (
                      <a
                        href={report.storage_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-[13px] py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <Download size={13} />
                        Download PDF
                      </a>
                    )}
                    <Link
                      href={`/decisions/${report.decision_id}`}
                      className="p-2 text-ink-faint hover:text-ink-muted transition-colors"
                    >
                      <ExternalLink size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
