'use client'

import { motion } from 'framer-motion'

import { pickDeckBackgrounds } from '@/config/card-backgrounds'

import { CardFace } from './CardFace'
import type { CardLike } from './types'
import { CARD_H, CARD_W } from './types'

interface Props {
  card: CardLike
  cardsLeft?: number
  textScale?: number
  isFlipped: boolean
  isRevealed?: boolean
  maxWidth?: number
  onFlip: () => void
  onFlippedClick?: () => void
}

export function GameCardStack({
  card,
  cardsLeft = 4,
  textScale = 1,
  isFlipped,
  isRevealed = false,
  maxWidth,
  onFlip,
  onFlippedClick,
}: Props) {
  const shadows = Math.min((cardsLeft ?? 1) - 1, 3)
  const stackPadding = 20
  const stackWidth = maxWidth ?? CARD_W + stackPadding
  const promptFontSize = `${1.125 * textScale}rem`
  const promptFontSizeSm = `${1.25 * textScale}rem`
  const answerFontSize = `${1 * textScale}rem`
  const answerFontSizeSm = `${1.125 * textScale}rem`
  const brandFontSize = `${2.25 * textScale}rem`
  const brandFontSizeSm = `${3 * textScale}rem`
  const backLabelFontSize = `${0.875 * textScale}rem`
  const backLabelFontSizeSm = `${1 * textScale}rem`
  // Różne grafiki dla całego decku (aktywna + cienie), stabilnie po id karty.
  const deckBgs = pickDeckBackgrounds(card.id, shadows + 1)
  const activeBg = deckBgs[0]
  const hasAnswer = Boolean(card.answer)

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        perspective: '1200px',
        width: `min(calc(100vw - 32px), ${stackWidth}px)`,
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
          transformOrigin: 'center center',
        }}
        animate={{
          rotateY: isRevealed ? 360 : isFlipped ? 180 : 0,
          rotate: isFlipped || isRevealed ? -5 : 0,
          x: 0,
          y: isFlipped || isRevealed ? 8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        onClick={isFlipped ? onFlippedClick : onFlip}
        whileHover={!isFlipped ? { rotateX: 14, rotateZ: -4, scale: 1.04, y: -3 } : {}}
      >
        {/* BACK face */}
        <CardFace background={activeBg}>
          {!isRevealed ? (
            <div className="flex h-full w-full items-center justify-center">
              <p
                className="font-bold tracking-[0.25em] uppercase"
                style={{
                  color: 'var(--neon-pink)',
                  fontSize: `clamp(${backLabelFontSize}, 3vw, ${backLabelFontSizeSm})`,
                }}
              >
                odsłoń dziką kartę
              </p>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
              <p
                className={
                  hasAnswer
                    ? 'leading-snug font-bold'
                    : 'leading-none font-black'
                }
                style={
                  hasAnswer
                    ? {
                        color: '#1a1a1a',
                        fontSize: `clamp(${answerFontSize}, 4.2vw, ${answerFontSizeSm})`,
                      }
                    : {
                        color: 'var(--neon-pink)',
                        fontFamily: 'var(--font-logo)',
                        fontSize: `clamp(${brandFontSize}, 7vw, ${brandFontSizeSm})`,
                      }
                }
              >
                {card.answer ?? 'Last Rodeo'}
              </p>
            </div>
          )}
        </CardFace>

        {/* FRONT face */}
        <CardFace flipped background={activeBg}>
          <div className="flex h-full w-full flex-col items-center justify-center p-5 text-center sm:p-7">
            <p
              className="leading-snug font-bold"
              style={{
                color: '#1a1a1a',
                fontSize: `clamp(${promptFontSize}, 4.8vw, ${promptFontSizeSm})`,
              }}
            >
              {card.description}
            </p>
          </div>
        </CardFace>
      </motion.div>
    </div>
  )
}
