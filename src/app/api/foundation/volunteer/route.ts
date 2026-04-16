import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeEmail, sanitizeLongText, sanitizePhone, sanitizeString } from '@/lib/sanitize'
import { sendVolunteerSignupReceived } from '@/lib/email'
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
  const occupation = sanitizeString(cleaned.occupation)
  const skills = sanitizeLongText(cleaned.skills)
  const availability = sanitizeString(cleaned.availability)
  const motivation = sanitizeLongText(cleaned.motivation)

  if (!fullName || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('foundation_volunteers')
    .insert({ full_name: fullName, email, phone, occupation, skills, availability, motivation })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await sendVolunteerSignupReceived({ name: fullName, email })
  return NextResponse.json({ success: true, id: data.id })
}
