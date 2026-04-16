'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import NextImage from 'next/image'
import { useRouter } from 'next/navigation'
import { CheckCircle2, FileText, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react'
import type { PublishTo, Resource } from '@/types'
import MediaPickerModal from '@/components/admin/blog/MediaPickerModal'

const CATEGORY_OPTIONS = [
  { value: '', label: 'No category' },
  { value: 'mental-health', label: 'Mental Health' },
  { value: 'life-transitions', label: 'Life Transitions' },
  { value: 'youth', label: 'Youth Development' },
  { value: 'women', label: 'Women Empowerment' },
  { value: 'relationships', label: 'Relationships & Family' },
  { value: 'wellness', label: 'Wellness & Self-Care' },
  { value: 'leadership', label: 'Leadership & Work' },
  { value: 'community', label: 'Community' },
] as const

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ResourceEditor({ resource }: { resource?: Resource | null }) {
  const router = useRouter()
  const pdfRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(resource?.title || '')
  const [slug, setSlug] = useState(resource?.slug || '')
  const [description, setDescription] = useState(resource?.description || '')

  const [resourceType, setResourceType] = useState<'pdf' | 'infographic'>(resource?.resource_type || 'pdf')
  const [publishTo, setPublishTo] = useState<PublishTo>(resource?.publish_to || 'foundation')
  const [category, setCategory] = useState(resource?.category || '')
  const [status, setStatus] = useState<'draft' | 'published'>(resource?.status || 'draft')
  const [featured, setFeatured] = useState(Boolean(resource?.featured))
  const [authorName, setAuthorName] = useState(resource?.author_name || 'Selasi Doku')
  const [tags, setTags] = useState<string[]>(resource?.tags || [])
  const [tagInput, setTagInput] = useState('')

  const [fileUrl, setFileUrl] = useState(resource?.file_url || '')
  const [fileName, setFileName] = useState(resource?.file_name || '')
  const [fileSize, setFileSize] = useState<number | null>(resource?.file_size ?? null)

  const [imageUrl, setImageUrl] = useState(resource?.image_url || '')
  const [imageAlt, setImageAlt] = useState(resource?.image_alt || '')

  const [coverImageUrl, setCoverImageUrl] = useState(resource?.cover_image_url || '')

  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerType = resourceType === 'pdf' ? 'pdf' : 'image'

  useEffect(() => {
    if (!resource && title) setSlug(slugify(title))
  }, [title, resource])

  const canPublish = useMemo(() => {
    if (!title.trim()) return false
    if (resourceType === 'pdf') return Boolean(fileUrl)
    return Boolean(imageUrl)
  }, [title, resourceType, fileUrl, imageUrl])

  function addTag(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().replace(/,$/, '')
      if (tag && !tags.includes(tag)) setTags([...tags, tag])
      setTagInput('')
    }
  }

  async function upload(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('alt_text', title || file.name)
      fd.append('used_in', 'resource')
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd })
      const data = (await res.json()) as { error?: string; media?: { file_url: string; file_name: string; file_size?: number | null } }
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      if (!data.media?.file_url) throw new Error('No file URL returned')

      if (resourceType === 'pdf') {
        setFileUrl(data.media.file_url)
        setFileName(file.name)
        setFileSize(file.size)
      } else {
        setImageUrl(data.media.file_url)
        setImageAlt(title || file.name)
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function uploadCover(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('alt_text', title || file.name)
      fd.append('used_in', 'resource')
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd })
      const data = (await res.json()) as { error?: string; media?: { file_url: string } }
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      if (!data.media?.file_url) throw new Error('No file URL returned')
      setCoverImageUrl(data.media.file_url)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Cover upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function save(nextStatus: 'draft' | 'published') {
    setSaveMsg('')
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        id: resource?.id,
        title,
        slug,
        description,
        resource_type: resourceType,
        publish_to: publishTo,
        category,
        status: nextStatus,
        featured,
        author_name: authorName,
        tags,
        cover_image_url: coverImageUrl,
      }

      if (resourceType === 'pdf') {
        payload.file_url = fileUrl
        payload.file_name = fileName
        payload.file_size = fileSize
        payload.image_url = null
        payload.image_alt = null
      } else {
        payload.image_url = imageUrl
        payload.image_alt = imageAlt
        payload.file_url = null
        payload.file_name = null
        payload.file_size = null
      }

      const res = await fetch('/api/resources/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const j = (await res.json()) as { error?: string; resource?: { id: string } }
      if (!res.ok) throw new Error(j.error || 'Save failed')
      setStatus(nextStatus)
      setSaveMsg('Saved ✓')
      setTimeout(() => setSaveMsg(''), 2500)
      router.refresh()
      if (!resource?.id && j.resource?.id) {
        router.push(`/admin/resources/${j.resource.id}/edit`)
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-lora text-2xl font-normal text-charcoal">{resource ? 'Edit Resource' : 'New Resource'}</h1>
          <p className="mt-1 font-dm text-sm font-light text-charcoal-muted">
            Standalone PDF guides and infographics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveMsg ? (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-brand-green">
              <CheckCircle2 size={14} aria-hidden /> {saveMsg}
            </span>
          ) : null}
          <button
            type="button"
            disabled={saving}
            onClick={() => void save('draft')}
            className="rounded-full border border-gray-200 px-5 py-2.5 font-dm text-sm text-charcoal hover:bg-charcoal-light disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={saving || !canPublish}
            onClick={() => void save('published')}
            className="rounded-full bg-brand-pink px-5 py-2.5 font-dm text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title..."
              className="w-full border-0 border-b border-gray-200 px-0 py-3 font-lora text-xl font-normal text-charcoal focus:outline-none focus:border-brand-pink"
            />
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-charcoal-muted">slug:</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 border-0 bg-transparent font-mono text-xs text-charcoal-muted focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <label className="block text-xs text-charcoal-muted mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-light text-charcoal focus:border-brand-pink focus:outline-none"
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-medium uppercase tracking-wider text-charcoal">File</p>
              <div className="flex gap-2">
                {(['pdf', 'infographic'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setResourceType(t)
                      setFileUrl('')
                      setFileName('')
                      setFileSize(null)
                      setImageUrl('')
                      setImageAlt('')
                    }}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium border ${
                      resourceType === t ? 'bg-brand-green text-white border-brand-green' : 'bg-white text-charcoal-muted border-gray-200'
                    }`}
                  >
                    {t === 'pdf' ? 'PDF' : 'Infographic'}
                  </button>
                ))}
              </div>
            </div>

            {resourceType === 'pdf' ? (
              <div className="mt-4">
                {fileUrl ? (
                  <div className="rounded-xl border border-gray-100 bg-brand-green-pale p-4 flex items-center gap-3">
                    <FileText size={18} className="text-brand-green" aria-hidden />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-dm text-sm text-charcoal">{fileName || 'PDF'}</p>
                      <p className="font-dm text-xs text-charcoal-muted">{fileSize ? `${(fileSize / 1024).toFixed(0)} KB` : ''}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFileUrl('')
                        setFileName('')
                        setFileSize(null)
                      }}
                      className="rounded-full border border-gray-200 bg-white p-2"
                      aria-label="Remove PDF"
                    >
                      <X size={14} className="text-charcoal-muted" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => pdfRef.current?.click()}
                    className="mt-3 border-2 border-dashed border-gray-200 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-brand-green hover:bg-brand-green-pale/30 transition-colors"
                  >
                    {uploading ? (
                      <Loader2 size={20} className="animate-spin text-brand-green" />
                    ) : (
                      <>
                        <Upload size={20} className="text-charcoal-muted/50 mb-2" />
                        <p className="text-sm text-charcoal-muted">Click to upload PDF</p>
                        <p className="text-xs text-charcoal-muted/50">Max 20MB</p>
                      </>
                    )}
                  </div>
                )}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="w-full rounded-full border border-gray-200 py-2 text-xs text-charcoal-muted hover:bg-charcoal-light"
                  >
                    Or pick from Media Library
                  </button>
                </div>
                <input
                  ref={pdfRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) void upload(f)
                    e.target.value = ''
                  }}
                />
              </div>
            ) : (
              <div className="mt-4">
                {imageUrl ? (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden bg-charcoal-light">
                    <NextImage src={imageUrl} alt={imageAlt || 'Infographic'} fill className="object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('')
                        setImageAlt('')
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200"
                      aria-label="Remove infographic"
                    >
                      <X size={12} className="text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => imageRef.current?.click()}
                    className="mt-3 border-2 border-dashed border-gray-200 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-brand-pink hover:bg-brand-pink-pale/30 transition-colors"
                  >
                    {uploading ? (
                      <Loader2 size={20} className="animate-spin text-brand-pink" />
                    ) : (
                      <>
                        <ImageIcon size={20} className="text-charcoal-muted/50 mb-2" />
                        <p className="text-sm text-charcoal-muted">Click to upload infographic</p>
                        <p className="text-xs text-charcoal-muted/50">JPG, PNG, WEBP</p>
                      </>
                    )}
                  </div>
                )}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="w-full rounded-full border border-gray-200 py-2 text-xs text-charcoal-muted hover:bg-charcoal-light"
                  >
                    Or pick from Media Library
                  </button>
                </div>
                <input
                  ref={imageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) void upload(f)
                    e.target.value = ''
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-charcoal">Cover Image</p>
            {coverImageUrl ? (
              <div className="relative">
                <div className="relative h-40 w-full overflow-hidden rounded-xl bg-charcoal-light">
                  <NextImage src={coverImageUrl} alt="" fill className="object-cover" sizes="400px" />
                </div>
                <button
                  type="button"
                  onClick={() => setCoverImageUrl('')}
                  className="absolute right-2 top-2 rounded-full border border-gray-200 bg-white p-1 shadow-sm hover:bg-red-50"
                  aria-label="Remove cover"
                >
                  <X size={12} className="text-red-500" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverRef.current?.click()}
                className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 transition-colors hover:border-brand-pink hover:bg-brand-pink-pale/30"
              >
                {uploading ? <Loader2 size={20} className="animate-spin text-brand-pink" /> : <Upload size={18} className="text-charcoal-muted/50" />}
                <p className="mt-2 text-xs text-charcoal-muted">Upload cover</p>
              </button>
            )}
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void uploadCover(f)
                e.target.value = ''
              }}
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-charcoal">Settings</p>

            <div className="mb-4">
              <label className="text-xs text-charcoal-muted block mb-1.5">Publish to</label>
              <div className="flex gap-2">
                {(['institute', 'foundation', 'both'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPublishTo(option)}
                    className={`flex-1 text-xs font-medium py-2 rounded-full border transition-colors capitalize ${
                      publishTo === option
                        ? 'bg-brand-pink text-white border-brand-pink'
                        : 'bg-white text-charcoal-muted border-gray-200 hover:border-brand-pink'
                    }`}
                  >
                    {option === 'both' ? 'Both Sites' : option === 'institute' ? 'Institute' : 'Foundation'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs text-charcoal-muted block mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-pink"
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-charcoal-muted">Status</span>
              <button
                type="button"
                onClick={() => setStatus((s) => (s === 'published' ? 'draft' : 'published'))}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  status === 'published' ? 'bg-brand-green-pale text-brand-green' : 'bg-amber-50 text-amber-800'
                }`}
              >
                {status === 'published' ? 'Published' : 'Draft'}
              </button>
            </div>

            <label className="mb-4 flex cursor-pointer items-center justify-between">
              <span className="text-sm text-charcoal-muted">Featured</span>
              <button
                type="button"
                role="switch"
                aria-checked={featured}
                onClick={() => setFeatured(!featured)}
                className={`relative h-5 w-10 rounded-full transition-colors ${featured ? 'bg-brand-pink' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </label>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs text-charcoal-muted">Author</label>
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-charcoal-muted">Tags (press Enter to add)</label>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add a tag..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none"
              />
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 rounded-full bg-brand-pink-pale px-2 py-0.5 text-xs text-brand-pink">
                      {tag}
                      <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} aria-label={`Remove ${tag}`}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        type={pickerType}
        onSelect={(url, name, size) => {
          if (resourceType === 'pdf') {
            setFileUrl(url)
            setFileName(name)
            setFileSize(size ?? null)
          } else {
            setImageUrl(url)
            setImageAlt(title || name)
          }
          setPickerOpen(false)
        }}
      />
    </div>
  )
}

