'use client'

import Image, { type ImageProps } from 'next/image'
import { useCallback, useState, type SyntheticEvent } from 'react'

type Props = Omit<ImageProps, 'src'> & {
  /** Public path without extension, e.g. `/images/ladytraining` */
  basename: string
}

/**
 * Tries `basename.jpg` first; on load error switches to `basename.jpeg`.
 */
export default function PublicImageJpgFallback({ basename, onError, ...rest }: Props) {
  const base = basename.startsWith('/') ? basename : `/${basename}`
  const [src, setSrc] = useState(`${base}.jpg`)

  const handleError = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      onError?.(e)
      setSrc((current) => (current.endsWith('.jpg') ? `${base}.jpeg` : current))
    },
    [base, onError]
  )

  return <Image key={src} {...rest} src={src} onError={handleError} />
}
