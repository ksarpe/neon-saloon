'use client'

import React from 'react'

import { DEFAULT_CARD_BACKGROUND } from '@/config/card-backgrounds'

export function CardFace({
  children,
  flipped = false,
  background = DEFAULT_CARD_BACKGROUND,
}: {
  children: React.ReactNode
  flipped?: boolean
  background?: string
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-xl"
      style={{
        backgroundImage: `url('${background}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        boxShadow:
          '0 0 0 1.5px #f94aff, 0 0 16px rgba(249,74,255,0.65), 0 0 40px rgba(249,74,255,0.35)',
      }}
    >
      <div className="relative h-full w-full">{children}</div>
    </div>
  )
}
