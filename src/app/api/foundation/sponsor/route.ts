import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeEmail, sanitizeLongText, sanitizePhone, sanitizeString } from '@/lib/sanitize'
import { sendSponsorInquiryReceived } from '@/lib/email'
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
  const fullName = sanitizeString(cleaned.full_name)
  const email = sanitizeEmail(cleaned.email)
  const phone = sanitizePhone(cleaned.phone)
  const organisation = sanitizeString(cleaned.organisation)
  const inquiryType = cleaned.inquiry_type === 'donate' ? 'donate' : 'sponsor'
  const programInterest = sanitizeString(cleaned.program_interest)
  const message = sanitizeLongText(cleaned.message)

  if (!fullName || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('foundation_sponsors')
    .insert({
      full_name: fullName,
      email,
      phone,
      organisation,
      inquiry_type: inquiryType,
      program_interest: programInterest,
      message,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await sendSponsorInquiryReceived({ name: fullName, email, type: inquiryType })
  return NextResponse.json({ success: true, id: data.id })
}
