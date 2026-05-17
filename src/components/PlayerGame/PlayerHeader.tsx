'use client'

interface Props {
  pin: string
  avatar: string
  playerName: string
  teamName: string | null
}

export function PlayerHeader({ pin, avatar, playerName, teamName }: Props) {
  return (
    <div className="border-saloon-border relative z-10 flex shrink-0 items-center justify-between border-b px-4 py-3">
      {/* Player identity */}
      <div className="flex items-center gap-2">
        <span className="text-xl">{avatar}</span>
        <div>
          <p className="text-text-primary text-xs leading-none font-bold">{playerName}</p>
          {teamName && (
            <p className="mt-0.5 text-[10px] leading-none" style={{ color: 'var(--neon-pink)' }}>
              {teamName}
            </p>
          )}
        </div>
      </div>

      {/* PIN + LIVE dot */}
      <div className="text-text-muted flex items-center gap-2 text-xs">
        <span
          className="h-2 w-2 animate-pulse rounded-full"
          style={{ backgroundColor: 'var(--neon-pink)' }}
        />
        PIN: <span className="text-text-primary font-bold">{pin}</span>
      </div>
    </div>
  )
}
