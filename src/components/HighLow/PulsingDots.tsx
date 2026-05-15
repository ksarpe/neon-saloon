'use client'

import { motion } from 'framer-motion'

export function PulsingDots({ color }: { color: string }) {
  return (
    <div className="flex justify-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity }}
        />
      ))}
    </div>
  )
}
