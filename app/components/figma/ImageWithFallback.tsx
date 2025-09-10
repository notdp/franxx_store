import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

type Props = Omit<ImageProps, 'src' | 'alt'> & { src: string; alt: string }

export function ImageWithFallback({ src, alt, className, ...rest }: Props) {
  const [didError, setDidError] = useState(false)

  const handleError = () => setDidError(true)

  if (didError) {
    return (
      <Image
        src={ERROR_IMG_SRC}
        alt="Error loading image"
        className={className}
        onError={undefined}
        {...rest}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      {...rest}
    />
  )
}
