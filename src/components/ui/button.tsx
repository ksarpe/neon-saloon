import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type: 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  id?: string
  /** Render as an <a> tag instead of <button> */
  href?: string
  /** Native button type attribute — defaults to "button" to prevent accidental form submits */
  htmlType?: 'button' | 'submit'
}

const sizeClasses = {
  sm: 'px-5 py-3 text-sm',
  md: 'px-6 py-4 text-base',
  lg: 'px-8 py-5 text-lg',
}

const shimmer =
  'pointer-events-none absolute inset-y-0 -left-full z-0 w-full skew-x-[-20deg] bg-linear-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-full'

export const Button = ({
  children,
  onClick,
  type,
  size = 'md',
  disabled,
  className,
  id,
  href,
  htmlType = 'button',
}: ButtonProps) => {
  // ── Shared inner content ─────────────────────────────────────────────────────
  const inner = (
    <>
      <div className={shimmer} />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  )

  // ── Primary ──────────────────────────────────────────────────────────────────
  const primaryClass = cn(
    'group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl text-white',
    'disabled:cursor-not-allowed disabled:opacity-30',
    sizeClasses[size],
    className
  )
  const primaryStyle = {
    background: 'linear-gradient(135deg,var(--neon-pink),#c800c8)',
    boxShadow: '0 4px 40px rgba(221,84,162,0.55)',
    fontFamily: "var(--font-app)",
    fontSize: size === 'lg' ? '1.25rem' : '1.1rem',
  }

  // ── Outline ──────────────────────────────────────────────────────────────────
  const outlineClass = cn(
    'group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 font-semibold',
    'disabled:cursor-not-allowed disabled:opacity-30',
    sizeClasses[size],
    className
  )
  const outlineStyle = {
    borderColor: 'rgba(255,220,180,0.25)',
    backgroundColor: 'rgba(255,220,180,0.05)',
    color: 'rgba(255,220,180,0.85)',
  }

  // ── href → render as <motion.a> (primary style only) ─────────────────────────
  if (href) {
    return (
      <motion.a
        href={href}
        id={id}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        className={primaryClass}
        style={primaryStyle}
      >
        {inner}
      </motion.a>
    )
  }

  // ── Button variants ──────────────────────────────────────────────────────────
  if (type === 'outline') {
    return (
      <motion.button
        type={htmlType}
        id={id}
        disabled={disabled}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className={outlineClass}
        style={outlineStyle}
      >
        <div className="pointer-events-none absolute inset-y-0 -left-full z-0 w-full skew-x-[-20deg] bg-linear-to-r from-transparent via-white/10 to-transparent transition-all duration-700 ease-in-out group-hover:left-full" />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.button>
    )
  }

  return (
    <motion.button
      type={htmlType}
      id={id}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={primaryClass}
      style={primaryStyle}
    >
      {inner}
    </motion.button>
  )
}
