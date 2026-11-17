import { useState } from 'react'

interface FlagImageProps {
  src: string
  /** Keep the alt neutral in quiz modes – a broken image would otherwise reveal the answer. */
  alt?: string
  className?: string
  eager?: boolean
}

export function FlagImage({ src, alt = 'Flag', className = '', eager = false }: FlagImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const loaded = loadedSrc === src
  const failed = failedSrc === src

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {!loaded && !failed && <div className="absolute inset-0 animate-pulse rounded-md bg-slate-800/80" />}
      {failed ? (
        <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-800 text-xs text-slate-400">
          Image unavailable
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          draggable={false}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
          className={`max-h-full max-w-full rounded-[3px] object-contain shadow-lg shadow-black/40 ring-1 ring-white/10 transition-all duration-500 ease-out ${
            loaded ? 'scale-100 opacity-100 blur-0' : 'scale-95 opacity-0 blur-sm'
          }`}
        />
      )}
    </div>
  )
}
