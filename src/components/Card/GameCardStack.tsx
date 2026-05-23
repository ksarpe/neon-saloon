'use client'

import { motion } from 'framer-motion'

import { pickDeckBackgrounds } from '@/config/card-backgrounds'

import { CardFace } from './CardFace'
import type { CardLike } from './types'
import { CARD_H, CARD_W } from './types'

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
  const stackPadding = 20
  // Różne grafiki dla całego decku (aktywna + cienie), stabilnie po id karty.
  const deckBgs = pickDeckBackgrounds(card.id, shadows + 1)
  const activeBg = deckBgs[0]

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        perspective: '1200px',
        width: `min(calc(100vw - 32px), ${CARD_W + stackPadding}px)`,
        aspectRatio: `${CARD_W + stackPadding} / ${CARD_H + stackPadding}`,
      }}
    >
      {/* Shadow cards */}
      {Array.from({ length: shadows }).map((_, i) => (
        <div
          key={i}
          className="absolute overflow-hidden rounded-2xl"
          style={{
            width: `calc(100% - ${stackPadding}px)`,
            height: `calc(100% - ${stackPadding}px)`,
            backgroundImage: `url('${deckBgs[i + 1]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${(i + 1) * -7}px) rotate(${(i % 2 === 0 ? 1 : -1) * (i + 1) * 1.8}deg)`,
            zIndex: shadows - i,
            boxShadow: '0 0 0 1px rgba(249,74,255,0.55), 0 0 12px rgba(249,74,255,0.4)',
          }}
        />
      ))}

      {/* Active card — 3D flip */}
      <motion.div
        className="absolute cursor-pointer"
        style={{
          zIndex: 10,
          width: `calc(100% - ${stackPadding}px)`,
          height: `calc(100% - ${stackPadding}px)`,
          transformStyle: 'preserve-3d',
        }}
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
        <CardFace background={activeBg}>
          {!isRevealed ? (
            <div className="flex h-full w-full items-center justify-center">
              <p
                className="text-sm font-bold tracking-[0.25em] uppercase sm:text-base"
                style={{
                  color: 'var(--neon-pink)',
                  textShadow: '0 0 12px var(--neon-pink), 0 0 30px rgba(221,84,162,0.5)',
                }}
              >
                odsłoń dziką kartę
              </p>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
              <p
                className="text-base leading-snug font-bold sm:text-lg"
                style={{ color: '#1a1a1a' }}
              >
                {card.answer ?? 'Last Rodeo'}
              </p>
            </div>
          )}
        </CardFace>

        {/* FRONT face */}
        <CardFace flipped background={activeBg}>
          <div className="flex h-full w-full flex-col items-center justify-center p-5 text-center sm:p-7">
            <p className="text-lg leading-snug font-bold sm:text-xl" style={{ color: '#1a1a1a' }}>
              {card.description}
            </p>
          </div>
        </CardFace>
      </motion.div>
    </div>
  )
}
