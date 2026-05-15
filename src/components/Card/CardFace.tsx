'use client'

import React from 'react'

export function CardFace({
  children,
  flipped = false,
}: {
  children: React.ReactNode
  flipped?: boolean
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-xl"
      style={{
        backgroundImage: "url('/bg/card1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}
    >
      <div className="relative h-full w-full">{children}</div>
    </div>
  )
}
