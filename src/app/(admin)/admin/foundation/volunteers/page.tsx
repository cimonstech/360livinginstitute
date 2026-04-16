import { createClient } from '@/lib/supabase/server'
import type { FoundationVolunteer } from '@/types'
import FoundationSubmissionActions from '@/components/admin/foundation/FoundationSubmissionActions'

export const dynamic = 'force-dynamic'

const STATUS_OPTIONS = ['new', 'reviewing', 'active', 'inactive']

export default async function FoundationVolunteersPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('foundation_volunteers').select('*').order('created_at', { ascending: false })
  const list = (data as FoundationVolunteer[]) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-lora text-2xl font-normal text-charcoal">Foundation Volunteers</h1>
        <p className="mt-1 font-dm text-sm font-light text-charcoal-muted">Volunteer signups from the Foundation website.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] font-dm text-sm">
            <thead className="bg-charcoal-light text-xs font-medium uppercase tracking-wider text-charcoal-muted">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Occupation</th>
                <th className="px-4 py-3 text-left">Skills</th>
                <th className="px-4 py-3 text-left">Availability</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {list.map((row) => (
                <tr key={row.id} className="hover:bg-charcoal-light/30">
                  <td className="px-4 py-3 text-charcoal">{row.full_name}</td>
                  <td className="px-4 py-3 text-charcoal-muted">{row.email}</td>
                  <td className="px-4 py-3 text-charcoal-muted">{row.occupation || '—'}</td>
                  <td className="max-w-[240px] truncate px-4 py-3 text-charcoal-muted">{row.skills || '—'}</td>
                  <td className="px-4 py-3 text-charcoal-muted">{row.availability || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-brand-pink-pale px-2 py-1 text-xs capitalize text-brand-pink">{row.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal-muted">{new Date(row.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-3">
                    <FoundationSubmissionActions
                      table="volunteers"
                      id={row.id}
                      currentStatus={row.status}
                      currentNotes={row.admin_notes}
                      statusOptions={STATUS_OPTIONS}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 ? <p className="py-12 text-center font-dm text-sm text-charcoal-muted">No volunteer signups yet.</p> : null}
      </div>
    </div>
  )
}
