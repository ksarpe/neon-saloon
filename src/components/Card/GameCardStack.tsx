'use client'

import { motion } from 'framer-motion'
import { CardFace } from './CardFace'
import { CARD_W, CARD_H } from './types'
import type { CardLike } from './types'

interface Props {
  card: CardLike
  cardsLeft?: number
  isFlipped: boolean
  isRevealed?: boolean
  onFlip: () => void
}

export function GameCardStack({
  card,
  cardsLeft = 4,
  isFlipped,
  isRevealed = false,
  onFlip,
}: Props) {
  const shadows = Math.min((cardsLeft ?? 1) - 1, 3)

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ perspective: '1200px', width: CARD_W + 20, height: CARD_H + 20 }}
    >
      {/* Shadow cards */}
      {Array.from({ length: shadows }).map((_, i) => (
        <div
          key={i}
          className="absolute overflow-hidden rounded-2xl"
          style={{
            width: CARD_W,
            height: CARD_H,
            backgroundImage: "url('/bg/card1.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${(i + 1) * -7}px) rotate(${(i % 2 === 0 ? 1 : -1) * (i + 1) * 1.8}deg)`,
            zIndex: shadows - i,
          }}
        />
      ))}

      {/* Active card — 3D flip */}
      <motion.div
        className="absolute cursor-pointer"
        style={{ zIndex: 10, width: CARD_W, height: CARD_H, transformStyle: 'preserve-3d' }}
        animate={{
          rotateY: isRevealed ? 360 : isFlipped ? 180 : 0,
          rotate: isFlipped || isRevealed ? -5 : 0,
          x: isFlipped || isRevealed ? 20 : 0,
          y: isFlipped || isRevealed ? 8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        onClick={!isFlipped ? onFlip : undefined}
        whileHover={!isFlipped ? { rotateX: 14, rotateZ: -4, scale: 1.04, y: -3 } : {}}
      >
        {/* BACK face */}
        <CardFace>
          {!isRevealed ? (
            <div className="flex h-full w-full items-center justify-center">
              <p
                className="text-sm font-bold tracking-[0.25em] uppercase"
                style={{
                  color: 'var(--neon-pink)',
                  textShadow: '0 0 12px var(--neon-pink), 0 0 30px rgba(221,84,162,0.5)',
                }}
              >
                odsłoń dziką kartę
              </p>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="text-3xl">🎉</span>
              <p
                className="text-base leading-snug font-bold"
                style={{ color: 'var(--sheriff-pink)' }}
              >
                {card.answer ?? 'Czas minął!'}
              </p>
            </div>
          )}
        </CardFace>

        {/* FRONT face */}
        <CardFace flipped>
          <div className="flex h-full w-full flex-col items-center justify-center p-5 text-center">
            <p className="text-lg leading-snug font-bold" style={{ color: '#1a1a1a' }}>
              {card.description}
            </p>
          </div>
        </CardFace>
      </motion.div>
    </div>
  )
}
