interface AgeNoticeProps {
  actionLabel: string
  className?: string
}

export function AgeNotice({ actionLabel, className = '' }: AgeNoticeProps) {
  return (
    <p
      className={`rounded-xl border px-3 py-2 text-center text-xs leading-relaxed font-semibold ${className}`}
      style={{
        borderColor: 'rgba(255,220,180,0.16)',
        backgroundColor: 'rgba(255,220,180,0.05)',
        color: 'rgba(255,220,180,0.72)',
      }}
    >
      Klikając &apos;{actionLabel}&apos;, potwierdzasz, że masz ukończone 18 lat
    </p>
  )
}
