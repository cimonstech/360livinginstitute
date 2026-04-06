import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

function getR2Client() {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing Cloudflare R2 environment variables')
  }
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

export async function uploadToR2(file: Buffer, fileName: string, mimeType: string): Promise<string> {
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/$/, '')
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME
  if (!publicUrl || !bucket) {
    throw new Error('Missing CLOUDFLARE_R2_PUBLIC_URL or CLOUDFLARE_R2_BUCKET_NAME')
  }

  const r2 = getR2Client()
  const key = `uploads/${Date.now()}-${fileName.replace(/\s+/g, '-').toLowerCase()}`

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000',
    })
  )

  return `${publicUrl}/${key}`
}

export async function deleteFromR2(fileUrl: string): Promise<void> {
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/$/, '')
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME
  if (!publicUrl || !bucket) {
    throw new Error('Missing CLOUDFLARE_R2_PUBLIC_URL or CLOUDFLARE_R2_BUCKET_NAME')
  }

  const prefix = `${publicUrl}/`
  if (!fileUrl.startsWith(prefix)) {
    throw new Error('File URL does not match configured R2 public URL')
  }

  const key = fileUrl.slice(prefix.length)
  const r2 = getR2Client()
  await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}
