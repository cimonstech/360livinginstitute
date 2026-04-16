import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeEmail, sanitizeHttpsUrl, sanitizeLongText, sanitizePhone, sanitizeString } from '@/lib/sanitize'
import { sendPartnerRequestReceived } from '@/lib/email'
import { silentRejectSpam, stripPublicFormMeta } from '@/lib/public-form-guard'
import { validateOrigin } from '@/lib/csrf'

export async function POST(request: NextRequest) {
  if (!(await validateOrigin())) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const spam = silentRejectSpam(body)
  if (spam) return spam

  const cleaned = stripPublicFormMeta(body)
  const orgName = sanitizeString(cleaned.organisation_name)
  const contactName = sanitizeString(cleaned.contact_name)
  const email = sanitizeEmail(cleaned.email)
  const phone = sanitizePhone(cleaned.phone)
  const orgType = sanitizeString(cleaned.organisation_type)
  const website = sanitizeHttpsUrl(cleaned.website)
  const partnershipInterest = sanitizeLongText(cleaned.partnership_interest)
  const message = sanitizeLongText(cleaned.message)

  if (!orgName || !contactName || !email) {
    return NextResponse.json({ error: 'Organisation name, contact name, and email are required.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('foundation_partners')
    .insert({
      organisation_name: orgName,
      contact_name: contactName,
      email,
      phone,
      organisation_type: orgType,
      website,
      partnership_interest: partnershipInterest,
      message,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await sendPartnerRequestReceived({ contactName, email, orgName })
  return NextResponse.json({ success: true, id: data.id })
}
