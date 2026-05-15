import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type PanelButtonProps = {
  onClick: () => void
  children: ReactNode
  isLoading?: boolean
  position?: 'top-right' | 'top-left'
}

export const PanelButton = ({
  onClick,
  children,
  isLoading = false,
  position = 'top-right',
}: PanelButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`fixed top-4 ${position === 'top-right' ? 'right-4' : 'left-4'} z-20 flex cursor-pointer items-center gap-2 rounded-xl border border-[#ffdcb4]/25 bg-[#0a0414]/25 px-4 py-2 text-xs font-semibold text-[#ffdcb4]/85 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-[#ffd700]/55 hover:bg-[#ffd700]/12 hover:text-[#ffeb96] hover:shadow-[0_0_14px_rgba(255,215,0,0.18)] active:scale-[0.96]`}
      initial={{ opacity: 0, y: -8 }}
      animate={{
        opacity: isLoading ? 0 : 1,
        y: isLoading ? -8 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.button>
  )
}
