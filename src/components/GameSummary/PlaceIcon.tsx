'use client'

import Image from 'next/image'

const PLACE_ICONS: Record<number, string> = {
  1: '/icons/1.png',
  2: '/icons/2.png',
  3: '/icons/3.png',
}

export function PlaceIcon({ rank, size }: { rank: number; size: number }) {
  const src = PLACE_ICONS[rank]
  if (!src) {
    return <span className="text-text-muted text-xs font-bold">{rank}.</span>
  }

  return (
    <Image
      src={src}
      alt={`${rank}. miejsce`}
      width={size}
      height={size}
      className="object-contain"
      priority={rank === 1}
    />
  )
}
