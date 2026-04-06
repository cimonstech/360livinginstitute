'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import CharacterCount from '@tiptap/extension-character-count'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { DragEvent, KeyboardEvent, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  ImageIcon,
  Undo,
  Redo,
  Eye,
  Save,
  Send,
  Loader2,
  X,
  Upload,
} from 'lucide-react'
import type { BlogPost } from '@/types'

interface Props {
  post?: BlogPost | null
}

export default function BlogEditor({ post }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [authorName, setAuthorName] = useState(post?.author_name || 'Selasi Doku')
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [readTime, setReadTime] = useState(post?.read_time_minutes || 5)
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status || 'draft')
  const [featured, setFeatured] = useState(post?.featured || false)
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url || '')
  const [coverImageAlt, setCoverImageAlt] = useState(post?.cover_image_alt || '')

  const [saving, setSaving] = useState(false)
  const [pendingSave, setPendingSave] = useState<'draft' | 'published' | null>(null)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [preview, setPreview] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)

  useEffect(() => {
    if (!post && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      )
    }
  }, [title, post])

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TiptapImage.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-xl w-full my-6 max-w-full',
        },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-pink underline underline-offset-2',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article here...',
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TextStyle,
      CharacterCount,
    ],
    content: post?.content || '',
    editorProps: {
      attributes: {
        class:
          'tiptap prose prose-lg max-w-none font-dm text-charcoal leading-relaxed focus:outline-none min-h-[500px] px-1',
      },
    },
  })

  const uploadAndInsertImage = useCallback(
    async (file: File) => {
      if (!editor) return
      setUploadingImage(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('alt_text', file.name.replace(/\.[^.]+$/, ''))
        formData.append('used_in', 'blog')

        const res = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        })
        const data = (await res.json()) as { error?: string; media?: { file_url: string; alt_text?: string | null } }
        if (!res.ok) throw new Error(data.error || 'Upload failed')

        const url = data.media?.file_url
        if (!url) throw new Error('No file URL returned')

        editor.chain().focus().setImage({ src: url, alt: data.media?.alt_text || '' }).run()
      } catch (err) {
        console.error('Image upload failed:', err)
        alert('Image upload failed. Please try again.')
      } finally {
        setUploadingImage(false)
      }
    },
    [editor]
  )

  async function uploadCoverImage(file: File) {
    setUploadingCover(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt_text', title || 'Cover image')
      formData.append('used_in', 'blog')

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })
      const data = (await res.json()) as { error?: string; media?: { file_url: string; alt_text?: string | null } }
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      if (!data.media?.file_url) throw new Error('No file URL returned')
      setCoverImageUrl(data.media.file_url)
      setCoverImageAlt(data.media.alt_text || '')
    } catch (err) {
      console.error('Cover upload failed:', err)
      alert('Cover image upload failed.')
    } finally {
      setUploadingCover(false)
    }
  }

  function handleEditorDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      void uploadAndInsertImage(file)
    }
  }

  async function handleSave(saveStatus: 'draft' | 'published') {
    if (!title.trim()) {
      setSaveError('Title is required')
      return
    }
    if (!editor?.getText().trim()) {
      setSaveError('Content cannot be empty')
      return
    }

    setSaving(true)
    setPendingSave(saveStatus)
    setSaveError('')
    setSaveSuccess(false)

    try {
      const body: Record<string, unknown> = {
        id: post?.id,
        title,
        slug,
        excerpt,
        content: editor.getHTML(),
        cover_image_url: coverImageUrl,
        cover_image_alt: coverImageAlt,
        author_name: authorName,
        tags,
        read_time_minutes: readTime,
        featured,
        status: saveStatus,
      }
      if (post?.published_at) {
        body.published_at = post.published_at
      }

      const res = await fetch('/api/blog/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = (await res.json()) as { error?: string; post?: { id: string } }
      if (!res.ok) throw new Error(data.error || 'Save failed')

      setSaveSuccess(true)
      setStatus(saveStatus)
      setTimeout(() => setSaveSuccess(false), 3000)

      if (!post?.id && data.post?.id) {
        router.push(`/admin/blog/${data.post.id}/edit`)
      }
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
      setPendingSave(null)
    }
  }

  function addTag(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().replace(/,$/, '')
      if (tag && !tags.includes(tag)) setTags([...tags, tag])
      setTagInput('')
    }
  }

  const wordCount =
    editor && 'characterCount' in editor.storage
      ? (editor.storage as { characterCount: { words: () => number } }).characterCount.words()
      : 0

  if (!editor) return null

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="text-xs text-charcoal-muted hover:text-charcoal"
          >
            ← Blog Posts
          </button>
          <span className="text-charcoal-muted/40">/</span>
          <span className="text-xs text-charcoal-muted">{post ? 'Edit Post' : 'New Post'}</span>
        </div>
        <div className="flex items-center gap-2">
          {saveSuccess && <span className="text-xs font-medium text-brand-green">Saved ✓</span>}
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-xs text-charcoal-muted hover:bg-charcoal-light"
          >
            <Eye size={13} />
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={() => void handleSave('draft')}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-xs text-charcoal hover:bg-charcoal-light disabled:opacity-50"
          >
            {saving && pendingSave === 'draft' ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => void handleSave('published')}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-full bg-brand-pink px-5 py-2 text-xs font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving && pendingSave === 'published' ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Send size={13} />
            )}
            Publish
          </button>
        </div>
      </div>

      {saveError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              className="w-full border-0 font-lora text-2xl font-normal text-charcoal placeholder:text-charcoal-muted/40 focus:outline-none"
            />
            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
              <span className="text-xs text-charcoal-muted">slug:</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 border-0 bg-transparent font-mono text-xs text-charcoal-muted focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            {preview ? (
              <div className="p-8">
                <h1 className="mb-4 font-lora text-3xl font-normal text-charcoal">{title || 'Untitled'}</h1>
                {coverImageUrl && (
                  <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl">
                    <NextImage src={coverImageUrl} alt={coverImageAlt} fill className="object-cover" sizes="896px" />
                  </div>
                )}
                <div
                  className="prose prose-lg max-w-none font-dm leading-relaxed text-charcoal prose-headings:font-lora prose-headings:font-normal prose-headings:text-charcoal prose-a:text-brand-pink prose-blockquote:border-l-brand-pink prose-blockquote:text-brand-pink prose-img:w-full prose-img:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                />
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-charcoal-light/50 p-2">
                  <ToolbarGroup>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().undo().run()}
                      disabled={!editor.can().undo()}
                      title="Undo"
                    >
                      <Undo size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().redo().run()}
                      disabled={!editor.can().redo()}
                      title="Redo"
                    >
                      <Redo size={14} />
                    </ToolbarButton>
                  </ToolbarGroup>

                  <ToolbarDivider />

                  <ToolbarGroup>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                      active={editor.isActive('heading', { level: 1 })}
                      title="Heading 1"
                    >
                      <Heading1 size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                      active={editor.isActive('heading', { level: 2 })}
                      title="Heading 2"
                    >
                      <Heading2 size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                      active={editor.isActive('heading', { level: 3 })}
                      title="Heading 3"
                    >
                      <Heading3 size={14} />
                    </ToolbarButton>
                  </ToolbarGroup>

                  <ToolbarDivider />

                  <ToolbarGroup>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      active={editor.isActive('bold')}
                      title="Bold"
                    >
                      <Bold size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      active={editor.isActive('italic')}
                      title="Italic"
                    >
                      <Italic size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().toggleUnderline().run()}
                      active={editor.isActive('underline')}
                      title="Underline"
                    >
                      <UnderlineIcon size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().toggleStrike().run()}
                      active={editor.isActive('strike')}
                      title="Strikethrough"
                    >
                      <Strikethrough size={14} />
                    </ToolbarButton>
                  </ToolbarGroup>

                  <ToolbarDivider />

                  <ToolbarGroup>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().setTextAlign('left').run()}
                      active={editor.isActive({ textAlign: 'left' })}
                      title="Align Left"
                    >
                      <AlignLeft size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().setTextAlign('center').run()}
                      active={editor.isActive({ textAlign: 'center' })}
                      title="Align Center"
                    >
                      <AlignCenter size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().setTextAlign('right').run()}
                      active={editor.isActive({ textAlign: 'right' })}
                      title="Align Right"
                    >
                      <AlignRight size={14} />
                    </ToolbarButton>
                  </ToolbarGroup>

                  <ToolbarDivider />

                  <ToolbarGroup>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                      active={editor.isActive('bulletList')}
                      title="Bullet List"
                    >
                      <List size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().toggleOrderedList().run()}
                      active={editor.isActive('orderedList')}
                      title="Numbered List"
                    >
                      <ListOrdered size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().toggleBlockquote().run()}
                      active={editor.isActive('blockquote')}
                      title="Quote"
                    >
                      <Quote size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                      type="button"
                      onClick={() => editor.chain().focus().setHorizontalRule().run()}
                      title="Divider"
                    >
                      <Minus size={14} />
                    </ToolbarButton>
                  </ToolbarGroup>

                  <ToolbarDivider />

                  <ToolbarGroup>
                    <ToolbarButton
                      type="button"
                      onClick={() => setShowLinkInput(!showLinkInput)}
                      active={editor.isActive('link')}
                      title="Insert Link"
                    >
                      <Link2 size={14} />
                    </ToolbarButton>
                  </ToolbarGroup>

                  <ToolbarGroup>
                    <ToolbarButton
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      title="Insert Image"
                    >
                      {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                    </ToolbarButton>
                  </ToolbarGroup>

                  <div className="ml-auto px-2 text-xs text-charcoal-muted/60">{wordCount} words</div>
                </div>

                {showLinkInput && (
                  <div className="flex items-center gap-2 border-b border-gray-100 bg-brand-pink-pale px-3 py-2">
                    <Link2 size={13} className="flex-shrink-0 text-brand-pink" />
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 border-0 bg-transparent text-sm text-charcoal placeholder:text-charcoal-muted/50 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          editor.chain().focus().setLink({ href: linkUrl }).run()
                          setLinkUrl('')
                          setShowLinkInput(false)
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (linkUrl) editor.chain().focus().setLink({ href: linkUrl }).run()
                        else editor.chain().focus().unsetLink().run()
                        setLinkUrl('')
                        setShowLinkInput(false)
                      }}
                      className="rounded-full border border-brand-pink-light bg-white px-3 py-1 text-xs font-medium text-brand-pink"
                    >
                      {linkUrl ? 'Apply' : 'Remove'}
                    </button>
                    <button type="button" onClick={() => setShowLinkInput(false)} aria-label="Close link bar">
                      <X size={14} className="text-charcoal-muted" />
                    </button>
                  </div>
                )}

                <div
                  className="p-6"
                  onDrop={handleEditorDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <EditorContent editor={editor} />
                  {uploadingImage && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-charcoal-muted">
                      <Loader2 size={14} className="animate-spin text-brand-pink" />
                      Uploading image...
                    </div>
                  )}
                  <p className="mt-4 text-xs text-charcoal-muted/50">
                    Tip: Drag and drop images directly into the editor, or use the image button in the toolbar.
                  </p>
                </div>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void uploadAndInsertImage(file)
              e.target.value = ''
            }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-charcoal">Cover Image</p>
            {coverImageUrl ? (
              <div className="relative">
                <div className="relative h-40 w-full overflow-hidden rounded-xl">
                  <NextImage src={coverImageUrl} alt={coverImageAlt} fill className="object-cover" sizes="400px" />
                </div>
                <button
                  type="button"
                  onClick={() => setCoverImageUrl('')}
                  className="absolute right-2 top-2 rounded-full border border-gray-200 bg-white p-1 shadow-sm hover:bg-red-50"
                  aria-label="Remove cover"
                >
                  <X size={12} className="text-red-500" />
                </button>
                <input
                  type="text"
                  value={coverImageAlt}
                  onChange={(e) => setCoverImageAlt(e.target.value)}
                  placeholder="Alt text..."
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand-pink focus:outline-none"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 transition-colors hover:border-brand-pink hover:bg-brand-pink-pale/30"
              >
                {uploadingCover ? (
                  <Loader2 size={20} className="animate-spin text-brand-pink" />
                ) : (
                  <>
                    <Upload size={20} className="mb-2 text-charcoal-muted/50" />
                    <p className="text-xs text-charcoal-muted">Click to upload cover image</p>
                    <p className="mt-1 text-xs text-charcoal-muted/50">JPG, PNG, WEBP up to 5MB</p>
                  </>
                )}
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void uploadCoverImage(file)
                e.target.value = ''
              }}
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-charcoal">Settings</p>

            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-charcoal-muted">Status</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  status === 'published'
                    ? 'bg-brand-green-pale text-brand-green'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>

            <label className="mb-4 flex cursor-pointer items-center justify-between">
              <span className="text-sm text-charcoal-muted">Featured post</span>
              <button
                type="button"
                role="switch"
                aria-checked={featured}
                onClick={() => setFeatured(!featured)}
                className={`relative h-5 w-10 rounded-full transition-colors ${featured ? 'bg-brand-pink' : 'bg-gray-200'}`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    featured ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs text-charcoal-muted">Author</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs text-charcoal-muted">Read time (minutes)</label>
              <input
                type="number"
                value={readTime}
                onChange={(e) => setReadTime(Number(e.target.value))}
                min={1}
                max={60}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-charcoal-muted">Tags (press Enter to add)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add a tag..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none"
              />
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded-full bg-brand-pink-pale px-2 py-0.5 text-xs text-brand-pink"
                    >
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

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-charcoal">Excerpt</p>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short summary shown on the blog list page..."
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-light text-charcoal placeholder:text-charcoal-muted/50 focus:border-brand-pink focus:outline-none"
            />
            <p className="mt-1 text-xs text-charcoal-muted/50">{excerpt.length}/200 characters</p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => void handleSave('published')}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-full bg-brand-pink py-3 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              {saving && pendingSave === 'published' ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
              Publish Post
            </button>
            <button
              type="button"
              onClick={() => void handleSave('draft')}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-full border border-gray-200 py-3 text-sm text-charcoal hover:bg-charcoal-light disabled:opacity-50"
            >
              {saving && pendingSave === 'draft' ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              Save as Draft
            </button>
            {post?.status === 'published' && (
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-brand-green-light py-3 text-sm text-brand-green hover:bg-brand-green-pale"
              >
                <Eye size={15} />
                View Published Post
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({
  type = 'button',
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  type?: 'button' | 'submit' | 'reset'
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title?: string
  children: ReactNode
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-lg p-1.5 transition-colors ${
        active
          ? 'bg-brand-pink text-white'
          : 'text-charcoal-muted hover:bg-white hover:text-charcoal'
      } disabled:cursor-not-allowed disabled:opacity-30`}
    >
      {children}
    </button>
  )
}

function ToolbarGroup({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px bg-gray-200" />
}
