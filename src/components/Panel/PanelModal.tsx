'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

import { panelButtonHover } from './shared'

export function PanelModal({
  title,
  hint,
  onClose,
  children,
}: {
  title: string
  hint?: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.18 }}
        className="max-h-[calc(100dvh-48px)] w-full max-w-2xl overflow-y-auto rounded-2xl border p-5 shadow-2xl"
        style={{
          borderColor: 'rgba(255,220,180,0.16)',
          backgroundColor: 'rgba(13,8,24,0.96)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-text-primary text-sm font-black tracking-normal uppercase">
              {title}
            </p>
            {hint && <p className="text-text-muted mt-1 text-xs">{hint}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
            {...panelButtonHover(
              {
                borderColor: 'rgba(255,220,180,0.14)',
                color: 'rgba(255,220,180,0.7)',
                backgroundColor: 'rgba(255,220,180,0.05)',
              },
              {
                borderColor: 'rgba(255,220,180,0.26)',
                color: 'rgba(255,220,180,0.92)',
                backgroundColor: 'rgba(255,220,180,0.1)',
              }
            )}
            aria-label="Zamknij"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}
