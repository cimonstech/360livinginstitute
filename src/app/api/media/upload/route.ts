import { assertAdminSession } from '@/lib/assert-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { uploadToR2 } from '@/lib/r2'
import { sanitizeString } from '@/lib/sanitize'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  const altText = sanitizeString(formData.get('alt_text'))
  const usedIn = sanitizeString(formData.get('used_in')) || 'general'

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'application/pdf',
  ]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Only images and PDFs allowed.' }, { status: 400 })
  }

  const maxSize = file.type === 'application/pdf' ? 20 * 1024 * 1024 : 5 * 1024 * 1024
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File too large. Max ${file.type === 'application/pdf' ? '20MB' : '5MB'}.` },
      { status: 400 }
    )
  }

  let fileUrl: string
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    fileUrl = await uploadToR2(buffer, file.name, file.type)
  } catch (e) {
    console.error('[api/media/upload] R2', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Upload failed' },
      { status: 500 }
    )
  }

  const admin = createAdminClient()
  const { data: media, error } = await admin
    .from('media')
    .insert({
      file_name: file.name,
      file_url: fileUrl,
      file_size: file.size,
      mime_type: file.type,
      alt_text: altText,
      used_in: usedIn,
      uploaded_by: auth.userId,
    })
    .select()
    .single()

  if (error) {
    console.error('[api/media/upload] db', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, media })
}
