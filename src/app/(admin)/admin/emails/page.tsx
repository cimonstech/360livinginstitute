import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { EmailLog } from '@/types'

export const metadata: Metadata = { title: 'Email Logs | Admin' }

export default async function EmailLogsPage() {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from('email_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const list = (logs as EmailLog[]) ?? []

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-lora text-2xl font-normal text-charcoal">Email Logs</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {list.length === 0 ? (
          <p className="text-center py-12 text-charcoal-muted text-sm font-dm">No email logs yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-charcoal-light text-xs font-medium text-charcoal-muted uppercase tracking-wider font-dm">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Recipient</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {list.map((log) => (
                <tr key={log.id} className="hover:bg-charcoal-light/30">
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium bg-brand-pink-pale text-brand-pink px-2 py-0.5 rounded-full font-dm">
                      {log.email_type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal-muted font-dm">{log.recipient_email}</td>
                  <td className="px-4 py-3 text-charcoal-muted text-xs font-dm">{log.subject}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full font-dm ${
                        log.status === 'sent'
                          ? 'bg-brand-green-pale text-brand-green'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal-muted text-xs font-dm">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
