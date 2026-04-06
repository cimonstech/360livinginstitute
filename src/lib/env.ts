const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'NEXT_PUBLIC_SITE_URL',
] as const

const optional = [
  'CLOUDFLARE_R2_ACCOUNT_ID',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET_NAME',
  'CLOUDFLARE_R2_PUBLIC_URL',
  'CONTACT_FORM_EMAIL',
] as const

let validated = false

export function validateEnv(): void {
  if (validated) return
  validated = true

  const missing = required.filter((key) => !process.env[key]?.trim())
  if (missing.length > 0) {
    const msg = `Missing required environment variables: ${missing.join(', ')}`
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg)
    }
    console.warn(`[env] ${msg} (set these before production deploy)`)
  }

  const missingOptional = optional.filter((key) => !process.env[key]?.trim())
  if (missingOptional.length > 0) {
    console.warn(`[env] Optional env vars not set: ${missingOptional.join(', ')}`)
  }
}
