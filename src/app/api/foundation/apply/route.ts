import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeEmail, sanitizeLongText, sanitizePhone, sanitizeString } from '@/lib/sanitize'
import { sendApplicationReceived } from '@/lib/email'
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
  const programInterest = sanitizeString(cleaned.program_interest)
  const programTitle = sanitizeString(cleaned.program_title)
  const motivation = sanitizeLongText(cleaned.motivation)
  const ageRange = sanitizeString(cleaned.age_range)
  const gender = sanitizeString(cleaned.gender)
  const location = sanitizeString(cleaned.location)
  const heardAboutUs = sanitizeString(cleaned.heard_about_us)

  if (!fullName || !email || !programInterest || !programTitle) {
    return NextResponse.json({ error: 'Name, email, and programme are required.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('foundation_applications')
    .insert({
      full_name: fullName,
      email,
      phone,
      age_range: ageRange,
      gender,
      location,
      program_interest: programInterest,
      program_title: programTitle,
      motivation,
      heard_about_us: heardAboutUs,
      is_guest: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await sendApplicationReceived({ name: fullName, email, programTitle })

  return NextResponse.json({ success: true, id: data.id })
}
