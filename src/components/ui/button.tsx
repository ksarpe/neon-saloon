import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const Button = ({
  children,
  onClick,
  type,
  size = 'sm',
}: {
  children: React.ReactNode
  onClick: () => void
  type: 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}) => {
  if (type === 'outline') {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className={cn(
          'group relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 px-5 py-4 text-sm font-semibold',
          size === 'sm' && 'px-5 py-4 text-sm',
          size === 'md' && 'px-6 py-5 text-base',
          size === 'lg' && 'px-8 text-lg'
        )}
        style={{
          borderColor: 'rgba(255,220,180,0.25)',
          backgroundColor: 'rgba(255,220,180,0.05)',
          color: 'rgba(255,220,180,0.85)',
        }}
      >
        <div className="pointer-events-none absolute inset-y-0 -left-full z-0 w-full skew-x-[-20deg] bg-linear-to-r from-transparent via-white/10 to-transparent transition-all duration-700 ease-in-out group-hover:left-full" />
        <span className="relative z-10">{children}</span>
      </motion.button>
    )
  } else if (type === 'primary')
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className={cn(
          'group relative flex flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-4 text-base text-white',
          size === 'sm' && 'px-5 py-4 text-sm',
          size === 'md' && 'px-6 py-5 text-base',
          size === 'lg' && 'px-8 text-lg'
        )}
        style={{
          background: 'linear-gradient(135deg,var(--neon-pink),#c800c8)',
          boxShadow: '0 4px 40px rgba(221,84,162,0.55)',
          fontFamily: "var(--font-bebas), 'Bebas Neue', cursive",
          fontSize: '1.15rem',
          letterSpacing: '0.12em',
        }}
      >
        <div className="pointer-events-none absolute inset-y-0 -left-full z-0 w-full skew-x-[-20deg] bg-linear-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-full" />
        <span className="relative z-10">{children}</span>
      </motion.button>
    )
}
